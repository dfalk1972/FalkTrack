# 🔧 FalkTrack

### Asset & Job Management Platform for Field Operations

FalkTrack is a full-stack web application that helps companies in the
automotive, utility, and agriculture industries track job progress,
log employee time, and manage asset maintenance records — all from a
single responsive platform usable on desktop, tablet, or mobile.

> Built as a Capstone Project for a Full-Stack Web Development course.
> Two businesses have already expressed interest in using FalkTrack
> in production.

---

## Live Demo

**[falk-track.vercel.app](https://falk-track.vercel.app)**

> ⏱️ **First load may be slow.** The API is hosted on Render's free tier,
> which sleeps after 15 minutes of inactivity and takes 30–60 seconds to
> wake. If the login screen or the company dropdown looks empty on the
> very first visit, give it a moment and refresh.

### Demo Accounts

| Role                      | Email                       | Password    |
| ------------------------- | --------------------------- | ----------- |
| Admin                     | `demoadmin@gmail.com`       | `123456`    |
| Worker — active           | `demo.worker@falktrack.com` | `123456789` |
| Worker — pending approval | `demo.worker2@gmail.com`    | `123456789` |

The third account is deliberately left **pending** so the admin approval
flow can be exercised end to end: log in as the admin, open the Admin
panel, and approve or reject it.

---

## Features

- **Company-Scoped Registration & Login** — email/password auth via Supabase, every account tied to one company
- **Admin User Approval** — new accounts start `pending` and need an admin to activate them before they can use the app
- **Role-Based Access** — Admin and Worker roles with different permissions, enforced both in the UI and on every API route
- **Jobs Gallery & Job Detail** — create and manage jobs with full detail pages
- **Start/Stop Timer** — clock in/out on a job, one open timer per worker per job
- **Hour Aggregation** — total hours auto-calculated across every worker once a job is marked complete
- **Asset Registry** — gallery of company assets (name, asset number, category, make/model/year)
- **Maintenance Records** — log maintenance history per asset with type, notes, cost, and next due date
- **Admin Panel** — approve/reject pending users, view company-wide time logs across every worker and job
- **In-App Schema Diagram** — the live database schema, viewable from inside the app

---

## Tech Stack

| Layer            | Technology                                                                            |
| ---------------- | ------------------------------------------------------------------------------------- |
| Frontend         | React 19, Vite, CSS Modules, React Router v7                                          |
| State Management | React Context API                                                                     |
| Backend          | Node.js, Express                                                                      |
| Database         | Supabase (PostgreSQL), accessed via `@supabase/supabase-js`                           |
| Testing          | Vitest + React Testing Library (frontend), Mocha + Chai + Supertest + Sinon (backend) |
| Deployment       | Vercel (frontend), Render (backend)                                                   |

---

## Architecture

React (Vercel) → Express (Render) → Supabase (PostgreSQL)

Express is the controller layer between the frontend and the database:
every protected route runs through `requireAuth` (verifies the
Supabase JWT) then `requireProfile` (looks up the caller's company,
role, and status), and every query from there filters by
`company_id` — that's the app's multi-tenancy boundary. See
`DECISIONS.md` for the reasoning behind this and other architectural
choices made along the way.

---

## Running Locally

FalkTrack is two separate Node projects in one repo: the React
frontend at the root, and the Express backend in `server/`.

### Prerequisites

- Node.js 18+
- A Supabase project with the schema in `supabase/01_schema.sql` and
  `supabase/02_rls.sql` already run against it (see those files, and
  `supabase/03_seed.sql` for optional sample data)

### 1. Backend setup

```
cd server
npm install
```

Create `server/.env`:

```
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret-key
PORT=5000
```

`SUPABASE_URL` should be the bare project URL from Supabase's
"Connect" panel — no `/rest/v1/` suffix. The service role key is
found under Project Settings → API — it bypasses Row Level Security,
so it must never be committed or exposed to the frontend.

```
npm run dev
```

Runs the API on `http://localhost:5000` with `nodemon` (auto-restarts
on file changes — but not on `.env` changes, restart manually after
editing that file).

### 2. Frontend setup

From the repo root:

```
npm install
```

Create a `.env` file at the repo root (not inside `server/`):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_API_URL=http://localhost:5000
```

The anon/publishable key is safe to expose in the browser — it's a
different key from the backend's service role key above, and it's
what the frontend uses to talk to Supabase Auth directly for login.

```
npm run dev
```

Runs the app on `http://localhost:5173` (Vite's default).

### 3. Running the tests

```
npm test          # frontend - Vitest, React components
cd server && npm test   # backend - Mocha/Chai, API endpoints + DB models
```

Neither suite needs real Supabase credentials to run — see
`server/test/` and each `*.test.jsx` file's comments for how the
database layer is faked for testing.

---

## 📁 Project Structure

```
├── src/                  # React frontend
│   ├── components/       # Shared UI (AppHeader, ProtectedRoute)
│   ├── context/          # AuthContext (session + profile)
│   └── pages/             # One folder per route
├── server/               # Express backend
│   ├── routes/           # URL → controller mapping only
│   ├── controllers/      # Request/response handling, validation
│   ├── models/           # Supabase queries
│   ├── middleware/        # requireAuth, requireProfile, requireAdmin
│   └── test/              # Mocha/Chai test suite
├── supabase/              # SQL migration files, run in order
└── diagrams/               # ERD and flow diagrams (see also the
                             # in-app Schema page for the current,
                             # generated-from-schema diagram)
```
