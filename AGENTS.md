# AGENTS.md — Persistent Development Rules for Sarpanch Setu

This file establishes strict operational guidelines for all AI agents working on **Sarpanch Setu** (सरपंच सेतु).

---

## 1. Core Operating Principles

1. **Inspect Before Modifying**: Always inspect the existing files and directory structure before making changes. Never rewrite from scratch or delete existing working implementations.
2. **Read Project Context**: Read `PROJECT_CONTEXT.md` and `TASKS.md` before starting any task.
3. **No Fabricated Information**:
   - Never invent or fabricate candidate achievements, village statistics, fake testimonials, or unauthorized government scheme details.
   - Never present proposed campaign promises as completed development works.
   - Mark placeholder data clearly with explicit `[PLACEHOLDER]` tags.
4. **Lightweight & High Performance**:
   - Keep the application ultra-lightweight, fast, and accessible for rural Indian contexts (2G/3G/4G connections).
   - Zero unnecessary bloat: use vanilla HTML5/CSS3/JavaScript (ES modules) with a minimal Vite build tooling.
   - No heavy UI framework overhead unless explicitly justified.
5. **Security & Privacy Boundaries**:
   - Never expose administrative keys, service role keys, or database credentials in client-side code.
   - Strict candidate isolation: switching or deploying for one candidate must NEVER leak or mix data with another candidate.
   - Never allow public enumeration of citizen complaints or personal phone numbers.
   - Collect minimal citizen data: strictly forbid collecting Aadhaar numbers, bank details, or unnecessary personal info.
6. **Bilingual Requirement (Hindi & English)**:
   - Hindi is the default language for Rajasthan Gram Panchayats.
   - All navigation, forms, error states, statuses, and citizen guidance must have high-quality, verified translations in both Hindi and English.
   - Centralize all strings in `locales/hi.js` and `locales/en.js`. Avoid hardcoded UI strings.
7. **Verify Before Declaring Success**:
   - Never claim a feature works without checking tests, linting, or running the code.
   - If third-party credentials (like live Supabase) are unconfigured, clearly report it as pending credentials and provide working offline/demo fallbacks without breaking the UI.
8. **Keep Documentation Synchronized**:
   - Update `TASKS.md`, `PROJECT_CONTEXT.md`, and `CHANGELOG.md` upon completing any significant feature.
