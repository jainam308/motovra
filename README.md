# 🏎️ MotoVra - Luxury Vehicle Inventory & AI Market Intelligence Platform

> **A state-of-the-art luxury automotive marketplace, online reservation system, and AI-powered valuation engine built with Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, React 18, Vite, Groq LLaMA 3.3 70B, Brevo API, and Razorpay.**

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Screenshots & UI Showcase](#-screenshots--ui-showcase)
- [Technology Stack](#-technology-stack)
- [Project Architecture](#-project-architecture)
- [Folder Structure](#-folder-structure)
- [Installation Guide](#-installation-guide)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [Running the Project](#-running-the-project)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [API Documentation Overview](#-api-documentation-overview)
- [Advanced Features Deep Dive](#-advanced-features-deep-dive)
  - [Authentication & Authorization](#1-authentication--authorization-system)
  - [Razorpay Payment Gateway](#2-razorpay-payment--checkout-integration)
  - [Brevo Email Notification System](#3-brevo-transactional-email-notification-system)
  - [Dashboard Analytics & BI](#4-dashboard-analytics--business-intelligence)
  - [AI Market Intelligence Module](#5-ai-market-intelligence-module)
- [Security & Validation](#-security--validation)
- [Deployment Guide](#-deployment-guide)
- [Future Improvements & n8n Roadmap](#-future-improvements--n8n-roadmap)
- [My AI Usage (MANDATORY)](#-my-ai-usage)
  - [AI Tools Used](#ai-tools-used)
  - [How I Used AI](#how-i-used-ai)
  - [Reflection](#reflection)
- [License](#-license)

---

## 🌐 Project Overview

**MotoVra** is an enterprise-grade luxury vehicle dealership web application engineered to solve critical challenges in modern automotive e-commerce. Traditional inventory platforms suffer from static listings, manual valuation estimations, lack of transaction receipts, slow search filtering, and unsecured authentication.

### What Problem It Solves
1. **Fair-Market Price Transparency:** Buyers often struggle to know if a luxury supercar or electric vehicle is priced fairly. MotoVra’s **AI Market Intelligence Engine** compares subject vehicles against a 100-record regional luxury benchmark dataset to calculate estimated market averages, price variance, confidence scores, and fair-deal badges.
2. **Instant Reservations & Secure Transactions:** Integrated with Razorpay SDK and an interactive payment simulator, customers can reserve or purchase luxury vehicles online with cryptographically verified HMAC signatures.
3. **Automated Customer Operations:** Eliminates manual email drafting by automatically dispatching 6-digit OTP codes, purchase confirmation receipts, and admin inquiry notifications via Brevo API.

### Target Audience
- **Luxury Automotive Buyers:** Discerning customers looking for verified supercar, SUV, sedan, and electric vehicle inventory with transparent pricing intelligence.
- **Dealership Administrators:** Operations managers requiring real-time inventory CRUD control, sales analytics, stock replenishment, and automated customer communication.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Local Credentials Auth:** Password hashing via `bcrypt` (10 rounds) and 6-digit email OTP verification.
- **Google OAuth2 Authentication:** Social sign-in via Passport.js Google Strategy.
- **Dual-Token JWT Security:** Short-lived access tokens (15 mins) and HTTP-only, secure, same-site refresh cookies (7 days).
- **Role-Based Access Control (RBAC):** Middleware guarding admin endpoints (`CUSTOMER` vs `ADMIN` roles).
- **Protected Navigation Guards:** Frontend `ProtectedRoute` guarding `/admin`, `/orders`, and `/profile`.

### 🏎️ Inventory & Catalog Management
- **Paginated Showroom:** Responsive vehicle grid with category chips (`SPORTS`, `SUV`, `SEDAN`, `LUXURY`, `ELECTRIC`).
- **Real-Time Substring Search:** Filter catalog dynamically by make and model.
- **Supercar Alloy Wheel Loading State:** Custom 5-spoke supercar alloy wheel CSS keyframe spinner (`WheelSpinner.tsx`).
- **Vehicle Details Page:** Specs, high-res image mapper, stock count, and market valuation drawer.
- **Saved Vehicles / My Garage:** Bookmark favorite inventory items to user profile.

### 💳 Payments & Booking Lifecycle
- **Checkout Modal:** Collects delivery address, phone, and payment method choice.
- **Stock Conflict Prevention:** Backend returns `409 Conflict` if vehicle stock is 0.
- **Razorpay Integration & Payment Simulator:** Cryptographic HMAC SHA256 signature verification and interactive test payment simulator.
- **Customer Orders Portal:** History tab showing transaction receipts, dates, and order status chips (`PENDING`, `DELIVERED`).
- **Admin Inventory CRUD & Restock:** Create, update, delete vehicles, and execute one-click stock replenishment.

### 🧠 AI Market Intelligence Module
- **100-Record Similarity Dataset:** Regional luxury benchmark dataset (`marketVehicles.json`).
- **Mathematical Bounds Calculation:** Min price, max price, market average, price variance %, confidence score (60-95%).
- **Deal Rating Badges:** *🟢 EXCELLENT_DEAL*, *🟡 FAIR_DEAL*, *🟠 SLIGHTLY_OVERPRICED*, *🟣 PREMIUM_PRICING*.
- **Groq LLaMA 3.3 70B Integration:** Ultra-fast LLM narrative generation (~0.045s execution).
- **Zero-Crash Fallback System:** Deterministic narrative generator ensuring 0% page crashes if LLM is offline.
- **PostgreSQL Persistence & Display:** Stores AI analysis directly in `Vehicle` schema for instant 0s customer pageview rendering.

---

## 🖼️ Screenshots & UI Showcase

*(Replace placeholders with actual application screenshots)*

| Screen | Preview Placeholder |
| :--- | :--- |
| **Home Page** | `![Home Page Page Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=MotoVra+Hero+Home+Page)` |
| **Showroom Catalog** | `![Showroom Catalog Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Showroom+Vehicle+Grid)` |
| **Vehicle Detail View** | `![Vehicle Detail Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Vehicle+Detail+Specs)` |
| **AI Market Intelligence Card** | `![AI Market Intelligence Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=AI+Valuation+Card+%26+Comparables)` |
| **Checkout & Razorpay Modal** | `![Razorpay Checkout Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Razorpay+Payment+Modal)` |
| **Customer Orders Portal** | `![Customer Orders Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=My+Orders+History)` |
| **Admin Panel & Inventory CRUD** | `![Admin Dashboard Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Admin+Control+Panel)` |
| **Analytics Dashboard** | `![Analytics Charts Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Sales+%26+Revenue+Analytics)` |

---

## 🛠️ Technology Stack

| Category | Technology / Library | Purpose & Implementation |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite, TypeScript | SPA framework with fast HMR bundling and strict type safety |
| **Styling & Icons** | Tailwind CSS, Lucide Icons, Framer Motion | Dark luxury theme, glassmorphic UI, animations, icons |
| **State & Fetching** | React Context, TanStack React Query, Axios | Global auth state, API caching, request interceptors |
| **Backend Runtime** | Node.js, Express.js, TypeScript | Modular RESTful API server with structured routing |
| **Database & ORM** | Neon PostgreSQL, Prisma ORM v5.22.0 | Cloud relational DB, type-safe queries, schema migrations |
| **AI & LLM Services** | Groq API (LLaMA 3.3 70B), Gemini 1.5 Flash | Fast AI market evaluation narratives and deal advice |
| **Email Infrastructure**| Brevo (Sendinblue) REST API v3 | OTP codes, booking confirmations, payment receipts |
| **Payments** | Razorpay SDK, Crypto (HMAC SHA256) | Order creation, payment verification, test simulator |
| **Authentication** | Passport.js, jsonwebtoken, bcrypt | JWT tokens, Google OAuth2, password hashing |
| **Testing** | Jest, Vitest, React Testing Library, Supertest | Unit, integration, component, and route testing |

---

## 📐 Project Architecture

### System Data Flow Diagram

```mermaid
graph TD
    User([Customer / Admin]) -->|HTTPS Requests| Frontend[React 18 + Vite Frontend]
    Frontend -->|REST API / Bearer Token| Backend[Express + TypeScript Backend]
    Backend -->|Prisma Client| DB[(Neon PostgreSQL Cloud)]
    Backend -->|LLM Prompts| AI[Groq API / LLaMA 3.3 70B]
    Backend -->|Transactional Emails| Brevo[Brevo Email API]
    Backend -->|Order Verification| Razorpay[Razorpay Payment API]
```

### Authentication Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant DB
    participant Brevo

    User->>Frontend: Submit Registration (email, password)
    Frontend->>Backend: POST /api/auth/register
    Backend->>DB: Hash password (bcrypt) & store User (isVerified=false)
    Backend->>Brevo: Send 6-digit OTP email
    Brevo-->>User: Delivers OTP Email
    User->>Frontend: Input OTP code
    Frontend->>Backend: POST /api/auth/verify-otp
    Backend->>DB: Verify OTP hash & update isVerified=true
    Backend-->>Frontend: Set Refresh Cookie & Return Access JWT
```

---

## 📁 Folder Structure

```
motovra/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma              # PostgreSQL schema models (User, Vehicle, Order, Payment, etc.)
│   ├── src/
│   │   ├── common/
│   │   │   ├── errors/                # Custom HTTP error classes (AppError, ConflictError, etc.)
│   │   │   ├── middlewares/           # requireAuth, requireRole Express middlewares
│   │   │   ├── services/              # email.service.ts (Brevo REST API)
│   │   │   └── utils/                 # jwt.ts, password.ts helper utilities
│   │   ├── config/                    # Environment key helpers
│   │   ├── data/                      # marketVehicles.json (100-record benchmark dataset)
│   │   ├── modules/
│   │   │   ├── aiMarketAnalysis/      # AI controller, service, routes, integration tests
│   │   │   ├── analytics/             # Sales analytics & revenue reports
│   │   │   ├── auth/                  # Auth controller, service, google.strategy, routes
│   │   │   ├── contact/               # Inquiry form handlers
│   │   │   ├── order/                 # Order management & stock decrement
│   │   │   ├── payment/               # Razorpay order creation & HMAC verification
│   │   │   └── vehicle/               # Inventory CRUD & saved vehicles
│   │   ├── services/                  # similarity.service.ts, gemini.service.ts
│   │   ├── utils/                     # promptBuilder.ts (AI prompt & sanitizer)
│   │   ├── app.ts                     # Express application setup & CORS
│   │   ├── server.ts                  # Server entry point
│   │   └── swagger.ts                 # Swagger OpenAPI setup
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── api/                       # axios.ts client configuration
│   │   ├── components/
│   │   │   ├── AI/                    # PriceBadge.tsx, AIInsights.tsx, AIMarketAnalysisCard.tsx
│   │   │   ├── layout/                # Navbar.tsx, Footer.tsx
│   │   │   ├── ui/                    # Button.tsx, Card.tsx, Input.tsx, Badge.tsx
│   │   │   └── ProtectedRoutes.tsx    # Route authorization guards
│   │   ├── context/                   # AuthContext.tsx
│   │   ├── pages/                     # Showroom, VehicleDetail, Admin, Orders, Profile, Login
│   │   ├── services/                  # Frontend API service wrappers
│   │   ├── main.tsx                   # App root entry
│   │   └── vite-env.d.ts              # Vite environment types
│   ├── package.json
│   ├── tsconfig.json
│   └── vercel.json                    # Single Page App rewrite rule
├── test_report.md                     # Master 52-Feature & 77-Test Audit Report
├── deployment_guide.md                # Render & Vercel deployment documentation
└── README.md
```

---

## 💻 Installation Guide

### Prerequisites
Ensure you have the following installed locally:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local database OR a free cloud instance on [Neon.tech](https://neon.tech)
- **Git**

---

### Backend Setup

1. Open terminal and navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `backend/.env`:
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="postgresql://user:password@localhost:5432/motovra?sslmode=require"
   JWT_SECRET="your-jwt-secret-key"
   JWT_REFRESH_SECRET="your-jwt-refresh-secret"
   GROQ_API_KEY="gsk_your_groq_api_key"
   BREVO_API_KEY="xkeysib_your_brevo_key"
   SENDER_EMAIL="jvora7990@gmail.com"
   DEALERSHIP_EMAIL="king14011977@gmail.com"
   RAZORPAY_KEY_ID="rzp_test_TGZbjezWj1I57y"
   RAZORPAY_KEY_SECRET="n5YPbMCx25L2oZOLiGLU5HPN"
   ```

4. Push Prisma schema to database and generate client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. Start backend development server:
   ```bash
   npm run dev
   ```
   Backend will start at `http://localhost:3000`.

---

### Frontend Setup

1. Open terminal and navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_RAZORPAY_KEY_ID=rzp_test_TGZbjezWj1I57y
   ```

4. Start frontend development server:
   ```bash
   npm run dev
   ```
   Frontend will start at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Backend Environment Variables (`backend/.env`)

| Variable | Description | Required | Example |
| :--- | :--- | :---: | :--- |
| `PORT` | HTTP server port | Yes | `3000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | Yes | `production` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key for signing Access Tokens | Yes | `super-secret-jwt-key` |
| `JWT_REFRESH_SECRET` | Secret key for Refresh Token cookies | Yes | `super-secret-refresh-key` |
| `GROQ_API_KEY` | Groq LLaMA 3.3 70B API Key | Yes | `gsk_...` |
| `BREVO_API_KEY` | Brevo REST API Key | Yes | `xkeysib-...` |
| `SENDER_EMAIL` | Verified Brevo sender email address | Yes | `jvora7990@gmail.com` |
| `DEALERSHIP_EMAIL` | Admin contact recipient email | Yes | `king14011977@gmail.com` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | Yes | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | Yes | `secret_...` |

### Frontend Environment Variables (`frontend/.env`)

| Variable | Description | Required | Example |
| :--- | :--- | :---: | :--- |
| `VITE_API_BASE_URL` | Base URL for backend Express REST API | Yes | `https://motovra-backend.onrender.com/api` |
| `VITE_RAZORPAY_KEY_ID` | Public Razorpay Key ID for client SDK | Yes | `rzp_test_TGZbjezWj1I57y` |

---

## 🧪 Testing & Quality Assurance

MotoVra includes an exhaustive automated test suite covering unit, integration, and component behavior.

### Run Backend Tests (Jest)
```bash
cd backend
npm run test
```

### Run Frontend Tests (Vitest)
```bash
cd frontend
npm run test
```

### 📊 Automated Test Summary
- **Total Test Suites:** `18 Files (9 Backend + 9 Frontend)`
- **Total Automated Test Cases Passed:** **`77 / 77 PASSED (100% PASS RATE)`**
- **Verified Features:** `52 System Features`

For complete feature-level test execution details, see [`test_report.md`](file:///e:/motovra/test_report.md).

---

## 📑 API Documentation Overview

The backend exposes an interactive **Swagger OpenAPI** playground at `http://localhost:3000/api-docs`.

### Key API Routes:
- **Auth:** `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/verify-otp`, `POST /api/auth/logout`
- **Vehicles:** `GET /api/vehicles`, `POST /api/vehicles`, `PUT /api/vehicles/:id`, `DELETE /api/vehicles/:id`
- **AI Valuation:** `POST /api/ai-market-analysis/:vehicleId`
- **Orders:** `POST /api/orders`, `GET /api/orders/my-orders`, `PATCH /api/orders/:id/status`
- **Payments:** `POST /api/payments/order`, `POST /api/payments/verify`
- **Analytics:** `GET /api/analytics`

---

## 🛡️ Security & Validation

- **Password Encryption:** Salted bcrypt hashing (10 rounds).
- **Session Security:** Dual JWT architecture with HTTP-only, secure, `sameSite: 'none'` (in production) refresh cookies.
- **Request Validation:** Input payloads sanitized via Joi schemas.
- **CORS Protection:** Configured in Express to restrict API access to verified frontend origins.
- **Payment Cryptography:** Razorpay transaction signatures verified via HMAC SHA256.

---

## 🚀 Deployment Guide

- **Backend:** Deployed as a Web Service on **[Render](https://render.com)**.
- **Frontend:** Deployed as a Single Page App on **[Vercel](https://vercel.com)**.

For complete, step-by-step production deployment instructions, refer to [`deployment_guide.md`](file:///e:/motovra/deployment_guide.md).

---

## 🔮 Future Improvements & n8n Roadmap

> [!IMPORTANT]
> **PROPOSED FUTURE ROADMAP ONLY:** The workflow described below represents a proposed architectural enhancement for automated customer inquiry routing using **n8n** and **LLM Agents**. It is **not currently active** in the production codebase.

### Proposed Intelligent Email Automation System (n8n)
1. **Gmail Trigger:** Automatically captures customer support or sales inquiry emails.
2. **AI Classification:** LLM classifies message intent into *Sales*, *Payment*, *Complaint*, or *General Inquiry*.
3. **Department Routing:** Automatically forwards ticket to specified Slack channels or CRM helpdesks.
4. **Auto-Acknowledgement:** Generates an immediate personalized AI email response.

---

## 🤖 My AI Usage

### AI Tools Used
During the development of MotoVra, the following AI tools were utilized:
- **Google Antigravity**: Primary AI pair-programming assistant for full-stack architecture, code refactoring, test suite creation, and documentation generation.
- **Groq API (LLaMA 3.3 70B)**: Live production AI service powering the AI Market Intelligence valuation narratives.
- **Google Gemini API**: Backup AI engine for market intelligence narratives.

### How I Used AI
- **Architecture & Database Design:** Assisting in schema design for Prisma models and dual-token JWT security flows.
- **AI Market Engine Development:** Building the deterministic similarity engine, prompt builder, markdown response sanitizer, and zero-crash fallback system.
- **Test Automation:** Writing 77 Jest and Vitest automated test cases covering backend REST APIs and React frontend components.
- **Documentation & UI Design:** Creating comprehensive Markdown test reports, deployment guides, and luxury Tailwind UI layouts.

> **Developer Control Note:** While AI served as an intelligent assistant for code generation, testing, and brainstorming, all architectural decisions, security controls, debugging, integration testing, and final code reviews remained strictly under manual developer control.

### Reflection
Working with AI tools significantly accelerated project setup, reduced boilerplate coding, and allowed for rapid test suite iteration. The primary learning takeaway was the critical importance of validating AI suggestions—particularly regarding cross-site cookie configurations, CORS policies, and resilient error handling for external LLM API calls.

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.
