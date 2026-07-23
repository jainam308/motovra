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

### 🌟 Live Homepage Design Showcase

![MotoVra Hero Homepage Section](docs/images/homepage_hero.png)

![MotoVra Featured Marques Collection](docs/images/homepage_featured.png)

![MotoVra Luxury Concierge & Footer](docs/images/homepage_footer.png)

---

### 📊 Full Application Interface Previews

| Screen / Feature | Interface Preview |
| :--- | :--- |
| **Home Page Hero** | ![MotoVra Hero](docs/images/homepage_hero.png) |
| **Featured Marques Grid** | ![Featured Marques](docs/images/homepage_featured.png) |
| **Luxury Concierge & Footer** | ![Footer](docs/images/homepage_footer.png) |
| **Showroom Loading Spinner** | ![Showroom Alloy Wheel Spinner](docs/images/showroom_loading_spinner.png) |
| **Showroom Catalog Grid** | ![Showroom Catalog Grid](docs/images/showroom_catalog_grid.png) |
| **Showroom Price Filter** | ![Showroom Filtered Grid](docs/images/showroom_price_filter.png) |
| **Vehicle Detail Page** | ![Vehicle Detail View](docs/images/vehicle_detail_page.png) |
| **Wishlist Heart Bookmark Button** | ![Wishlist Bookmark Button](docs/images/wishlist_bookmark_button.png) |
| **My Garage / Saved Vehicles Page** | ![My Garage Saved Vehicles](docs/images/wishlist_my_garage_page.png) |
| **AI Market Intelligence Card** | `![AI Market Intelligence Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=AI+Valuation+Card+%26+Comparables)` |
| **Checkout & Razorpay Modal** | `![Razorpay Checkout Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=Razorpay+Payment+Modal)` |
| **n8n Automation Workflow Canvas** | `![n8n Email Automation Canvas](https://via.placeholder.com/800x450/09090b/f59e0b?text=n8n+Intelligent+Email+Automation+Workflow+Canvas)` |
| **Customer Orders Portal** | `![Customer Orders Placeholder](https://via.placeholder.com/800x450/09090b/f59e0b?text=My+Orders+History)` |
| **Admin Inventory Management Table** | ![Admin Inventory Table](docs/images/admin_inventory_table.png) |
| **Admin Add New Vehicle Modal** | ![Add New Vehicle Modal](docs/images/admin_add_vehicle_modal.png) |
| **Admin Edit Vehicle Modal** | ![Edit Vehicle Modal](docs/images/admin_edit_vehicle_modal.png) |
| **Admin One-Click Stock Restock** | ![One-Click Restock Prompt](docs/images/admin_restock_prompt.png) |
| **Admin Vehicle Deletion Alert** | ![Delete Confirmation Alert](docs/images/admin_delete_prompt.png) |

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

#### 1.1 Authentication Dual-Option Process Diagram

```mermaid
flowchart TD
    Start([User Authentication Request]) --> Choice{Select Authentication Method}

    %% Branch 1: Manual Credentials Flow
    Choice -->|Option 1: Manual Email & Password| ManualReg[Enter Email & Password]
    ManualReg --> HashPass[Hash Password with bcrypt 10 rounds]
    HashPass --> GenOTP[Generate 6-Digit Numeric OTP & Store Hash in DB]
    GenOTP --> SendBrevo[Dispatch Verification Email via Brevo REST API]
    SendBrevo --> OTPInbox[User Receives 6-Digit OTP Code in Email Inbox]
    OTPInbox --> EnterOTP[User Inputs 6-Digit Code on /verify-email]
    EnterOTP --> VerifyCheck{Backend Validates OTP Hash & 15-Min Expiry}
    VerifyCheck -->|Valid OTP| VerifyDB[Update User: isVerified = true]
    VerifyCheck -->|Invalid / Expired| ErrOTP[Return 400 Bad Request & Allow Resend OTP]
    ErrOTP --> EnterOTP
    VerifyDB --> IssueTokens[Issue Access JWT & HTTP-Only Refresh Cookie]

    %% Branch 2: Google OAuth Social Flow
    Choice -->|Option 2: Google OAuth| ClickGoogle[Click 'Continue with Google']
    ClickGoogle --> PassportAuth[Redirect to Google OAuth Consent Screen]
    PassportAuth --> GoogleConsent[User Selects Google Account]
    GoogleConsent --> OAuthCallback[Backend Passport Strategy Verifies Profile]
    OAuthCallback --> IssueTokens

    IssueTokens --> Success([Authenticated Session Active / Access Granted])
```

