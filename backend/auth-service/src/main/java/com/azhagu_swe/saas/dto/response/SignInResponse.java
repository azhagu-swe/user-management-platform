package com.azhagu_swe.saas.dto.response; // Or your actual package

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;
import java.util.UUID; // Import UUID

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignInResponse {
    private String accessToken;
    private String refreshToken;
    private String type = "Bearer";
    private UUID id;
    private String username;
    private String email;
    private Set<String> roles;
    private Set<String> permissions;

}