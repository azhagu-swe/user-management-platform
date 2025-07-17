package com.azhagu_swe.saas.gateway.config;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Configuration
public class JwtConfig {

    @Value("${saas.app.jwtSecret}")
    private String secret;

    /**
     * Creates a singleton SecretKey bean that can be injected into other components.
     * This ensures the key is created only once and managed by Spring.
     * @return A secure SecretKey for HS512.
     */
    @Bean
    public SecretKey secretKey() {
        // Ensure the secret from your configuration is long enough for the HS512 algorithm (at least 64 bytes).
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}