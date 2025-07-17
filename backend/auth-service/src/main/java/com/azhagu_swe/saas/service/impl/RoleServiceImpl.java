package com.azhagu_swe.saas.service.impl; // Example: impl subpackage

import com.azhagu_swe.saas.dto.request.RoleRequest;
import com.azhagu_swe.saas.dto.response.RoleResponse;
import com.azhagu_swe.saas.exception.BadRequestException;
import com.azhagu_swe.saas.exception.DuplicateResourceException;
import com.azhagu_swe.saas.exception.OperationNotAllowedException; // Ensure this import is present
import com.azhagu_swe.saas.exception.ResourceNotFoundException;
import com.azhagu_swe.saas.mapper.RoleMapper;
import com.azhagu_swe.saas.model.entity.Permission;
import com.azhagu_swe.saas.model.entity.Role;
import com.azhagu_swe.saas.model.repository.PermissionRepository;
import com.azhagu_swe.saas.model.repository.RoleRepository;
import com.azhagu_swe.saas.model.repository.UserRepository;
import com.azhagu_swe.saas.service.RoleService;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RoleServiceImpl implements RoleService {

    private static final Logger logger = LoggerFactory.getLogger(RoleServiceImpl.class);
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PermissionRepository permissionRepository;

    @Override
    public Page<RoleResponse> getAllRoles(Pageable pageable) {
        logger.info("Fetching all roles with pagination: {}", pageable);
        return roleRepository.findAll(pageable)
                .map(RoleMapper::toResponse); // Using static mapper
    }

    @Override
    public RoleResponse getRoleById(Long id) {
        logger.info("Fetching role with id: {}", id);
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Role not found with id: {}", id);
                    return new ResourceNotFoundException("Role", "id", id.toString());
                });
        return RoleMapper.toResponse(role);
    }

    @Override
    public RoleResponse getRoleByName(String name) {
        logger.info("Fetching role by name: {}", name);
        Role role = roleRepository.findByName(name)
                .orElseThrow(() -> {
                    logger.warn("Role not found with name: {}", name);
                    return new ResourceNotFoundException("Role", "name", name);
                });
        return RoleMapper.toResponse(role);
    }

    @Transactional
    public RoleResponse createRole(RoleRequest request) {
        logger.info("Attempting to create role with name: {}", request.getName());
        roleRepository.findByName(request.getName()).ifPresent(existingRole -> {
            logger.warn("Attempt to create duplicate role. Name '{}' already exists with id: {}",
                    request.getName(), existingRole.getId());
            throw new DuplicateResourceException("Role", "name", request.getName());
        });

        Role role = RoleMapper.toEntity(request); // Creates role with name

        // --- Assign Permissions ---
        Set<String> requestedPermissionNames = request.getPermissions();
        if (requestedPermissionNames != null && !requestedPermissionNames.isEmpty()) {
            Set<Permission> resolvedPermissions = new HashSet<>();
            for (String permName : requestedPermissionNames) {
                Permission foundPermission = permissionRepository.findByName(permName.trim()) // Trim name
                        .orElseThrow(() -> {
                            logger.warn("Invalid permission name provided during role creation: {}", permName);
                            // It's better to throw an exception that maps to 400 Bad Request,
                            // as the client provided an invalid permission name.
                            // return new ResourceNotFoundException("Permission", "name", permName);
                            // Alternatively:
                            return new BadRequestException("Invalid permission name provided: " +
                                    permName);
                        });
                resolvedPermissions.add(foundPermission);
            }
            role.setPermissions(resolvedPermissions); // Set the resolved Permission entities
        }

        Role savedRole = roleRepository.save(role);
        logger.info("Role created successfully with id: {} and name: {} with {} permissions.",
                savedRole.getId(), savedRole.getName(),
                savedRole.getPermissions() != null ? savedRole.getPermissions().size() : 0);

        return RoleMapper.toResponse(savedRole); // Static call, ensure RoleMapper.toResponse handles permissions
    }

    @Override
    @Transactional
    public RoleResponse updateRole(Long id, RoleRequest request) {
        logger.info("Updating role with id: {}", id);
        Role existingRole = roleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Role not found with id: {} for update", id);
                    return new ResourceNotFoundException("Role", "id", id.toString());
                });

        // Update name (with duplicate check and system role protection)
        if (request.getName() != null && !request.getName().trim().isEmpty() &&
                !request.getName().trim().equalsIgnoreCase(existingRole.getName())) {

            String newName = request.getName().trim();
            if (isSystemRole(existingRole.getName())) {
                logger.warn("Attempt to rename essential system role: {} to {}", existingRole.getName(), newName);
                throw new OperationNotAllowedException(
                        "Cannot rename essential system role: " + existingRole.getName());
            }
            roleRepository.findByName(newName).ifPresent(roleWithNewName -> {
                if (!roleWithNewName.getId().equals(id)) { // If it's a different role that already has the new name
                    logger.warn(
                            "Attempt to update role name for id: {} to '{}', but this name is already used by role id: {}",
                            id, newName, roleWithNewName.getId());
                    throw new DuplicateResourceException("Role", "name", newName);
                }
            });
            existingRole.setName(newName); // Set the new name
        }

        // --- Update Permissions ---
        // This logic replaces all existing permissions with the new set provided in the
        // request.
        // If request.getPermissions() is null, permissions are not changed.
        // If request.getPermissions() is an empty set, all permissions will be removed.
        if (request.getPermissions() != null) {
            Set<Permission> resolvedPermissions = new HashSet<>();
            if (!request.getPermissions().isEmpty()) {
                for (String permName : request.getPermissions()) {
                    Permission foundPermission = permissionRepository.findByName(permName.trim())
                            .orElseThrow(() -> {
                                logger.warn(
                                        "Invalid permission name ('{}') provided during role update for role id: {}",
                                        permName, id);
                                // Consider throwing BadRequestException here as client provided invalid data
                                return new ResourceNotFoundException("Permission", "name", permName);
                            });
                    resolvedPermissions.add(foundPermission);
                }
            }
            // This replaces all existing permissions for the role.
            // JPA handles the join table updates based on the state of this collection.
            existingRole.getPermissions().clear(); // Clear existing permissions first
            if (!resolvedPermissions.isEmpty()) {
                existingRole.getPermissions().addAll(resolvedPermissions); // Add new ones
            }
            logger.info("Permissions updated for role id: {}. New permission count: {}", id,
                    resolvedPermissions.size());
        }
        // --- End Update Permissions ---

        Role updatedRole = roleRepository.save(existingRole);
        logger.info("Role updated successfully with id: {}", updatedRole.getId());
        return RoleMapper.toResponse(updatedRole); // Ensure RoleMapper.toResponse correctly reflects permissions
    }

    @Override
    @Transactional
    public void deleteRole(Long id) {
        logger.info("Attempting to delete role with id: {}", id);
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Role not found with id: {} for deletion", id);
                    return new ResourceNotFoundException("Role", "id", id.toString());
                });

        // Prevent deletion of critical system roles
        if (isSystemRole(role.getName())) {
            logger.warn("Attempt to delete essential system role: {}", role.getName());
            throw new OperationNotAllowedException("Cannot delete essential system role: " + role.getName());
        }

        // Check if the role is currently assigned to any users.
        if (userRepository.existsByRolesContains(role)) { // Using the method from UserRepository
            logger.warn("Attempt to delete role id: {} ('{}') which is currently assigned to users.", id,
                    role.getName());
            throw new OperationNotAllowedException(
                    "Cannot delete role: '" + role.getName()
                            + "' as it is currently assigned to one or more users. Please reassign users first.");
        }

        try {
            // Before deleting a role, ensure its associations in role_permissions are
            // handled.
            // If Role entity's 'permissions' collection has appropriate cascade settings or
            // is managed,
            // this might be automatic. Otherwise, manually clear:
            if (role.getPermissions() != null && !role.getPermissions().isEmpty()) {
                logger.info("Clearing permissions for role '{}' before deletion.", role.getName());
                role.getPermissions().clear();
                roleRepository.save(role); // This updates the join table
            }

            roleRepository.delete(role);
            logger.info("Role deleted successfully with id: {}", id);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting role id: {}. It might still be in use unexpectedly.",
                    id, e);
            throw new OperationNotAllowedException(
                    "Cannot delete role: '" + role.getName() + "' due to existing dependencies.", e);
        }
    }

    // Helper method for system role check (example)
    // Consider making these configurable or part of an enum/constants
    private boolean isSystemRole(String roleName) {
        return "SuperAdmin".equalsIgnoreCase(roleName) ||
                "AccountAdmin".equalsIgnoreCase(roleName) ||
                "StandardUser".equalsIgnoreCase(roleName); // Define your essential roles
    }


      @Override
    @Transactional(readOnly = true) // Good practice for read-only operations
    public List<RoleResponse> getAllRolesAsList() {
        logger.info("Fetching all roles as a non-paginated list.");

        // Fetch all roles from the repository, sorting by name for a consistent order.
        List<Role> roles = roleRepository.findAll(Sort.by(Sort.Direction.ASC, "name"));

        // Convert the list of Role entities to a list of RoleResponse DTOs.
        // You must use .stream() to map over a List.
        return roles.stream()
                .map(RoleMapper::toResponse) // Using static mapper call
                .collect(Collectors.toList());
    }
}