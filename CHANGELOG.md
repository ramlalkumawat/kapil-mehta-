# CHANGELOG — Sarpanch Setu

All notable changes to this project are documented in this file.

## [1.0.0] - 2026-10-22
### Added
- **Core Master Application Architecture**: Single master codebase customizable per candidate via `config/candidates/*.js`.
- **Candidate Configurations**:
  - `default.js`: Baseline candidate configuration template with explicit placeholder markers.
  - `candidate-001.js`: Rameshwar Lal Choudhary (Gram Panchayat Bagru Khurd, Sanganer, Jaipur, Rajasthan).
  - `candidate-002.js`: Sunita Meena (Gram Panchayat Kolyari, Jhadol, Udaipur, Rajasthan).
- **Candidate Schema & CLI Tools**:
  - `config/schema.js`: Comprehensive schema validation and normalization with safe fallback defaults.
  - `scripts/validate-candidates.js`: Automated CLI validator for candidate configurations.
  - `scripts/switch-candidate.js`: Utility script to switch active candidate configuration.
- **Bilingual Localization System**:
  - Centralized Hindi dictionary (`src/locales/hi.js`) and English dictionary (`src/locales/en.js`) with 100% key parity.
  - Reactive translation controller (`src/locales/i18n.js`) with persistent `localStorage` support and HTML `lang` sync.
- **Responsive UI Components**:
  - Sticky Header with emblem, bilingual Panchayat and candidate branding, language switch toggle, and staff portal button.
  - Mobile bottom navigation bar.
  - Candidate Hero Card with verified badge, rural representative SVG avatar, and direct Call/WhatsApp action buttons.
  - Profile Section with biography, education, experience, and verified social work.
  - Development Works Section with Completed, Ongoing, and Proposed tabs with statutory campaign promise notices.
  - Vision & Mission Section with 6 core development pillars (Water, Roads, Light, Education, Health, Cleanliness).
  - Citizen Services Hub with direct action cards.
  - Verified Government Welfare Schemes Section with eligibility, document checklists, and official portal links.
  - Announcements Section for Gram Sabha dates and health camps.
  - Emergency Directory and prominent non-government statutory disclaimers.
- **Citizen Grievance Redressal System**:
  - Accessible grievance registration form with field validations and honeypot spam protection.
  - Cryptographically non-sequential tracking code generator (`SETU-RJ-XXXXXX`).
  - 2-factor privacy-preserving status tracker requiring Tracking Code + mobile last 4 digits.
  - Authorized Sarpanch staff portal with PIN authentication for reviewing complaints and updating statuses.
- **Backend & Database Infrastructure**:
  - PostgreSQL / Supabase migration (`supabase/migrations/001_sarpanch_setu_schema.sql`) with Row Level Security (RLS) denying public table enumeration and security-definer RPC functions.
  - Graceful local simulated storage fallback for instant offline/local testing.
- **Progressive Web App (PWA)**:
  - `manifest.webmanifest` and Service Worker (`sw.js`) with cache-first static strategy and network-only mutation strategy.
  - Offline fallback page (`offline.html`) with direct emergency dialers.
  - 192x192 and 512x512 SVG app icons.
- **Automated Test Suite**:
  - `scripts/run-tests.js` executing 29 tests covering schemas, i18n parity, grievance validation, anti-spam traps, tracking codes, privacy shields, and status workflows (29/29 passing).
