package com.azhagu_swe.saas.dto.response; // Or your actual package

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmailAvailabilityResponse {
    private String email;
    private boolean available;
}