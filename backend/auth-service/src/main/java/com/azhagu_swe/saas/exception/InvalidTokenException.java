package com.azhagu_swe.saas.exception; // Your exception package

import org.springframework.http.HttpStatus;

public class InvalidTokenException extends ApiException {

    public InvalidTokenException(String message) {
        // Typically, invalid tokens result in UNAUTHORIZED,
        // but for some flows (like reset token not found), BAD_REQUEST might also be suitable.
        // Let's default to UNAUTHORIZED for now.
        super(message, HttpStatus.UNAUTHORIZED);
    }

    public InvalidTokenException(String message, HttpStatus status) {
        super(message, status);
    }
}