# SaaS Platform - Full Stack Application

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)
![Spring Cloud](https://img.shields.io/badge/Spring%20Cloud-2023.0.1-green)
![Maven](https://img.shields.io/badge/Build-Maven-red)
![Docker](https://img.shields.io/badge/Container-Docker-blue)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black)
![TypeScript](https://img.shields.io/badge/TypeScript-blue)

---

## 📁 Project Structure

```bash
user-management/
├── backend/
└── frontend/
```

---

## 🚀 Backend - Microservices

### Overview

Implements a scalable microservice architecture using Spring Boot and Spring Cloud. Each service is containerized and communicates over a service registry and API gateway.

### Architecture Flow

```
Client (Browser)
   ↓
API Gateway (Port 8080)
   ↓
Discovery Server (Port 8761)
   ↓
Microservices (auth-service, etc.)
   ↓
Database (PostgreSQL)
```

### Tech Stack

* Java 17
* Spring Boot 3.2.5
* Spring Cloud 2023.0.1
* PostgreSQL
* Flyway
* Spring Security (JWT)
* Docker, Docker Compose

### Key Modules

* **discovery-server** - Eureka service registry.
* **api-gateway** - Entry point for all services.
* **auth-service** - Authentication & user management.
* **payment-service** - (WIP) Payment handling.

### Development Setup

```bash
git clone <repo-url>
cd user-management/backend
mvn clean package -DskipTests
docker-compose up --build
```

Access:

* API Gateway: `http://localhost:8080`
* Eureka Dashboard: `http://localhost:8761`

---

## 🎨 Frontend - Next.js App

### Overview

The frontend is a modular Next.js application built with TypeScript and Tailwind CSS. It is designed for flexibility, theming, and scalable user experiences.

### Tech Stack

* Next.js 14
* TypeScript
* Tailwind CSS
* ShadCN UI
* Framer Motion
* Zustand / Context API

### Directory Structure

```
frontend/
├── app/
│   ├── (auth)/
│   ├── (pages)/
│   ├── api/
│   ├── maintenance/
│   └── unauthorized/
├── components/
│   ├── layout/
│   └── shared/
├── config/
├── contexts/
├── features/
│   ├── authentication/
│   ├── landing-page/
│   ├── permission-management/
│   ├── role-management/
│   ├── theme-customization/
│   ├── user-management/
│   └── user-profile/
├── hooks/
├── lib/
├── providers/
├── styles/
└── types/
```

### Getting Started

```bash
cd user-management-platform/frontend
npm install
npm run dev
```

### Common Pages

* `/signin`, `/signup`, `/forgot-password`, `/reset-password/[token]`
* `/user/settings/profile`, `/security`, `/notifications`
* `/admin/users`, `/roles`, `/permissions`

### Key Features

* Auth flow (Sign In / Sign Up / Reset)
* Dynamic Theme Switching
* Modular Component Architecture
* Role & Permission Management

---

## 🐳 Docker Support

* Backend services are fully Dockerized.
* Frontend can be optionally containerized using a Next.js Dockerfile.

```bash
cd user-management/backend
mvn clean package -DskipTests
docker-compose up --build
```

---

## 🔐 Security

* Backend uses JWT for secure communication.
* Frontend stores auth tokens securely using HttpOnly cookies or local storage.

---

## 📖 Documentation

* Swagger: `http://localhost:8080/v1/api/auth/swagger-ui/index.html`
* Config Repo (Spring Cloud Config Server): Holds service-specific config YAMLs.

---

## 📌 To Do

* [ ] Payment Service Implementation
* [ ] Config Server Integration
* [ ] CI/CD Pipelines
* [ ] Unit & E2E Tests

---

## 👨‍💻 Author

**Alagappan P**

📧 [azhagu.swe@gmail.com](mailto:azhagu.swe@gmail.com)

---

## 📝 License

MIT License
