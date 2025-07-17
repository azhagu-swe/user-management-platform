package com.azhagu_swe.saas.exception; // Or your common exception handling package

import com.azhagu_swe.saas.dto.response.ErrorDetail;
import com.azhagu_swe.saas.dto.response.ErrorResponse;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler { // Extend for Spring MVC exception handling

        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        // --- Custom API Exception Handling ---
        @ExceptionHandler(ApiException.class)
        public ResponseEntity<ErrorResponse> handleApiException(ApiException ex, HttpServletRequest request) {
                logger.warn("API Exception: {} - Path: {}", ex.getMessage(), request.getRequestURI(), ex);
                ErrorResponse errorResponse = new ErrorResponse(
                                ex.getStatus().value(),
                                ex.getStatus().getReasonPhrase(),
                                ex.getMessage(),
                                request.getRequestURI());
                return new ResponseEntity<>(errorResponse, ex.getStatus());
        }

        // --- Specific Custom Exception Handlers (Examples) ---
        // You can create more specific handlers if ApiException is too generic or
        // if you don't make all your custom exceptions extend ApiException.

        @ExceptionHandler(ResourceNotFoundException.class)
        public ResponseEntity<ErrorResponse> handleResourceNotFoundException(
                        ResourceNotFoundException ex, HttpServletRequest request) {
                logger.warn("Resource Not Found: {} - Path: {}", ex.getMessage(), request.getRequestURI());
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.NOT_FOUND.value(),
                                HttpStatus.NOT_FOUND.getReasonPhrase(),
                                ex.getMessage(),
                                request.getRequestURI());
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(DuplicateResourceException.class)
        public ResponseEntity<ErrorResponse> handleDuplicateResourceException(
                        DuplicateResourceException ex, HttpServletRequest request) {
                logger.warn("Duplicate Resource: {} - Path: {}", ex.getMessage(), request.getRequestURI());
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.CONFLICT.value(),
                                HttpStatus.CONFLICT.getReasonPhrase(),
                                ex.getMessage(),
                                request.getRequestURI());
                return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }

        @ExceptionHandler(InvalidTokenException.class) // Example: for invalid JWT or RefreshToken
        public ResponseEntity<ErrorResponse> handleInvalidTokenException(
                        InvalidTokenException ex, HttpServletRequest request) {
                logger.warn("Invalid Token: {} - Path: {}", ex.getMessage(), request.getRequestURI());
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.UNAUTHORIZED.value(), // Or BAD_REQUEST depending on context
                                HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                                ex.getMessage(),
                                request.getRequestURI());
                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        // --- Spring Security Exception Handling ---
        @ExceptionHandler(AuthenticationException.class) // Base for auth failures by Spring Security
        public ResponseEntity<ErrorResponse> handleAuthenticationException(
                        AuthenticationException ex, HttpServletRequest request) {
                logger.warn("Authentication Failed: {} - Path: {}", ex.getMessage(), request.getRequestURI());
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.UNAUTHORIZED.value(),
                                HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                                ex.getMessage(), // Or a more generic "Authentication failed"
                                request.getRequestURI());
                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(AccessDeniedException.class) // From Spring Security for authorization failures
        public ResponseEntity<ErrorResponse> handleAccessDeniedException(
                        AccessDeniedException ex, HttpServletRequest request) {
                logger.warn("Access Denied: {} - Path: {}", ex.getMessage(), request.getRequestURI());
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.FORBIDDEN.value(),
                                HttpStatus.FORBIDDEN.getReasonPhrase(),
                                "You do not have permission to access this resource.", // Generic message
                                request.getRequestURI());
                return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        }

        // --- Standard Spring MVC Exception Overrides (from
        // ResponseEntityExceptionHandler) ---
        @Override
        protected ResponseEntity<Object> handleMethodArgumentNotValid(
                        MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status,
                        WebRequest request) {
                logger.warn("Validation Error: {}", ex.getMessage());
                List<ErrorDetail> errorDetails = ex.getBindingResult().getFieldErrors().stream()
                                .map(fieldError -> new ErrorDetail(
                                                fieldError.getField(),
                                                (fieldError.getRejectedValue() != null
                                                                ? fieldError.getRejectedValue().toString()
                                                                : "null"),
                                                fieldError.getDefaultMessage()))
                                .collect(Collectors.toList());

                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                                "Validation failed. Please check your input.",
                                ((org.springframework.web.context.request.ServletWebRequest) request).getRequest()
                                                .getRequestURI());
                errorResponse.setDetails(errorDetails);
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ConstraintViolationException.class) // For @Validated on params/path variables
        public ResponseEntity<ErrorResponse> handleConstraintViolationException(
                        ConstraintViolationException ex, HttpServletRequest request) {
                logger.warn("Constraint Violation: {}", ex.getMessage());
                List<ErrorDetail> errorDetails = ex.getConstraintViolations().stream()
                                .map(violation -> new ErrorDetail(
                                                violation.getPropertyPath().toString(),
                                                (violation.getInvalidValue() != null
                                                                ? violation.getInvalidValue().toString()
                                                                : "null"),
                                                violation.getMessage()))
                                .collect(Collectors.toList());

                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                                "Validation failed. Please check your input.",
                                request.getRequestURI());
                errorResponse.setDetails(errorDetails);
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @Override
        protected ResponseEntity<Object> handleHttpMessageNotReadable(
                        HttpMessageNotReadableException ex, HttpHeaders headers, HttpStatusCode status,
                        WebRequest request) {
                logger.warn("Malformed JSON request: {}", ex.getMessage());
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                                "Malformed JSON request or invalid request body.", // More generic message
                                ((org.springframework.web.context.request.ServletWebRequest) request).getRequest()
                                                .getRequestURI());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(MethodArgumentTypeMismatchException.class)
        public ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatch(
                        MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
                logger.warn("Method Argument Type Mismatch: {}", ex.getMessage());
                String message = String.format("Parameter '%s' with value '%s' could not be converted to type '%s'.",
                                ex.getName(), ex.getValue(),
                                ex.getRequiredType() != null ? ex.getRequiredType().getSimpleName() : "unknown");
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                HttpStatus.BAD_REQUEST.getReasonPhrase(),
                                message,
                                request.getRequestURI());
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @Override
        protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
                        HttpRequestMethodNotSupportedException ex, HttpHeaders headers, HttpStatusCode status,
                        WebRequest request) {
                logger.warn("HTTP Method Not Supported: {}", ex.getMessage());
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.METHOD_NOT_ALLOWED.value(),
                                HttpStatus.METHOD_NOT_ALLOWED.getReasonPhrase(),
                                ex.getMessage(),
                                ((org.springframework.web.context.request.ServletWebRequest) request).getRequest()
                                                .getRequestURI());
                return new ResponseEntity<>(errorResponse, HttpStatus.METHOD_NOT_ALLOWED);
        }

        @Override
        protected ResponseEntity<Object> handleNoHandlerFoundException(
                        NoHandlerFoundException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
                logger.warn("No Handler Found: {}", ex.getMessage());
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.NOT_FOUND.value(),
                                HttpStatus.NOT_FOUND.getReasonPhrase(),
                                String.format("The requested resource '%s' was not found on this server.",
                                                ex.getRequestURL()),
                                ex.getRequestURL());
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        // --- Fallback Handler for any other unhandled exceptions ---
        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> handleAllUncaughtException(
                        Exception ex, HttpServletRequest request) {
                logger.error("An unexpected error occurred: Path: {}", request.getRequestURI(), ex); // Log with full
                                                                                                     // stack trace for
                                                                                                     // server errors
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                                "An unexpected internal server error occurred. Please try again later.", // Generic
                                                                                                         // message for
                                                                                                         // client
                                request.getRequestURI());
                return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // // Inside GlobalExceptionHandler.java
        @ExceptionHandler(BadRequestException.class)
        public ResponseEntity<ErrorResponse> handleBadRequestException(
                        BadRequestException ex, HttpServletRequest request) {
                logger.warn("Bad Request: {} - Path: {}", ex.getMessage(), request.getRequestURI());
                ErrorResponse errorResponse = new ErrorResponse(
                                ex.getStatus().value(), // Will be HttpStatus.BAD_REQUEST (400)
                                ex.getStatus().getReasonPhrase(),
                                ex.getMessage(),
                                request.getRequestURI());
                // if (ex.getErrorCode() != null) {
                // errorResponse.setErrorCode(ex.getErrorCode()); } // If ErrorResponse supports
                // it
                return new ResponseEntity<>(errorResponse, ex.getStatus());
        }
}