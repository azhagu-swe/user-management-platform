package com.azhagu_swe.saas.gateway.filter;

import com.azhagu_swe.saas.gateway.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.function.Predicate;

@Component
@Slf4j
public class JwtAuthenticationGatewayFilterFactory extends AbstractGatewayFilterFactory<JwtAuthenticationGatewayFilterFactory.Config> {

    private final JwtUtil jwtUtil;

    public JwtAuthenticationGatewayFilterFactory(JwtUtil jwtUtil) {
        super(Config.class);
        this.jwtUtil = jwtUtil;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();
            log.debug("Applying JWT Authentication filter to request: {}", request.getURI());

            final List<String> publicApiEndpoints = List.of(
                "/v1/api/auth",
                "/swagger-ui",
                "/v3/api-docs"
            );

            Predicate<ServerHttpRequest> isSecured = r -> publicApiEndpoints.stream()
                    .noneMatch(uri -> r.getURI().getPath().startsWith(uri));

            if (isSecured.test(request)) {
                if (!isAuthHeaderPresent(request)) {
                    return onError(exchange, "Authorization header is missing", HttpStatus.UNAUTHORIZED);
                }

                String token = extractToken(request);
                if (token == null) {
                    return onError(exchange, "Authorization header format must be 'Bearer <token>'", HttpStatus.UNAUTHORIZED);
                }

                try {
                    // 1. Validate the token
                    jwtUtil.validateToken(token);

                    // 2. Extract claims for header enrichment
                    String userId = jwtUtil.getUserIdFromToken(token);
                    List<String> roles = jwtUtil.getRolesFromToken(token);
                    log.debug("Authenticated User ID: {}, Roles: {}", userId, roles);

                    // 3. Add user info to request headers for downstream services
                    ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                            .header("X-User-Id", userId)
                            .header("X-User-Roles", String.join(",", roles))
                            .build();

                    // 4. Forward the modified request
                    return chain.filter(exchange.mutate().request(modifiedRequest).build());

                } catch (Exception e) {
                    log.error("JWT Authentication Error: {}", e.getMessage());
                    return onError(exchange, "Unauthorized", HttpStatus.UNAUTHORIZED);
                }
            }
            
            // If the endpoint is public, pass through without checks
            return chain.filter(exchange);
        };
    }

    private boolean isAuthHeaderPresent(ServerHttpRequest request) {
        return request.getHeaders().containsKey("Authorization");
    }

    private String extractToken(ServerHttpRequest request) {
        String authHeader = request.getHeaders().getOrEmpty("Authorization").get(0);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }
        return null;
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        log.warn("Authorization Error: {}", err);
        return response.setComplete();
    }

    public static class Config {
        // Configuration properties can be added here
    }
}