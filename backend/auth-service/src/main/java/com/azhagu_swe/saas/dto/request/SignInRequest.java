package com.azhagu_swe.saas.dto.request; // Or your actual package

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignInRequest {

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Email should be valid")
    private String email; 

    @NotBlank(message = "Password must not be blank")
    private String password;
}