#### 1.2 Dual-Option Authentication & OTP Verification Showcase

| Step / Authentication Option | Interface Preview |
| :--- | :--- |
| **Option 1: Manual Account Signup** | ![Manual Signup Form](docs/images/auth_register.png) |
| **Brevo OTP Code Email Delivery** | ![Brevo Email OTP Inbox](docs/images/auth_email_otp_inbox.png) |
| **6-Digit OTP Verification Screen** | ![6-Digit OTP Input Form](docs/images/auth_verify_otp.png) |
| **Option 2: Google OAuth Consent Screen** | ![Google OAuth Consent](docs/images/auth_google_oauth.png) |
| **User Sign In Form** | ![Sign In Screen](docs/images/auth_login.png) |

---

#### 1.3 Why the Feature Was Implemented
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

#### 2.1 Complete Order System & HMAC Signature Verification Process Diagram

```mermaid
flowchart TD
    Start([User Selects Vehicle & Clicks 'Buy Now']) --> Step1Address{Step 1: Select Delivery Address}
    
    %% Address Options
    Step1Address -->|Option A: Live Location| GPSLoc[Detect GPS Latitude & Longitude]
    Step1Address -->|Option B: Interactive Map| PinMap[Pin Location on OpenStreetMap Leaflet Map]
    Step1Address -->|Option C: Manual Entry| ManualForm[Fill Address Form: Name, Phone, City, State]
    
    GPSLoc & PinMap & ManualForm --> Step2Summary[Step 2: Review Booking Summary & Deposit Breakdown]
    
    %% Order Initialization
    Step2Summary -->|Click 'Pay Deposit'| BackendCreate[Step 3: Backend Order API Request]
    BackendCreate -->|Check Stock > 0| CheckStock{Stock Available?}
    CheckStock -->|No Stock| Err409[Return 409 Conflict Error]
    CheckStock -->|Stock OK| CallRazorpay[Call Razorpay Order API with Secret Key]
    CallRazorpay --> GenOrderID[Razorpay Creates Order ID: order_TH1LKhuDQNPWjr]
    GenOrderID --> Step3Checkout[Step 4: Frontend Opens Razorpay Checkout Modal]
    
    %% Payment Methods
    Step3Checkout --> PayChoice{Customer Selects Payment Method}
    PayChoice -->|UPI / QR| PayUPI[Google Pay, PhonePe, Paytm]
    PayChoice -->|Cards| PayCard[Visa, MasterCard, Amex]
    PayChoice -->|NetBanking| PayBank[All Major Banks]
    PayChoice -->|Wallets| PayWallet[Paytm, Mobikwik]
    
    %% Signature Generation & Transmission
    PayUPI & PayCard & PayBank & PayWallet --> RazorpayGen[Step 5: Razorpay Processes & Generates Signatures]
    RazorpayGen --> ReturnSign[Return order_id, payment_id, razorpay_signature]
    ReturnSign --> SendBackend[Step 6: Frontend Transmits Signatures to POST /api/payments/verify]
    
    %% Backend Security Verification
    SendBackend --> BackendCompute[Step 7: Backend Computes Server-Side HMAC-SHA256 Hash]
    BackendCompute --> ComputeFormula["generated_signature = HMAC_SHA256(order_id + '|' + payment_id, RAZORPAY_KEY_SECRET)"]
    ComputeFormula --> CompareSign{Compare Signatures}
    
    CompareSign -->|Mismatched / Tampered| FailBlock[Reject Payment & Flag Fraud Warning]
    CompareSign -->|Signatures Match ✅| VerifySuccess[Payment Authenticated & Genuine]
    
    %% Database Update & Dual Email Dispatch
    VerifySuccess --> DBUpdate[Update Payment: PAID, Order: PROCESSING, Decrement Stock]
    DBUpdate --> SuccessUI[Render Vehicle Reserved Successfully Page]
    SuccessUI --> DualEmail{Dispatch Dual Transactional Emails}
    DualEmail --> MailCust[Email 1: Customer Inbox Payment Receipt]
    DualEmail --> MailAdmin[Email 2: Dealership Admin Inbox Order Alert]
    MailCust & MailAdmin --> CompleteOrder([Order Lifecycle Fully Executed])
```

