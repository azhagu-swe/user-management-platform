package com.azhagu_swe.saas.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsGlobalConfig {

    @Value("${app.cors.allowedOrigins}")
    private List<String> allowedOrigins;

    @Value("${app.cors.allowedMethods}")
    private List<String> allowedMethods;

    @Value("${app.cors.allowedHeaders}")
    private List<String> allowedHeaders;

    @Value("${app.cors.allowCredentials:true}")
    private boolean allowCredentials;

    @Value("${app.cors.maxAge:7200}")
    private Long maxAge;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowCredentials(this.allowCredentials);
        configuration.setAllowedOrigins(this.allowedOrigins);
        configuration.setAllowedMethods(this.allowedMethods);
        configuration.setAllowedHeaders(this.allowedHeaders);
        configuration.setMaxAge(this.maxAge);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}