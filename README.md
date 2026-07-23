# 🏎️ MotoVra - Luxury Vehicle Inventory & AI Market Intelligence Platform

> **An enterprise-grade luxury automotive marketplace, online reservation system, AI-powered valuation engine, and n8n intelligent email automation system built with Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, React 18, Vite, Groq LLaMA 3.3 70B, Brevo API, Razorpay, and n8n.**

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [System Architecture & Flowchart Diagrams](#-system-architecture--flowchart-diagrams)
  - [High-Level Data Flow](#1-high-level-system-data-flow)
  - [Authentication & 6-Digit OTP Flow](#2-authentication--6-digit-otp-verification-flow)
  - [Order System & Razorpay HMAC Signature Verification](#3-order-system--razorpay-hmac-signature-verification-flow)
  - [24/7 Concierge Support & n8n Email Routing](#4-247-concierge-support--n8n-email-routing-flow)
  - [AI Market Valuation Calculation Engine](#5-ai-market-valuation-calculation-engine-flow)
- [Complete Visual Application Walkthrough](#-complete-visual-application-walkthrough)
  - [1. Homepage & Showroom Catalog Experience](#1-homepage--showroom-catalog-experience)
  - [2. Dual-Option Authentication & Email Verification](#2-dual-option-authentication--email-verification)
  - [3. Vehicle Details & My Garage Wishlist](#3-vehicle-details--my-garage-wishlist)
  - [4. Checkout, Razorpay Payment & Order Receipts](#4-checkout-razorpay-payment--order-receipts)
  - [5. 24/7 Concierge Contact & Brevo Email Dispatch](#5-247-concierge-contact--brevo-email-dispatch)
  - [6. AI Market Intelligence & Pricing Insights](#6-ai-market-intelligence--pricing-insights)
  - [7. Admin Control Panel, Inventory CRUD & Executive Analytics](#7-admin-control-panel-inventory-crud--executive-analytics)
- [Key Features Matrix](#-key-features-matrix)
- [Technology Stack](#-technology-stack)
- [Project Folder Structure](#-project-folder-structure)
- [Installation & Setup Guide](#-installation--setup-guide)
- [Environment Variables Reference](#-environment-variables-reference)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [API Documentation Overview](#-api-documentation-overview)
- [Security & Validation](#-security--validation)
- [Deployment Guide](#-deployment-guide)
- [My AI Usage (MANDATORY)](#-my-ai-usage)

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

## 📐 System Architecture & Flowchart Diagrams

---

### 1. High-Level System Data Flow

```mermaid
graph TD
    User([Customer / Admin]) -->|HTTPS Requests| Frontend[React 18 + Vite Frontend]
    Frontend -->|REST API / Bearer Token| Backend[Express + TypeScript Backend]
    Backend -->|Prisma Client| DB[(Neon PostgreSQL Cloud)]
    Backend -->|LLM Prompts| AI[Groq API / LLaMA 3.3 70B]
    Backend -->|Transactional Emails| Brevo[Brevo Email API]
    Backend -->|Order Verification| Razorpay[Razorpay Payment API]
    CustomerEmail[Customer Support Email] -->|Gmail Webhook| n8n[n8n Automation Engine]
    n8n -->|AI Classification| n8nAI[n8n LLM Agent]
    n8nAI -->|Route & Auto Reply| SupportTeams[Sales / Support / Billing Inboxes]
```

---

### 2. Authentication & 6-Digit OTP Verification Flow

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

---

### 3. Order System & Razorpay HMAC Signature Verification Flow

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

### 4. 24/7 Concierge Support & n8n Email Routing Flow

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

### 5. AI Market Valuation Calculation Engine Flow

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

## 🖼️ Complete Visual Application Walkthrough

---

### 1. Homepage & Showroom Catalog Experience

> **Discover flagship hypercars and luxury sedans with instant substring search, price filtering, and custom supercar alloy wheel spinners.**

#### 1.1 Landing Hero Section
![MotoVra Hero Section](docs/images/homepage_hero.png)

#### 1.2 Featured Marques Collection
![Featured Marques](docs/images/homepage_featured.png)

#### 1.3 Luxury Concierge Banner & Footer
![Concierge & Footer](docs/images/homepage_footer.png)

#### 1.4 Custom Supercar Alloy Wheel Loading Spinner
![Showroom Alloy Wheel Spinner](docs/images/showroom_loading_spinner.png)

#### 1.5 Showroom Catalog Inventory Grid
![Showroom Inventory Grid](docs/images/showroom_catalog_grid.png)

#### 1.6 Showroom Live Price Range Filter (`< $250,000`)
![Showroom Price Filter](docs/images/showroom_price_filter.png)

---

### 2. Dual-Option Authentication & Email Verification

> **Frictionless signup featuring local bcrypt credential hashing with 6-digit Brevo OTP verification and one-click Google OAuth2 social login.**

#### 2.1 Manual Account Registration Form
![Register Form](docs/images/auth_register.png)

#### 2.2 Brevo 6-Digit Verification Code Email Delivery
![Brevo Email OTP Inbox](docs/images/auth_email_otp_inbox.png)

#### 2.3 6-Digit Verification Code Input Screen (`/verify-email`)
![Verify Email Form](docs/images/auth_verify_otp.png)

#### 2.4 Google OAuth2 Consent Screen
![Google OAuth Consent](docs/images/auth_google_oauth.png)

#### 2.5 User Sign In Form
![Sign In Form](docs/images/auth_login.png)

---

### 3. Vehicle Details & My Garage Wishlist

> **Explore high-resolution vehicle galleries, provenance guarantees, stock availability, and personal garage bookmarking.**

#### 3.1 Vehicle Detail Page (Porsche 911 GT3 RS)
![Vehicle Detail Page](docs/images/vehicle_detail_page.png)

#### 3.2 Wishlist Heart Bookmark Button
![Wishlist Bookmark Button](docs/images/wishlist_bookmark_button.png)

#### 3.3 My Garage / Saved Vehicles Page (`/profile`)
![My Garage Saved Vehicles](docs/images/wishlist_my_garage_page.png)

---

### 4. Checkout, Razorpay Payment & Order Receipts

> **Complete vehicle reservations with interactive location pinning, Razorpay SDK payment processing, and cryptographically verified HMAC-SHA256 signatures.**

#### 4.1 Step 1: Delivery Address Selection & OpenStreetMap Location Pinning
![Delivery Address Modal](docs/images/checkout_step1_address.png)

#### 4.2 Step 2: Booking Summary & Deposit Price Breakdown
![Booking Summary Modal](docs/images/checkout_step2_summary.png)

#### 4.3 Step 3: Razorpay Payment Gateway Simulator (Sandbox Mode)
![Razorpay Payment Simulator](docs/images/checkout_razorpay_modal.png)

#### 4.4 Step 4: Vehicle Reserved Successfully Confirmation Page (`/order-success`)
![Vehicle Reserved Successfully Page](docs/images/checkout_success_page.png)

#### 4.5 Step 5: Customer Official Payment Receipt Email (Brevo)
![Customer Payment Receipt Email](docs/images/checkout_customer_receipt_email.png)

#### 4.6 Step 6: Dealership Admin Order Alert Email (Brevo)
![Dealership Admin Order Alert Email](docs/images/checkout_admin_order_notification_email.png)

---

### 5. 24/7 Concierge Contact & Brevo Email Dispatch

> **24/7 Concierge form dispatching dual instant email notifications to customers and dealership administrators.**

#### 5.1 Customer Contact Inquiry Form (`/contact`)
![Contact Inquiry Form](docs/images/contact_inquiry_form.png)

#### 5.2 Customer Auto-Acknowledgement Email (Brevo)
![Customer Receipt Email](docs/images/contact_customer_acknowledgement_email.png)

#### 5.3 Dealership Admin Notification Email (Brevo)
![Admin Notification Email](docs/images/contact_admin_notification_email.png)

---

### 6. AI Market Intelligence & Pricing Insights

> **Real-time market valuation engine matching subject vehicles against a 100-record benchmark dataset, calculating price variance, and executing Groq LLaMA 3.3 70B AI narratives.**

#### 6.1 Admin Inventory Table Executing Live AI Evaluation
![AI Evaluation Loading State](docs/images/ai_evaluation_loading_state.png)

#### 6.2 Real-Time Updated AI Deal Rating Badges (`EXCELLENT DEAL`, `FAIR MARKET VALUE`)
![Updated AI Deal Badges](docs/images/ai_evaluation_updated_badge.png)

#### 6.3 Pricing Analytics & Valuation Insights Drawer with Top 5 Comparables
![AI Valuation Insights Drawer](docs/images/ai_market_intelligence_card.png)

---

### 7. Admin Control Panel, Inventory CRUD & Executive Analytics

> **Complete administrative control center with executive KPI analytics cards, real-time activity feeds, transaction ledgers, inventory CRUD modals, and restock prompts.**

#### 7.1 Executive Analytics KPI Summary Dashboard
![Executive Analytics KPI Dashboard](docs/images/admin_analytics_kpi_dashboard.png)

#### 7.2 Demand Velocity Ranking & Brand Mix Breakdown
![Demand Ranking and Brand Mix](docs/images/admin_analytics_brand_demand.png)

#### 7.3 Live Activity Feeds (Reservations, Payments, Inquiries)
![Activity Feeds and Inquiries](docs/images/admin_analytics_activity_feed.png)

#### 7.4 Customer Bookings & Verified Razorpay Transactions Ledger
![Customer Bookings Table](docs/images/admin_customer_bookings_table.png)

#### 7.5 Current Inventory Management Table
![Admin Inventory Table](docs/images/admin_inventory_table.png)

#### 7.6 Add New Vehicle Form Modal
![Add New Vehicle Form Modal](docs/images/admin_add_vehicle_modal.png)

#### 7.7 Edit Vehicle Specs Modal
![Edit Vehicle Specs Modal](docs/images/admin_edit_vehicle_modal.png)

#### 7.8 One-Click Stock Replenishment Prompt Dialog (`"Enter restock amount: 5"`)
![One-Click Restock Prompt](docs/images/admin_restock_prompt.png)

#### 7.9 Vehicle Deletion Confirmation Safeguard Dialog
![Delete Confirmation Dialog](docs/images/admin_delete_prompt.png)

> 📌 **Summary Note:** All administrative functionalities, analytics widgets, inventory CRUD controls, and transaction ledgers provided in the MotoVra platform are fully listed, detailed, and documented along with live screenshots above.

---

## ✨ Key Features Matrix

| Module | Features Included |
| :--- | :--- |
| **🔐 Authentication** | Local Bcrypt Hashing, 6-Digit Brevo Email OTP Verification, Google OAuth2 Social Sign-In, Dual JWT Tokens (15m Access / 7d HTTP-Only Refresh), Role-Based Access Control (`CUSTOMER` vs `ADMIN`). |
| **🏎️ Inventory & Catalog** | Paginated Showroom, Real-Time Substring Search, Supercar Alloy Wheel Loading State, Vehicle Details Gallery, Category Filters (`SPORTS`, `LUXURY`, `SUV`, `ELECTRIC`, `SEDAN`), Price Range Slider. |
| **❤️ Wishlist & Garage** | One-Click Heart Bookmarking, My Garage Profile Management (`/profile`), Saved Vehicles Persistence. |
| **💳 Payments & Orders** | Step-by-Step Checkout Modal, OpenStreetMap Location Pinning, GPS Location Auto-Detect, Razorpay Gateway SDK Integration, Interactive Payment Simulator, HMAC-SHA256 Signature Verification, Vehicle Reservation Success UI. |
| **📧 Email Infrastructure** | Brevo REST API v3 Integration, Dual Instant Transactional Email Dispatch (Customer Receipt + Admin Alert), 6-Digit OTP Verification Emails. |
| **⚡ Support Automation** | 24/7 Concierge Contact Form, n8n Intelligent AI Email Classification Agent, Google Sheet Department Mapping, Auto-Reply Generation, Department Forwarding. |
| **🧠 AI Valuation Engine** | 100-Record Regional Luxury Dataset (`marketVehicles.json`), KNN Nearest Neighbor Proximity Match, Price Variance %, Confidence Score (60-95%), Deal Badges (*🟢 EXCELLENT DEAL*, *🟡 FAIR MARKET VALUE*, *🟠 SLIGHTLY ABOVE BASELINE*, *🟣 PREMIUM PRICING*), Groq LLaMA 3.3 70B Completion (~0.045s execution), Zero-Crash Fallback System. |
| **👑 Admin Control Panel** | Executive KPI Summary Cards (Total Vehicles, Available Stock, Total Bookings, Revenue, Total Customers), Demand Velocity Ranking, Brand Mix Breakdown, Live Activity Feeds, Full Inventory CRUD Modals, One-Click Stock Restock, Deletion Safeguard Alert. |

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

## 📁 Project Folder Structure

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
├── docs/
│   └── images/                        # High-resolution application screenshots
├── test_report.md                     # Master 52-Feature & 77-Test Audit Report
├── deployment_guide.md                # Render & Vercel deployment documentation
└── README.md
```

---

## 💻 Installation & Setup Guide

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

## 🔑 Environment Variables Reference

### Backend Environment Variables (`backend/.env`)

| Variable | Description | Required | Example |
| :--- | :--- | :---: | :--- |
| `PORT` | HTTP server port | Yes | `3000` |
| `NODE_ENV` | Environment mode (`development` / `production`) | Yes | `production` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key for signing Access Tokens | Yes | `super-secret-jwt-key` |
| `JWT_REFRESH_SECRET` | Secret key for Refresh Token cookies | Yes | `super-secret-refresh-key` |
| `GROQ_API_KEY` | Groq LLaMA 3.3 70B API Key | Yes | `gsk_your_groq_api_key` |
| `BREVO_API_KEY` | Brevo REST API Key | Yes | `xkeysib_your_brevo_api_key` |
| `SENDER_EMAIL` | Verified Brevo sender email address | Yes | `jvora7990@gmail.com` |
| `DEALERSHIP_EMAIL` | Admin contact recipient email | Yes | `king14011977@gmail.com` |
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | Yes | `rzp_test_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | Yes | `secret_...` |

### Frontend Environment Variables (`frontend/.env`)

| Variable | Description | Required | Example |
| :--- | :--- | :---: | :--- |
| `VITE_API_BASE_URL` | Base URL for backend Express REST API | Yes | `https://motovra.onrender.com/api` |
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

I actively use AI as a productivity and learning assistant while ensuring I understand, verify, and test all generated outputs before integrating them into my projects.

- **ChatGPT & Antigravity AI** – Used for brainstorming solutions, prompt engineering, understanding complex concepts, generating boilerplate code, debugging, creating and refining test cases, and improving technical documentation.
- **Claude** – Used for project planning, designing scalable project structures, reviewing code organization, and suggesting clean and maintainable implementations.
- **Perplexity AI** – Used for technical research, comparing technologies, exploring best practices, and quickly finding relevant documentation and implementation approaches.
- **Groq API** – Integrated into AI-powered applications to build and experiment with LLM-based features, conversational workflows, and intelligent automation.
- **n8n AI Agent** – Used to create AI-driven automation workflows such as email classification, intelligent routing, notification systems, and business process automation.
