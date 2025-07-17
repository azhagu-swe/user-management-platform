package com.azhagu_swe.saas.exception; // Or your common exception package

import org.springframework.http.HttpStatus;

/**
 * Custom exception to represent a client-side bad request (HTTP 400).
 * This can be thrown when input data is invalid beyond what standard bean validation catches,
 * or when a request cannot be processed due to invalid parameters or state.
 */
public class BadRequestException extends ApiException {

    /**
     * Constructs a new BadRequestException with the specified detail message.
     * The HTTP status will be 400 (Bad Request).
     *
     * @param message the detail message.
     */
    public BadRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    /**
     * Constructs a new BadRequestException with the specified detail message and cause.
     * The HTTP status will be 400 (Bad Request).
     *
     * @param message the detail message.
     * @param cause   the cause (which is saved for later retrieval by the {@link #getCause()} method).
     */
    public BadRequestException(String message, Throwable cause) {
        super(message, HttpStatus.BAD_REQUEST, cause);
    }

    /**
     * Constructs a new BadRequestException with the specified detail message, HTTP status, and error code.
     * Allows overriding the status if a more specific 4xx error is needed but still represents a bad request.
     *
     * @param message   the detail message.
     * @param status    the HTTP status to be used (should be a 4xx client error).
     * @param errorCode an optional application-specific error code.
     */
    public BadRequestException(String message, HttpStatus status, String errorCode) {
        super(message, status, errorCode);
    }

    /**
     * Constructs a new BadRequestException with the specified detail message, HTTP status, error code, and cause.
     * Allows overriding the status if a more specific 4xx error is needed but still represents a bad request.
     *
     * @param message   the detail message.
     * @param status    the HTTP status to be used (should be a 4xx client error).
     * @param errorCode an optional application-specific error code.
     * @param cause     the cause.
     */
    public BadRequestException(String message, HttpStatus status, String errorCode, Throwable cause) {
        super(message, status, errorCode, cause);
    }
}