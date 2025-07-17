package com.azhagu_swe.saas.service;

import com.azhagu_swe.saas.dto.request.*;
import com.azhagu_swe.saas.dto.response.MessageResponse;
import com.azhagu_swe.saas.dto.response.SignInResponse;
import com.azhagu_swe.saas.dto.response.TokenRefreshResponse;
import jakarta.validation.Valid;

/**
 * Interface for authentication and user account management services.
 * Defines the contract for operations like user sign-in, sign-up,
 * token refreshing, password recovery, and availability checks.
 */
public interface AuthService {

    /**
     * Authenticates a user based on their login credentials.
     *
     * @param loginRequest DTO containing login credentials (e.g., email and
     *                     password).
     * @return SignInResponse DTO containing JWT access token, refresh token, and
     *         user details.
     * @throws com.azhagu_swe.saas.exception.InvalidCredentialsException if
     *                                                                   authentication
     *                                                                   fails.
     * @throws com.azhagu_swe.saas.exception.ServiceProcessingException  if an
     *                                                                   unexpected
     *                                                                   error
     *                                                                   occurs.
     */
    SignInResponse authenticateUser(@Valid SignInRequest loginRequest);

    /**
     * Registers a new user in the system.
     *
     * @param signUpRequest DTO containing user registration details.
     * @return MessageResponse indicating the outcome of the registration.
     * @throws com.azhagu_swe.saas.exception.DuplicateResourceException if username
     *                                                                  or email
     *                                                                  already
     *                                                                  exists.
     * @throws com.azhagu_swe.saas.exception.ServiceProcessingException if an
     *                                                                  unexpected
     *                                                                  error occurs
     *                                                                  (e.g.,
     *                                                                  default role
     *                                                                  not found).
     */
    MessageResponse registerUser(@Valid SignupRequest signUpRequest);

    /**
     * Refreshes an access token using a valid refresh token.
     * Implements refresh token rotation for enhanced security.
     *
     * @param request DTO containing the refresh token.
     * @return TokenRefreshResponse DTO containing the new access token and new
     *         refresh token.
     * @throws com.azhagu_swe.saas.exception.InvalidTokenException      if the
     *                                                                  refresh
     *                                                                  token is
     *                                                                  invalid,
     *                                                                  expired, or
     *                                                                  not found.
     * @throws com.azhagu_swe.saas.exception.ServiceProcessingException if an
     *                                                                  unexpected
     *                                                                  error
     *                                                                  occurs.
     */
    TokenRefreshResponse refreshToken(@Valid TokenRefreshRequest request);

    /**
     * Initiates the password reset process for a user.
     * Generates a password reset token and sends an email with reset instructions.
     * Always returns a generic success message to prevent user enumeration.
     *
     * @param request DTO containing the user's email.
     * @return MessageResponse indicating that instructions have been sent if the
     *         email is registered.
     */
    MessageResponse forgotPassword(@Valid ForgotPasswordRequest request);

    /**
     * Resets a user's password using a valid password reset token.
     *
     * @param request DTO containing the reset token and the new password.
     * @return MessageResponse indicating the outcome of the password reset.
     * @throws com.azhagu_swe.saas.exception.InvalidTokenException      if the reset
     *                                                                  token is
     *                                                                  invalid,
     *                                                                  expired, or
     *                                                                  already
     *                                                                  used.
     * @throws com.azhagu_swe.saas.exception.ServiceProcessingException if an
     *                                                                  unexpected
     *                                                                  error
     *                                                                  occurs.
     */
    MessageResponse resetPassword(@Valid ResetPasswordRequest request);

    /**
     * Checks if a given username is available for registration.
     *
     * @param username The username to check.
     * @return true if the username is available, false otherwise.
     * @throws com.azhagu_swe.saas.exception.ServiceProcessingException if an error
     *                                                                  occurs
     *                                                                  during the
     *                                                                  check.
     */
    boolean isUsernameAvailable(String username);

    /**
     * Checks if a given email address is available for registration.
     *
     * @param email The email address to check.
     * @return true if the email is available, false otherwise.
     * @throws com.azhagu_swe.saas.exception.ServiceProcessingException if an error
     *                                                                  occurs
     *                                                                  during the
     *                                                                  check.
     */
    boolean isEmailAvailable(String email);

    MessageResponse logoutUser(String accessToken, LogoutRequest logoutRequest); // Pass access token for potential
                                                                                 // blacklisting

}
