# Progress Log

## Current Status

_Last updated: 2026-08-23_

**Done:**

- Phase 0: Home page, stack decisions, ERD, PROGRESS.md tracking
- Phase 1: Database — `01_schema.sql`, `02_rls.sql`, `03_seed.sql` run
  against a live Supabase project, first admin bootstrapped
- Phase 2: Express backend — scaffold, signup with rollback, JWT auth
  middleware, company-scoped profile middleware
- Phase 3: Auth screens — Login, Signup, Pending,
- Phase 4: Jobs — gallery, create, detail, start/stop timer, mark
  complete with hour aggregation
- Phase 5: Assets & Maintenance — gallery, detail, add maintenance
  record (photo upload cut from scope)
- Phase 6: Admin Panel — approve/reject pending users, company-wide
  time logs
- Phase 7: Testing — Vitest (React components), Mocha/Chai/Supertest/
  Sinon (API endpoints and database models)
- Phase 8: Presentation polish — in-app schema diagram, responsive
  pass

**Next:**

- Phase 9: Deployment — Vercel (frontend) + Render (backend)
- Phase 10: Submission — PR from `dev` → `main`, left unmerged,
  confirm all Completion-criterion documents are present

**Done:**

- Full project scaffold, routing, global CSS tokens
- Home page complete (nav, hero with dog photo, how it works,
  features, CTA banner, footer)
- PROGRESS.md tracking choices and reasoning
- Proposal scaled back to v4 — 6 tables, ~39 hour scope,
  stretch goals moved to Section 8 V2 roadmap

**Next:**

- Step 4: Database ERD diagram (6 tables)
- Login and Signup pages
- Supabase project setup and schema migration
- Express backend scaffold

---

## Session Log

### 2026-08-23 — Phases 2 through 8: full build

Long single-day session. Built the database, the entire Express
backend (auth, jobs, assets/maintenance, admin), the entire React
frontend (all pages/routes/components), the test suite, and this
round of presentation polish — schema diagram, responsive pass,
documentation accuracy. Made a deliberate time-scoping call partway
through (skip photo upload;) to protect finishing the
course. Deployment (Phase 9) and submission (Phase 10) still ahead.

### 2026-06-24 — Home page complete

Built and styled the full Home page. Sections completed: nav/header,
hero with real dog photo, How It Works (first use of array/map
pattern), Features with lucide-react icons and dynamic accent colors
via inline styles, CTA banner, and footer.

Key things learned this session:

- CSS custom properties (var()) don't resolve inside JavaScript
  inline style objects — use raw hex values there instead
- Inline styles override CSS class properties for the same rule,
  but only if the style prop is on the correct element
- Object property name typos fail silently in JavaScript (iconName
  vs Icon bug from last session)
- box-shadow works best on contained card elements, not full-width
  sections
- object-fit: cover fills a container with an image without
  stretching it

### 2026-06-22 — Home page: How It Works and Features sections

Built How It Works using the array/map pattern for the first time.
Built Features section with lucide-react icons stored directly in
the data array as components. Hit a real bug: property named
`iconName` in the array but accessed as `feature.Icon` in the map
— JavaScript returned undefined silently, React blew up on render.
Fixed by renaming the property to `Icon` to match. Rule learned:
typos in object property names fail silently in JavaScript.

### 2026-06-21 — Home page: nav/header section

Set up global CSS custom properties in index.css for the brand palette
and fonts, then wired up React Router with a placeholder Home page and
confirmed it rendering end to end. Built the real nav/header section:
a reusable Paw icon component using the `fill="currentColor"` pattern
so color lives in CSS rather than JS props, plus the logo and nav
links. Hit a real bug — a missing `fill="currentColor"` attribute made
the icon render black — and debugged it by checking whether the CSS
variable worked elsewhere on the page first, which isolated the
problem to the component instead of the variable system.

### 2026-06-21 — Project setup

Cloned the existing repo, scaffolded Vite + React into a temp folder
and merged the generated files in cleanly, installed dependencies,
created a `dev` branch for all build work, added DECISIONS.md, and
pushed the first commit. Repo is ready for actual component code.
