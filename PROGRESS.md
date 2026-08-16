# Progress Log

## Current Status

*Last updated: 2026-07-31*

**Done:**
- Full project scaffold, routing, global CSS tokens
- Home page complete (nav, hero with dog photo, how it works,
  features, CTA banner, footer)
- DECISIONS.md and PROGRESS.md tracking choices and reasoning
- Proposal scaled back to v4 — 6 tables, ~39 hour scope,
  stretch goals moved to Section 8 V2 roadmap
- Multi-tenancy and relational database concepts documented
  in DECISIONS.md

**Next:**
- Step 4: Database diagram — draw the 6 tables and their
  relationships (ERD)
- Step 4 submission to mentor
- Login and Signup pages (controlled forms in React)
- Supabase project setup and schema migration


### 2026-06-24_

**Done:**

- Full project scaffold, routing, global CSS tokens
- Home page complete:
  - Nav/header with reusable Paw component
  - Hero section with dog photo and CTA buttons
  - How It Works section (array/map pattern)
  - Features section with lucide icons and dynamic accent colors
  - CTA banner
  - Footer

**Next:**

- Login page
- Signup page
- Dashboard (placeholder for now)
- Begin wiring up the real app screens per the flow diagram

## Session Log

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

