import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `server/` is a separate CommonJS Node project (its own
  // package.json, its own `require`/`module.exports`/Mocha globals) -
  // this config is for the Vite/React frontend and assumes browser
  // globals, so it was never meant to lint server/ at all. It went
  // unnoticed until Phase 7 added enough server-side files (and test
  // files with describe/it) for `npm run lint` (which runs `eslint .`
  // from the repo root, so it walks server/ too) to actually surface
  // it - this file predates server/ existing.
  globalIgnores(['dist', 'server']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
])
