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
- [x] Phase 13: Kapil Mehta Candidate Edition Personalization (District Council Ward 22, Jhalawar, Rajasthan):
  - Configured active candidate `config/candidates/candidate-kapil-mehta.js` with verified personal details, education timeline (6 qualifications), political journey (ABVP & BJYM 2014-2025), and 7 Gram Panchayats (Akodiya, Sarkhandiya, Panwad, Bishan Khedi, Pakhrana, Layphal, Harigarh).
  - Updated design tokens to dark maroon (`#800020`), subtle saffron (`#d97706`), and off-white background (`#faf8f5`).
  - Added campaign management module (`src/services/campaignService.js`) supporting volunteer assignment, voter registry with CSV import/export, field surveys, task management, and strictly query-driven metrics.
  - Implemented full Campaign Management Portal & Admin Dashboard (`src/components/AdminPanel.js`) with 8 interactive modules and GP location filters.
  - Updated Grievance Modal (`src/components/ComplaintModal.js`) with dynamic Ward 22 Gram Panchayat selector.
  - Updated Candidate Profile Section (`src/components/ProfileSection.js`) with verified personal details, card-based education timeline, and chronological political journey timeline.
  - Added PostgreSQL migration `supabase/migrations/002_campaign_management_schema.sql` with multi-tenant RLS.
  - Expanded automated test suite (`scripts/run-tests.js`) to 47 tests with 100% pass rate (**47/47 Passed**).
  - Production build verified with Vite (`npm run build`).
- [x] Phase 14: Google Cloud Run Live Grievance Microservice & Form Overhaul:
  - Deployed & verified live Cloud Run endpoint: `https://submit-complaint-giiw7bvowq-el.a.run.app`.
  - Configured `VITE_COMPLAINT_API_URL` and `VITE_GCP_COMPLAINT_URL` in `.env` and `.env.example`.
  - Updated complaint form with specified labels, required fields, 7 standard categories, loading indicator, and double-submission protection.
  - Implemented confirmation section with server-generated tracking code, status badge ("दर्ज की गई"), copy tracking code button, and "Submit Another Complaint" action.
  - Expanded automated test suite with Suite 9 (**56/56 Passed, 100%**) and verified production build (`npm run build`).
- [x] Phase 15: Clean Decoupling of Supabase:
  - Removed `@supabase/supabase-js` package dependency, reducing bundle footprint.
  - Removed `src/services/supabase.js` and `supabase/` migrations.
  - Cleaned up environment variables and service worker references.
- [x] Phase 16: Admin Decoupling, SVG Candidate Photo & Multi-Device Responsiveness:
  - Removed admin panel modal and lock button from public citizen portal.
  - Converted and embedded candidate photograph into self-contained vector SVG assets (`public/kapil-mehta.svg`, `public/kapil-mehta-namaste.svg`).
  - Added full multi-device responsive rules covering extra small mobile (320px–360px), standard mobile (up to 480px), foldables/tablets (481px–767px), portrait tablets (768px–1023px), and desktop (1024px+).
  - Production build bundle size reduced by ~75 kB.
  - All 56 automated tests passing (100%).

## Pending / Next Recommended Tasks
- [ ] Connect custom domain (e.g. `kapilmehta.sarpanchsetu.in`) for candidate deployment.

## Known Limitations / Disclosures
- Browser automation in the local subagent environment encountered sandbox network restrictions regarding driver download; full verification was executed and confirmed via the automated Node.js test suite (`npm test`), configuration validator (`npm run validate`), and Vite build pipeline (`npm run build`).
