package com.azhagu_swe.saas.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

public class ResetPasswordRequest {

    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = "New password is required")
    @Size(min = 8, max = 128, message = "Password must be between 8 and 128 characters")
    // Using the strong password pattern we defined earlier for SignupRequest
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,128}$",
             message = "New password must be 8-128 characters and include at least one uppercase letter, one lowercase letter, one digit, and one special character (@$!%*?&)")
    private String newPassword;

    // Optional: If you want confirmation on the frontend and backend
    @NotBlank(message = "Confirm password is required")
    private String confirmNewPassword; 

    // If using confirmNewPassword, you'd add a class-level validator:
}