---

#### 2.2 Complete 6-Stage Checkout & Order Fulfillment Showcase

| Stage / Order Step | Interface Preview |
| :--- | :--- |
| **1. Step 1: Delivery Address & Map Selection** | ![Delivery Address Modal](docs/images/checkout_step1_address.png) |
| **2. Step 2: Booking Summary & Deposit Breakdown** | ![Booking Summary Modal](docs/images/checkout_step2_summary.png) |
| **3. Step 3: Razorpay Payment Simulator Modal** | ![Razorpay Payment Modal](docs/images/checkout_razorpay_modal.png) |
| **4. Step 4: Vehicle Reserved Successfully Page** | ![Order Success Confirmation](docs/images/checkout_success_page.png) |
| **5. Step 5: Customer Payment Receipt Email (Brevo)** | ![Customer Receipt Email](docs/images/checkout_customer_receipt_email.png) |
| **6. Step 6: Dealership Admin Order Alert Email (Brevo)** | ![Admin Order Alert Email](docs/images/checkout_admin_order_notification_email.png) |

---

#### 2.3 Step-by-Step Security Protocol & HMAC Verification Mechanics

1. **Step 1: Vehicle Selection & Multi-Option Address Capture**
   The customer selects an available vehicle in the showroom catalog and clicks **Buy Now**. The checkout modal prompts the user to specify their delivery address via 3 options:
   - **Option A:** Auto-detect live GPS location coordinates (`Use My Current Location`).
   - **Option B:** Interactive map location pinning using OpenStreetMap & Leaflet.
   - **Option C:** Manual form entry (Full Name, Phone Number, Address, City, State).

2. **Step 2: Backend Order Creation via Razorpay API**
   The frontend sends `POST /api/payments/order`. The backend verifies that `stock > 0` in PostgreSQL (returning `409 Conflict` if sold out). The backend calls Razorpay's Order API using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to generate a unique order reference:
   $$\text{Razorpay Order ID} = \text{order\_TH1LKhuDQNPWjr}$$

3. **Step 3: Secure Payment Authorization**
   The frontend renders the official Razorpay Checkout SDK (or interactive test payment simulator in demo mode). The customer chooses their preferred payment method:
   - **UPI / QR Code** (Google Pay, PhonePe, Paytm)
   - **Credit / Debit Card** (Visa, MasterCard, Amex)
   - **NetBanking** (All major retail banks)
   - **Wallets** (Mobikwik, Paytm Wallet)

4. **Step 4: Cryptographic Payment Signature Generation**
   Upon payment authorization, Razorpay generates 3 parameters:
   - `order_id`: `order_TH1LKhuDQNPWjr`
   - `payment_id`: `pay_1784826452590_1239`
   - `razorpay_signature`: `8d5bce79ab4d...`

5. **Step 5: Client Transmission to Backend Verification Endpoint**
   The frontend posts `{ order_id, payment_id, razorpay_signature }` to `POST /api/payments/verify`.
   > ⚠️ **Zero-Trust Client Principle:** Frontend payload data is treated as unauthenticated and potentially untrusted. Verification occurs strictly on the Express backend server.

