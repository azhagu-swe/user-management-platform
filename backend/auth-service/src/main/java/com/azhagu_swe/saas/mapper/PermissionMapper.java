package com.azhagu_swe.saas.mapper;

import com.azhagu_swe.saas.dto.request.PermissionRequest;
import com.azhagu_swe.saas.dto.response.PermissionResponse;
import com.azhagu_swe.saas.model.entity.Permission;
import org.springframework.stereotype.Component;

/**
 * Mapper component for converting between Permission entities and DTOs.
 * Managed by Spring for dependency injection and better testability.
 */
@Component // Marks this class as a Spring component (bean)
public class PermissionMapper {

    /**
     * Converts a Permission entity to a PermissionResponse DTO.
     * 
     * @param permission The Permission entity.
     * @return The corresponding PermissionResponse DTO, or null if the input is
     *         null.
     */
    public PermissionResponse toResponse(Permission permission) {
        if (permission == null) {
            return null;
        }
        PermissionResponse response = new PermissionResponse();
        response.setId(permission.getId());
        response.setName(permission.getName());
        // Assuming PermissionResponse DTO has fields for these if needed from the
        // entity
        // response.setDescription(permission.getDescription());
        // response.setCreatedAt(permission.getCreatedAt());
        // response.setUpdatedAt(permission.getUpdatedAt());
        return response;
    }

    /**
     * Converts a PermissionRequest DTO to a new Permission entity.
     * 
     * @param request The PermissionRequest DTO.
     * @return A new Permission entity, or null if the input is null.
     */
    public Permission toEntity(PermissionRequest request) {
        if (request == null) {
            return null;
        }
        Permission permission = new Permission();
        permission.setName(request.getName());
        // Assuming PermissionRequest DTO has description if it needs to be set during
        // creation
        // permission.setDescription(request.getDescription());
        return permission;
    }

    /**
     * Updates an existing Permission entity from a PermissionRequest DTO.
     * Only non-null fields in the request are typically used to update the entity.
     * 
     * @param permission The existing Permission entity to update.
     * @param request    The PermissionRequest DTO containing update data.
     */
    public void updateEntity(Permission permission, PermissionRequest request) {
        if (permission == null || request == null) {
            return;
        }
        // Only update fields if they are provided in the request,
        // or handle as per your business logic for updates.
        if (request.getName() != null) {
            permission.setName(request.getName());
        }
        // if (request.getDescription() != null) { // If description is part of
        // PermissionRequest
        // permission.setDescription(request.getDescription());
        // }
    }
}