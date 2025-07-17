package com.azhagu_swe.saas.service;

import com.azhagu_swe.saas.dto.request.ChangePasswordRequest;
import com.azhagu_swe.saas.dto.request.CreateUserRequest;
import com.azhagu_swe.saas.dto.request.UpdateUserRequest;
import com.azhagu_swe.saas.dto.response.UserResponse;
import com.azhagu_swe.saas.exception.DuplicateResourceException;
import com.azhagu_swe.saas.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

/**
 * Service interface for managing users.
 * Defines operations for creating, retrieving, updating, and deleting users.
 */
public interface UserService {

    /**
     * Creates a new user.
     *
     * @param request DTO containing user creation details.
     * @return UserResponse DTO of the created user.
     * @throws DuplicateResourceException if username or email already exists.
     * @throws ResourceNotFoundException  if a specified role is not found.
     */
    UserResponse createUser(@Valid CreateUserRequest request);

    /**
     * Retrieves a paginated list of all users.
     *
     * @param pageable Pagination and sorting information.
     * @return A page of {@link UserResponse} objects.
     */
    Page<UserResponse> getAllUsers(Pageable pageable);

    /**
     * Retrieves a specific user by their ID.
     *
     * @param id The UUID of the user to retrieve.
     * @return The {@link UserResponse} object if found.
     * @throws ResourceNotFoundException if no user is found with the given ID.
     */
    UserResponse getUserById(UUID id);

    /**
     * Updates an existing user.
     *
     * @param id      The UUID of the user to update.
     * @param request The {@link UpdateUserRequest} DTO containing the updated
     *                details.
     * @return The {@link UserResponse} object for the updated user.
     * @throws ResourceNotFoundException  if no user or specified role is found.
     * @throws DuplicateResourceException if updating email/username conflicts with
     *                                    another user.
     */
    UserResponse updateUser(UUID id, @Valid UpdateUserRequest request);

    /**
     * Deletes a user by their ID.
     *
     * @param id The UUID of the user to delete.
     * @throws ResourceNotFoundException if no user is found with the given ID.
     */
    void deleteUser(UUID id);

    void changePassword(String userEmail, ChangePasswordRequest request);

}