6. **Step 6: Server-Side HMAC-SHA256 Signature Recalculation**
   The backend combines the received `order_id` and `payment_id` with its confidential, server-side `RAZORPAY_KEY_SECRET` to recompute the cryptographic hash:
   $$\text{generated\_signature} = \text{HMAC-SHA256}(\text{order\_id} + "|" + \text{payment\_id}, \text{RAZORPAY\_KEY\_SECRET})$$

7. **Step 7: Signature Comparison, Database Settlement & Dual Email Dispatch**
   The backend compares `received_signature` against `generated_signature`:
   - **Match ✅:** Confirms genuine payment authorization.
   - **Database Updates:** Updates Payment status to `PAID`, Order status to `PROCESSING`, and decrements vehicle inventory count in Neon PostgreSQL.
   - **Success UI:** Renders the **Vehicle Reserved Successfully** page (`/order-success`).
   - **Dual Email Dispatch via Brevo API:**
     - **Email 1 (Customer Payment Receipt):** Dispatches official deposit receipt ($25,000 deposit paid, remaining balance due).
     - **Email 2 (Dealership Admin Order Alert):** Dispatches instant order notification with customer contact information and scheduled delivery address.

---

### 📧 3. Brevo Transactional Email Notification System

#### 3.1 Why the Feature Was Implemented
Providing real-time transactional communication (OTP codes, purchase receipts, inquiry acknowledgements) builds customer trust and automates dealership operations.

#### 3.2 Technical Architecture & Sender Integrity
- Integrated via **Brevo REST API v3** (`@getbrevo/brevo` HTTP client).
- **Verified Account Sender:** All emails are dispatched using verified account owner credentials (`jvora7990@gmail.com`), guaranteeing high deliverability and zero quarantine drops.

---

### ⚡ 4. 24/7 Intelligent Support Team & n8n Email Automation System

#### 4.1 24/7 Concierge Support & n8n Workflow Architecture Diagram

```mermaid
flowchart TD
    Customer([Customer / Website Visitor]) -->|1. Submits Inquiry Form| WebForm[MotoVra Frontend Concierge Form]
    WebForm -->|POST /api/contact| Backend[Express REST API Backend]
    
    %% Dual Immediate Brevo Email Dispatch
    Backend -->|2. Dispatches via Brevo REST API| DualMail{Dual Email Dispatch}
    DualMail -->|Mail 1: Instant Receipt| CustAck[Customer Inbox: Auto-Acknowledgement Email]
    DualMail -->|Mail 2: Admin Alert| AdminMail[Admin Inbox: New Inquiry Alert]
    
    %% n8n Intelligent Agent Processing
    Backend -->|3. Passes Mail / Webhook Payload| n8nAgent[n8n Intelligent AI Agent]
    n8nAgent --> VerifyUser{Identify Customer Account}
    VerifyUser -->|Customer Identified| ClassifyLLM[n8n AI LLM Classification Node]
    VerifyUser -->|Guest Visitor| LogGuest[Flag Guest Ticket] --> ClassifyLLM
    
    %% Intent Classification
    ClassifyLLM --> SwitchIntent{Classify Inquiry Category}
    SwitchIntent -->|Website Issue| TechDept[Tech Support Team]
    SwitchIntent -->|General Inquiry| SalesDept[Sales & Car Acquisition Team]
    SwitchIntent -->|Feedback| ReviewDept[Customer Experience Team]
    SwitchIntent -->|Order Query| BillingDept[Billing & Orders Team]
    
    %% Department Lookup & Google Sheet Logging
    TechDept & SalesDept & ReviewDept & BillingDept --> SheetLookup[4. Look up Department Email in Google Sheet]
    SheetLookup --> RouteDept[5. Forward Ticket to Department Inbox]
    RouteDept --> SheetLog[6. Append Ticket Entry in Google Sheet Audit Log]
    SheetLog --> Complete([24/7 Support Workflow Execution Completed])
```

