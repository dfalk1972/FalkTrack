import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Separate from vite.config.js on purpose - keeps "build my app" config
// and "run my tests" config from tangling together, though both use the
// same React plugin.
export default defineConfig({
  plugins: [react()],
  // Vitest 2.x's transform pipeline didn't pick up the automatic JSX
  // runtime the way `vite dev`/`vite build` did, so JSX touched during a
  // test threw "React is not defined" - esbuild.jsxInject used to work
  // around that. Vitest 4 switched its default transform to "oxc", which
  // handles the automatic JSX runtime correctly on its own (and silently
  // ignores esbuild options like jsxInject, printing a warning if they're
  // still set) - so that workaround isn't needed anymore. Left this note
  // in case a future Vitest version reintroduces the issue.
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    globals: true,
    // Without this, Vitest's default file glob also picks up the
    // Mocha/Chai suite under server/test - those files run fine under
    // Vitest by accident (same describe/it shape), but they're meant to
    // run via `npm test` inside server/, with server/'s own
    // dependencies. Keep the two suites separate.
    exclude: ["node_modules/**", "server/**"],
  },
});
