package com.azhagu_swe.saas.discovery.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF for Eureka's API endpoints
            // Eureka clients may not handle CSRF tokens, so it's common to disable this for the /eureka/** path.
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/eureka/**")
            )
            // 2. Define authorization rules
            .authorizeHttpRequests(auth -> auth
                // All other requests to any endpoint must be authenticated
                .anyRequest().authenticated()
            )
            // 3. Enable HTTP Basic Authentication
            .httpBasic(withDefaults());

        return http.build();
    }
}