---

#### 4.2 Live Contact Inquiry & Email Verification Showcase

| Stage / Email Notification | Interface Preview |
| :--- | :--- |
| **1. Customer Contact Inquiry Form (`/contact`)** | ![Contact Inquiry Form](docs/images/contact_inquiry_form.png) |
| **2. Customer Auto-Acknowledgement Email (Brevo)** | ![Customer Receipt Email](docs/images/contact_customer_acknowledgement_email.png) |
| **3. Dealership Admin Notification Email (Brevo)** | ![Admin Notification Email](docs/images/contact_admin_notification_email.png) |

---

#### 4.3 Why the Feature Was Created
In luxury automotive retail, customer support emails contain vastly different intent—ranging from urgent vehicle acquisition requests, website issues, order payment queries, customer feedback, and selling inquiries. Manually triaging every email causes response delays. This automated 24/7 concierge system guarantees instant dual notifications and intelligent department routing.

#### 4.4 Step-by-Step Workflow Implementation
1. **User Inquiry Submission:** Customer submits full name, email address, subject, and message on the `/contact` concierge page.
2. **Dual Instant Email Dispatch:** The Express backend immediately dispatches:
   - An auto-acknowledgement email to the customer guaranteeing a 24-hour response.
   - An admin notification email to `DEALERSHIP_EMAIL` with complete inquiry details.
3. **n8n Webhook Trigger & Customer Identification:** Captures incoming email payloads and verifies customer status.
4. **AI LLM Intent Classification:** Classifies inquiry into *Website Issue*, *General Inquiry / Car Sales*, *Customer Feedback*, or *Order Query*.
5. **Google Sheet Department Lookup:** Queries the Google Sheet database to retrieve the target department email address.
6. **Department Forwarding & Audit Logging:** Forwards the ticket to the assigned department and logs the complete audit entry into the Google Sheet ledger.
3. **Automated Department Routing:** Routes the email automatically to the corresponding team inbox or Slack notification channel.
4. **Contextual AI Auto-Reply:** Generates a personalized, professional AI acknowledgement email confirming ticket receipt and providing expected resolution timelines.
5. **Logging & Escalation:** Logs the ticket into a Google Sheets / CRM ledger. High-priority complaints trigger instant SMS/Slack alerts to human managers for manual intervention.

---

### 👑 5. Admin Control Panel & Executive Intelligence Suite

#### 5.1 Executive Analytics & Financial Intelligence Showcase

| Analytics View / Admin Module | Interface Preview |
| :--- | :--- |
| **1. Executive Analytics KPI Header** | ![Executive Analytics KPI Dashboard](docs/images/admin_analytics_kpi_dashboard.png) |
| **2. Demand Ranking & Brand Mix Mix** | ![Demand Ranking and Brand Mix](docs/images/admin_analytics_brand_demand.png) |
| **3. Live Activity Feeds & Inquiries** | ![Activity Feeds and Inquiries](docs/images/admin_analytics_activity_feed.png) |
| **4. Customer Bookings & Razorpay Ledger** | ![Customer Bookings Table](docs/images/admin_customer_bookings_table.png) |

---

#### 5.2 Complete Inventory CRUD Control Showcase

| CRUD Action / Modal | Interface Preview |
| :--- | :--- |
| **1. Current Inventory Table & Status Pills** | ![Admin Inventory Management Table](docs/images/admin_inventory_table.png) |
| **2. Add New Vehicle Modal** | ![Add New Vehicle Form Modal](docs/images/admin_add_vehicle_modal.png) |
| **3. Edit Vehicle Modal** | ![Edit Vehicle Specs Modal](docs/images/admin_edit_vehicle_modal.png) |
| **4. One-Click Stock Replenishment** | ![One-Click Stock Restock Prompt](docs/images/admin_restock_prompt.png) |
| **5. Vehicle Deletion Safeguard Alert** | ![Delete Confirmation Dialog](docs/images/admin_delete_prompt.png) |

