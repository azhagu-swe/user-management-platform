package com.azhagu_swe.saas.service;

import com.azhagu_swe.saas.dto.request.PermissionRequest;
import com.azhagu_swe.saas.dto.response.PermissionResponse;
import com.azhagu_swe.saas.exception.DuplicateResourceException; // For create if name exists
import com.azhagu_swe.saas.exception.ResourceNotFoundException;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing permissions.
 * Defines operations for creating, retrieving, updating, and deleting permissions.
 */
public interface PermissionService {

     /**
     * Retrieves a paginated list of all permissions.
     *
     * @param pageable Pagination and sorting information.
     * @return A page of {@link PermissionResponse} objects.
     */
    Page<PermissionResponse> getAllPermissions(Pageable pageable); 

    /**
     * Retrieves a specific permission by its ID.
     *
     * @param id The ID of the permission to retrieve.
     * @return The {@link PermissionResponse} object if found.
     * @throws ResourceNotFoundException if no permission is found with the given ID.
     */
    PermissionResponse getPermissionById(Long id);

    /**
     * Creates a new permission.
     *
     * @param request The {@link PermissionRequest} DTO containing details for the new permission.
     * @return The {@link PermissionResponse} object for the created permission.
     * @throws DuplicateResourceException if a permission with the same name already exists.
     */
    PermissionResponse createPermission(PermissionRequest request);

    /**
     * Updates an existing permission.
     *
     * @param id      The ID of the permission to update.
     * @param request The {@link PermissionRequest} DTO containing the updated details.
     * @return The {@link PermissionResponse} object for the updated permission.
     * @throws ResourceNotFoundException if no permission is found with the given ID.
     * @throws DuplicateResourceException if updating the name conflicts with an existing permission's name (if name updates are allowed and unique).
     */
    PermissionResponse updatePermission(Long id, PermissionRequest request);

    /**
     * Deletes a permission by its ID.
     * Note: Consider the implications if this permission is currently assigned to roles.
     * Depending on business logic, you might prevent deletion or handle cascading effects.
     *
     * @param id The ID of the permission to delete.
     * @throws ResourceNotFoundException if no permission is found with the given ID.
     */
    void deletePermission(Long id);

    /**
     * Finds a permission by its unique name.
     * This is often useful for internal lookups, e.g., by DataInitializer.
     *
     * @param name The unique name of the permission.
     * @return The {@link PermissionResponse} object if found.
     * @throws ResourceNotFoundException if no permission is found with the given name.
     */
    PermissionResponse getPermissionByName(String name); // Added based on common needs and repo method
}
