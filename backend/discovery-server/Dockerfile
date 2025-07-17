# --- Build Stage ---
# Use an official Maven image with a specific JDK to build the application JAR.
FROM maven:3.9-eclipse-temurin-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file first. This leverages Docker's layer caching.
# If pom.xml doesn't change, Maven won't need to re-download dependencies.
COPY pom.xml .

# Copy the rest of your source code
COPY src ./src

# -- DEBUG: List files to confirm pom.xml and src are copied --
RUN echo "--- Listing files in /app before build ---" && ls -la

# Build the application using Maven. This creates the JAR file in the /app/target/ directory.
RUN mvn clean package -DskipTests

# -- DEBUG: List the contents of the target directory to see what was actually built --
RUN echo "--- Listing contents of /app/target/ after build ---" && ls -la /app/target/

# --- Run Stage ---
# Use a slim, secure base image for the final container to reduce size.
FROM openjdk:17-slim
WORKDIR /app

# Copy the specifically named app.jar from the build stage.
# If the previous step fails to create app.jar, this step will fail with a "not found" error.
COPY --from=build /app/target/app.jar app.jar

# The command to run the application when the container starts.
ENTRYPOINT ["java", "-jar", "/app.jar"]