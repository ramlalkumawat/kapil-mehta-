/**
 * Citizen Services Hub Component
 * One-touch shortcuts to grievance submission, tracking, schemes, and notices.
 */

import { t } from '../locales/i18n.js';

export function renderCitizenServices() {
  return `
    <section id="services" class="section container" style="background-color: var(--color-surface-subtle); border-radius: var(--radius-xl); padding-top: var(--space-8); padding-bottom: var(--space-8); margin-top: var(--space-6); margin-bottom: var(--space-6); border: 1px solid var(--color-border);">
      <div class="section-header" style="text-align: center; margin-bottom: var(--space-8);">
        <span class="section-tag">${t('nav.services')}</span>
        <h2 class="section-title" style="text-align: center;">${t('services.title')}</h2>
        <p class="section-subtitle" style="margin-left: auto; margin-right: auto; text-align: center;">${t('services.subtitle')}</p>
      </div>

      <div class="services-grid">
        <!-- 1. Lodge Grievance -->
        <div id="service-card-lodge" class="service-card">
          <div>
            <div class="service-icon-box" style="background-color: #fee2e2; color: #dc2626;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </div>
            <h3 class="service-title" style="margin-top: var(--space-3);">${t('services.lodgeCardTitle')}</h3>
            <p class="service-desc">${t('services.lodgeCardDesc')}</p>
          </div>
          <button class="btn btn-sm btn-primary" style="width: 100%;">
            ${t('actions.lodgeComplaint')}
          </button>
        </div>

        <!-- 2. Track Grievance -->
        <div id="service-card-track" class="service-card">
          <div>
            <div class="service-icon-box" style="background-color: #e0f2fe; color: #0284c7;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <h3 class="service-title" style="margin-top: var(--space-3);">${t('services.trackCardTitle')}</h3>
            <p class="service-desc">${t('services.trackCardDesc')}</p>
          </div>
          <button class="btn btn-sm btn-secondary" style="width: 100%;">
            ${t('actions.trackComplaint')}
          </button>
        </div>

        <!-- 3. Government Schemes -->
        <a href="#schemes" class="service-card" style="text-decoration: none;">
          <div>
            <div class="service-icon-box" style="background-color: #fef3c7; color: #d97706;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <h3 class="service-title" style="margin-top: var(--space-3);">${t('services.schemesCardTitle')}</h3>
            <p class="service-desc">${t('services.schemesCardDesc')}</p>
          </div>
          <span class="btn btn-sm btn-outline" style="width: 100%;">
            ${t('actions.readMore')}
          </span>
        </a>

        <!-- 4. Gram Sabha Announcements -->
        <a href="#announcements" class="service-card" style="text-decoration: none;">
          <div>
            <div class="service-icon-box" style="background-color: #dcfce7; color: #16a34a;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
            </div>
            <h3 class="service-title" style="margin-top: var(--space-3);">${t('services.announcementsCardTitle')}</h3>
            <p class="service-desc">${t('services.announcementsCardDesc')}</p>
          </div>
          <span class="btn btn-sm btn-outline" style="width: 100%;">
            ${t('actions.viewAnnouncements')}
          </span>
        </a>
      </div>
    </section>
  `;
}

export function initCitizenServicesEvents() {
  const cardLodge = document.getElementById('service-card-lodge');
  if (cardLodge) {
    cardLodge.addEventListener('click', () => {
      const trigger = document.getElementById('btn-open-complaint-modal');
      if (trigger) trigger.click();
    });
  }

  const cardTrack = document.getElementById('service-card-track');
  if (cardTrack) {
    cardTrack.addEventListener('click', () => {
      const trigger = document.getElementById('btn-open-track-modal');
      if (trigger) trigger.click();
    });
  }
}
