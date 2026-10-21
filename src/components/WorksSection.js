/**
 * Works Section Component
 * Transparent display of completed, ongoing, and proposed public works.
 * Clearly separates campaign promises from verified completed works.
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderWorksSection() {
  const completed = activeCandidate.completedWorks || [];
  const ongoing = activeCandidate.ongoingWorks || [];
  const proposed = activeCandidate.proposedWorks || [];

  return `
    <section id="works" class="section container">
      <div class="section-header">
        <span class="section-tag">${t('nav.works')}</span>
        <h2 class="section-title">${t('works.title')}</h2>
        <p class="section-subtitle">${t('works.subtitle')}</p>
      </div>

      <!-- Filter Tabs -->
      <div class="tabs-header" role="tablist">
        <button class="tab-btn active" data-filter="all" role="tab" aria-selected="true">
          ${t('works.tabs.all')} (${completed.length + ongoing.length + proposed.length})
        </button>
        <button class="tab-btn" data-filter="completed" role="tab" aria-selected="false">
          ${t('works.tabs.completed')} (${completed.length})
        </button>
        <button class="tab-btn" data-filter="ongoing" role="tab" aria-selected="false">
          ${t('works.tabs.ongoing')} (${ongoing.length})
        </button>
        <button class="tab-btn" data-filter="proposed" role="tab" aria-selected="false">
          ${t('works.tabs.proposed')} (${proposed.length})
        </button>
      </div>

      <!-- Notice for Proposed Works -->
      <div id="proposed-notice-banner" style="background-color: var(--color-warning-bg); border-left: 4px solid var(--color-warning); padding: var(--space-3) var(--space-4); border-radius: var(--radius-sm); margin-bottom: var(--space-6); font-size: var(--font-size-xs); color: #78350f;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        ${t('works.proposedNotice')}
      </div>

      <!-- Works Cards Grid -->
      <div class="works-grid" id="works-container">
        <!-- Render Completed Works -->
        ${completed.map(w => `
          <div class="work-card" data-category="completed">
            <div>
              <div class="work-header">
                <h4 class="work-title">${getLocalized(w.title)}</h4>
                <span class="badge badge-success">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  ${t('works.tabs.completed')}
                </span>
              </div>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-2);">
                ${getLocalized(w.description)}
              </p>
            </div>

            <div class="work-meta">
              ${w.location ? `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span><strong>${t('works.locationLabel')}:</strong> ${getLocalized(w.location)}</span>
                </div>
              ` : ''}
              
              ${w.period ? `
                <div style="display: flex; align-items: center; gap: 4px;">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span><strong>${t('works.periodLabel')}:</strong> ${w.period}</span>
                </div>
              ` : ''}

              ${w.source ? `
                <div style="display: flex; align-items: center; gap: 4px; color: var(--color-primary);">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <span><strong>${t('works.sourceLabel')}:</strong> ${getLocalized(w.source)}</span>
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}

        <!-- Render Ongoing Works -->
        ${ongoing.map(w => `
          <div class="work-card" data-category="ongoing">
            <div>
              <div class="work-header">
                <h4 class="work-title">${getLocalized(w.title)}</h4>
                <span class="badge badge-warning">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  ${t('works.tabs.ongoing')}
                </span>
              </div>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-2);">
                ${getLocalized(w.description)}
              </p>
            </div>

            <div class="work-meta">
              ${w.location ? `
                <div><strong>${t('works.locationLabel')}:</strong> ${getLocalized(w.location)}</div>
              ` : ''}
              ${w.period ? `
                <div><strong>${t('works.periodLabel')}:</strong> ${w.period}</div>
              ` : ''}
            </div>
          </div>
        `).join('')}

        <!-- Render Proposed Works -->
        ${proposed.map(w => `
          <div class="work-card" data-category="proposed" style="border-left: 4px solid var(--color-info);">
            <div>
              <div class="work-header">
                <h4 class="work-title">${getLocalized(w.title)}</h4>
                <span class="badge badge-info">
                  ${t('works.tabs.proposed')}
                </span>
              </div>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-2);">
                ${getLocalized(w.description)}
              </p>
            </div>

            <div class="work-meta">
              ${w.priority ? `
                <div><strong>${t('works.priorityLabel')}:</strong> ${w.priority}</div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

export function initWorksEvents() {
  const tabBtns = document.querySelectorAll('.tab-btn[data-filter]');
  const cards = document.querySelectorAll('.work-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}
