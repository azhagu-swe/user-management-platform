package com.azhagu_swe.saas.util;

import com.azhagu_swe.saas.security.service.impl.UserDetailsImpl;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for generating and validating JSON Web Tokens (JWTs).
 * This class is responsible for creating tokens for authenticated users.
 */
@Component
@Slf4j
public class JwtUtils {

    @Value("${saas.app.jwtExpirationMs}")
    private long jwtExpirationMs;

    private final SecretKey key;
    private final JwtParser jwtParser;

    /**
     * Injects the SecretKey bean managed by Spring.
     * This is the recommended way to handle keys and thread-safe parsers.
     * @param key The singleton SecretKey bean from JwtConfig.
     */
    public JwtUtils(SecretKey key) {
        this.key = key;
        this.jwtParser = Jwts.parserBuilder().setSigningKey(key).build();
    }

    /**
     * Generates a JWT token from a successfully authenticated user principal.
     * This is the primary method for creating tokens after login.
     * @param authentication The authentication object from Spring Security context.
     * @return A JWT string.
     */
    public String generateJwtToken(Authentication authentication) {
        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        // Extract roles as a clean list of strings (e.g., ["ROLE_USER", "ROLE_ADMIN"])
        // This is a more robust format than a comma-separated string.
        List<String> roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        // Build the JWT with standard claims and custom claims (userId, roles)
        return Jwts.builder()
                .setSubject(userPrincipal.getUsername()) // Subject is the user's email/username
                .claim("userId", userPrincipal.getId().toString()) // Add userId as a custom claim
                .claim("roles", roles) // Add roles as a list claim
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Validates a given JWT token. It checks for a valid signature and expiration.
     * @param authToken The token to validate.
     * @return true if the token is valid, false otherwise.
     */
    public boolean validateJwtToken(String authToken) {
        try {
            jwtParser.parseClaimsJws(authToken);
            return true;
        } catch (JwtException e) {
            log.error("JWT validation error: {}", e.getMessage());
        }
        return false;
    }

    /**
     * Extracts the username (the token's subject) from a valid JWT.
     * @param token The JWT.
     * @return The username (email).
     */
    public String getUsernameFromJwtToken(String token) {
        return jwtParser.parseClaimsJws(token).getBody().getSubject();
    }
}