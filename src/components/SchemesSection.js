/**
 * Government Welfare Schemes Section Component
 * Displays verified welfare schemes with eligibility conditions,
 * required document checklists, and direct official government links.
 */

import { t, getLocalized } from '../locales/i18n.js';
import { governmentSchemes } from '../services/schemeService.js';

export function renderSchemesSection() {
  return `
    <section id="schemes" class="section container">
      <div class="section-header">
        <span class="section-tag">${t('nav.schemes')}</span>
        <h2 class="section-title">${t('schemes.title')}</h2>
        <p class="section-subtitle">${t('schemes.subtitle')}</p>
      </div>

      <!-- Scheme Statutory Notice -->
      <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-left: 4px solid var(--color-primary); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-6); font-size: var(--font-size-xs); color: var(--color-text-muted);">
        <p style="margin: 0;">
          <strong>${t('schemes.officialDisclaimer')}</strong>
        </p>
      </div>

      <!-- Category Filter Tabs -->
      <div class="tabs-header" role="tablist" style="margin-bottom: var(--space-6);">
        <button class="tab-btn active scheme-filter-btn" data-category="all" role="tab">
          ${t('schemes.filterAll')}
        </button>
        <button class="tab-btn scheme-filter-btn" data-category="housing" role="tab">
          ${t('schemes.filterHousing')}
        </button>
        <button class="tab-btn scheme-filter-btn" data-category="water" role="tab">
          ${t('schemes.filterWater')}
        </button>
        <button class="tab-btn scheme-filter-btn" data-category="farmer" role="tab">
          ${t('schemes.filterFarmer')}
        </button>
        <button class="tab-btn scheme-filter-btn" data-category="health" role="tab">
          ${t('schemes.filterHealth')}
        </button>
      </div>

      <!-- Schemes Cards List -->
      <div class="schemes-list" id="schemes-container">
        ${governmentSchemes.map((scheme, idx) => `
          <div class="scheme-card" data-category="${scheme.category}">
            <!-- Header (Always Visible) -->
            <div class="scheme-header" data-toggle-id="scheme-body-${idx}">
              <div>
                <h3 style="font-size: var(--font-size-base); color: var(--color-primary-dark); margin-bottom: 4px;">
                  ${getLocalized(scheme.title)}
                </h3>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
                  ${getLocalized(scheme.shortDesc)}
                </p>
              </div>
              <button class="btn btn-sm btn-outline scheme-toggle-btn" aria-label="Toggle details">
                <span>${t('actions.readMore')}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="scheme-arrow">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>

            <!-- Expandable Details Body -->
            <div id="scheme-body-${idx}" class="scheme-body" style="display: none;">
              <!-- Eligibility -->
              <div>
                <h4 style="font-size: var(--font-size-xs); font-weight: 700; text-transform: uppercase; color: var(--color-primary-dark); margin-bottom: var(--space-2);">
                  📋 ${t('schemes.eligibility')}
                </h4>
                <ul style="padding-left: 20px; font-size: var(--font-size-xs); color: var(--color-text-muted); display: flex; flex-direction: column; gap: 4px;">
                  ${(getLocalized(scheme.eligibility) || []).map(item => `
                    <li>${item}</li>
                  `).join('')}
                </ul>
              </div>

              <!-- Required Documents Checklist -->
              <div style="background-color: var(--color-surface-subtle); border: 1px solid var(--color-border-light); border-radius: var(--radius-md); padding: var(--space-4);">
                <h4 style="font-size: var(--font-size-xs); font-weight: 700; text-transform: uppercase; color: var(--color-primary-dark); margin-bottom: var(--space-2);">
                  📄 ${t('schemes.documentsNeeded')}
                </h4>
                <ul class="doc-checklist">
                  ${(getLocalized(scheme.documents) || []).map(doc => `
                    <li>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span>${doc}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <!-- Application Process -->
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">
                <strong>💡 ${t('schemes.applicationProcess')}:</strong> ${getLocalized(scheme.howToApply)}
              </div>

              <!-- Footer with Official Link & Verification Date -->
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-3); border-top: 1px dashed var(--color-border); padding-top: var(--space-3); margin-top: var(--space-2);">
                <span style="font-size: 0.72rem; color: var(--color-text-light);">
                  ${t('schemes.lastVerified')}: ${scheme.lastVerified}
                </span>

                <a href="${scheme.officialUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary">
                  <span>${t('schemes.officialPortal')}</span>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

export function initSchemesEvents() {
  // Category filter
  const filterBtns = document.querySelectorAll('.scheme-filter-btn');
  const cards = document.querySelectorAll('.scheme-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      cards.forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Accordion toggle
  const headers = document.querySelectorAll('.scheme-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const targetId = header.getAttribute('data-toggle-id');
      const body = document.getElementById(targetId);
      const arrow = header.querySelector('.scheme-arrow');
      const btnSpan = header.querySelector('.scheme-toggle-btn span');

      if (body) {
        const isHidden = body.style.display === 'none';
        body.style.display = isHidden ? 'flex' : 'none';
        if (arrow) {
          arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        }
        if (btnSpan) {
          btnSpan.textContent = isHidden ? t('actions.showLess') : t('actions.readMore');
        }
      }
    });
  });
}
