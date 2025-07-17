package com.azhagu_swe.saas.exception; // Your exception package

import org.springframework.http.HttpStatus;

public class OperationNotAllowedException extends ApiException {

    public OperationNotAllowedException(String message) {
        super(message, HttpStatus.FORBIDDEN); // HTTP 403 Forbidden is often appropriate
                                             // Or HttpStatus.BAD_REQUEST (400) if it's more like a business rule violation
    }

    public OperationNotAllowedException(String message, Throwable cause) {
        super(message, HttpStatus.FORBIDDEN, cause);
    }

    public OperationNotAllowedException(String message, HttpStatus status) {
        super(message, status);
    }

    public OperationNotAllowedException(String message, HttpStatus status, Throwable cause) {
        super(message, status, cause);
    }
}