package com.azhagu_swe.saas.config;

import com.azhagu_swe.saas.filter.RateLimitingFilter;
import com.azhagu_swe.saas.security.jwt.AuthEntryPointJwt; // Import new handler
import com.azhagu_swe.saas.security.jwt.CustomAccessDeniedHandler; // Import new handler
import com.azhagu_swe.saas.security.jwt.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
// import org.springframework.beans.factory.annotation.Autowired; // No longer needed for jwtAuthenticationFilter
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true) 
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RateLimitingFilter rateLimitingFilter;
    private final CorsConfigurationSource corsConfigurationSource;
    private final AuthEntryPointJwt unauthorizedHandler; 
    private final CustomAccessDeniedHandler accessDeniedHandler; 

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(unauthorizedHandler) 
                .accessDeniedHandler(accessDeniedHandler)      
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                        "/v1/api/auth/**",         
                        "/swagger-ui/**",       
                        "/v3/api-docs/**",     
                        "/actuator/health",     
                        "/error"               
                ).permitAll()
                .requestMatchers("/actuator/**").hasAuthority("ROLE_ADMIN") 
                .anyRequest().authenticated()   
            );

       
        http.addFilterBefore(rateLimitingFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
      
        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}