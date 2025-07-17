package com.azhagu_swe.saas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {


    @Value("${app.cors.allowedOrigins:*}")
    private List<String> allowedOrigins; 

    @Value("${app.cors.allowedMethods:GET,POST,PUT,DELETE,OPTIONS,PATCH}") 
    private List<String> allowedMethods;

    @Value("${app.cors.allowedHeaders:Authorization,Cache-Control,Content-Type,X-Requested-With,Accept,Origin}") 
    private List<String> allowedHeaders;

    @Value("${app.cors.exposedHeaders:Content-Disposition,X-Rate-Limit-Remaining,Retry-After}") 
    private List<String> exposedHeaders;

    @Value("${app.cors.allowCredentials:true}")
    private boolean allowCredentials;

    @Value("${app.cors.maxAge:3600}") 
    private Long maxAge;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

      
        if (allowedOrigins != null && !allowedOrigins.isEmpty()) {
            configuration.setAllowedOrigins(allowedOrigins);
        } else {
            configuration.setAllowedOrigins(List.of("*"));
        }

        configuration.setAllowedMethods(allowedMethods);

        configuration.setAllowedHeaders(allowedHeaders);

        configuration.setExposedHeaders(exposedHeaders);

        configuration.setAllowCredentials(allowCredentials);

        configuration.setMaxAge(maxAge);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}