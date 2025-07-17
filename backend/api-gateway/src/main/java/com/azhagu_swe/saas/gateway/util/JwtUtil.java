package com.azhagu_swe.saas.gateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.List;

@Component
@Slf4j
public class JwtUtil {

    private final JwtParser jwtParser;

    /**
     * Use modern constructor injection to receive the SecretKey bean.
     * The JwtParser is thread-safe and can be built once and reused.
     */
    public JwtUtil(SecretKey secretKey) {
        this.jwtParser = Jwts.parserBuilder().setSigningKey(secretKey).build();
    }

    /**
     * Validates the token. If invalid, the underlying method throws an exception.
     * 
     * @param token The JWT to validate.
     */
    public void validateToken(final String token) {
        try {
            jwtParser.parseClaimsJws(token);
        } catch (Exception e) {
            log.error("Invalid JWT token: {}", e.getMessage());
            throw e; // Re-throw for the filter to handle.
        }
    }

    /**
     * Extracts all claims from a valid token.
     */
    public Claims getAllClaimsFromToken(String token) {
        return jwtParser.parseClaimsJws(token).getBody();
    }

    /**
     * Extracts the User ID from the 'userId' claim in the token.
     */
    public String getUserIdFromToken(String token) {
        return getAllClaimsFromToken(token).get("userId", String.class);
    }

    /**
     * Extracts the roles from the 'roles' claim in the token.
     */
    @SuppressWarnings("unchecked")
    public List<String> getRolesFromToken(String token) {
        return getAllClaimsFromToken(token).get("roles", List.class);
    }
}