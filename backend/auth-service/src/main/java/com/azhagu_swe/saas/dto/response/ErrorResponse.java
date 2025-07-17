package com.azhagu_swe.saas.dto.response; // Or your common DTO package

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;
import lombok.Setter;
import java.time.Instant;
import java.util.List;

@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL) // Don't include null fields in JSON output
public class ErrorResponse {
    private Instant timestamp;
    private int status; // HTTP status code
    private String error; // HTTP status reason phrase (e.g., "Bad Request", "Unauthorized")
    private String message; // A general message describing the error
    private String path; // The request path that caused the error
    private List<ErrorDetail> details; // For validation errors or more specific details

    public ErrorResponse(int status, String error, String message, String path) {
        this.timestamp = Instant.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}