package com.azhagu_swe.saas.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LogoutRequest {
    @NotBlank(message = "Refresh token is required for logout.")
    private String refreshToken;
}
