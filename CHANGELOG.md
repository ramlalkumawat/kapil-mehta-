# CHANGELOG — Sarpanch Setu

All notable changes to this project are documented in this file.

## [1.3.6] - 2026-10-24
### Changed
- **Expanded Grievance Section to 'Citizen Complaints & Suggestions' ("नागरिक शिकायत एवं सुझाव")**:
  - Rebranded complaint actions and buttons across Hero, Citizen Services, and BottomNav to "शिकायत / सुझाव दर्ज करें" (`Submit Complaint / Suggestion`).
  - Added new category option `suggestion`: "💡 विकास सुझाव / नवाचार विचार" (`💡 Development Suggestion / Feedback`) in `ComplaintModal.js` and `complaintService.js`.
  - Updated form labels, placeholders, and descriptions to encourage citizens to share both civic grievances and constructive development ideas.
  - Updated status tracking messages and bilingual dictionaries in `src/locales/hi.js` and `src/locales/en.js`.

## [1.3.5] - 2026-10-24
### Changed
- **Announcements / Public Notices Section ("सूचनाएं") Emptied with 'Coming Soon' State**:
  - Emptied `announcements: []` in candidate profile `config/candidates/candidate-kapil-mehta.js`.
  - Updated `src/components/AnnouncementsSection.js` to render a polished, accessible 'Coming Soon / जल्द उपलब्ध' card instead of mock placeholder notices.
  - Added bilingual translations in `src/locales/hi.js` and `src/locales/en.js`.

