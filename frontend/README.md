# User Management Frontend

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![React](https://img.shields.io/badge/React-18-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-06B6D4)
![TypeScript](https://img.shields.io/badge/TypeScript-enabled-blue)

This is the **Next.js frontend** of the full-stack User Management Platform. It handles authentication, profile management, user/role/permission-based access, and admin dashboard functionalities.

---

## 🔧 Features

* 🔐 Authentication (Login, Signup, Forgot/Reset Password)
* 🛡️ Role & Permission-based access
* 👤 User Profile Management
* 🌙 Theme customization
* 🧩 Modular folder structure
* 🔁 API communication with Spring Boot backend
* 🎨 Tailwind CSS design system
* 🧠 Context and custom hooks support
* 📃 Legal Pages (Privacy Policy, Terms)

---

## 📁 Folder Structure Overview

```
app/
├── (auth)/                # Sign in, sign up, password flows
├── (pages)/               # User/admin dashboard, legal pages
├── api/                   # Next.js API routes (optional)
├── maintenance/           # Maintenance page
├── unauthorized/          # Unauthorized access screen

components/
├── layout/                # Layout components like SideDrawer
├── shared/                # Reusable UI components

features/
├── authentication/        # Auth flows
├── landing-page/          # Public landing page
├── permission-management/ # View/update permissions
├── role-management/       # Role CRUD and assignment
├── theme-customization/   # Theme switchers, etc.
├── user-management/       # Admin-side user controls
├── user-profile/          # Personal profile settings

Other Folders:
- config/          → App configuration files
- contexts/        → React Context Providers
- hooks/           → Custom React hooks
- lib/constants/   → Constants and static config
- providers/       → Global providers (Theme, Auth, etc.)
- styles/          → Global and Tailwind styles
- types/           → Shared TypeScript types
```

---

## 🚀 Getting Started

### 📦 Prerequisites

* Node.js (18+)
* npm or yarn
* Backend running (Spring Boot based gateway)

### 🛠️ Setup

```bash
cd frontend
npm install   # or yarn install
```

### ▶️ Run Dev Server

```bash
npm run dev   # or yarn dev
```

Access: [http://localhost:3000](http://localhost:3000)

### ⚙️ Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/v1/api
```

---

## 🏗️ Build for Production

```bash
npm run build
npm run start
```

---

## 🧪 Testing

You can use tools like:

* Jest
* React Testing Library
* Cypress (for E2E)

*Note: Not bundled by default.*

---

## 📄 License

MIT License

---

## 👨‍💻 Contributing

Pull requests are welcome. Make sure to:

* Run `eslint`
* Use `prettier` for formatting
* Follow folder/module conventions
