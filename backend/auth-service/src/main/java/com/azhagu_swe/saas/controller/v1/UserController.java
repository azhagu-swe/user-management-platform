package com.azhagu_swe.saas.controller.v1;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.azhagu_swe.saas.dto.request.CreateUserRequest;
import com.azhagu_swe.saas.dto.request.UpdateUserRequest;
import com.azhagu_swe.saas.dto.response.APIResponse;
import com.azhagu_swe.saas.dto.response.MessageResponse;
import com.azhagu_swe.saas.dto.response.UserResponse;
import com.azhagu_swe.saas.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.azhagu_swe.saas.dto.request.ChangePasswordRequest;
import org.springframework.security.core.Authentication;

import java.util.UUID;

@Tag(name = "User Management", description = "Endpoints for managing users")
@RestController
@RequestMapping("v1/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/create")
    @Operation(summary = "Create User", description = "Registers a new user.")
    @ApiResponse(responseCode = "201", description = "User registered successfully", content = @Content(schema = @Schema(implementation = UserResponse.class)))
    public ResponseEntity<APIResponse<UserResponse>> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success("User registered successfully", response));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('PERMISSION_SYSTEM_USER_READ_ANY_LIST') or hasRole('SUPERADMIN')") // More specific permission
    @Operation(summary = "Get All Users (Paginated)",
               description = "Retrieves a paginated list of all users. Supports pagination and sorting.")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully") 
    public ResponseEntity<APIResponse<Page<UserResponse>>> getAllUsers(@ParameterObject Pageable pageable) {
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(APIResponse.success("Users retrieved successfully", users));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get User By ID", description = "Retrieves a user by their ID.")
    @ApiResponse(responseCode = "200", description = "User retrieved successfully", content = @Content(schema = @Schema(implementation = UserResponse.class)))
    public ResponseEntity<APIResponse<UserResponse>> getUserById(@PathVariable UUID id) {
        UserResponse response = userService.getUserById(id);
        return ResponseEntity.ok(APIResponse.success("User retrieved successfully", response));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update User", description = "Updates an existing user.")
    @ApiResponse(responseCode = "200", description = "User updated successfully", content = @Content(schema = @Schema(implementation = UserResponse.class)))
    public ResponseEntity<APIResponse<UserResponse>> updateUser(@PathVariable UUID id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse response = userService.updateUser(id, request);
        return ResponseEntity.ok(APIResponse.success("User updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete User", description = "Deletes a user by their ID.")
    @ApiResponse(responseCode = "200", description = "User deleted successfully", content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    public ResponseEntity<APIResponse<MessageResponse>> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(APIResponse.success("User deleted successfully"));
    }
     @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()") // Ensures only a logged-in user can access this
    @Operation(summary = "Change Current User's Password",
               description = "Allows an authenticated user to change their own password by providing their current password.")
    @ApiResponse(responseCode = "200", description = "Password changed successfully",
                 content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    @ApiResponse(responseCode = "400", description = "Bad Request (e.g., incorrect current password)",
                 content = @Content(schema = @Schema(implementation = APIResponse.class)))
    public ResponseEntity<APIResponse<MessageResponse>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) { // Spring Security provides the current user's auth details

        // The currently authenticated username (email) is retrieved from the Authentication object
        String userEmail = authentication.getName();

        userService.changePassword(userEmail, request);
        return ResponseEntity.ok(APIResponse.success("Password changed successfully"));
    }
}
