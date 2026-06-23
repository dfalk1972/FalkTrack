# Progress Log

## Current Status

_Last updated: 2026-06-22_

**Done:**

- Full project scaffold, routing, global CSS tokens
- Home page nav/header with reusable Paw component
- How It Works section with array/map pattern
- Features section JSX complete (needs CSS styling)
- Learned: lucide-react icon imports, undefined property
  names fail silently in JavaScript, when to use inline
  styles vs CSS classes

**Next:**

- Style the Features section (featuresGrid, featureCard,
  featureIconWrap)
- CTA banner section
- Footer section
- Commit and call the Home page done

---

## Session Log

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
