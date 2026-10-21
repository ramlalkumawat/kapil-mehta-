/**
 * Hero Component
 * Displays candidate identity, Panchayat jurisdiction, verified badge,
 * quick direct contact buttons (Call/WhatsApp), and emergency contacts bar.
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

// SVG Placeholder Avatar for rural representative
function getCandidateAvatarSvg() {
  return `
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%;">
      <rect width="120" height="120" fill="#e8f5e9" />
      <!-- Traditional Pagri / Turban styling silhouette for Rajasthan leadership -->
      <path d="M30 42C30 28 42 18 60 18C78 18 90 28 90 42C90 46 88 50 84 53C80 50 72 48 60 48C48 48 40 50 36 53C32 50 30 46 30 42Z" fill="#d97706" />
      <path d="M35 34C42 26 52 22 60 22C68 22 78 26 85 34C81 37 72 38 60 38C48 38 39 37 35 34Z" fill="#b45309" />
      <!-- Face -->
      <circle cx="60" cy="58" r="22" fill="#ffedd5" />
      <!-- Eyes & Tilak -->
      <circle cx="52" cy="54" r="2.5" fill="#374151" />
      <circle cx="68" cy="54" r="2.5" fill="#374151" />
      <path d="M59 44H61V52H59V44Z" fill="#dc2626" />
      <!-- Smile / Mustache -->
      <path d="M48 64C52 68 56 69 60 69C64 69 68 68 72 64C70 63 65 62 60 62C55 62 50 63 48 64Z" fill="#1f2937" />
      <!-- Kurta / Dress -->
      <path d="M22 110C22 92 36 82 60 82C84 82 98 92 98 110V120H22V110Z" fill="#1b4332" />
      <path d="M52 82L60 96L68 82H52Z" fill="#ffffff" />
    </svg>
  `;
}

export function renderHero() {
  const name = getLocalized(activeCandidate.name);
  const designation = getLocalized(activeCandidate.designation);
  const panchayat = getLocalized(activeCandidate.panchayatName);
  const village = getLocalized(activeCandidate.village);
  const tehsil = getLocalized(activeCandidate.tehsil);
  const district = getLocalized(activeCandidate.district);
  const state = getLocalized(activeCandidate.state);
  const tagline = getLocalized(activeCandidate.tagline);
  const phone = activeCandidate.contact?.phone || '+91-9876543210';
  const whatsappNum = activeCandidate.contact?.whatsapp || '919876543210';
  const photo = activeCandidate.photo;

  return `
    <section id="home" class="container" style="padding-top: var(--space-4);">
      <div class="hero-card">
        <div class="hero-grid">
          <!-- Candidate Photograph / Avatar -->
          <div class="hero-avatar-wrapper">
            <div class="hero-avatar" aria-label="${name}">
              ${photo ? `<img src="${photo}" alt="${name}" loading="eager" />` : getCandidateAvatarSvg()}
            </div>
          </div>

          <!-- Hero Details -->
          <div class="hero-content">
            <div class="hero-badge-row">
              <span class="badge badge-success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                ${t('hero.verifiedBadge')}
              </span>
              <span class="badge badge-primary">${designation}</span>
            </div>

            <h1 class="hero-name">${name}</h1>

            <div class="hero-panchayat-meta">
              <strong>${panchayat}</strong> • ${village ? `${village}, ` : ''}${tehsil ? `${tehsil}, ` : ''}${district} (${state})
            </div>

            <p class="hero-tagline">“${tagline}”</p>

            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-top: var(--space-1);">
              ${t('hero.connectPrompt')}
            </p>

            <!-- Quick Action Buttons -->
            <div class="hero-actions-row">
              <button id="btn-open-complaint-modal" class="btn btn-primary" aria-haspopup="dialog">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                ${t('actions.lodgeComplaint')}
              </button>

              <button id="btn-open-track-modal" class="btn btn-secondary" aria-haspopup="dialog">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                ${t('actions.trackComplaint')}
              </button>

              <a href="https://wa.me/${whatsappNum}?text=${encodeURIComponent(`नमस्ते, मैं ग्राम पंचायत ${panchayat} का निवासी हूं।`)}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp" aria-label="${t('actions.whatsappMessage')}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                </svg>
                ${t('actions.whatsappMessage')}
              </a>

              <a href="tel:${phone.replace(/[^0-9+]/g, '')}" class="btn btn-outline" aria-label="${t('actions.callNow')}">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                ${t('actions.callNow')}
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Emergency Numbers Strip -->
      <div class="helpline-strip">
        <div style="display: flex; align-items: center; gap: var(--space-2); font-weight: 600; font-size: var(--font-size-xs); color: var(--color-primary-dark);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span>${t('hero.urgentEmergency')}:</span>
        </div>

        <div class="helpline-items">
          ${(activeCandidate.emergencyNumbers || []).slice(0, 4).map(e => `
            <a href="tel:${e.number.split('/')[0].trim()}" class="helpline-item">
              <span>${getLocalized(e.name)}:</span>
              <span class="helpline-num">${e.number}</span>
            </a>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
