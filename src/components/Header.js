/**
 * Header Component
 * Sticky topbar with Gram Panchayat branding, navigation links,
 * language toggle button, and administrative portal trigger.
 */

import { t, toggleLanguage, getCurrentLang, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderHeader() {
  const currentLang = getCurrentLang();
  const panchayatTitle = getLocalized(activeCandidate.panchayatName);
  const candidateName = getLocalized(activeCandidate.name);
  const designation = getLocalized(activeCandidate.designation);

  const editionName = activeCandidate.editionName ? getLocalized(activeCandidate.editionName) : t('appName');

  return `
    <header class="site-header" role="banner">
      <!-- Topmost Statutory Disclaimer Strip -->
      <div style="background-color: var(--color-primary-dark); color: #fef3c7; font-size: 0.72rem; padding: 4px 12px; text-align: center; font-weight: 500;">
        <span>${t('governmentDisclaimerBadge')} | ${candidateName} • ${panchayatTitle}, ${getLocalized(activeCandidate.district)}</span>
      </div>

      <div class="container header-inner">
        <!-- Brand Emblem & Title -->
        <a href="#home" class="brand-wrapper" aria-label="${editionName}">
          <div class="brand-emblem" aria-hidden="true" style="background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark)); color: #fff;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <div class="brand-info">
            <span class="brand-name">${editionName}</span>
            <span class="brand-panchayat">${panchayatTitle} • ${designation}</span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="header-nav" aria-label="Main Navigation">
          <a href="#home" class="nav-link active">${t('nav.home')}</a>
          <a href="#profile" class="nav-link">${t('nav.profile')}</a>
          <a href="#works" class="nav-link">${t('nav.works')}</a>
          <a href="#vision" class="nav-link">${t('nav.vision')}</a>
          <a href="#services" class="nav-link">${t('nav.services')}</a>
          <a href="#schemes" class="nav-link">${t('nav.schemes')}</a>
          <a href="#announcements" class="nav-link">${t('nav.announcements')}</a>
        </nav>

        <!-- Header Actions: Lang Switcher -->
        <div class="header-actions">
          <button id="btn-lang-toggle" class="btn-lang-toggle" aria-label="Switch Language / भाषा बदलें" title="Switch Language">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <span>${currentLang === 'hi' ? 'English' : 'हिन्दी'}</span>
          </button>
        </div>
      </div>
    </header>
  `;
}

export function initHeaderEvents() {
  const langBtn = document.getElementById('btn-lang-toggle');
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      toggleLanguage();
    });
  }

  // Active link highlighters on scroll
  const navLinks = document.querySelectorAll('.header-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}
