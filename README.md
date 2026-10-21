# Sarpanch Setu (सरपंच सेतु)
### Lightweight Bilingual Candidate & Gram Panchayat Citizen Services Web Application / PWA

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-29%2F29%20passed-brightgreen.svg)]()
[![Region](https://img.shields.io/badge/region-Rajasthan%20(India)-darkgreen.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)]()

**Sarpanch Setu** is an ultra-lightweight, high-performance, mobile-first, bilingual (Hindi & English) Progressive Web Application (PWA) built specifically for Gram Panchayat Sarpanch candidates and elected Sarpanches in Rajasthan, India.

It is designed with a **reusable master architecture**, allowing multiple candidates to have completely branded, isolated deployments generated from candidate configuration files (`config/candidates/*.js`) without code alteration or data cross-contamination.

---

## 🌟 Key Features

1. **Candidate Identity & Verified Governance**:
   - High-fidelity candidate card, photo/avatar, designation, and Gram Panchayat jurisdiction (Village, Tehsil, District, State).
   - Candidate biography, educational qualifications, leadership history, and verified community contributions.
   - Long-term Vision & Mission statement.
   - 6 Core Development Pillars (Drinking Water, Roads & Drainage, Solar Lighting, Education & Library, Primary Health & Medicine, Sanitation & Solid Waste).

2. **Transparent Development Works Portfolio**:
   - Filterable view: **Completed (Verified)**, **Ongoing (In Progress)**, and **Proposed Workplan**.
   - Clear statutory badges distinguishing campaign promises from completed public works with official verification source records.

3. **Secure Citizen Grievance Redressal System**:
   - Accessible complaint registration form with category selector, ward/locality, description, optional photo attachment, and citizen consent checkbox.
   - Anti-spam honeypot protection.
   - Cryptographically random non-sequential tracking ID generation (e.g. `SETU-RJ-XXXXXX`).
   - 2-factor privacy-preserving tracking query (requires both Tracking ID + registered mobile last 4 digits).
   - Step-by-step progress timeline: `Submitted` ➔ `Under Review` ➔ `In Progress` ➔ `Resolved` ➔ `Closed`.
   - Never exposes citizen phone numbers, full names, or third-party complaint records.

4. **Verified Government Welfare Schemes & Document Checklists**:
   - Curated directory of key schemes: PMAY-G, Jal Jeevan Mission, MGNREGA, PM-KUSUM Solar Pumps, MAAY Rajasthan Healthcare, and Palanhar Yojana.
   - Eligibility rules, required document checklists, and direct official portal links.
   - Prominent statutory disclaimers clarifying that this platform is an independent facilitation tool and not an official government portal.

5. **Full Hindi (Default) & English Localization**:
   - Instant language switch toggle in header.
   - Centralized translation dictionaries (`src/locales/hi.js` and `src/locales/en.js`) with 100% key parity.
   - Persistent language preference in `localStorage`.

6. **Authorized Staff / Sarpanch Management Portal**:
   - PIN-protected status update portal.
   - Allows Sarpanches and Panchayat secretaries to review grievances, update resolution statuses, and append public notes visible to citizens.

7. **Progressive Web App (PWA) & Safe Offline Caching**:
   - Web App Manifest (`manifest.webmanifest`) and Service Worker (`sw.js`).
   - Cache-first strategy for static assets.
   - Graceful offline fallback page (`offline.html`) with emergency dialer directory.
   - Never caches private or authenticated complaint submission requests.

---

## 🏗️ Architecture & Candidate Customization

### Directory Structure

```
sarpanch/
├── config/
│   ├── schema.js                 # Validation schema and normalizer
│   ├── active-candidate.js       # Active candidate profile resolver
│   └── candidates/
│       ├── default.js            # Starter template with clear placeholder tags
│       ├── candidate-001.js      # Rameshwar Lal Choudhary (Bagru Khurd, Jaipur)
│       └── candidate-002.js      # Sunita Meena (Kolyari, Udaipur)
├── src/
│   ├── main.js                   # Application bootstrap and router
│   ├── styles/                   # Design system (variables, base, components, animations)
│   ├── locales/                  # Bilingual translation dictionaries (hi, en, i18n controller)
│   ├── services/                 # Supabase client, complaint service, scheme service
│   └── components/               # Header, BottomNav, Hero, Profile, Works, Services, etc.
├── scripts/
│   ├── validate-candidates.js    # CLI validator for all candidate configuration files
│   ├── switch-candidate.js       # CLI tool to switch active candidate in .env
│   └── run-tests.js              # Comprehensive automated test suite
├── supabase/
│   └── migrations/
│       └── 001_sarpanch_setu_schema.sql # PostgreSQL schema, RLS policies, RPC functions
├── public/                       # PWA icons, manifest, service worker, offline fallback
├── index.html                    # Single page HTML shell
└── package.json                  # NPM dependencies & scripts
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Installation
```bash
git clone <repository-url>
cd sarpanch
npm install
```

### 2. Environment Setup
Copy the blueprint `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your `.env` variables:
```ini
# Active candidate configuration file identifier (in config/candidates/<id>.js)
VITE_CANDIDATE_ID=candidate-001

# Supabase Backend (Optional for local testing / demo mode)
# If left blank, the app runs in safe local simulated storage mode
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Demonstration Staff Portal Access PIN
VITE_ADMIN_ACCESS_PIN=sarpanch789
```

### 3. Local Development Server
Start the development server with live reload:
```bash
npm run dev
```
Open your browser at `http://localhost:3000/`.

### 4. Running Automated Tests & Validation
Run the test suite verifying schemas, translations, complaint logic, and anti-spam protection:
```bash
npm test
```
Validate all candidate configurations against the official schema:
```bash
npm run validate
```

### 5. Production Build & Preview
Generate the production bundle:
```bash
npm run build
```
Preview the built application locally:
```bash
npm run preview
```

---

## 👥 How to Add a New Candidate

1. **Create Configuration**:
   Copy `config/candidates/default.js` to `config/candidates/candidate-003.js`:
   ```bash
   cp config/candidates/default.js config/candidates/candidate-003.js
   ```

2. **Customize Content**:
   Update `candidate-003.js` with the candidate's real information:
   - Full name, designation, and Gram Panchayat jurisdiction in Hindi and English.
   - Real photograph (or leave `null` for the clean rural leader SVG avatar).
   - Verified biography, education, and community social work.
   - Development works divided into `completedWorks`, `ongoingWorks`, and `proposedWorks`.
   - Contact phone and WhatsApp number.
   - Custom theme colors (primary green, accent gold).

3. **Register in `config/active-candidate.js`**:
   Import `candidate-003.js` and add `'candidate-003'` to `candidateRegistry`.

4. **Validate**:
   ```bash
   npm run validate
   ```

5. **Switch and Build**:
   ```bash
   node scripts/switch-candidate.js candidate-003
   npm run build
   ```

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Create a new project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire contents of `supabase/migrations/001_sarpanch_setu_schema.sql`.
4. Copy your project URL and `anon` public key to `.env`.
5. The application will automatically connect to live PostgreSQL tables with strict Row Level Security (RLS) policies and security-definer RPC functions enabled.

---

## 🚢 Deployment (Vercel / Cloudflare Pages)

Because Sarpanch Setu compiles to static HTML, CSS, and vanilla ES modules:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Set `VITE_CANDIDATE_ID`, `VITE_SUPABASE_URL`, and `VITE_SUPABASE_ANON_KEY` in your hosting dashboard.

---

## 🛡️ Privacy & Statutory Disclaimers

- **No Sensitive Data**: The platform never requests, stores, or processes Aadhaar numbers, PAN, bank account numbers, or OTPs.
- **Privacy Shield**: Public grievance tracking requires both the non-sequential tracking ID and the registered mobile number's last 4 digits. Full names, telephone numbers, and internal IDs are never exposed in tracking queries.
- **Non-Government Status**: This application is an independent citizen engagement and grievance facilitation platform. It is not an official portal of the Government of India or the Government of Rajasthan.

---

## 📄 License
This project is open-source and distributed under the [MIT License](LICENSE).
