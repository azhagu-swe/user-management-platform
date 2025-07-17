package com.azhagu_swe.saas.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

        @Bean
        public OpenAPI customOpenAPI() {
                SecurityScheme bearerScheme = new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .in(SecurityScheme.In.HEADER)
                                .name("Authorization");

                SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");

                return new OpenAPI()
                                .components(new Components().addSecuritySchemes("bearerAuth", bearerScheme))
                                .addSecurityItem(securityRequirement)
                                .info(new Info()
                                                .title("Saas Starter API")
                                                .version("1.0")
                                                .description("API documentation for the Tech Tutorials application")
                                                .contact(new Contact()
                                                                .name("Azhagu")
                                                                .email("azhagu.swe@gmail.com")
                                                                .url("https://azhagu_tech.com"))
                                                .license(new License()
                                                                .name("Apache 2.0")
                                                                .url("http://springdoc.org")));
        }
}
