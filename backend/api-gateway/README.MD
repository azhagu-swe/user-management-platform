
# API Gateway Service

## Overview

Welcome to the API Gateway for the SaaS application. This service is the **single entry point** for all external client requests (e.g., from our Next.js frontend). It is a critical component of our microservice architecture, responsible for routing, security, and other cross-cutting concerns.

The gateway is built using **Spring Cloud Gateway**, which is a modern, reactive framework designed for this purpose. It ensures that our internal microservices are not directly exposed to the public internet, providing a robust and secure perimeter.

---
## Core Responsibilities

* **Routing:** Intelligently directs incoming API requests to the appropriate downstream microservice (e.g., `auth-service`, `payment-service`). This routing is dynamic, using the **Eureka Discovery Server** to find the network locations of other services.
* **Centralized Security:**
    * **Authentication:** Validates JSON Web Tokens (JWTs) on all protected endpoints. It is the single security checkpoint, simplifying our internal services.
    * **CORS Management:** Handles all Cross-Origin Resource Sharing (CORS) policies, allowing our frontend application to communicate with the backend securely.
* **Load Balancing:** If multiple instances of a downstream service are running (e.g., two `auth-service` instances for high availability), the gateway automatically load-balances requests between them.
* **Cross-Cutting Concerns:** This is the ideal place to manage global policies like rate limiting, request logging, and metrics collection.

---
## Tech Stack

* **Java 17+**
* **Spring Boot 3.2.x**
* **Spring Cloud Gateway** (Reactive)
* **Spring Security** (WebFlux)
* **Spring Cloud Netflix Eureka Client**
* **Maven**

---
## Configuration

The primary configuration for the gateway is located in `src/main/resources/application.yml`. This file is the "control panel" for the service.

### Key Configuration Sections

* `server.port`: The public port the gateway listens on (e.g., `8080`). All client requests must be sent here.
* `spring.application.name`: The name this service registers with in Eureka (`api-gateway`).
* `eureka.client.service-url.defaultZone`: The address of the Eureka Discovery Server.
* `saas.app.jwtSecret`: The secret key used to validate JWTs. This **must** be identical to the secret used by the `auth-service`.
* `app.cors.allowedOrigins`: A list of frontend URLs that are permitted to make requests.

### Understanding Routes

The most important part of the configuration is `spring.cloud.gateway.routes`. This defines how requests are routed.

**Example Route:**
```yaml
- id: auth-service-route
  uri: lb://auth-service
  predicates:
    - Path=/v1/api/auth/**, /api/users/**
```
* **`id`**: A unique name for the route.
* **`uri: lb://auth-service`**: The destination. The `lb://` prefix is critical; it tells the gateway to look up a service named `auth-service` from Eureka.
* **`predicates: - Path=...`**: The condition. This rule says, "If an incoming request's path matches `/v1/api/auth/**` OR `/api/users/**`, forward it to the `auth-service`."

---
## Running Locally

### Prerequisites

* Java 17+ and Maven installed.
* A running instance of the **Eureka Discovery Server** (`discovery-server`).
* The downstream microservices (e.g., `auth-service`, `payment-service`) must be running and successfully registered with Eureka.

### Crucial Startup Order

For the system to function, services **must** be started in this order:

1.  **`discovery-server`** (The central registry)
2.  **`auth-service`**, **`payment-service`**, and any other business services.
3.  **`api-gateway`** (Starts last, after the services it needs to route to are registered)

### Build and Run

You can run the application using your IDE or from the command line:
```bash
# Clean and build the project
mvn clean install

# Run the application
mvn spring-boot:run
```
Once started, the gateway will listen on port `8080`.

---
## Common Troubleshooting

Please refer to the `HELP.md` file in this project for a detailed guide on solving common issues like `404 Not Found` (routing mismatch), `503 Service Unavailable` (discovery issues), and CORS errors.