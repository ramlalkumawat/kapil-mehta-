# CHANGELOG — Sarpanch Setu

All notable changes to this project are documented in this file.

## [1.2.0] - 2026-10-24
### Added
- **Google Cloud Run Live Grievance Microservice Integration**:
  - Connected live Google Cloud Run grievance submission endpoint (`https://submit-complaint-giiw7bvowq-el.a.run.app`) for real-time citizen complaint dispatch to cloud storage/Firestore.
  - Configured `VITE_COMPLAINT_API_URL` and `VITE_GCP_COMPLAINT_URL` in `.env` and `.env.example`.
  - Updated complaint form with exact fields: पूरा नाम (`name`), मोबाइल नंबर (`mobile`), शिकायत की श्रेणी (`category`), वार्ड / क्षेत्र / मोहल्ला (`ward`), शिकायत का विवरण (`description`), and hidden Candidate ID (`candidate-kapil-mehta`).
  - Implemented 7 standardized category options: सड़क एवं परिवहन (`road`), पानी की समस्या (`water`), बिजली की समस्या (`electricity`), सफाई एवं कचरा (`sanitation`), स्ट्रीट लाइट (`street_light`), नाली एवं जल निकासी (`drainage`), अन्य शिकायत (`general`).
  - Added robust frontend validations: empty checks, 10-digit Indian mobile validation (`/^[6-9]\d{9}$/`), double-submission prevention, and accessible loading state indicator ("शिकायत दर्ज की जा रही है...").
  - Implemented visually polished success confirmation section with server-generated tracking code, status badge ("दर्ज की गई"), copy tracking code button, and "Submit Another Complaint" action.
  - Added test suite Suite 9 with 9 automated tests passing (total: **56 / 56 tests passed**).

## [1.1.0] - 2026-10-22
### Added
- **Kapil Mehta Candidate Edition**:
  - Personalized profile for Kapil Mehta (District Council / Zila Parishad Member Candidate, Ward No. 22, Jhalawar, Rajasthan).
  - Configured 7 Gram Panchayats: Akodiya, Sarkhandiya, Panwad, Bishan Khedi, Pakhrana, Layphal, Harigarh.
  - Verified Personal Details: Native village Ganeshpura (Chonsla), PO Akodiya, Tehsil Khanpur, District Jhalawar, DOB 29 March 1993.
  - Educational Qualifications timeline: Sangod, Jhalawar, B.Com (Commerce College, Kota), B.Ed. (Om Kothari College), M.Com Accounting (Univ. of Kota), M.Com Business (Commerce College, Kota).
  - Chronological Political Journey (2014-2025): ABVP Kota University Secretary, 2017 Commerce College Candidate, 2018 ABVP Joint Secretary, 2019 ABVP Secretary, 2020 ABVP Division Co-convener & State Executive, 2021-2025 BJYM State Executive Member.
- **Campaign Management System (`src/services/campaignService.js`)**:
  - Gram Panchayat and Polling Booth management with configurable dynamic additions.
  - Volunteer Management & village/booth assignment.
  - Voter Registry with search, CSV Import with header auto-mapping, and CSV Export.
  - Door-to-Door Field Survey & Visit Tracker with citizen sentiment classification.
  - Campaign Task Assignment & follow-up with status toggles.
  - Query-driven metrics calculation (Zero fake numbers or fabricated totals).
  - Candidate photograph upload and local/backend synchronization.
- **Design System & Palette Transformation**:
  - Switched palette to dignified Rajasthan local election theme: Dark Maroon (`#800020`), Warm Saffron (`#d97706`), Off-White background (`#faf8f5`).
  - Added CSS tokens and components for education timeline, political journey, and multi-tab campaign dashboard.
- **Database & Multi-Tenant Migration**:
  - `supabase/migrations/002_campaign_management_schema.sql` providing schema for locations, booths, volunteers, voters, field visits, and tasks with strict RLS isolation.
- **Automated Test Suite Expansion**:
  - Expanded `scripts/run-tests.js` from 29 to 47 passing tests (**47/47 Passed**).

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
