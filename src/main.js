/**
 * Sarpanch Setu — Main Application Entry Point
 * Orchestrates component rendering, dynamic candidate theme injection,
 * and reactive bilingual localization.
 */

import { onLanguageChange, getLocalized } from './locales/i18n.js';
import activeCandidate from '../config/active-candidate.js';

// Import Stylesheets for Vite Bundling & HMR
import './styles/variables.css';
import './styles/base.css';
import './styles/components.css';
import './styles/animations.css';

// Import Components
import { renderHeader, initHeaderEvents } from './components/Header.js';
import { renderBottomNav, initBottomNavEvents } from './components/BottomNav.js';
import { renderHero } from './components/Hero.js';
import { renderCitizenServices, initCitizenServicesEvents } from './components/CitizenServices.js';
import { renderProfileSection } from './components/ProfileSection.js';
import { renderWorksSection, initWorksEvents } from './components/WorksSection.js';
import { renderVisionSection } from './components/VisionSection.js';
import { renderGallerySection, initGalleryEvents } from './components/GallerySection.js';
import { renderSchemesSection, initSchemesEvents } from './components/SchemesSection.js';
import { renderAnnouncementsSection } from './components/AnnouncementsSection.js';
import { renderComplaintModal, initComplaintModalEvents } from './components/ComplaintModal.js';
import { renderComplaintTracker, initComplaintTrackerEvents } from './components/ComplaintTracker.js';
import { renderFloatingActions, initFloatingActionsEvents } from './components/FloatingActions.js';
import { renderFooter } from './components/Footer.js';

// Apply candidate custom theme colors if specified
function applyCandidateTheme() {
  const root = document.documentElement;
  if (activeCandidate.theme) {
    if (activeCandidate.theme.primaryColor) {
      root.style.setProperty('--color-primary', activeCandidate.theme.primaryColor);
    }
    if (activeCandidate.theme.accentColor) {
      root.style.setProperty('--color-accent', activeCandidate.theme.accentColor);
    }
    if (activeCandidate.theme.surfaceColor) {
      root.style.setProperty('--color-surface-subtle', activeCandidate.theme.surfaceColor);
    }
  }

  // Update document title dynamically
  const candidateName = getLocalized(activeCandidate.name);
  const panchayat = getLocalized(activeCandidate.panchayatName);
  document.title = `${candidateName} • ${panchayat} — कपिल मेहता (Kapil Mehta)`;
}

// Assemble full application markup
function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  applyCandidateTheme();

  appContainer.innerHTML = `
    <!-- Topbar -->
    ${renderHeader()}

    <!-- Main Content Area -->
    <main id="main-content" role="main">
      ${renderHero()}
      ${renderCitizenServices()}
      ${renderProfileSection()}
      ${renderWorksSection()}
      ${renderVisionSection()}
      ${renderGallerySection()}
      ${renderSchemesSection()}
      ${renderAnnouncementsSection()}
    </main>

    <!-- Footer -->
    ${renderFooter()}

    <!-- Mobile Bottom Navigation -->
    ${renderBottomNav()}

    <!-- Floating Scroll WhatsApp & Call Buttons (FAB) -->
    ${renderFloatingActions()}

    <!-- Modals & Overlays -->
    ${renderComplaintModal()}
    ${renderComplaintTracker()}
  `;

  // Initialize interactive event listeners
  initHeaderEvents();
  initBottomNavEvents();
  initCitizenServicesEvents();
  initWorksEvents();
  initGalleryEvents();
  initSchemesEvents();
  initComplaintModalEvents();
  initComplaintTrackerEvents();
  initFloatingActionsEvents();
}

// Initial mount
function init() {
  renderApp();

  // Re-render automatically on language switch
  onLanguageChange(() => {
    renderApp();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
