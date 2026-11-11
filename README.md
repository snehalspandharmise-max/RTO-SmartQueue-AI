# RTO SmartQueue AI — Intelligent Queue Optimization System

[![Academic Project](https://img.shields.io/badge/Academic-Third--Year%20Computer%20Engineering-blue)](https://github.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Backend Tests](https://img.shields.io/badge/Backend%20Tests-15%2F15%20Passed-brightgreen)](docs/testing-report.md)
[![Frontend Tests](https://img.shields.io/badge/Frontend%20Tests-4%2F4%20Passed-brightgreen)](docs/testing-report.md)

> [!IMPORTANT]
> **Academic Demonstration Disclaimer**:
> **RTO SmartQueue AI** is an academic capstone/demonstration project developed for a third-year Computer Engineering curriculum. It is **not** an official government portal, does not claim government affiliation, and does not access official Parivahan/RTO production databases. All RTO locations, staff profiles, and processing duration standards are synthetic demonstration data.

---

## 1. Project Overview & Motivation

Existing appointment booking and token systems at Regional Transport Offices (RTOs) allow citizens to select a visit slot, but booking a time window does not inform the citizen:
- How long their physical visit will actually take.
- Whether specific service counters are experiencing severe delays.
- Which appointment slots on a given day offer lower congestion.
- How counter workload can be dynamically balanced to relieve bottlenecks.

**RTO SmartQueue AI** addresses these problems through:
1. **Explainable Wait-Time Prediction**: Transparent mathematical queue modeling ($M/M/c$) that estimates waiting times from active certified counters, residual times, and historical sample distributions.
2. **Smart Slot Recommendations**: Ranks slots into **Lowest Wait**, **Balanced**, and **Most Convenient** options before booking.
3. **Real-time Live Queue Tracker**: Gives citizens a verified digital token, live count of people ahead, and transparent delay factors.
4. **Adaptive Counter Workload Optimizer**: Detects queue congestion ($Q > 3$ or wait $> 30\text{ min}$) and recommends authorized counter reassignment for administrative approval.
5. **Prediction Accuracy Telemetry**: Computes Mean Absolute Error (MAE) and MAPE against observed completed visits.

---

## 2. Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Lucide React (icons), Recharts (operational charts), responsive CSS3 with custom variables.
- **Backend**: Node.js (v20+), Express.js REST API, JSON Web Tokens (JWT), input validation, rate limiting, and CORS.
- **Database & Auth**:
  - **Connected Mode**: Supabase PostgreSQL with Row Level Security (RLS) policies and Supabase Auth.
  - **Academic Viva Offline Mode**: Built-in High-Fidelity In-Memory Relational Engine that adheres strictly to the exact 13 PostgreSQL tables, constraints, and atomic slot capacity checks so the project can be demonstrated seamlessly without live internet dependencies!
- **Testing**: Vitest, Supertest, and React Testing Library with jsdom.

---

## 3. Monorepo Project Structure

```text
RTO-SmartQueue-AI/
├── bin/                          # Portable developer wrappers (node, npm, git)
│   ├── dev-runner.js             # Dual-service concurrent runner
│   ├── node.cmd                  # Node.js binary wrapper
│   ├── npm.cmd                   # npm CLI wrapper
│   └── git.cmd                   # Git portable wrapper
├── docs/                         # Comprehensive engineering documentation
│   ├── architecture.md           # System architecture & data flow diagrams
│   ├── database-schema.md        # Relational schema specification & RLS policies
│   ├── prediction-methodology.md # Mathematical formulas & confidence intervals
│   └── testing-report.md         # Test execution log verifying all 20 criteria
├── backend/                      # Express.js REST API
│   ├── src/
│   │   ├── config/               # Database adapter & configuration
│   │   ├── controllers/          # HTTP request handlers (Auth, Appt, Queue, Admin)
│   │   ├── middleware/           # Auth, RBAC, Rate-Limiting, Error Handling
│   │   ├── routes/               # API route definitions (/api/*)
│   │   ├── services/             # Core business logic:
│   │   │   ├── predictionService.js       # Mathematical queue engine
│   │   │   ├── recommendationService.js   # Multi-objective slot ranker
│   │   │   ├── workloadService.js         # Adaptive counter optimizer
│   │   │   ├── analyticsService.js        # MAE / MAPE telemetry & charts
│   │   │   ├── appointmentService.js      # Concurrency & capacity logic
│   │   │   └── queueService.js            # Queue state machine transitions
│   │   ├── scripts/              # Seed & admin bootstrap utilities
│   │   ├── app.js                # Express app setup
│   │   └── server.js             # HTTP server entrypoint
│   ├── tests/                    # Supertest & Vitest integration test suite
│   ├── package.json
│   └── .env.example
├── frontend/                     # React 18 Single-Page Application
│   ├── src/
│   │   ├── components/           # Navbar, Footer, NotificationsDropdown
│   │   ├── layouts/              # CitizenLayout, AdminLayout
│   │   ├── pages/                # LandingPage, Login, Register, Dashboard, Details
│   │   │   └── admin/            # AdminDashboard, Appointments, Counters, Insights
│   │   ├── features/
│   │   │   ├── auth/             # AuthContext, RoleGuard
│   │   │   └── appointments/     # 8-Step Interactive Booking Wizard
│   │   ├── hooks/                # useNotifications, useAuth
│   │   ├── services/             # Centralized API fetch client
│   │   └── styles/               # CSS variables, animations, responsive design
│   ├── tests/                    # React Testing Library unit tests
│   ├── package.json
│   └── .env.example
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql  # 13 relational tables & constraints
│   │   └── 002_rls_policies.sql    # Row Level Security & RBAC rules
│   └── seed.sql                  # Comprehensive synthetic demonstration records
├── README.md
└── package.json
```

---

## 4. Quick Start & Installation

### 4.1 Prerequisites
- Node.js v18+ (Node v20.18.0 LTS configured in `bin/`)
- npm v10+

### 4.2 Installation
From the root directory, install dependencies for both the frontend and backend:

```bash
# Install backend dependencies
npm --prefix backend install

# Install frontend dependencies
npm --prefix frontend install
```

### 4.3 Running the Application

You can launch both the backend API and frontend client with a single command:

```bash
# Starts Backend (port 5000) and Frontend (port 3000)
npm run dev
```

Alternatively, run each service in separate terminal windows:

```bash
# Terminal 1: Backend API
npm --prefix backend run dev

# Terminal 2: Frontend Client
npm --prefix frontend run dev
```

Open your browser to: **`http://localhost:3000`**

---

## 5. Demonstration Accounts for External Viva

For instant viva evaluation, pre-seeded accounts and one-click shortcuts are built directly into the UI:

| Role | Email | Password | Access Privileges |
|---|---|---|---|
| **Administrator** | `admin@smartqueue.demo` | `admin123` | Full Operations Console, Counter Dispatch, Analytics, Workload Optimizer, Audit Logs |
| **Demo Citizen** | `citizen@smartqueue.demo` | `citizen123` | Personal Dashboard, 8-Step Booking, Live Queue Tracker (Token `DL-105`), Notifications |

> [!TIP]
> On the login page, you can click **"👤 Citizen Demo"** or **"👑 Admin Demo"** for instantaneous 1-click authentication without typing credentials!

---

## 6. Database Setup Instructions

The application supports dual persistence modes:

### Mode A: Built-in High-Fidelity Academic Demo Mode (Default)
- Zero external database setup or cloud account required.
- Pre-populated with synthetic RTO offices, counters, active queue appointments, and completed observations.
- Fully supports transactions, atomic capacity validation, and state progression.

### Mode B: Connected Supabase PostgreSQL Mode
If you wish to connect to an external Supabase project:
1. Create a project at [supabase.com](https://supabase.com).
2. Open the SQL Editor in Supabase and execute:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/seed.sql`
3. Update `backend/.env` with your project keys:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-public-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-private-service-role-key
   ```
4. Update `frontend/.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-anon-key
   ```

---

## 7. Administrator Role Bootstrap Procedure

In compliance with strict security requirements, the public registration form **never** grants administrator privileges. To create or promote an admin account:

```bash
# Run server-side bootstrap script
node backend/src/scripts/bootstrapAdmin.js --email newadmin@rto.demo --name "Senior Inspector" --password "AdminSecret123!" --secret super-secret-academic-admin-key-2026
```

---

## 8. REST API Documentation

### Authentication & Profiles
- `GET  /api/health` — System status, uptime, and database connection.
- `POST /api/auth/register` — Citizen registration (strictly role `citizen`).
- `POST /api/auth/login` — Citizen / Admin login (returns JWT).
- `GET  /api/me` — Current authenticated user profile.

### Resources & Predictions
- `GET  /api/offices` — List active demonstration RTO offices.
- `GET  /api/services` — List configured RTO services and base durations.
- `GET  /api/slots` — Fetch slots, remaining capacities, and wait-time recommendations.
- `GET  /api/predictions/wait-time` — Calculate estimated wait time for an appointment or queue position.
- `GET  /api/predictions/recommendations` — Multi-objective slot ranker.
- `GET  /api/notifications` — In-app alerts for citizen.
- `PATCH /api/notifications/:id/read` — Mark notification read.

### Appointments & Queue
- `GET   /api/appointments/my` — Citizen's appointments list.
- `POST  /api/appointments` — Atomic slot booking (checks capacity, generates `BK-` ref & token).
- `GET   /api/appointments/:id` — View appointment details (tenant-isolated).
- `PATCH /api/appointments/:id/checkin` — Citizen self check-in to active queue.
- `PATCH /api/appointments/:id/reschedule` — Reschedule booking to another slot.
- `PATCH /api/appointments/:id/cancel` — Cancel booking and restore slot capacity.
- `GET   /api/queue/my` — Citizen's active queue ticket & live metrics.
- `GET   /api/queue/:appointmentId` — Queue status for specific appointment.

### Administrative Operations (Admin Only)
- `GET   /api/admin/dashboard` — Aggregated operational metrics.
- `GET   /api/admin/appointments` — Search, filter by status, date, service.
- `PATCH /api/admin/appointments/:id/status` — Advance queue state (`in_progress`, `completed`, `no_show`).
- `GET   /api/admin/counters` — Counter workloads, statuses, and queues.
- `PATCH /api/admin/counters/:id` — Update counter status (`active`, `busy`, `paused`, `offline`).
- `GET   /api/admin/recommendations` — Counter workload balancing recommendations.
- `POST  /api/admin/recommendations/:id/approve` — Transactionally approve reassignment.
- `POST  /api/admin/recommendations/:id/reject` — Reject reassignment.
- `GET   /api/admin/analytics` — Recharts datasets & prediction evaluation (MAE, MAPE).
- `POST  /api/admin/analytics/seed-demo` — Seed 25 synthetic completed records for viva demo.
- `GET   /api/admin/audit-logs` — Administrative action history.
- `POST  /api/admin/reset-database` — Reset database to clean seed state.

---

## 9. Mathematical Prediction Methodology

### 9.1 Effective Service Duration
Blends baseline duration $D_{\text{base}}$ with observed historical mean $\bar{D}_{\text{hist}}$:
$$D_{\text{eff}}(s) = \alpha \cdot \bar{D}_{\text{hist}}(s) + (1 - \alpha) \cdot D_{\text{base}}(s), \quad \alpha = \min\left(0.75, \frac{N}{20}\right)$$

### 9.2 Multi-Counter Queue Estimation
$$\hat{W}(k) = \frac{\sum_{j \in \text{Active}} \max(0, D_{\text{eff}} - \text{elapsed}_j) + \sum_{i=1}^{k-1} D_{\text{eff}}}{c_{\text{active}}(s)} \cdot \beta_{\text{congestion}}$$

### 9.3 Confidence Bounds
Dynamic uncertainty interval $[L, U] = \hat{W} \cdot (1 \pm \delta)$ where $\delta$ decreases from $0.35$ to $0.15$ as observations accumulate.

---

## 10. Automated Tests & Actual Results

Run all test suites locally using Windows PowerShell:

```powershell
# Run backend API tests (15 tests)
npm.cmd --prefix backend test

# Run frontend component tests (4 tests)
npm.cmd --prefix frontend test

# Run frontend production build
npm.cmd --prefix frontend run build
```

### Actual Verified Results
- **Backend**: **15 out of 15 passed** (Supertest integration tests covering RBAC isolation, atomic capacity locks, lifecycle state progression, `/api/offices` directory filtering, and prediction calculations).
- **Frontend**: **4 out of 4 passed** (React Testing Library verifying landing page disclaimer, unauthenticated queue tracker handling, booking wizard initialization, and Maharashtra office directory rendering).
- **Production Bundle**: **Clean production build** via Vite (`dist/` generated with zero errors).

---

## 11. Complete Deployment & Production Guide

Follow these steps to deploy RTO SmartQueue AI to cloud infrastructure.

### 11.1 Step 1: Database Setup (Supabase PostgreSQL)
1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Under **Project Settings -> API**, copy:
   - Project URL (`https://xyzcompany.supabase.co`)
   - `anon` `public` key
   - `service_role` `secret` key (keep strictly secret, never put in frontend!)
3. In the Supabase **SQL Editor**, run the migration scripts in order:
   - `supabase/migrations/001_initial_schema.sql` (creates 13 core tables, indexes, constraints)
   - `supabase/migrations/002_rls_policies.sql` (enforces strict tenant isolation and admin rules)
   - `supabase/seed.sql` (seeds official Maharashtra RTO offices, demo accounts, and services)

### 11.2 Step 2: Backend Deployment (Persistent Node.js Hosting)
Deploy the `backend` folder to a persistent Node.js hosting platform (e.g., [Render.com](https://render.com), [Railway.app](https://railway.app), or Fly.io):
1. **Root Directory**: `backend`
2. **Build Command**: `npm install`
3. **Start Command**: `node src/server.js`
4. **Environment Variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   JWT_SECRET=your-strong-production-jwt-secret-string
   ADMIN_BOOTSTRAP_SECRET=your-strong-admin-bootstrap-secret
   ```
5. Once deployed, verify your backend health endpoint in your browser:  
   `https://your-backend.onrender.com/api/health`

### 11.3 Step 3: Frontend Deployment (Vercel)
The project includes `frontend/vercel.json` configured with Vite build output and SPA client-side route rewrites.
1. Connect your GitHub repository to [Vercel](https://vercel.com).
2. Set **Root Directory** to: `frontend`
3. Framework Preset: **Vite**
4. Build Command: `vite build`
5. Output Directory: `dist`
6. **Environment Variables**:
   ```env
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```
7. Click **Deploy**. Vercel will build and assign your production domain (`https://rto-smartqueue.vercel.app`).

### 11.4 Step 4: Verification of Live System
1. Open your live Vercel URL.
2. Verify the **RTO Directory** (`/offices`) loads all verified Maharashtra locations.
3. Test citizen login or demo login (`citizen@smartqueue.demo`).
4. Test the 8-step booking wizard and observe slot recommendation generation.
5. Confirm token issue and live queue tracking.
6. Log in as administrator (`admin@smartqueue.demo`) to verify dashboard metrics and counter dispatch.

---

## 12. External Viva Demonstration Guide

When presenting this project to your external examiner or college professor, follow this 5-minute walkthrough:

### Step 1: System Vision & Academic Scope (1 minute)
- Point out the top **Academic Demonstration Disclaimer banner**.
- Explain that existing systems only give citizens a time slot without visibility into actual delays or counter congestion.
- Explain that this project solves this through explainable queueing theory ($M/M/c$), not an opaque LLM.

### Step 2: Citizen Booking Journey (1.5 minutes)
1. Click **"Book an Appointment"** or log in as **Demo Citizen**.
2. Walk through the **8-step wizard**:
   - Step 1: Select **Driving Licence (DL)**.
   - Step 2: Select **Mumbai Central Demonstration RTO**.
   - Step 3: Select today's date.
   - Step 4: Show the **Compare Slots** table with calculated wait times.
   - Step 5: Highlight the 3 smart recommendation cards: **Lowest Wait**, **Balanced**, and **Most Convenient**.
   - Step 6-8: Complete booking, show the generated **Booking Reference (`BK-...`)** and **Queue Token (`DL-106`)**.

### Step 3: Live Queue Tracker (1 minute)
1. Click **"Open Live Queue Tracker"**.
2. Point out:
   - Big Token display box.
   - People ahead counter.
   - Active certified counters.
   - **Explainable Wait-Time Calculation breakdown**: show the examiner that every factor (queue ahead, effective duration, active counters) is transparently explained!

### Step 4: Administrator Operations & Workload Optimizer (1.5 minutes)
1. Switch to Administrator (click **"👑 Demo Admin"** in navbar).
2. Open **Dashboard**: show the 8 real-time KPI metrics and the 4 Recharts graphs.
3. Open **Appointments**: demonstrate queue progression (click **"Call Token"** to advance to In Progress, then **"Complete"**).
4. Open **Insights & Optimizer**:
   - Show the **Counter Load-Balancing Recommendation** (e.g. Counter 1 congested, Counter 5 has capacity).
   - Click **"Approve Reassignment"** and show that the transaction executes immediately.
   - Scroll to **Prediction Accuracy Telemetry**: click **"⚡ Seed 25 Synthetic Records for Viva"** to instantly compute and display **Mean Absolute Error (MAE: ~2.4 mins)** and **MAPE (~14.8%)**!

---

## 12. Viva Q&A Preparation

**Q1: Why didn't you use ChatGPT/OpenAI API for predicting queue times?**  
*Answer*: LLMs are probabilistic language models and cannot reliably perform deterministic queue scheduling or guarantee mathematical bounds. Queueing systems require deterministic operations research formulas ($M/M/c$) that consider exact remaining service times, active counter certification, and atomic database state.

**Q2: How does the system prevent double booking or slot overbooking?**  
*Answer*: Booking requests are executed through atomic transactional checks on `appointment_slots.booked_count < max_capacity` and unique database constraints on `(office_id, token_date, queue_token)`. If two citizens submit requests concurrently, one succeeds and the other is atomically rejected with HTTP 409 `SLOT_FULL`.

**Q3: How is role authorization secured?**  
*Answer*: Role-based access control is enforced strictly on the backend via Express middleware (`requireAdmin`). Hiding an admin button in React is just UI convenience; all `/api/admin/*` routes verify the user's role from the database before granting access.

---

## 13. Known Limitations & Future Work

- **SMS/WhatsApp Gateways**: In-app notifications are fully implemented. Real SMS dispatch requires external telephony credentials (e.g., Twilio / Fast2SMS).
- **Physical Hardware**: Token call bells and display monitors are represented in software via live web polling and responsive views. Future extensions can integrate MQTT for physical LED display boards.
- **Biometric Integration**: Biometric kiosk thumbprint capture is represented via self-service QR check-in.
