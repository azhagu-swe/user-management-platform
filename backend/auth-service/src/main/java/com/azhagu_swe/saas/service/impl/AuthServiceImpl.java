package com.azhagu_swe.saas.service.impl;

import com.azhagu_swe.saas.dto.request.*;
import com.azhagu_swe.saas.dto.response.MessageResponse;
import com.azhagu_swe.saas.dto.response.SignInResponse;
import com.azhagu_swe.saas.dto.response.TokenRefreshResponse;
import com.azhagu_swe.saas.exception.DuplicateResourceException;
import com.azhagu_swe.saas.exception.InvalidCredentialsException;
import com.azhagu_swe.saas.exception.InvalidTokenException;
import com.azhagu_swe.saas.exception.ServiceProcessingException;
import com.azhagu_swe.saas.model.entity.PasswordResetToken;
import com.azhagu_swe.saas.model.entity.RefreshToken;
import com.azhagu_swe.saas.model.entity.Role;
import com.azhagu_swe.saas.model.entity.User;
import com.azhagu_swe.saas.model.repository.RoleRepository;
import com.azhagu_swe.saas.model.repository.UserRepository;
import com.azhagu_swe.saas.security.service.impl.UserDetailsImpl;
import com.azhagu_swe.saas.service.AuthService;
import com.azhagu_swe.saas.service.EmailService;
import com.azhagu_swe.saas.service.PasswordResetTokenService;
import com.azhagu_swe.saas.service.RefreshTokenService;
import com.azhagu_swe.saas.util.JwtUtils;
import jakarta.validation.Valid;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private JwtUtils jwtUtils;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordResetTokenService passwordResetTokenService; // Use the service

    @Value("${app.defaultUserRoleName:StandardUser}") // Example: Make default role name configurable
    private String defaultUserRoleName;

    @Transactional
    public SignInResponse authenticateUser(@Valid SignInRequest loginRequest) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
        } catch (BadCredentialsException e) {
            logger.warn("Failed login attempt for email: {}", loginRequest.getEmail());
            // Throw your custom exception or Spring's (GlobalExceptionHandler will handle
            // it)
            throw new InvalidCredentialsException("Invalid email or password provided.");
        } catch (Exception e) {
            // Catch other potential AuthenticationExceptions or issues during
            // authenticate()
            logger.error("Unexpected error during Spring Security authentication for email {}: {}",
                    loginRequest.getEmail(), e.getMessage(), e);
            throw new ServiceProcessingException("An unexpected error occurred during authentication.", e);
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        // Ensure user still exists in DB (should be extremely rare if auth succeeded)
        User userEntity = userRepository.findByEmail(userDetails.getEmail())
                .orElseThrow(() -> {
                    logger.error(
                            "CRITICAL: User '{}' authenticated but not found in database. Possible data inconsistency.",
                            userDetails.getEmail());
                    return new ServiceProcessingException(
                            "Authenticated user details not found. Please contact support.");
                });

        try {
            String accessToken = jwtUtils.generateJwtToken(authentication);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId()); // userDetails.getId()
                                                                                                     // is UUID

            Set<String> roleNames = userEntity.getRoles().stream()
                    .map(Role::getName) // Assuming Role entity has getName()
                    .collect(Collectors.toSet());

            Set<String> permissions = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());

            logger.info("User '{}' authenticated successfully.", userDetails.getEmail());
            return new SignInResponse(
                    accessToken,
                    refreshToken.getToken(),
                    "Bearer",
                    userDetails.getId(), // UUID
                    userDetails.getApplicationUsername(), // Actual app username
                    userDetails.getEmail(), // Login email
                    roleNames,
                    permissions);

        } catch (Exception e) {
            // Handle exceptions during token generation or fetching roles/permissions after
            // successful auth
            logger.error("Error generating tokens or fetching roles/permissions for authenticated user {}: {}",
                    userDetails.getEmail(), e.getMessage(), e);
            throw new ServiceProcessingException("Error finalizing authentication process. Please try again.", e);
        }
    }

    @Transactional
    public MessageResponse registerUser(@Valid SignupRequest signUpRequest) {
        // Check if username already exists
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            logger.warn("Registration attempt with taken username: {}", signUpRequest.getUsername());
            throw new DuplicateResourceException("User", "username", signUpRequest.getUsername());
        }

        // Check if email already exists
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            logger.warn("Registration attempt with taken email: {}", signUpRequest.getEmail());
            throw new DuplicateResourceException("User", "email", signUpRequest.getEmail());
        }

        // Create and set up the user entity
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        // ** CRITICAL FIX: Use firstName and lastName from SignupRequest **
        user.setFirstName(signUpRequest.getFirstName());
        user.setLastName(signUpRequest.getLastName());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        user.setVerified(false); // New users usually start as unverified

        // Assign the default role to the new user
        Set<Role> roles = new HashSet<>();
        Role defaultRole = roleRepository.findByName(defaultUserRoleName)
                .orElseThrow(() -> {
                    logger.error(
                            "CRITICAL: Default role '{}' not found in the database! Check DataInitializer or Flyway scripts.",
                            defaultUserRoleName);
                    // This is a server configuration/setup error.
                    return new ServiceProcessingException("Server configuration error: Default user role is missing.");
                });
        roles.add(defaultRole);
        user.setRoles(roles);

        try {
            userRepository.save(user);
            logger.info("User registered successfully: {} with email: {}", user.getUsername(), user.getEmail());

            // Optionally, trigger an asynchronous email verification process here
            // emailService.sendVerificationEmail(user, verificationToken);

            return new MessageResponse("User registered successfully! Please check your email to verify your account.");
        } catch (Exception e) { // Catch unexpected errors during save
            logger.error("Error saving new user {}: {}", signUpRequest.getUsername(), e.getMessage(), e);
            throw new ServiceProcessingException(
                    "An unexpected error occurred during user registration. Please try again.", e);
        }
    }

    @Transactional
    public TokenRefreshResponse refreshToken(@Valid TokenRefreshRequest request) {
        String requestRefreshTokenString = request.getRefreshToken();

        // 1. Find the refresh token entity by its string value
        RefreshToken oldRefreshTokenEntity = refreshTokenService.findByToken(requestRefreshTokenString)
                .orElseThrow(() -> {
                    logger.warn("Attempt to refresh with non-existent token: {}",
                            requestRefreshTokenString.substring(0, Math.min(requestRefreshTokenString.length(), 10))
                                    + "...");
                    return new InvalidTokenException("Refresh token not found. Please sign in again.");
                });

        // 2. Verify the token's expiration and used status (verifyExpiration should
        // handle this)
        // This method should throw InvalidTokenException if expired or already marked
        // as used.
        refreshTokenService.verifyTokenAndHandleExpiration(oldRefreshTokenEntity);

        // 3. Get the associated User
        User user = oldRefreshTokenEntity.getUser();
        if (user == null) {
            // This would indicate a data integrity issue. The token should always have a
            // user.
            logger.error("CRITICAL: Refresh token ID {} found but has no associated user.",
                    oldRefreshTokenEntity.getId());
            throw new ServiceProcessingException("Invalid refresh token state: no associated user.");
        }

        // 4. (Optional but Recommended) Check User Account Status
        // Example: if your User entity has an 'isActive' or 'isLocked' field
        if (!user.isVerified()) { // Assuming 'isVerified' also implies 'isEnabled' for login purposes
            logger.warn("Refresh token attempt for unverified/disabled user: {}", user.getUsername());
            // Invalidate the token that was attempted to be used, as the user account is
            // not active
            refreshTokenService.deleteSpecificToken(oldRefreshTokenEntity);
            throw new InvalidTokenException(
                    "User account is not active or verified. Please verify your account or contact support.");
        }

        // --- ✨ Implement Refresh Token Rotation ---
        // a. Invalidate/delete the old refresh token to prevent reuse.
        try {
            refreshTokenService.deleteSpecificToken(oldRefreshTokenEntity);
            logger.debug("Successfully deleted old refresh token ID: {} for user: {}", oldRefreshTokenEntity.getId(),
                    user.getUsername());
        } catch (Exception e) {
            logger.error("Failed to delete old refresh token ID: {} for user: {}. Manual cleanup may be required.",
                    oldRefreshTokenEntity.getId(), user.getUsername(), e);
            // Depending on policy, you might allow proceeding or throw an error.
            // For security, if old token deletion fails, it's risky to issue a new one
            // without investigation.
            throw new ServiceProcessingException("Failed to secure refresh token process. Please try again.", e);
        }

        // b. Create and save a NEW RefreshToken for this user.
        RefreshToken newRefreshTokenEntity;
        try {
            newRefreshTokenEntity = refreshTokenService.createRefreshToken(user.getId()); // user.getId() returns UUID
            logger.debug("Successfully created new refresh token ID: {} for user: {}", newRefreshTokenEntity.getId(),
                    user.getUsername());
        } catch (Exception e) {
            logger.error("Failed to create new refresh token for user: {}.", user.getUsername(), e);
            // If new token creation fails after old one is deleted, user needs to re-login.
            throw new ServiceProcessingException("Failed to issue new refresh token. Please sign in again.", e);
        }
        // --- End Rotation ---

        // 5. Build UserDetails for JWT generation (user object is already up-to-date)
        UserDetailsImpl userDetails = UserDetailsImpl.build(user);

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        // 6. Generate a new Access Token
        String newAccessToken = jwtUtils.generateJwtToken(authentication);

        logger.info("Access token refreshed successfully for user: {}", user.getUsername());
        // 7. Return the new access token AND the NEW refresh token string.
        return new TokenRefreshResponse(newAccessToken, newRefreshTokenEntity.getToken());
    }

    @Transactional
    public MessageResponse forgotPassword(@Valid ForgotPasswordRequest request) {
        final String email = request.getEmail();
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            try {
                PasswordResetToken resetToken = passwordResetTokenService.createPasswordResetTokenForUser(user);
                emailService.sendPasswordResetEmail(user.getEmail(), user.getUsername(), resetToken.getToken());
                logger.info("Password reset token generated and email dispatch initiated for user: {}", email);
            } catch (MailException e) {
                logger.error("MailException occurred while sending password reset email to {}: {}", email,
                        e.getMessage(), e);
                // Still return the generic success message below.
            } catch (Exception e) {
                logger.error("Unexpected error during forgot password process for email {}: {}", email, e.getMessage(),
                        e);
                // Still return the generic success message.
            }
        } else {
            logger.warn("Password reset requested for non-existent email: {}", email);
        }

        return new MessageResponse(
                "If an account with that email address exists, instructions to reset your password have been sent.");
    }

    @Transactional
    public MessageResponse resetPassword(@Valid ResetPasswordRequest request) {
        // 1. Verify the token (existence, not used, not expired).
        // passwordResetTokenService.verifyToken should throw InvalidTokenException on
        // any failure.
        PasswordResetToken passwordResetToken = passwordResetTokenService.verifyToken(request.getToken());

        User user = passwordResetToken.getUser();
        // This check might be redundant if verifyToken ensures user presence or throws.
        // However, as a defense-in-depth for data integrity:
        if (user == null) {
            logger.error("CRITICAL: Valid password reset token ID {} has no associated user. Token string: {}",
                    passwordResetToken.getId(),
                    request.getToken().substring(0, Math.min(request.getToken().length(), 10)) + "...");
            // This indicates a severe data integrity issue.
            throw new ServiceProcessingException(
                    "Password reset failed due to an internal data inconsistency. Please contact support.");
        }

        // Optional: Prevent setting the same password as the old one
        // if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
        // throw new BadRequestException("New password cannot be the same as the current
        // password.");
        // }

        try {
            user.setPassword(encoder.encode(request.getNewPassword())); // Assuming 'passwordEncoder' is
                                                                        // injected
            userRepository.save(user);
            passwordResetTokenService.markTokenAsUsed(passwordResetToken); // Or delete it
        } catch (Exception e) {
            // Catching unexpected errors during the critical update phase
            logger.error("Failed to update password or mark reset token as used for user {}: {}", user.getUsername(),
                    e.getMessage(), e);
            throw new ServiceProcessingException(
                    "An unexpected error occurred while updating your password. Please try again.", e);
        }

        // Invalidate active sessions (refresh tokens)
        try {
            int invalidatedCount = refreshTokenService.deleteAllTokensByUserId(user.getId()); // Assuming user.getId()
                                                                                              // is UUID
            logger.info("Invalidated {} active refresh token(s) for user {} after password reset.", invalidatedCount,
                    user.getUsername());
        } catch (Exception e) {
            // Log this error but do not let it fail the overall password reset success
            // response.
            // This is a secondary security measure; password has been reset.
            logger.error(
                    "Failed to invalidate refresh tokens for user {} after password reset. User sessions might still be active elsewhere. Error: {}",
                    user.getUsername(), e.getMessage(), e);
        }

        logger.info("Password reset successful for user: {}", user.getUsername());
        return new MessageResponse("Your password has been reset successfully.");
    }

    public boolean isUsernameAvailable(String username) {
        logger.debug("Checking username availability for: {}", username);
        boolean exists = userRepository.existsByUsername(username);
        logger.debug("Username '{}' exists: {}", username, exists);
        return !exists;
    }

    public boolean isEmailAvailable(String email) {
        logger.debug("Checking email availability for: {}", email);
        boolean exists = userRepository.existsByEmail(email);
        logger.debug("Email '{}' exists: {}", email, exists);
        return !exists;
    }

    @Override
    @Transactional
    public MessageResponse logoutUser(String currentAccessToken, LogoutRequest logoutRequest) {
        String refreshTokenString = logoutRequest.getRefreshToken();

        refreshTokenService.findByToken(refreshTokenString).ifPresentOrElse(
                refreshTokenEntity -> {
                    // Verify the token belongs to the currently authenticated user (important!)
                    // UserDetailsImpl currentUser = (UserDetailsImpl)
                    // SecurityContextHolder.getContext().getAuthentication().getPrincipal();
                    // if (!refreshTokenEntity.getUser().getId().equals(currentUser.getId())) {
                    // logger.warn("User {} attempted to logout with a refresh token not belonging
                    // to them.", currentUser.getApplicationUsername());
                    // throw new InvalidTokenException("Invalid refresh token provided.");
                    // }
                    // Note: The above check requires UserDetailsImpl to be readily available or
                    // fetched.
                    // Simpler: just delete the token if found, assuming the client is trusted to
                    // send its own.

                    refreshTokenService.deleteSpecificToken(refreshTokenEntity); // Or mark as revoked
                    logger.info("User logged out. Refresh token invalidated: {}",
                            refreshTokenString.substring(0, Math.min(refreshTokenString.length(), 10)) + "...");
                },
                () -> {
                    // Token not found, could log this, but still treat as successful logout from
                    // client perspective
                    logger.warn("Logout attempt with a refresh token that was not found: {}",
                            refreshTokenString.substring(0, Math.min(refreshTokenString.length(), 10)) + "...");
                });

        // Optional: Blacklist the current access token if you have such a mechanism
        // if (currentAccessToken != null && currentAccessToken.startsWith("Bearer ")) {
        // String tokenToBlacklist = currentAccessToken.substring(7);
        // jwtBlacklistService.blacklistToken(tokenToBlacklist,
        // jwtUtils.getExpirationDateFromJwtToken(tokenToBlacklist));
        // logger.info("Access token blacklisted for user.");
        // }

        SecurityContextHolder.clearContext(); // Clear security context on the server side for the current request
                                              // thread

        return new MessageResponse("You have been logged out successfully.");
    }
}