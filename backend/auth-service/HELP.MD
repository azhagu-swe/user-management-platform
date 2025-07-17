
# Authentication & Authorization Service (`auth-service`)

## Overview

Welcome to the  **Authentication & Authorization Service** . This microservice is the central authority for user identity and access control within our SaaS platform. It handles all aspects of the user lifecycle, from registration and login to password management and permissions.

This service is responsible for verifying who a user is (Authentication) and what they are allowed to do (Authorization). It generates JSON Web Tokens (JWTs) for authenticated users, which are then used to securely access other microservices in the system.

---

## Core Responsibilities

* **User Authentication:**
  * Handles user sign-in via email and password.
  * Validates credentials against the database.
  * Issues short-lived JWT access tokens and long-lived refresh tokens upon successful login.
* **User & Identity Management:**
  * Manages user registration (sign-up).
  * Provides endpoints for users to manage their own profiles.
  * Includes a full password recovery flow (forgot password and reset password).
  * Handles email verification for new users.
* **Authorization Management:**
  * Manages a granular, permission-based access control system.
  * Defines `Roles` (e.g., "StandardUser", "AccountAdmin") and `Permissions` (e.g., "PERMISSION_WIDGET_CREATE").
  * The JWTs it generates contain all the necessary roles and permissions (as "authorities") that other services use to make authorization decisions.
* **Service Discovery:** Registers itself as `auth-service` with the Eureka Discovery Server so the API Gateway and other services can find it.

---

## Tech Stack

* **Java 17+**
* **Framework:** Spring Boot 3.2.x, Spring MVC
* **Security:** Spring Security, JWT (jjwt library)
* **Database:** PostgreSQL
* **Persistence:** Spring Data JPA, Hibernate
* **Database Migration:** Flyway
* **Service Discovery:** Spring Cloud Netflix Eureka Client
* **Build Tool:** Maven

---

## Key Configuration

The service is configured in `src/main/resources/application.properties`.

* **`server.port`** : The internal port for this service (e.g., `8081`). It should not be exposed directly to the public.
* **`spring.application.name`** : The unique name for this service, `auth-service`, used for Eureka registration.
* **`spring.datasource.*`** : Connection details for its dedicated `auth_db` PostgreSQL database.
* **`spring.jpa.hibernate.ddl-auto`** : Set to `validate` to ensure JPA entities are in sync with the Flyway-managed schema.
* **`eureka.client.service-url.defaultZone`** : The address of the secured Eureka Discovery Server.
* **`saas.app.jwtSecret`** : The highly sensitive secret key used to *sign* JWTs. This key must be identical in the API Gateway for validation to succeed.
* **`saas.app.jwtExpirationMs`** : The lifespan of a JWT access token (e.g., 1 hour).
* **`saas.app.refreshExpirationMs`** : The lifespan of a refresh token (e.g., 30 days).

---

## API Endpoints

This service exposes endpoints under the `/v1/api/` prefix. These endpoints are routed to by the API Gateway.

* `POST /auth/signup`: Registers a new user.
* `POST /auth/signin`: Authenticates a user and returns access and refresh tokens.
* `POST /auth/refresh-token`: Issues a new access token using a valid refresh token.
* `POST /auth/logout`: Invalidates a user's refresh token.
* `POST /auth/forgot-password`: Initiates the password reset flow.
* `POST /auth/reset-password`: Completes the password reset with a valid token.
* `GET /users`: (Admin) Retrieves a paginated list of all users.
* `GET /roles/all`: (Admin) Retrieves a list of all available roles for UI dropdowns.
* ... and other CRUD endpoints for Users, Roles, and Permissions.

---

## Database Schema Management

The database schema for this service is exclusively managed by  **Flyway** .

* All schema changes (e.g., creating tables, adding columns) must be done by adding a new, versioned SQL script in the `src/main/resources/db/migration` directory.
* Never modify an existing migration script that has already been applied.
* The `V1__...` script creates the initial tables (`users`, `roles`, `permissions`, and their join tables). The `V1.1__...` script seeds the database with the predefined, essential roles and permissions.

---

## Running Locally

### Prerequisites

* Java 17+, Maven, and a running PostgreSQL instance.
* The `discovery-server` must be running before you start this service.

### Startup Order

1. Start `discovery-server`.
2. Start `auth-service`.
3. Start `api-gateway`.

### Build and Run

You can run the application using your IDE or from the command line:

**Bash**

```
# Clean and build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Once started, check the Eureka Dashboard (`http://localhost:8761`) to confirm that `AUTH-SERVICE` has successfully registered. All API calls to this service should be made through the API Gateway (`http://localhost:8080`).

---

## Troubleshooting

For common issues, please refer to the project's dedicated `HELP.md` file.
