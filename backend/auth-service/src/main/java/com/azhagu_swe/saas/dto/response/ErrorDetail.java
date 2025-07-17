package com.azhagu_swe.saas.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Represents a specific detail about an error, often used for
 * validation errors to indicate issues with particular fields.
 */
@Getter
@Setter
@NoArgsConstructor // Useful for deserialization or if default instantiation is needed
@AllArgsConstructor
public class ErrorDetail {
    private String field; // The name of the field that caused the validation error
    private String rejectedValue; // The actual value that was rejected (optional, be cautious with sensitive
                                  // data)
    private String message; // The specific error message for this field/validation rule
}