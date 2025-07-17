package com.azhagu_swe.saas.service.impl;

import com.azhagu_swe.saas.dto.request.PermissionRequest;
import com.azhagu_swe.saas.dto.response.PermissionResponse;
import com.azhagu_swe.saas.exception.DuplicateResourceException;
import com.azhagu_swe.saas.exception.ResourceNotFoundException;
import com.azhagu_swe.saas.mapper.PermissionMapper; // Import the mapper
import com.azhagu_swe.saas.model.entity.Permission;
import com.azhagu_swe.saas.model.repository.PermissionRepository;
import com.azhagu_swe.saas.service.PermissionService;
import lombok.RequiredArgsConstructor; // For constructor injection
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class PermissionServiceImpl implements PermissionService {

    private static final Logger logger = LoggerFactory.getLogger(PermissionServiceImpl.class);
    private final PermissionRepository permissionRepository;
    private final PermissionMapper permissionMapper; // Inject the mapper

     @Override
    @Transactional(readOnly = true) 
    public Page<PermissionResponse> getAllPermissions(Pageable pageable) {
        logger.debug("Fetching permissions with pagination: {}", pageable);

        // Fetch a Page of Permission entities from the repository
        Page<Permission> permissionEntityPage = permissionRepository.findAll(pageable);

        // Convert the Page of ENTITIES to a Page of DTOs using the injected mapper instance
        return permissionEntityPage.map(permissionMapper::toResponse);
    }

    @Override
    public PermissionResponse getPermissionById(Long id) {
        logger.debug("Fetching permission by id: {}", id);
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Permission not found with id: {}", id);
                    return new ResourceNotFoundException("Permission", "id", id.toString());
                });
        return permissionMapper.toResponse(permission); // Use the injected mapper instance
    }

    @Override
    public PermissionResponse getPermissionByName(String name) {
        logger.debug("Fetching permission by name: {}", name);
        Permission permission = permissionRepository.findByName(name)
                .orElseThrow(() -> {
                    logger.warn("Permission not found with name: {}", name);
                    return new ResourceNotFoundException("Permission", "name", name);
                });
        return permissionMapper.toResponse(permission); // Use the injected mapper instance
    }

    @Override
    @Transactional
    public PermissionResponse createPermission(PermissionRequest request) {
        logger.info("Attempting to create permission with name: {}", request.getName());
        permissionRepository.findByName(request.getName()).ifPresent(existingPermission -> {
            logger.warn("Attempt to create duplicate permission. Name '{}' already exists with id: {}",
                    request.getName(), existingPermission.getId());
            throw new DuplicateResourceException("Permission", "name", request.getName());
        });

        Permission permission = permissionMapper.toEntity(request); // Use the injected mapper instance
        Permission savedPermission = permissionRepository.save(permission);
        logger.info("Permission created successfully with id: {} and name: {}", savedPermission.getId(),
                savedPermission.getName());
        return permissionMapper.toResponse(savedPermission); // Use the injected mapper instance
    }

    @Override
    @Transactional
    public PermissionResponse updatePermission(Long id, PermissionRequest request) {
        logger.info("Attempting to update permission with id: {}", id);
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Permission not found with id: {} for update", id);
                    return new ResourceNotFoundException("Permission", "id", id.toString());
                });

        if (request.getName() != null && !request.getName().equals(permission.getName())) {
            permissionRepository.findByName(request.getName()).ifPresent(existingPermission -> {
                if (!existingPermission.getId().equals(id)) {
                    logger.warn("Attempt to update permission name for id: {} to '{}', which already exists for id: {}",
                            id, request.getName(), existingPermission.getId());
                    throw new DuplicateResourceException("Permission", "name", request.getName());
                }
            });
        }

        permissionMapper.updateEntity(permission, request); // Use the injected mapper instance
        Permission updatedPermission = permissionRepository.save(permission);
        logger.info("Permission updated successfully with id: {}", updatedPermission.getId());
        return permissionMapper.toResponse(updatedPermission); // Use the injected mapper instance
    }

    @Override
    @Transactional
    public void deletePermission(Long id) {
        logger.info("Attempting to delete permission with id: {}", id);
        Permission permission = permissionRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("Permission not found with id: {} for deletion", id);
                    return new ResourceNotFoundException("Permission", "id", id.toString());
                });
        permissionRepository.delete(permission);
        logger.info("Permission deleted successfully with id: {}", id);
    }
}