## [1.3.4] - 2026-10-24
### Changed
- **Replaced 'Sarpanch Setu' / 'सरपंच सेतु' with 'Kapil Mehta' / 'कपिल मेहता' Throughout Portal**:
  - Updated candidate edition name in `config/candidates/candidate-kapil-mehta.js` (`editionName: { hi: 'कपिल मेहता', en: 'Kapil Mehta' }`), updating brand title in sticky Header.
  - Updated main document title in `src/main.js` to `${candidateName} • ${panchayat} — कपिल मेहता (Kapil Mehta)`.
  - Updated `appName` and `aboutTitle` in both Hindi ([`src/locales/hi.js`](file:///c:/Users/ramla/OneDrive/Desktop/KAPIL-MEHTA/src/locales/hi.js)) and English ([`src/locales/en.js`](file:///c:/Users/ramla/OneDrive/Desktop/KAPIL-MEHTA/src/locales/en.js)).
  - Updated footer branding in `src/components/Footer.js` to dynamic `${t('appName')} v1.0 (राजस्थान)`.
  - Updated HTML `<title>` and `<meta>` tags in `index.html` to reflect Kapil Mehta Zila Parishad Ward 22.
  - Updated PWA manifest name & short_name in `public/manifest.webmanifest` and `manifest.webmanifest`.
  - Updated offline fallback page `<title>` in `public/offline.html` and `offline.html`.

## [1.3.3] - 2026-10-24
### Changed
- **Configured Official Contact Mobile & WhatsApp Number (`9785899641`)**:
  - Updated candidate profile `config/candidates/candidate-kapil-mehta.js` with phone (`+91-9785899641`) and WhatsApp (`919785899641`).
  - Added direct WhatsApp URL link (`https://wa.me/919785899641`) under `socialLinks`.
  - Added contact mobile & WhatsApp directly into `personalDetails` and displayed them with clickable quick links in the Profile Personal Details card (`src/components/ProfileSection.js`).
  - Hero action buttons (Direct Call & WhatsApp message), Sticky Floating Actions (FAB), and Site Footer now instantly route to `9785899641`.
  - Added bilingual translation keys in `src/locales/hi.js` and `src/locales/en.js`.
  - Added automated test assertions in `scripts/run-tests.js` (58/58 tests passing).

## [1.3.2] - 2026-10-24
### Changed
- **Candidate Photo Display — Square Format (1:1) with Top-Aligned Face Preservation**:
  - Converted candidate vector SVGs (`public/kapil-mehta.svg`, `public/candidate-avatar.svg`, `public/kapil-mehta-namaste.svg`) to exact 1:1 square aspect ratio (`viewBox="0 0 500 500"`).
  - Applied `preserveAspectRatio="xMidYMin slice"` ensuring the candidate's face, smile, hair, and Namaste pose are 100% visible and centered at the top without vertical crop.
  - Formatted the photo card with royal Rajasthani maroon (`#800020`) and saffron gold (`#d97706`) rounded borders (`rx="18"`).
  - Configured `.hero-avatar` and `.profile-photo-wrapper` to square dimensions across all breakpoints (`200x200px` desktop, `170x170px` tablet, `150x150px` mobile, `125x125px` extra-small mobile) with `object-position: top center`.

## [1.3.1] - 2026-10-24
### Fixed
- **Mobile Responsive Layout & Viewport Width Bug**:
  - Diagnosed and resolved the root cause of the mobile layout issue where page content occupied only ~75% of the viewport with a white gap on the right.
  - Identified CSS Flexbox/Grid min-content expansion in `ProfileSection.js` (inline flex containing photo next to an unconstrained grid `minmax(200px, 1fr)` with 48px padding, forcing `#profile` scrollWidth to 478px on 320px–430px viewports).
  - Refactored `ProfileSection.js` into responsive CSS classes (`.profile-cards-stack`, `.profile-card`, `.profile-details-body`, `.profile-photo-wrapper`, `.personal-details-grid`) with mobile-first column wrapping.
  - Added responsive CSS definitions in `src/styles/components.css` using `minmax(min(100%, 180px), 1fr)` and mobile-breakpoint stacking for screens `<= 640px` and `<= 360px`.
  - Updated `education-grid` in `src/styles/components.css` from fixed `minmax(260px, 1fr)` to `repeat(auto-fit, minmax(min(100%, 240px), 1fr))`.
  - Updated grid containers in `VisionSection.js` and `AnnouncementsSection.js` to use `minmax(min(100%, 280px), 1fr)` and `min-width: 0; width: 100%`.
  - Enforced `width: 100%; max-width: 100%; overflow-x: hidden;` across `html`, `body`, `#app`, and `main` in `src/styles/base.css`, along with `box-sizing: border-box; min-width: 0;` on `.container`.
  - Added `word-break: break-word` on long text and top disclaimer strip in `Header.js`.
  - Automated CDP testing verified zero overflow (`scrollWidth === innerWidth`) at 320px, 360px, 375px, 390px, 412px, 430px, and desktop 1280px.

## [1.3.0] - 2026-10-24
### Changed & Removed
- **Removed Admin Panel from Public Citizen Portal**:
  - Completely detached administrative dashboard and modal (`renderAdminPanel`, `initAdminPanelEvents`) from `src/main.js`.
  - Removed admin staff trigger lock button (`#btn-open-admin`) from header.
  - Reduced production bundle size from 268 kB to 194 kB (~74 kB saving).
- **Candidate Photo in High-Quality SVG Format**:
  - Converted and embedded candidate photograph into self-contained vector SVG assets (`public/kapil-mehta.svg`, `public/kapil-mehta-namaste.svg`, `public/candidate-avatar.svg`).
  - Added royal Rajasthani circular and rectangular gradient frames (maroon `#800020`, saffron gold `#d97706`).
  - Updated candidate configuration and hero/profile components to use `.svg` photos with zero degradation on retina/high-DPI screens.
- **Universal Multi-Device Responsiveness**:
  - Added specific media queries for extra small mobile (320px–360px), standard mobile (up to 480px), foldables/tablets (481px–767px), portrait tablets (768px–1023px), and large screens (1024px+).
  - Mobile full-width CTAs with 46px touch targets for seamless grievance lodging and tracking.
  - Safe-area bottom padding for iOS notch and home bars.
  - 16px font on inputs to prevent iOS Safari auto-zoom.
  - Responsive modals with bottom-sheet appearance on mobile.
- **Sticky Scroll WhatsApp & Phone Call Floating Buttons (FAB)**:
  - Added persistent floating contact buttons dock (`src/components/FloatingActions.js`) that stays accessible as citizens scroll through the website.
  - Instant one-tap WhatsApp chat with pre-filled greeting message.
  - Direct telephone call trigger with candidate's contact number.
  - WhatsApp subtle pulse micro-animation and smooth hover lift effects.
  - Adaptive layout: expanded pill on desktop, thumb-friendly circular buttons on mobile without obstructing the mobile navigation bar.

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
- **Decoupled Supabase**:
  - Removed `@supabase/supabase-js` runtime dependency, reducing bundle footprint.
  - Removed `src/services/supabase.js` and `supabase/` database migrations directory.
  - Cleaned up environment variables and service worker references.

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
