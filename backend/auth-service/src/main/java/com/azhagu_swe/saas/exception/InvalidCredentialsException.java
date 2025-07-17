package com.azhagu_swe.saas.exception;

import org.springframework.http.HttpStatus;

// Option 1: Extend your base ApiException
public class InvalidCredentialsException extends ApiException {
    public InvalidCredentialsException(String message) {
        super(message, HttpStatus.UNAUTHORIZED);
    }
}
