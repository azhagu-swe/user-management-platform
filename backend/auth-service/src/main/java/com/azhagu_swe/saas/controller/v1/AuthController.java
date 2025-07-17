package com.azhagu_swe.saas.controller.v1;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.azhagu_swe.saas.dto.request.*;
import com.azhagu_swe.saas.dto.response.UsernameAvailabilityResponse;
import com.azhagu_swe.saas.service.AuthService;
import com.azhagu_swe.saas.dto.response.APIResponse;
import com.azhagu_swe.saas.dto.response.EmailAvailabilityResponse;
import com.azhagu_swe.saas.dto.response.ErrorResponse;
import com.azhagu_swe.saas.dto.response.SignInResponse;
import com.azhagu_swe.saas.dto.response.MessageResponse;
import com.azhagu_swe.saas.dto.response.TokenRefreshResponse;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("v1/api/auth")
@Tag(name = "Authentication", description = "Endpoints for user authentication and authorization")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signin")
    @Operation(summary = "User Sign-In", description = "Authenticates a user and returns JWT tokens.")
    @ApiResponse(responseCode = "200", description = "Successful authentication", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "400", description = "Bad Request (e.g. missing email/password if caught by @Valid)", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "401", description = "invalid credentials", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    public ResponseEntity<APIResponse<SignInResponse>> signIn(@Valid @RequestBody SignInRequest signInRequest) {
        SignInResponse response = authService.authenticateUser(signInRequest);
        return ResponseEntity.ok(APIResponse.success("Successful authentication", response));
    }

    @PostMapping("/signup")
    @Operation(summary = "User Sign-Up", description = "Registers a new user.")
    @ApiResponse(responseCode = "201", description = "User registered successfully", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "400", description = "Bad Request (e.g., validation errors on input)", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "409", description = "Conflict (e.g., username or email already exists)", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    public ResponseEntity<APIResponse<MessageResponse>> signUp(@Valid @RequestBody SignupRequest signupRequest) {
        // The service method will throw exceptions for error scenarios,
        // which will be handled by the global exception handler.
        MessageResponse response = authService.registerUser(signupRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(APIResponse.success(
                        response));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh Token", description = "Generates a new access token and a new refresh token using a valid refresh token.")
    @ApiResponse(responseCode = "200", description = "Token refreshed successfully", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "400", description = "Bad Request (e.g., refresh token missing or malformed)", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "401", description = "Unauthorized (e.g., refresh token invalid, expired, or revoked)", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    public ResponseEntity<APIResponse<TokenRefreshResponse>> refreshToken(
            @Valid @RequestBody TokenRefreshRequest request) {
        TokenRefreshResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(APIResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot Password", description = "Initiates the password reset process.")
    @ApiResponse(responseCode = "200", description = "Password reset instructions sent", content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    @ApiResponse(responseCode = "404", description = "User not found", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public ResponseEntity<APIResponse<MessageResponse>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        // No try-catch here – exceptions are handled globally by GlobalExceptionHandler
        MessageResponse response = authService.forgotPassword(request);
        return ResponseEntity.ok(APIResponse.success("Password reset instructions sent", response));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset Password", description = "Resets the user's password.")
    @ApiResponse(responseCode = "200", description = "Password reset successfully", content = @Content(schema = @Schema(implementation = MessageResponse.class)))
    @ApiResponse(responseCode = "400", description = "Bad Request / Invalid Token", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    public ResponseEntity<APIResponse<MessageResponse>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        MessageResponse response = authService.resetPassword(request);
        return ResponseEntity.ok(APIResponse.success("Password reset successfully", response));
    }

    @GetMapping("/check-username")
    @Operation(summary = "Check Username Availability", description = "Checks if a username is available.")
    @ApiResponse(responseCode = "200", description = "Username availability check successful", content = @Content(schema = @Schema(implementation = UsernameAvailabilityResponse.class)))
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    public ResponseEntity<APIResponse<UsernameAvailabilityResponse>> checkUsernameAvailability(
            @RequestParam @Pattern(regexp = "^[a-zA-Z0-9_]{4,20}$", message = "Username must be 4-20 characters and contain only letters, digits, or underscores") String username) {
        boolean isAvailable = authService.isUsernameAvailable(username);
        UsernameAvailabilityResponse data = new UsernameAvailabilityResponse(username, isAvailable);
        return ResponseEntity.ok(APIResponse.success("Username availability check successful", data));
    }

    @GetMapping("/check-email")
    @Operation(summary = "Check Email Availability", description = "Checks if an email address is available for registration.")
    @ApiResponse(responseCode = "200", description = "Email availability check successful", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "400", description = "Invalid email format", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    @ApiResponse(responseCode = "500", description = "Internal Server Error", content = @Content(schema = @Schema(implementation = APIResponse.class)))
    public ResponseEntity<APIResponse<EmailAvailabilityResponse>> checkEmailAvailability(
            @RequestParam @NotBlank(message = "Email must not be blank") @Size(max = 100, message = "Email cannot exceed 100 characters") @Email(message = "Please provide a valid email address") String email) {

        boolean isAvailable = authService.isEmailAvailable(email);
        EmailAvailabilityResponse data = new EmailAvailabilityResponse(email, isAvailable);
        return ResponseEntity.ok(APIResponse.success("Email availability check successful.", data));
    }

    @PostMapping("/logout")
    @Operation(summary = "User Logout", description = "Logs out the current user by invalidating their refresh token.")
    @ApiResponse(responseCode = "200", description = "Logout successful", content = @Content(schema = @Schema(implementation = APIResponse.class))) // APIResponse<MessageResponse>
    @ApiResponse(responseCode = "400", description = "Bad Request (e.g., refresh token missing)", content = @Content(schema = @Schema(implementation = APIResponse.class))) // APIResponse<ErrorResponse>
    @ApiResponse(responseCode = "401", description = "Unauthorized (if access token is invalid/missing for this call)", content = @Content(schema = @Schema(implementation = APIResponse.class))) // APIResponse<ErrorResponse>
    public ResponseEntity<APIResponse<MessageResponse>> logout(
            @Valid @RequestBody LogoutRequest logoutRequest, HttpServletRequest request) {

        // String authorizationHeader = request.getHeader("Authorization");
        // MessageResponse response = authService.logoutUser(authorizationHeader,
        // logoutRequest);
        // For simplicity if not blacklisting access token, can omit passing
        // authorizationHeader
        MessageResponse response = authService.logoutUser(null, logoutRequest);

        // While SecurityContextHolder.clearContext() is good in the service or filter
        // after logout logic,
        // for stateless APIs, the main effect is invalidating tokens.
        // The client is responsible for discarding its tokens.
        // If you were using sessions, httpServletRequest.getSession().invalidate()
        // would be here.

        return ResponseEntity.ok(APIResponse.success(response.getMessage(), response)); // Or a simpler success message
    }
}