---

#### 5.3 Detailed Administrative Capabilities

1. **Executive KPI Analytics Cards:** Real-time calculation of key performance indicators:
   - **Total Vehicles:** `21 Vehicles`
   - **Available Stock:** `20 Vehicles Available`
   - **Total Bookings:** `11 Completed Reservations`
   - **Total Revenue:** `$250,000 Total Deposit Revenue`
   - **Total Registered Customers:** `29 Customers`

2. **Demand Ranking & Brand Distribution:** 
   - Ranks vehicles dynamically by customer demand velocity (e.g., *Porsche 911 GT3 RS* ranked #1 with 7 reservations flagged as **High Demand**).
   - Visual bar chart displaying inventory distribution across luxury marques (Honda, McLaren, Porsche, Bentley, Lucid, Audi, Rolls-Royce, Tesla, Lexus, Range Rover, Lamborghini, Mercedes-Benz, Rivian, Aston Martin).

3. **Real-Time Activity Feeds:**
   - **Latest Reservations:** Real-time feed showing customer booking reference numbers (`MV-53733832`).
   - **Recent Payments:** Live ledger tracking Razorpay deposit authorizations ($25,000 status `BOOKING_PAID`).
   - **Customer Inquiries:** Stream of incoming contact form inquiries forwarded from the website concierge.

4. **Customer Bookings & Razorpay Transactions Ledger:**
   - Detailed ledger table displaying Booking Reference (`MV-BOOK-1001`), Vehicle Name, Total/Remaining Due, Verified Razorpay Deposit (`$25,000 Paid pay_verified_razorpay`), and Booking Status (`BOOKING_PAID`).

5. **Full Inventory CRUD & Stock Replenishment:**
   - **Add Vehicle:** Create new inventory entries with make, model, category, price, quantity, and Unsplash image URL.
   - **Edit Vehicle:** Modify existing vehicle attributes, prices, and stock levels.
   - **One-Click Restock:** Prompt dialog allowing admins to add stock units directly to any vehicle (`Enter restock amount: 5`).
   - **Delete Vehicle:** Protected deletion modal preventing accidental inventory removal.

> 📌 **Summary Note:** All administrative functionalities, analytics widgets, inventory CRUD controls, and transaction ledgers provided in the MotoVra platform are fully listed, detailed, and documented along with live screenshots above.

---

### 🧠 6. AI Market Intelligence & Pricing Analytics Module

#### 6.1 AI Valuation Calculation Architecture Diagram

```mermaid
flowchart TD
    Start([Vehicle Evaluation Triggered]) --> Step1Data[Step 1: Input Subject Vehicle Specs: Make, Model, Year, Price]
    Step1Data --> Step2Dataset[Step 2: Query 100-Record Benchmark Luxury Dataset marketVehicles.json]
    
    %% Similarity & Matching Engine
    Step2Dataset --> Step3Match[Step 3: Run KNN Proximity Algorithm in similarity.service.ts]
    Step3Match --> Step4Comps[Select Top 5 Nearest Comparable Market Listings C1, C2, C3, C4, C5]
    
    %% Statistical Calculations
    Step4Comps --> Step5Math[Step 4: Compute Statistical Bounds & Variance Metrics]
    Step5Math --> FormulaAvg["Market Average P_avg = (Sum of Comp Prices) / 5"]
    FormulaAvg --> FormulaVar["Price Variance = Listed Price - P_avg"]
    FormulaVar --> FormulaVarPct["Variance % = ((Listed Price - P_avg) / P_avg) * 100"]
    FormulaVarPct --> FormulaConf["Confidence Score = Calculated (60% - 95% High Precision)"]
    
    %% Deterministic Badge Assignment
    FormulaConf --> Step6Badge{Step 5: Assign Deal Rating Badge}
    Step6Badge -->|Variance % <= -5%| Badge1[🟢 EXCELLENT DEAL]
    Step6Badge -->|-5% < Variance % <= +5%| Badge2[🟡 FAIR MARKET VALUE]
    Step6Badge -->|+5% < Variance % <= +12%| Badge3[🟠 SLIGHTLY ABOVE BASELINE]
    Step6Badge -->|Variance % > +12%| Badge4[🟣 PREMIUM PRICING]
    
    %% Groq LLaMA LLM Generation
    Badge1 & Badge2 & Badge3 & Badge4 --> Step7Prompt[Step 6: Construct Structured JSON Prompt in promptBuilder.ts]
    Step7Prompt --> CallGroq[Step 7: Execute Groq API LLaMA 3.3 70B Completion]
    
    CallGroq --> CheckLLM{Groq API Online?}
    CheckLLM -->|Yes (~0.045s)| ParseJSON[Parse & Sanitize AI JSON Narrative Response]
    CheckLLM -->|No / Timeout| FallbackEngine[Step 8: Execute Deterministic Zero-Crash Fallback Engine]
    
    ParseJSON & FallbackEngine --> SaveDB[Step 9: Persist Valuation Data directly into PostgreSQL Vehicle Schema]
    SaveDB --> RenderUI[Step 10: Render Live Pricing Analytics & Valuation Insights Drawer on Frontend]
    RenderUI --> Complete([AI Market Evaluation Complete])
```

---

#### 6.2 Live AI Market Evaluation & Valuation Insights Showcase

| Evaluation Stage / Component | Interface Preview |
| :--- | :--- |
| **1. Live Inventory Table AI Evaluation** | ![AI Evaluation Loading State](docs/images/ai_evaluation_loading_state.png) |
| **2. Real-Time Updated AI Deal Badges** | ![Updated AI Deal Rating Badges](docs/images/ai_evaluation_updated_badge.png) |
| **3. Pricing Analytics & Top 5 Comparables** | ![AI Valuation Insights Drawer](docs/images/ai_market_intelligence_card.png) |

---

#### 6.3 Mathematical Valuation Formulas & Algorithm Mechanics

1. **Top 5 Comparable Nearest Neighbor Matching:**
   The `similarity.service.ts` module filters 100 regional luxury dealership benchmark records, selecting the 5 closest listings ($C_1 \dots C_5$) matching vehicle make, model, year proximity, and price range.

2. **Market Average ($P_{avg}$):**
   $$P_{avg} = \frac{\sum_{i=1}^{5} P_{\text{comp}_i}}{5}$$
   *Example (Porsche 911 GT3 RS):* Top 5 market listings ($226k, $228k, $232k, $215k, $245k) yield $P_{avg} = \$229,200$.

3. **Price Variance Dollars ($V_{USD}$) & Percentage ($V_{\%}$):**
   $$V_{USD} = P_{\text{listed}} - P_{avg} = \$223,800 - \$229,200 = -\$5,400$$
   $$V_{\%} = \left( \frac{P_{\text{listed}} - P_{avg}}{P_{avg}} \right) \times 100 = \left( \frac{-\$5,400}{\$229,200} \right) \times 100 = -2.356\% \approx -2.4\%$$

4. **Confidence Score Calculation ($C_{score}$):**
   Evaluates dataset density and price distribution variance. High dataset density yields **95% High Precision**.

5. **Groq LLaMA 3.3 70B AI Narrative Generation:**
   The server invokes the Groq API running `llama-3.3-70b-versatile` (~0.045s execution), receiving structured JSON containing:
   - **Executive AI Assessment:** Market context and price positioning summary.
   - **Key Vehicle Strengths:** 3 bullet points highlighting value drivers.
   - **Buyer Considerations:** Service requirements and ownership factors.
   - **Actionable Buyer Advice:** Custom financing or concierge negotiation guidance.
   - **Top 5 Comparable Market Listings:** Detailed table showing source name, model year, mileage, market price, and price variance vs target vehicle.

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
