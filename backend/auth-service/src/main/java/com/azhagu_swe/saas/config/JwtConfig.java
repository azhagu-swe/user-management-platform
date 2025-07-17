package com.azhagu_swe.saas.config;

import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;

@Configuration
@Slf4j
public class JwtConfig {

    // 1. @Value is used here, in the configuration class, to read the secret
    // string.
    @Value("${saas.app.jwtSecret}")
    private String secret;

    /**
     * 2. This method uses the secret string to create a cryptographic SecretKey
     * and provides it as a singleton Spring Bean.
     */
    @Bean
    public SecretKey secretKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 64) {
            log.error(
                    "!!! CRITICAL SECURITY WARNING: The configured JWT secret is too short for the HS512 algorithm (requires 64 bytes). Please provide a longer, secure secret. !!!");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }
}