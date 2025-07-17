
# Eureka Discovery Server

## Overview

Welcome to the  **Eureka Discovery Server** . This service is the central **Service Registry** for our entire SaaS application and acts as the "phone book" for all other microservices. Its sole purpose is to keep track of all running service instances and their network locations.

By using this server, our other services (like the API Gateway) can find and communicate with each other using simple, logical service names (e.g., `auth-service`) instead of hardcoded IP addresses and ports. This makes our architecture dynamic, resilient, and scalable.

This service is built using  **Spring Cloud Netflix Eureka Server** .

---

## Core Responsibilities

* **Service Registration:** Listens for other microservices (Eureka Clients) to start up. When a service comes online, it registers itself with the Eureka server, providing its application name, IP address, port, and health status.
* **Service Discovery:** Provides a registry that other services can query to get the up-to-date network locations of any registered service. The API Gateway relies heavily on this to perform dynamic routing.
* **Health Monitoring & Registry Maintenance:** Eureka clients are required to send regular "heartbeats" (pings) to the server. If the server does not receive heartbeats from a service instance for a configurable period, it assumes the instance is unhealthy and removes it from the registry. This prevents traffic from being routed to a failed service.

---

## Tech Stack

* **Java 17+**
* **Spring Boot 3.2.x**
* **Spring Cloud Netflix Eureka Server**
* **Spring Security** (for securing the dashboard)
* **Maven**

---

## Configuration

The service is configured in `src/main/resources/application.yml`. The configuration is minimal but very important.

**YAML**

```
# The standard port for Eureka Discovery Server
server:
  port: 8761

# The name of this application
spring:
  application:
    name: discovery-server
  
  # Credentials to protect the Eureka dashboard from unauthorized access
  security:
    user:
      name: eureka-admin
      # The password should be loaded from a secure environment variable in production
      password: ${EUREKA_DASHBOARD_PASSWORD:YourStrongPasswordHere}

# Eureka-specific configuration
eureka:
  client:
    # A Eureka server should not try to register with itself.
    # This setting tells it NOT to add itself to its own phone book.
    register-with-eureka: false
  
    # This setting tells it NOT to try to fetch the registry from another server.
    # It IS the registry.
    fetch-registry: false
  
  server:
    # This setting is useful for development with a single Eureka node.
    # It tells the server not to wait for other replica nodes to connect on startup,
    # which speeds up the startup time significantly.
    wait-time-in-ms-when-sync-empty: 0
```

### Security Configuration

The Eureka dashboard and API are protected by HTTP Basic Authentication.

* **Username:** `eureka-admin`
* **Password:** Defined by the `spring.security.user.password` property.

Any client service that wants to register with this server **must** include these credentials in its `eureka.client.service-url.defaultZone` property.

**Example Client Configuration (for `auth-service`, `api-gateway`, etc.):**

**YAML**

```
eureka:
  client:
    service-url:
      defaultZone: http://eureka-admin:YourStrongPasswordHere@localhost:8761/eureka
```

---

## Running Locally

### Prerequisites

* Java 17+ and Maven installed.

### How to Run

This service is the first piece of infrastructure that should be started.

You can run the application using your IDE or from the command line:

**Bash**

```
# Clean and build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Once started, you can access the Eureka dashboard in your browser at  **`http://localhost:8761`** . You will be prompted for the username and password you defined in the configuration. After logging in, you can see the status of the server and a list of all registered client services.

---

## High Availability (Production Note)

For a production environment, you should never run a single instance of the discovery server as it would be a single point of failure. The professional approach is to run **at least two or three instances** configured as peers.

Each peer registers with the other, and they replicate their registry information. If one server instance goes down, the others remain available, and the system continues to function without interruption.

---

## Troubleshooting

For common issues such as port conflicts, client registration failures, or other startup problems, please refer to the **`HELP.md`** file in this project.
