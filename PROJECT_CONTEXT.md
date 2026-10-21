# PROJECT CONTEXT — SARPANCH SETU (सरपंच सेतु)

## 1. Project Purpose
Sarpanch Setu is a production-oriented, ultra-lightweight, responsive, bilingual (Hindi/English) Progressive Web Application (PWA) tailored for Gram Panchayat Sarpanch candidates and elected Sarpanches in Rajasthan, India. It empowers candidates to present verified credentials and vision, while providing rural residents with an accessible, privacy-preserving interface to lodge complaints, track redressal, inspect public works, access verified government welfare schemes, and view Panchayat announcements.

## 2. Reusable Multi-Candidate Architecture
The application is structured around a single master codebase customized entirely via candidate configuration modules located in `config/candidates/*.js`. 
- `config/schema.js`: Validates all required candidate fields and normalizes optional fields with safe defaults.
- `config/candidates/default.js`: Baseline candidate template with explicit placeholder markers.
- `config/candidates/candidate-001.js`: Rameshwar Lal Choudhary (Gram Panchayat Bagru Khurd, Sanganer, Jaipur).
- `config/candidates/candidate-002.js`: Sunita Meena (Gram Panchayat Kolyari, Jhadol, Udaipur).
- `config/active-candidate.js`: Dynamically resolves the active candidate profile based on `VITE_CANDIDATE_ID`.
- `scripts/switch-candidate.js`: Utility to switch active candidate configuration via CLI.
- `scripts/validate-candidates.js`: Automated validator testing every candidate file.

## 3. Technology Stack & Design System
- **Core**: HTML5, Vanilla CSS3 (Custom design system tokens), Vanilla JavaScript (ES Modules). Zero UI library overhead.
- **Build Tooling**: Vite 6.
- **Color Tokens**: Rajasthan Forest Green (`#1b4332`), Warm Ochre Gold (`#d97706`), Soft Cream (`#f8f6f0`), Pure White (`#ffffff`), Charcoal Text (`#1f2937`).
- **Typography**: Google Font `Mukta` with Devanagari system fallback stack for clean Hindi rendering.
- **PWA**: Web App Manifest (`manifest.webmanifest`), Service Worker (`sw.js`) with cache-first static strategy, network-only mutation strategy, and standalone offline fallback page (`offline.html`).

## 4. Grievance Redressal & Security Architecture
- **Submission**: Collects only necessary data (Name, Phone, Category, Ward/Locality, Description, Consent, optional photo under 5MB). Strictly excludes sensitive personal financial identifiers (Aadhaar, bank account numbers).
- **Spam Protection**: Invisible honeypot field (`_honeypot`) traps and rejects automated bot submissions.
- **Tracking Reference**: Cryptographically random, non-sequential alphanumeric codes (e.g. `SETU-RJ-XXXXXX`).
- **Privacy Shield**: Status queries require two factors: the Tracking Code AND the last 4 digits of the registered mobile number. Personal phone numbers and citizen names are never returned in public lookup responses.
- **Backend & Database**:
  - `supabase/migrations/001_sarpanch_setu_schema.sql`: Full PostgreSQL migration featuring Row Level Security (RLS) denying public table enumeration, audit history in `complaint_updates`, and security-definer RPC functions (`submit_complaint`, `track_complaint`, `update_complaint_status`).
  - Graceful local simulated storage fallback for instant offline/local evaluation prior to live Supabase credential provisioning.

## 5. Automated Verification Results
- **Candidate Validation**: `npm run validate` passed with zero errors for all candidates.
- **Automated Tests**: `npm test` executed 29 tests across schemas, i18n key parity, validation rules, honeypot traps, entropy checks, privacy lookup, and status workflows — **29/29 Passed**.
- **Production Build**: `npm run build` completed successfully in 1.59s with zero bundle errors.

## 6. Environment Variables
- `VITE_CANDIDATE_ID`: Target candidate configuration ID (e.g. `candidate-001`).
- `VITE_SUPABASE_URL`: Supabase project URL.
- `VITE_SUPABASE_ANON_KEY`: Supabase anon public key.
- `VITE_ADMIN_ACCESS_PIN`: Staff portal security PIN (default: `sarpanch789`).
