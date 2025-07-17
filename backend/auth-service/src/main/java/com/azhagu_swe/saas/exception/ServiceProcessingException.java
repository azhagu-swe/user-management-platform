package com.azhagu_swe.saas.exception; // Your exception package

import org.springframework.http.HttpStatus;

public class ServiceProcessingException extends ApiException {
    public ServiceProcessingException(String message) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public ServiceProcessingException(String message, Throwable cause) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR, cause);
    }
}
