# 🏎️ MotoVra - Luxury Vehicle Inventory & AI Market Intelligence Platform

> **A state-of-the-art luxury automotive marketplace, online reservation system, AI-powered valuation engine, and n8n intelligent email automation system built with Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, React 18, Vite, Groq LLaMA 3.3 70B, Brevo API, Razorpay, and n8n.**

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
- [Advanced Implemented Features Deep Dive](#-advanced-implemented-features-deep-dive)
  - [Authentication & Authorization](#1-authentication--authorization-system)
  - [Razorpay Payment Gateway](#2-razorpay-payment--checkout-integration)
  - [Brevo Email Notification System](#3-brevo-transactional-email-notification-system)
  - [n8n Intelligent Email Automation System](#4-n8n-intelligent-email-automation--helpdesk-routing-system)
  - [Dashboard Analytics & BI](#5-dashboard-analytics--business-intelligence)
  - [AI Market Intelligence Module](#6-ai-market-intelligence-module)
- [Security & Validation](#-security--validation)
- [Deployment Guide](#-deployment-guide)
- [My AI Usage (MANDATORY)](#-my-ai-usage)
  - [AI Tools Used](#ai-tools-used)
  - [How I Used AI](#how-i-used-ai)
  - [Reflection](#reflection)

---

## 🌐 Project Overview

**MotoVra** is an enterprise-grade luxury vehicle dealership web application engineered to solve critical challenges in modern automotive e-commerce. Traditional inventory platforms suffer from static listings, manual valuation estimations, lack of transaction receipts, slow search filtering, and unsecured authentication.

### What Problem It Solves
1. **Fair-Market Price Transparency:** Buyers often struggle to know if a luxury supercar or electric vehicle is priced fairly. MotoVra’s **AI Market Intelligence Engine** compares subject vehicles against a 100-record regional luxury benchmark dataset to calculate estimated market averages, price variance, confidence scores, and fair-deal badges.
2. **Instant Reservations & Secure Transactions:** Integrated with Razorpay SDK and an interactive payment simulator, customers can reserve or purchase luxury vehicles online with cryptographically verified HMAC signatures.
3. **Automated Customer Operations & n8n Email Routing:** Eliminates manual email drafting and sorting by integrating Brevo API and an **n8n Intelligent Email Automation Workflow** that classifies incoming emails via AI and routes them to appropriate department channels.

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

### ⚡ n8n Intelligent Email Automation
- **Gmail Webhook Trigger:** Listens for incoming customer emails in real time.
- **LLM Intent Classification:** Automatically classifies email intent (*Sales*, *Payment Support*, *Complaints*, *Business Inquiry*, *Feedback*).
- **Department Routing & Auto-Reply:** Forwards messages to department channels and generates instant AI acknowledgement responses.

### 🧠 AI Market Intelligence Module
- **100-Record Similarity Dataset:** Regional luxury benchmark dataset (`marketVehicles.json`).
- **Mathematical Bounds Calculation:** Min price, max price, market average, price variance %, confidence score (60-95%).
- **Deal Rating Badges:** *🟢 EXCELLENT_DEAL*, *🟡 FAIR_DEAL*, *🟠 SLIGHTLY_OVERPRICED*, *🟣 PREMIUM_PRICING*.
- **Live Groq LLM AI Generation:** Integrated Groq API running LLaMA 3.3 70B generating live narratives in ~0.045s. execution).
- **Zero-Crash Fallback System:** Deterministic narrative generator ensuring 0% page crashes if LLM is offline.
- **PostgreSQL Persistence & Display:** Stores AI analysis directly in `Vehicle` schema for instant 0s customer pageview rendering.

---

## 🖼️ Screenshots & UI Showcase

*(Replace placeholders with actual application & workflow screenshots)*

| Screen / Workflow | Preview Placeholder |
| :--- | :--- |
| **Home Page** | `![Home Page Page Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=MotoVra+Hero+Home+Page)` |
| **Showroom Catalog** | `![Showroom Catalog Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Showroom+Vehicle+Grid)` |
| **Vehicle Detail View** | `![Vehicle Detail Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Vehicle+Detail+Specs)` |
| **AI Market Intelligence Card** | `![AI Market Intelligence Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=AI+Valuation+Card+%26+Comparables)` |
| **Checkout & Razorpay Modal** | `![Razorpay Checkout Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Razorpay+Payment+Modal)` |
| **n8n Automation Workflow Canvas** | `![n8n Email Automation Canvas](https://via.placeholder.com/800x450/09090b/f59e0b?text=n8n+Intelligent+Email+Automation+Workflow+Canvas)` |
| **Customer Orders Portal** | `![Customer Orders Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=My+Orders+History)` |
| **Admin Panel & Inventory CRUD** | `![Admin Dashboard Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Admin+Control+Panel)` |

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
| **Email & Workflow Automation**| Brevo REST API v3, n8n Workflow Automation | Transactional OTP/receipt emails & AI email routing workflow |
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
    CustomerEmail[Customer Support Email] -->|Gmail Trigger| n8n[n8n Automation Engine]
    n8n -->|AI Classification| n8nAI[n8n LLM Agent]
    n8nAI -->|Route & Auto Reply| SupportTeams[Sales / Support / Admin Inboxes]
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
│   │   │   ├── errors/                # Custom HTTP error classes
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
│   │   └── server.ts                  # Server entry point
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
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local database OR cloud instance on [Neon.tech](https://neon.tech)
- **Git**

---

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in `backend/.env`:
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

---

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file in `frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_RAZORPAY_KEY_ID=rzp_test_TGZbjezWj1I57y
   ```

4. Start frontend development server:
   ```bash
   npm run dev
   ```

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
| `BREVO_API_KEY` | Brevo REST API Key | Yes | `xkeysib_your_brevo_api_key` |
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

---

## 🌟 Advanced Implemented Features Deep Dive

---

### 🔐 1. Authentication & Authorization System

#### 1.1 Why the Feature Was Implemented
Securing user identity, protecting customer personal data, enforcing role separation between buyers and platform administrators, and providing frictionless authentication options (local credentials & Google OAuth) are fundamental requirements for any luxury e-commerce platform.

#### 1.2 The Problem It Solves
Unsecured APIs allow unauthorized data tampering, account hijacking, and unauthorized access to administrative functions like modifying inventory stock or altering vehicle prices. MotoVra implements multi-layered authentication to guarantee that sensitive management routes remain strictly accessible to verified administrators while providing customers with a seamless, secure shopping experience.

#### 1.3 How It Works Internally
1. **Password Security:** Passwords submitted during registration are salted and hashed using `bcrypt` (10 rounds). Plaintext passwords are never stored in the database.
2. **Dual-Token System:** Upon authentication, the backend generates two JSON Web Tokens (JWTs):
   - **Access Token:** Short-lived (15 minutes), signed with `JWT_SECRET`, returned to the client for inclusion in `Authorization: Bearer <token>` HTTP headers.
   - **Refresh Token:** Long-lived (7 days), signed with `JWT_REFRESH_SECRET`, stored in an HTTP-only, secure, same-site-configured cookie to prevent XSS attacks.
3. **Role-Based Access Control (RBAC):** Express middleware (`requireAuth` and `requireRole('ADMIN')`) inspects incoming Bearer tokens. If a customer attempts to access `/api/vehicles` `POST/PUT/DELETE` or `/api/analytics`, the system immediately returns a `403 Forbidden` response.

---

### 💳 2. Razorpay Payment & Checkout Integration

#### 2.1 Why the Feature Was Implemented
To facilitate real-time vehicle reservations and direct purchases with secure, standardized payment gateway processing.

#### 2.2 The Problem It Solves
Manual bank transfers or unverified payment states lead to order processing delays, double-booking errors, and lack of transaction receipts. Razorpay integration provides instantaneous payment authorization, cryptographically verified payment signatures, and automated order state transitions.

#### 2.3 How It Works Internally
1. **Order Initialization:** When a user initiates a purchase inside `CheckoutModal.tsx`, the frontend requests `POST /api/payments/order` with `vehicleId`, `amount`, and `deliveryAddress`.
2. **Server Order Creation:** Backend validates vehicle stock (`quantity > 0`). If stock is depleted, it returns `409 Conflict`. Otherwise, it uses the Razorpay SDK to create a Razorpay Order ID (`order_...`) and records a `Payment` entity in PostgreSQL with status `PENDING`.
3. **Payment Execution & Signature Verification:** 
   - In production, the official Razorpay Checkout SDK handles card/UPI authorization.
   - For demo environments, an interactive **Razorpay Payment Simulator** (`RazorpaySandboxModal.tsx`) renders, simulating real payment authorization.
4. **HMAC SHA256 Verification:** Upon payment completion, Razorpay returns `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`. The backend computes:
   $$\text{Generated Signature} = \text{HMAC-SHA256}(\text{order\_id} + "|" + \text{payment\_id}, \text{RAZORPAY\_KEY\_SECRET})$$
   If signatures match, the payment status updates to `PAID`, order status updates to `PROCESSING`, and vehicle stock is decremented.

---

### 📧 3. Brevo Transactional Email Notification System

#### 3.1 Why the Feature Was Implemented
Providing real-time transactional communication (OTP codes, purchase receipts, inquiry acknowledgements) builds customer trust and automates dealership operations.

#### 3.2 Technical Architecture & Sender Integrity
- Integrated via **Brevo REST API v3** (`@getbrevo/brevo` HTTP client).
- **Verified Account Sender:** All emails are dispatched using verified account owner credentials (`jvora7990@gmail.com`), guaranteeing high deliverability and zero quarantine drops.

---

### ⚡ 4. n8n Intelligent Email Automation & Helpdesk Routing System

#### 4.1 Feature Overview & Canvas Screenshot

![n8n Email Automation Canvas](https://via.placeholder.com/1000x500/09090b/f59e0b?text=n8n+Intelligent+Email+Automation+Workflow+Canvas)

#### 4.2 Why the Feature Was Created
In luxury automotive retail, customer support emails contain vastly different intent—ranging from urgent test drive booking requests, payment queries, purchase complaints, and business partnership inquiries. Manually sorting, triaging, and responding to every incoming email causes delays and increases response times.

#### 4.3 Architecture & n8n Workflow Mechanics

```
                       Customer Incoming Email
                                 │
                                 ▼
                        Gmail Trigger (n8n)
                                 │
                                 ▼
                   AI Email Classification (LLM)
                                 │
                                 ▼
                          Determine Intent
                                 │
     ┌──────────────┬────────────┼────────────┬─────────────┐
     ▼              ▼            ▼            ▼             ▼
Sales Support  Payment Issue  Complaint  Business Inquiry  Feedback
     │              │            │            │             │
     └──────────────┴────────────┼────────────┴─────────────┘
                                 ▼
                 Forward to Appropriate Department
                                 │
                                 ▼
               Generate AI Auto-Acknowledgement Email
                                 │
                                 ▼
                     Log Ticket (Google Sheets / CRM)
                                 │
                                 ▼
                   Notify Team (Slack / Email)
```

#### 4.4 Step-by-Step Workflow Implementation
1. **Gmail Webhook Trigger (n8n):** Listens for new incoming emails to the dealership contact address in real time.
2. **AI Email Classification (LLM Node):** Passes email body text to an LLM node that analyzes customer sentiment and extracts key intent (*Sales*, *Payment Issue*, *Complaint*, *Business Inquiry*, *Feedback*).
3. **Automated Department Routing:** Routes the email automatically to the corresponding team inbox or Slack notification channel.
4. **Contextual AI Auto-Reply:** Generates a personalized, professional AI acknowledgement email confirming ticket receipt and providing expected resolution timelines.
5. **Logging & Escalation:** Logs the ticket into a Google Sheets / CRM ledger. High-priority complaints trigger instant SMS/Slack alerts to human managers for manual intervention.

---

### 📊 5. Dashboard Analytics & Business Intelligence

#### 5.1 Business Intelligence Overview
Aggregates complex PostgreSQL database queries into instantaneous visual analytics cards:
- **Total Revenue KPI Card:** Sum of all `PAID` transaction amounts.
- **Total Sales & Order Volume:** Counts orders categorized by status (`PENDING`, `DELIVERED`, `CANCELLED`).
- **Inventory Category Distribution:** Visual breakdown of stock across `SPORTS`, `SUV`, `SEDAN`, `LUXURY`, `ELECTRIC`.

---

### 🧠 6. AI Market Intelligence Module

#### 6.1 Business Objective & Valuation Engine
The AI Market Intelligence module compares subject vehicles against a 100-record luxury benchmark dataset (`marketVehicles.json`).
1. **Top 5 Comparable Matching:** Ranks top comparable listings by make, model, year, and price proximity.
2. **Price Bounds Calculation:** Computes lowest market price, highest market price, estimated market average, price variance %, and confidence score (60-95%).
3. **Deal Badge Assignment:** Assigns *🟢 EXCELLENT_DEAL*, *🟡 FAIR_DEAL*, *🟠 SLIGHTLY_OVERPRICED*, or *🟣 PREMIUM_PRICING*.
4. **Groq LLaMA 3.3 70B Integration:** Ultra-fast LLM narrative generation (~0.045s execution) providing executive summaries, key strengths, considerations, and buying advice.
5. **Zero-Crash Fallback Engine:** Guarantees 0% page crashes if LLM services are offline by serving deterministic statistical benchmark narratives.

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

## 🤖 My AI Usage

### AI Tools Used
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
