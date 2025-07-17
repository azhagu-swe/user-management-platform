package com.azhagu_swe.saas.service;

import com.azhagu_swe.saas.dto.request.RoleRequest;
import com.azhagu_swe.saas.dto.response.RoleResponse;
import com.azhagu_swe.saas.exception.DuplicateResourceException;
import com.azhagu_swe.saas.exception.ResourceNotFoundException;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for managing roles.
 * Defines operations for creating, retrieving, updating, and deleting roles.
 */
public interface RoleService {
    /**
     * Retrieves a list of all roles.
     *
     * @return A page of {@link RoleResponse} objects.
     */
    List<RoleResponse> getAllRolesAsList();

    /**
     * Retrieves a paginated list of all roles.
     *
     * @param pageable Pagination information.
     * @return A page of {@link RoleResponse} objects.
     */
    Page<RoleResponse> getAllRoles(Pageable pageable);

    /**
     * Retrieves a specific role by its ID.
     *
     * @param id The ID of the role to retrieve.
     * @return The {@link RoleResponse} object if found.
     * @throws ResourceNotFoundException if no role is found with the given ID.
     */
    RoleResponse getRoleById(Long id);

    /**
     * Retrieves a specific role by its name.
     *
     * @param name The name of the role to retrieve.
     * @return The {@link RoleResponse} object if found.
     * @throws ResourceNotFoundException if no role is found with the given name.
     */
    RoleResponse getRoleByName(String name);

    /**
     * Creates a new role.
     *
     * @param request The {@link RoleRequest} DTO containing details for the new
     *                role.
     * @return The {@link RoleResponse} object for the created role.
     * @throws DuplicateResourceException if a role with the same name already
     *                                    exists.
     */
    RoleResponse createRole(RoleRequest request);

    /**
     * Updates an existing role.
     *
     * @param id      The ID of the role to update.
     * @param request The {@link RoleRequest} DTO containing the updated details.
     * @return The {@link RoleResponse} object for the updated role.
     * @throws ResourceNotFoundException  if no role is found with the given ID.
     * @throws DuplicateResourceException if updating the name conflicts with an
     *                                    existing role's name.
     */
    RoleResponse updateRole(Long id, RoleRequest request);

    /**
     * Deletes a role by its ID.
     * Professional implementations should consider implications:
     * - What happens if users are currently assigned this role?
     * - What happens to permissions associated only with this role?
     * This method might throw an exception if deletion criteria are not met (e.g.,
     * role in use).
     *
     * @param id The ID of the role to delete.
     * @throws ResourceNotFoundException                                  if no role
     *                                                                    is found
     *                                                                    with the
     *                                                                    given ID.
     * @throws com.azhagu_swe.saas.exception.OperationNotAllowedException if the
     *                                                                    role
     *                                                                    cannot be
     *                                                                    deleted(e.g.,system
     *                                                                    role or in
     *                                                                    use).
     */
    void deleteRole(Long id);

    // Optional: Methods to assign/remove permissions from a role
    // RoleResponse assignPermissionToRole(Long roleId, Long permissionId);
    // RoleResponse removePermissionFromRole(Long roleId, Long permissionId);
}
