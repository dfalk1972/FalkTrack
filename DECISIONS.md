# Decisions Log

A running record of significant choices on this project — what was
chosen, what was considered, and why. Newest entries at the top.

---

## 2026-08-23 — Presentation: corrected schema diagram for the in-app Schema page

**Decision:** The Schema page (`/schema`) displays a new diagram
(`public/schema-diagram.png`), generated directly from
`supabase/01_schema.sql`, instead of the original
`diagrams/FalkTrack_ERD.png`.

**Why:** Checking the original ERD against the actual, finalized
schema turned up a mismatch — that file predates the schema being
locked in (it has different table names, an extra `industries` table
that was never built, and doesn't match the real six tables:
`companies`, `users`, `assets`, `maintenance_records`, `jobs`,
`time_entries`). Presenting a diagram that doesn't match the real
database would be worse than not presenting one at all, so a corrected
diagram was generated from the actual schema file rather than reusing
the stale image. `diagrams/FalkTrack_ERD.png` is left in place as a
historical record of the early design, not deleted.

---

## 2026-08-23 — Scope cut: skip maintenance record photo upload

**Decision:** Maintenance records and assets don't include photo
upload. `maintenance_records.photo_url` and `assets.thumbnail_url`
stay unset — both columns are nullable in the schema, so nothing about
the data model needed to change.

**Why:** Time-scoping call made partway through the build, to protect
finishing the course on schedule. Supabase Storage integration (upload
UI, file handling, storage bucket policies) was real, non-trivial
scope for a feature that isn't load-bearing for the core "track jobs
and maintenance" functionality the app is graded on. Revisit if there's
time after submission — the schema already supports it, so it's a
pure addition, not a rework.

---

## 2026-08-23 — Clarification: anon key vs. service_role key for login

**Decision:** The frontend calls Supabase Auth's `signInWithPassword()`
directly using the public `anon` key. Express does not proxy login.

**Why:** The 2026-07-31 entry's "never exposed to the browser" language
was written without distinguishing key types. The `anon` key is designed
to be public in the browser — Supabase's real security boundary is RLS,
not key secrecy. The `service_role` key remains server-side only, used
by Express for everything else (jobs, assets, maintenance, admin
approval). Express still verifies every request's JWT via auth
middleware, so it remains the required controller layer — only the
login handshake itself moved client-side.

---

## 2026-07-31 — Deployment: Render over Railway for backend

**Decision:** Use Render instead of Railway for hosting the
Express backend.

**Why:** Render is explicitly named in the rubric, has a
reliable free tier, and is one less unknown to manage. Railway
has become less generous with free tiers recently.

---

## 2026-07-31 — Backend: Keep Express as separate server

**Decision:** Maintain a separate Express backend rather than
calling Supabase directly from React.

**Why:** The rubric explicitly requires a controller layer
between the frontend and database. Express provides that —
routes, validation, and Supabase credentials all live server-
side, never exposed to the browser. Architecture is:
React (Vercel) → Express (Render) → Supabase (PostgreSQL).

---

## 2026-07-31 — File storage: Supabase Storage over Cloudinary

**Decision:** Use Supabase Storage for the one photo per
maintenance record instead of Cloudinary.

**Why:** Supabase Storage is already part of the stack, one
less third-party service to configure and manage, and simpler
for a single photo use case. Cloudinary makes more sense at
higher photo/video volume (V2 roadmap).

**Superseded 2026-08-23** — photo upload itself was cut from scope
(see above), so this decision no longer applies to what was actually
built. Left here as a record of the original plan.

## 2026-06-21 — Git workflow: dev branch for active build, PR into main at submission

**Decision:** All Step 6 build work happens on a `dev` branch. `main`
stays untouched (proposal, diagrams, README) until submission, at
which point a pull request opens from `dev` into `main` — and is not
merged, per the capstone submission instructions.

**Why:** The submission instructions explicitly call for that PR.
Keeping `main` clean until then makes it an actual reviewable diff
instead of an empty one.

---

## 2026-06-21 — Confirmed stack: Vite + React Router + Express + Supabase

**Decision:** Keep the originally proposed stack (Vite, React Router v6,
Node/Express, Supabase/Postgres) rather than switching to Next.js +
MongoDB as referenced in the general Step 6 build instructions.

**Why:** The Step 2 proposal using this stack was already reviewed and
approved by my mentor. Step 6 appears to be general guidance rather
than a hard requirement overriding an already-approved proposal.

---

## 2026-06-21 — Styling approach: CSS Modules over Tailwind

**Decision:** Use CSS Modules for component styling instead of Tailwind
CSS, even though Tailwind was named in the original proposal.

**Why:** CSS Modules is the approach used across every prior coursework
project (Space Travel, Cosmic Encyclopedia, WorldWise), and this
capstone already introduces several new concepts at once (Supabase,
Express, more complex routing and state). Sticking with a styling tool
I already know keeps the number of brand-new things manageable, and
demonstrates core CSS skills rather than relying on a utility framework.

**Revisit if:** the rubric specifically asks for Tailwind or
utility-first CSS once it's fully available.

## 2026-07-29 — Database: Relational vs Document, and Multi-Tenancy

### Why PostgreSQL (Supabase) over MongoDB

FalkTrack's data is highly structured and deeply relational — jobs
have time entries, assets have maintenance records, everything traces
back to a company. PostgreSQL enforces those connections at the
database level with foreign keys, meaning bad data can't exist.
MongoDB leaves that enforcement to application code, which means one
bug can corrupt real business data permanently. For a product
handling real employee hours and equipment records, data integrity
is non-negotiable.

### Multi-Tenancy

FalkTrack is multi-tenant — multiple companies share one app but
each sees only their own data. Company is the top of the entire
data hierarchy. Everything flows down from it.

**Directly connected to company (stores company_id):**

- users
- jobs
- assets

**Indirectly connected through another table:**

- time_entries → jobs → company
- maintenance_records → assets → company
