package com.azhagu_swe.saas.security.jwt;

import com.azhagu_swe.saas.security.service.impl.UserDetailsServiceImpl;
import com.azhagu_swe.saas.util.JwtUtils;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * A filter that runs once per request to validate the JWT token.
 * If the token is valid, it sets the user authentication in the Spring Security context.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {
        
        // Only process if there is no existing authentication in the context
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                String jwt = parseJwt(request);
                if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                    // If token is valid, create and set the authentication object
                    setAuthenticationInContext(jwt, request);
                }
            } catch (JwtException e) {
                // This will catch any JJWT specific exception (expired, malformed, etc.)
                log.warn("JWT processing error for request URI [{}]: {}", request.getRequestURI(), e.getMessage());
                // We allow the request to proceed, but without authentication.
                // The endpoint's security rules will then deny access if it's a protected resource.
            }
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Extracts the token from the "Authorization: Bearer <token>" header.
     */
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7);
        }
        return null;
    }

    /**
     * Creates the Authentication object and sets it in the SecurityContext.
     */
    private void setAuthenticationInContext(String jwt, HttpServletRequest request) {
        String username = jwtUtils.getUsernameFromJwtToken(jwt); // This is the user's email

        // Load user details from the database. This ensures the user account is still active.
        UserDetails userDetails = userDetailsService.loadUserByUsername(username);

        // Create the authentication token. Spring Security will use the authorities from the UserDetails object.
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userDetails, null, userDetails.getAuthorities());
        
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        // Set the authentication object in the security context
        SecurityContextHolder.getContext().setAuthentication(authentication);
        log.debug("Successfully set security context for user: {}", username);
    }
}