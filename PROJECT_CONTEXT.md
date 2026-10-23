# PROJECT CONTEXT — SARPANCH SETU (सरपंच सेतु)

## 1. Project Purpose
Sarpanch Setu is a production-oriented, ultra-lightweight, responsive, bilingual (Hindi/English) Progressive Web Application (PWA) tailored for Gram Panchayat Sarpanch candidates and elected Sarpanches in Rajasthan, India. It empowers candidates to present verified credentials and vision, while providing rural residents with an accessible, privacy-preserving interface to lodge complaints, track redressal, inspect public works, access verified government welfare schemes, and view Panchayat announcements.

## 2. Reusable Multi-Candidate Architecture
The application is structured around a single master codebase customized entirely via candidate configuration modules located in `config/candidates/*.js`. 
- `config/schema.js`: Validates all required candidate fields and normalizes optional fields (wardNumber, gramPanchayats, personalDetails, educationTimeline, politicalJourney, editionName) with safe defaults.
- `config/candidates/candidate-kapil-mehta.js`: Active candidate edition for Kapil Mehta (District Council / Zila Parishad Ward No. 22, Jhalawar, Rajasthan) configuring 7 Gram Panchayats: Akodiya, Sarkhandiya, Panwad, Bishan Khedi, Pakhrana, Layphal, and Harigarh.
- `config/candidates/default.js`: Baseline candidate template with explicit placeholder markers.
- `config/candidates/candidate-001.js`: Rameshwar Lal Choudhary (Gram Panchayat Bagru Khurd, Sanganer, Jaipur).
- `config/candidates/candidate-002.js`: Sunita Meena (Gram Panchayat Kolyari, Jhadol, Udaipur).
- `config/active-candidate.js`: Dynamically resolves the active candidate profile based on `VITE_CANDIDATE_ID` (default: `candidate-kapil-mehta`).
- `scripts/switch-candidate.js`: Utility to switch active candidate configuration via CLI.
- `scripts/validate-candidates.js`: Automated validator testing every candidate file.

## 3. Technology Stack & Design System
- **Core**: HTML5, Vanilla CSS3 (Custom design system tokens), Vanilla JavaScript (ES Modules). Zero UI library overhead.
- **Build Tooling**: Vite 6.
- **Color Tokens (Rajasthan Election Palette)**: Dark Maroon Primary (`#800020`), Darker Maroon (`#4c0519`), Light Maroon (`#9f1239`), Warm Saffron Accent (`#d97706`), Off-White Background (`#faf8f5`), Soft Surface (`#f5efe6`), Crisp White (`#ffffff`), Charcoal Text (`#1f2937`).
- **Typography**: Google Font `Mukta` with Devanagari system fallback stack for clean Hindi rendering.
- **PWA**: Web App Manifest (`manifest.webmanifest`), Service Worker (`sw.js`) with cache-first static strategy, network-only mutation strategy, and standalone offline fallback page (`offline.html`).

## 4. Grievance Redressal, Campaign Management & Security Architecture
- **Grievance Redressal**: Collects only necessary data (Name, Phone, Category, Gram Panchayat / Ward, Description, Consent). Strictly excludes sensitive personal financial identifiers (Aadhaar, bank account numbers).
- **Spam Protection**: Invisible honeypot field (`_honeypot`) traps and rejects automated bot submissions.
- **Tracking Reference**: Cryptographically random, non-sequential alphanumeric codes (e.g. `SETU-RJ-XXXXXX`).
- **Privacy Shield**: Status queries require two factors: the Tracking Code AND the last 4 digits of the registered mobile number. Personal phone numbers and citizen names are never returned in public lookup responses.
- **Campaign Management Service (`src/services/campaignService.js`)**:
  - Gram Panchayat & Polling Booth configuration for Ward No. 22.
  - Volunteer management & village/booth assignment.
  - Voter registry with CSV import, CSV export, and name/EPIC search.
  - Door-to-door field survey and visit tracking.
  - Campaign task assignment and follow-up.
  - Candidate photograph upload and management.
  - Strictly query-driven metrics calculation (Zero fake numbers / fabricated totals).
- **Backend & Database**:
  - `supabase/migrations/001_sarpanch_setu_schema.sql`: Complaints schema with RLS and RPC functions.
  - `supabase/migrations/002_campaign_management_schema.sql`: Campaign management schema (GPs, booths, volunteers, voters, field visits, tasks) with strict candidate isolation RLS policies.
  - Local simulated storage engine fallback for offline and local evaluation without live credentials.

## 5. Automated Verification Results
- **Candidate Validation**: `npm run validate` passed with zero errors across all candidate files.
- **Automated Tests**: `npm test` executed 47 tests across schemas, isolation, 7 Gram Panchayats verification, i18n key parity, validation rules, honeypot traps, entropy checks, privacy lookup, status workflows, and campaign management / CSV modules — **47/47 Passed (100%)**.
- **Production Build**: `npm run build` completed successfully in 2.91s with zero bundle errors.

## 6. Environment Variables
- `VITE_CANDIDATE_ID`: Target candidate configuration ID (e.g. `candidate-kapil-mehta`).
- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon public key.
- `VITE_ADMIN_ACCESS_PIN`: Staff portal security PIN (default: `sarpanch789`).
