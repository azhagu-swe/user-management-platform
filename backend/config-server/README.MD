# Spring Cloud Config Server

This microservice acts as the centralized configuration server for the entire backend application. It provides a consistent and managed way to serve configuration properties to all other services, externalizing their configuration from their deployment packages.

This server is backed by a Git repository, allowing for version-controlled, auditable, and dynamic configuration management.

## Core Concepts

The Config Server operates on a simple principle: it maps an incoming request from a client service to a specific configuration file in its backend Git repository.

The mapping is based on:

  - **Application Name**: The `spring.application.name` of the client service (e.g., `api-gateway`).
  - **Profile**: The active Spring profile (e.g., `dev`, `prod`, `default`).

For example, a request from the `api-gateway` service with the `default` profile will be served a combination of properties from `application.yml` and `api-gateway.yml` in the Git repository.

## Technology Stack

  - **Spring Boot**: For the application framework.
  - **Spring Cloud Config Server**: Enables the core functionality.
  - **Spring Cloud Netflix Eureka Client**: For service discovery and registration.
  - **Git**: As the backend for storing configuration files.

## Configuration

The server's own configuration is located in `src/main/resources/application.yml`. The most critical section is the configuration for the Git repository backend.

```yaml
spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git:
          # The URI of your configuration repository
          uri: [https://github.com/your-github-username/microservices-config-repo.git](https://github.com/your-github-username/microservices-config-repo.git)
          # For public repos, no credentials are needed.
          # For private repos, configure username/password or an SSH key.
          clone-on-start: true
          # Force pull to ensure the server has the latest changes on refresh
          force-pull: true