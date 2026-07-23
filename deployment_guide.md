# 🚀 MotoVra Production Deployment Guide

**Backend Hosting:** Render Web Service (Node.js / Express / Prisma)  
**Frontend Hosting:** Vercel Static Web App (React / Vite)  
**Database Hosting:** Neon Cloud PostgreSQL  
**AI & Email Providers:** Groq API (LLaMA 3.3 70B), Brevo API  

---

## 🛑 1. Production Security Checklist (What MUST NOT Go to Production)

> [!CAUTION]
> **CRITICAL SECURITY RULES BEFORE DEPLOYING:**

1. **NEVER Commit `.env` Files to Git**:
   - Verify `.env` is listed in your root `.gitignore`.
   - Never hardcode secret keys (`GROQ_API_KEY`, `BREVO_API_KEY`, `RAZORPAY_KEY_SECRET`, `JWT_SECRET`, `DATABASE_URL`) inside source code files.
   - All secret environment variables must ONLY be entered in the Render & Vercel dashboard settings.

2. **Strict Frontend Key Isolation**:
   - **DO NOT** expose secret keys (Groq, Gemini, Brevo, Razorpay Secret) in frontend Vite code (`VITE_*`).
   - The frontend ONLY requires `VITE_API_BASE_URL` and the public `VITE_RAZORPAY_KEY_ID`. All AI, Email, and DB operations execute securely on the backend.

3. **Exclude Scratch & Test Files**:
   - Remove scratch test files (`scratch/`, `test_gemini.ts`, `test_send_otp.ts`) before pushing code to GitHub.

4. **Production CORS Security**:
   - Update `backend/src/app.ts` CORS origin setting to allow requests ONLY from your production Vercel domain (e.g. `https://motovra.vercel.app`).

---

## ⚙️ 2. Step-by-Step Deployment Process

### 🅰️ STEP A: Deploy Backend on Render

1. Sign in to **[Render.com](https://render.com)**.
2. Click **New +** ➔ Select **Web Service**.
3. Connect your **GitHub repository** containing MotoVra.
4. Fill in the deployment details:
   - **Name:** `motovra-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Region:** Choose nearest (e.g., Singapore or Oregon)
   - **Branch:** `main` (or your active branch)
   - **Build Command:**
     ```bash
     npm install --include=dev && npx prisma generate && npm run build
     ```
   - **Start Command:**
     ```bash
     npx prisma db push && node dist/server.js
     ```

5. Add **Environment Variables** under Render Settings:

   | Variable Key | Value / Source |
   | :--- | :--- |
   | `PORT` | `3000` |
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | `postgresql://neondb_owner:npg_YuJUzBblE25q@ep-shy-tooth-awyblj14.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require` |
   | `JWT_SECRET` | `super-secret-production-jwt-key-motovra-2026` |
   | `JWT_REFRESH_SECRET` | `super-secret-production-refresh-jwt-key-2026` |
   | `GROQ_API_KEY` | `gsk_your_groq_api_key_here` |
   | `BREVO_API_KEY` | `xkeysib_your_brevo_api_key_here` |
   | `SENDER_EMAIL` | `jvora7990@gmail.com` |
   | `DEALERSHIP_EMAIL` | `king14011977@gmail.com` |
   | `FRONTEND_URL` | `https://motovra.vercel.app` |
   | `RAZORPAY_KEY_ID` | `rzp_test_TGZbjezWj1I57y` |
   | `RAZORPAY_KEY_SECRET` | `n5YPbMCx25L2oZOLiGLU5HPN` |

6. Click **Create Web Service**. Wait for Render to build and start.
7. Copy your live Render Backend URL (e.g. `https://motovra-backend.onrender.com`).

---

### 🅱️ STEP B: Configure SPA Rewrite for Vercel

Create a file `frontend/vercel.json` to enable React Router single-page app rewrites so routes like `/showroom`, `/vehicle/:id`, `/admin`, `/orders` load cleanly on browser refresh:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

### ℂ STEP C: Deploy Frontend on Vercel

1. Sign in to **[Vercel.com](https://vercel.com)**.
2. Click **Add New...** ➔ Select **Project**.
3. Import your **GitHub repository**.
4. Configure Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** Edit and set to `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add **Environment Variables** in Vercel:

   | Variable Key | Value |
   | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://motovra-backend.onrender.com/api` |
   | `VITE_RAZORPAY_KEY_ID` | `rzp_test_TGZbjezWj1I57y` |

6. Click **Deploy**. Vercel will build and assign your live domain (e.g. `https://motovra.vercel.app`).

---

### 💥 STEP D: Connect CORS in Backend

Update CORS origin in `backend/src/app.ts` to include your live Vercel domain:

```typescript
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://motovra.vercel.app', // Add your actual Vercel domain
    ],
    credentials: true,
  })
);
```

---

## 🧪 3. Post-Deployment Verification Checklist

Once both services are live:
1. Visit your Vercel URL (`https://motovra.vercel.app`).
2. Test **Registration & Login**: Verify OTP email receives in inbox.
3. Test **Showroom & Search**: Verify vehicle catalog loads from Neon PostgreSQL.
4. Test **AI Market Intelligence**: Open vehicle details page (`/vehicle/:id`) and verify Groq LLaMA 3.3 70B AI Market card loads.
5. Test **Admin Panel**: Sign in as Admin (`/admin`), edit a vehicle, and test manual **🧠 Regenerate AI** action button.
