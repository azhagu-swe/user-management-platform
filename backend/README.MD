# SaaS Platform - Backend Microservices

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.1-green)
![Maven](https://img.shields.io/badge/Build-Maven-red)
![Docker](https://img.shields.io/badge/Container-Docker-blue)

## 1. Overview

Welcome to the backend for the SaaS Platform. This project implements a modern, scalable microservice architecture designed to be robust, maintainable, and cloud-ready. The system is broken down into independent, containerized services that handle specific business domains (like authentication and payments) and communicate through a well-defined infrastructure.

This document provides a comprehensive guide for developers to understand the architecture, set up the development environment, and run the entire system.

---

## 2. Core Architecture

Our backend follows a standard microservice pattern. This decoupled approach allows for independent development, deployment, and scaling of each part of the application.

### Request Flow

All requests from a client (e.g., our Next.js frontend) follow this path:

1.  **Client (Browser)**
    * Sends API requests to the API Gateway, which is the only publicly exposed service.
        `|`
        `v`
2.  **API Gateway (`api-gateway` on port `8080`)**
    * Acts as the "front door." It handles routing, CORS, and centralized security by validating JSON Web Tokens (JWTs).
    * It queries the Discovery Server to find the network location of the required internal service.
        `|`
        `v`
3.  **Discovery Server (`discovery-server` on port `8761`)**
    * Acts as the "phone book" for the system. It maintains a live registry of all active microservice instances.
    * It responds to the API Gateway with the address of a healthy service instance.
        `|`
        `v`
4.  **API Gateway**
    * Forwards the request to the specific microservice over the internal Docker network.
        `|`
        `v`
5.  **Business Microservices (`auth-service`, `payment-service`, etc.)**
    * Each service handles its specific business logic.
    * Each service owns and connects to its own dedicated PostgreSQL database.
    * It processes the request and sends a response back up the chain.

---

## 3. Technology Stack

* **Java:** 17
* **Framework:** Spring Boot 3.2.5
* **Microservices:** Spring Cloud (Gateway, Netflix Eureka)
* **Database:** PostgreSQL
* **Database Migration:** Flyway
* **Security:** Spring Security (OAuth2 Resource Server for JWT)
* **Build Tool:** Maven (Multi-Module Monorepo)
* **Containerization:** Docker & Docker Compose

---

## 4. Getting Started (Local Development)

This project is fully containerized with Docker Compose for a streamlined, one-command setup.

### Prerequisites

* **Docker** and **Docker Compose** must be installed and running on your machine.
* **JDK 17** and **Maven** (for building the projects before the first Docker run).
* A Git client.

### Local Environment Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd saas-backend
    ```

2.  **Build All Modules with Maven:**
    Before running with Docker for the first time, Maven needs to build the application JAR files that will be copied into the Docker images. Run this command from the root directory (`saas-backend/`).
    ```bash
    mvn clean package -DskipTests
    ```

3.  **Run the Entire System with Docker Compose:**
    This single command will build the Docker images for each service (if they don't exist) and start all containers (databases, services) in the correct dependency order.
    ```bash
    docker-compose up --build
    ```
    * **`--build`**: Use this flag the first time or anytime you make changes to the source code or `Dockerfile`s to rebuild the images.
    * To run in the background (detached mode), use `docker-compose up -d --build`.
    * To stop all services, press `Ctrl + C` in the terminal or run `docker-compose down`.

---

## 5. Key Modules Overview

* **`discovery-server`**: The Eureka service registry.
    * **Dashboard:** [http://localhost:8761](http://localhost:8761) (Check here to see if all services have registered successfully).
* **`api-gateway`**: The single entry point for all API calls.
    * **Public URL:** [http://localhost:8080](http://localhost:8080).
* **`auth-service`**: Handles all authentication and user management logic.
    * **API Documentation (Swagger UI):** Accessible through the gateway at [http://localhost:8080/v1/api/auth/swagger-ui/index.html](http://localhost:8080/v1/api/auth/swagger-ui/index.html) (requires a route to be configured on the gateway for Swagger).
* **`payment-service`**: (In development) Manages all billing logic.

---

## 6. Configuration Management

* **Local:** Each service has its own `application.properties` or `.yml` file for base configuration.
* **Docker Compose:** The `docker-compose.yml` file uses `environment` variables to override properties for the containerized environment (e.g., setting database hostnames to service names like `auth-db`).
* **Production:** A centralized **Config Server** is the recommended next step for managing configuration in production environments, keeping secrets and environment-specific properties completely separate from the application code.

---

## 7. Troubleshooting

For common issues related to startup, Docker, CORS, routing, and database connections, please refer to the dedicated **`HELP.md`** file for each specific microservice.
`
# Centralized Configuration for Microservices

This repository stores the externalized configuration for the microservices-based application. The Spring Cloud Config Server reads from this repository to serve configuration to all other services.

## File Naming Convention

- `application.yml`: Contains properties that are **common to all** microservices (e.g., Eureka server address, management endpoints).
- `<service-name>.yml`: Contains properties **specific to a single service**. For example, `auth-service.yml` holds the database and JWT settings for the `auth-service`.

## Services

- `api-gateway.yml`
- `auth-service.yml`

Changes pushed to this repository can be dynamically reloaded by the services without restarting them by using the Spring Cloud Bus `/bus/refresh` endpoint.