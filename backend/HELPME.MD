# Project Troubleshooting Guide (HELP.md)

This guide provides solutions to common issues that can occur when running the multi-service backend environment with Docker Compose.

---

### **Issue 1: Docker Compose Fails with `Unable to access jarfile /app.jar`**

**Symptom:**
When running `docker-compose up --build`, one or more services exit immediately with `Error: Unable to access jarfile /app.jar`.

**Cause:**
The `mvn clean package` command inside the Docker build process did not produce a JAR file named `app.jar` in the `target` directory. This is usually because the `<finalName>app</finalName>` configuration is missing from the service's `pom.xml`.

**Solution:**
1.  Open the `pom.xml` file of the failing service (e.g., `auth-service/pom.xml`).
2.  Find the `<build>` section and ensure the `spring-boot-maven-plugin` is configured correctly:
    ```xml
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <finalName>app</finalName>
                </configuration>
            </plugin>
        </plugins>
    </build>
    ```
3.  Run `docker-compose up --build --no-cache` again to force a full rebuild with the new configuration.

---

### **Issue 2: A Service Fails to Start, Complaining About Database Connection**

**Symptom:**
The `auth-service` logs show errors like `Connection to localhost:5432 refused` or `Connection to auth-db:5432 refused`.

**Cause:**
The service cannot connect to its database. This is usually due to either a timing issue or a misconfiguration in `docker-compose.yml`.

**Solution Checklist:**
1.  **Service Naming:** In your `docker-compose.yml`, ensure the database service is named correctly (e.g., `auth-db`).
2.  **Environment Variable:** Make sure the service's environment variables in `docker-compose.yml` are pointing to the Docker service name, **not `localhost`**.
    * **Correct:** `SPRING_DATASOURCE_URL=jdbc:postgresql://auth-db:5432/auth_db`
    * **Incorrect:** `SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/auth_db`
3.  **`depends_on`:** Verify that the service definition in `docker-compose.yml` includes a `depends_on` clause for its database, like so:
    ```yaml
    auth-service:
      # ...
      depends_on:
        - auth-db
        - discovery-server
    ```

---

### **Issue 3: Services Fail to Register with Eureka**

**Symptom:**
The Eureka Dashboard (`http://localhost:8761`) is empty, or a service's logs show `401 Unauthorized` errors when trying to connect to Eureka.

**Cause:**
The client service (`auth-service`, `api-gateway`) has the wrong configuration for connecting to the secured Eureka server.

**Solution:**
1.  **Check Startup Order:** Always start the `discovery-server` first.
2.  **Verify Client Configuration:** In the `application.properties` or `.yml` of the failing client service, check the Eureka URL. It **must** include the correct username and password.
    * **Correct Format:** `eureka.client.service-url.defaultZone=http://eureka-admin:YourStrongPasswordHere@discovery-server:8761/eureka` (Note: `discovery-server` is the hostname inside the Docker network).

---

### **Issue 4: `404 Not Found` When Calling an Endpoint via the API Gateway**

**Symptom:**
A request to `http://localhost:8080/v1/api/users` returns a `404 Not Found`, but you know the `auth-service` has that endpoint.

**Cause:**
There is a mismatch between the `Path` predicate in the `api-gateway`'s routing rule and the actual `@RequestMapping` path in the downstream service's controller.

**Solution:**
1.  Open the `api-gateway`'s `application.yml`. Look at the `predicates` for the route. Example: `Path=/v1/api/users/**`.
2.  Open the controller in the `auth-service`. Look at its `@RequestMapping`. Example: `@RequestMapping("/v1/api/users")`.
3.  Ensure they match perfectly. The gateway's `Path` must match the full prefix of the controller path.

---

### **Issue 5: `401 Unauthorized` When Accessing a Protected Endpoint**

**Symptom:**
You have successfully logged in and received a JWT. When you use this token to call a protected endpoint through the gateway, you get a `401 Unauthorized` error.

**Cause:**
The API Gateway rejected your JWT as invalid. This is almost always because the **JWT Secret Key is not identical** between the service that created the token (`auth-service`) and the service that is validating it (`api-gateway`).

**Solution:**
1.  **Verify JWT Secret:** Open the configuration files for both `auth-service` and `api-gateway`.
2.  **Copy** the entire `saas.app.jwtSecret` string from `auth-service`.
3.  **Paste** it into the `api-gateway`'s configuration, replacing the old value. Ensure there are no extra spaces or character differences.
4.  **Check Dependencies:** Make sure the `api-gateway`'s `pom.xml` has all the `io.jsonwebtoken` (`jjwt`) dependencies.
5.  **Check Decoder Config:** Ensure the `api-gateway` has the `JwtDecoderConfig.java` class to handle HS512 validation.
6.  **Restart** the `api-gateway`.