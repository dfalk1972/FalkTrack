# Progress Log

## Current Status

_Last updated: 2026-06-21_

**Done:**

- Repo cloned and merged with Vite scaffold (existing docs preserved)
- `dev` branch created — all build work happens here
- DECISIONS.md and PROGRESS.md tracking choices and progress
- React Router set up — Home route rendering and confirmed working
- Global design tokens (colors, fonts) defined as CSS custom properties
  in index.css
- Home page nav/header built: logo with a reusable Paw icon component,
  Log in / Sign up links (routes not built yet, will dead-end for now)

**Next:**

- Build the hero section of the Home page (headline, subtext, CTA
  buttons, mascot placeholder)
- Then How It Works, Features, CTA banner, and Footer sections
- Eventually: real Login and Signup pages so the nav links resolve

**Done:**

- Cloned the FalkTrack repo locally (existing README, proposal doc, and
  diagrams preserved)
- Scaffolded Vite + React, merged it into the repo without touching
  existing files
- `npm install` complete — 135 packages, 0 vulnerabilities
- Created a `dev` branch — all build work happens here, per the
  capstone submission instructions (PR from dev into main at the end,
  not merged)
- Created DECISIONS.md to track the reasoning behind technical choices
- First commit pushed to the `dev` branch on GitHub

**Next:**

- Walk through what's actually inside `src/` (understand the scaffold
  before adding to it)
- Build and style the Home page using CSS Modules

---

## Session Log

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
