# TASKS.md — Work Tracking for Sarpanch Setu

## In Progress
- [ ] Production deployment to hosting target (Vercel / Cloudflare Pages) once deployment credentials are provided by the client.

## Completed Tasks
- [x] Phase 1: Workspace inspection (clean directory verified).
- [x] Phase 2: Core documentation initialized (`AGENTS.md`, `PROJECT_CONTEXT.md`, `TASKS.md`, `CHANGELOG.md`, `README.md`, `.env.example`).
- [x] Phase 3: Lightweight design system tokens, typography, CSS variables, base styles, and animations (`src/styles/`).
- [x] Phase 4: Candidate configuration architecture (`config/schema.js`, `default.js`, `candidate-001.js`, `candidate-002.js`, `active-candidate.js`).
- [x] Phase 5: Bilingual i18n localization system (`src/locales/hi.js`, `src/locales/en.js`, `src/locales/i18n.js`) with 100% dictionary key parity.
- [x] Phase 6: Responsive UI components:
  - Sticky Header with emblem, bilingual branding, lang toggle, and staff access button.
  - Mobile bottom navigation bar.
  - Candidate Hero Card with rural leader SVG avatar, verified badge, and quick WhatsApp/Call actions.
  - Profile section with biography, education, experience, and verified social work.
  - Works section with Completed, Ongoing, and Proposed tabs and verification citations.
  - Vision & Mission section with 6 core development pillars.
  - Citizen Services panel with direct shortcuts.
  - Verified Government Welfare Schemes section with document checklists and official links.
  - Gram Sabha announcements and emergency numbers directory.
  - Prominent statutory non-government disclaimers and citizen privacy notices.
- [x] Phase 7: Real citizen grievance submission & tracking system:
  - Form validation with honeypot spam protection.
  - Cryptographically non-sequential tracking code generator (`SETU-RJ-XXXXXX`).
  - 2-factor privacy-preserving status query (Tracking code + mobile last 4 digits).
  - Status progression workflow (`submitted` -> `under_review` -> `in_progress` -> `resolved` -> `closed`).
  - Authorized staff PIN-protected status updater with audit history.
- [x] Phase 8: Supabase PostgreSQL database migration (`supabase/migrations/001_sarpanch_setu_schema.sql`) with Row Level Security (RLS) policies and security-definer RPC functions.
- [x] Phase 9: PWA implementation: `manifest.webmanifest`, `sw.js` with safe caching strategy, and offline fallback (`offline.html`).
- [x] Phase 10: Candidate validator CLI (`scripts/validate-candidates.js`) and candidate switcher (`scripts/switch-candidate.js`).
- [x] Phase 11: Automated test suite (`scripts/run-tests.js`) passing 29 out of 29 tests across schemas, i18n parity, validation, privacy shields, and tracking workflows.
- [x] Phase 12: Production build verified with Vite (`npm run build`).

## Pending / Next Recommended Tasks
- [ ] Connect live Supabase instance by supplying `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` and running `001_sarpanch_setu_schema.sql`.
- [ ] Replace candidate SVG avatar placeholder with real high-resolution photographs when candidate assets are supplied.
- [ ] Connect custom domain (e.g. `bagrukhurd.sarpanchsetu.in`) for candidate deployment.

## Known Limitations / Disclosures
- Browser automation in the local subagent environment encountered sandbox network restrictions regarding driver download; full verification was executed and confirmed via the automated Node.js test suite (`npm test`), configuration validator (`npm run validate`), and Vite build pipeline (`npm run build`).
- Live Supabase operations run in local simulated mode until real project credentials are added to `.env`.
