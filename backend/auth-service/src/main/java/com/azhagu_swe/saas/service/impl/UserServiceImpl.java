package com.azhagu_swe.saas.service.impl; // Assuming impl subpackage

import com.azhagu_swe.saas.constants.AppConstants;
import com.azhagu_swe.saas.dto.request.ChangePasswordRequest;
import com.azhagu_swe.saas.dto.request.CreateUserRequest;
import com.azhagu_swe.saas.dto.request.UpdateUserRequest;
import com.azhagu_swe.saas.dto.response.UserResponse;
import com.azhagu_swe.saas.exception.DuplicateResourceException;
import com.azhagu_swe.saas.exception.ResourceNotFoundException;
import com.azhagu_swe.saas.mapper.UserMapper; // Assuming static mapper
import com.azhagu_swe.saas.model.entity.Role;
import com.azhagu_swe.saas.model.entity.User;
import com.azhagu_swe.saas.model.repository.RoleRepository;
import com.azhagu_swe.saas.model.repository.UserRepository;
import com.azhagu_swe.saas.service.UserService; // Import the interface
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService { // Implements the interface

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class); // Corrected logger

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    // Assuming UserMapper is a class with static methods as per your code.
    // If you make it a Spring bean: private final UserMapper userMapper;

    @Override
    @Transactional
    public UserResponse createUser(@Valid CreateUserRequest request) {
        // Use more specific custom exceptions
        if (userRepository.existsByUsername(request.getUsername())) {
            logger.warn("Attempt to create user with taken username: {}", request.getUsername());
            throw new DuplicateResourceException("User", "username", request.getUsername());
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            logger.warn("Attempt to create user with taken email: {}", request.getEmail());
            throw new DuplicateResourceException("User", "email", request.getEmail());
        }

        User user = UserMapper.toUser(request); // Assuming this maps basic fields like name, email, etc.
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerified(true); // Or false, depending on your flow (e.g., if email verification is needed)

        // Assign roles
        Set<String> roleNames = request.getRoleNames();
        Set<Role> roles = resolveRoles(roleNames); // Use helper method for clarity
        user.setRoles(roles);

        User savedUser = userRepository.save(user);
        logger.info("User created with id: {}", savedUser.getId());
        return UserMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional(readOnly = true) // Mark read-only operations for optimization
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        logger.info("Fetching all users with pagination: {}", pageable);
        // Fetch a Page of User entities and map it to a Page of UserResponse DTOs
        return userRepository.findAll(pageable)
                .map(UserMapper::toUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(UUID id) {
        logger.info("Fetching user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id.toString()));
        return UserMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(UUID id, @Valid UpdateUserRequest request) {
        logger.info("Updating user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id.toString()));

        // Use a static mapper to update fields, assuming it exists
        UserMapper.updateUserFromRequest(user, request);

        // Explicitly handle password update if provided
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Explicitly handle role update if provided
        if (request.getRoleNames() != null) {
            Set<Role> roles = resolveRoles(request.getRoleNames()); // Reuse helper method
            user.setRoles(roles);
        }

        User updatedUser = userRepository.save(user);
        logger.info("User updated with id: {}", updatedUser.getId());
        return UserMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(UUID id) {
        logger.info("Deleting user with id: {}", id);
        // Check for existence before deleting
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User", "id", id.toString());
        }
        userRepository.deleteById(id);
        logger.info("User deleted with id: {}", id);
    }

    /**
     * Helper method to resolve role names into a Set of Role entities.
     * @param roleNames A set of role names from a request.
     * @return A Set of resolved {@link Role} entities.
     */
    private Set<Role> resolveRoles(Set<String> roleNames) {
        Set<Role> roles = new HashSet<>();
        if (roleNames == null || roleNames.isEmpty()) {
            // Assign a default role if none are provided
            Role defaultRole = roleRepository.findByName(AppConstants.DEFAULT_ROLE)
                .orElseThrow(() -> new ResourceNotFoundException("Role", "name", AppConstants.DEFAULT_ROLE));
            roles.add(defaultRole);
        } else {
            // Find each role by name from the repository
            roleNames.forEach(roleName -> {
                Role role = roleRepository.findByName(roleName)
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "name", roleName));
                roles.add(role);
            });
        }
        return roles;
    }
       @Override
    public void changePassword(String userEmail, ChangePasswordRequest request) {
        // 1. Find the user by their email (which is the principal's name)
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Error: User not found. This should not happen for an authenticated user."));

        // 2. Verify the provided current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            // Throw an exception for an incorrect password.
            // A custom exception is better, but this works for demonstration.
            throw new BadCredentialsException("Incorrect current password provided.");
        }

        // 3. Ensure the new password is not the same as the old one
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new IllegalArgumentException("New password cannot be the same as the old password.");
        }

        // 4. Encode the new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // 5. Save the user with the new password
        userRepository.save(user);
    }
}