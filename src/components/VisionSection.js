/**
 * Vision & Development Priorities Component
 * Outlines long-term vision, mission, and the 6 core development pillars.
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

// Get thematic SVG icons for village development pillars
function getPriorityIcon(type) {
  switch (type) {
    case 'water':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>`;
    case 'road':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="22" height="18" rx="2"></rect><line x1="8" y1="3" x2="8" y2="21"></line><line x1="16" y1="3" x2="16" y2="21"></line></svg>`;
    case 'light':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line></svg>`;
    case 'education':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
    case 'health':
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`;
    case 'clean':
    default:
      return `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
  }
}

export function renderVisionSection() {
  const vision = getLocalized(activeCandidate.vision);
  const mission = getLocalized(activeCandidate.mission);
  const priorities = activeCandidate.priorities || [];

  return `
    <section id="vision" class="section container">
      <div class="section-header">
        <span class="section-tag">${t('nav.vision')}</span>
        <h2 class="section-title">${t('vision.title')}</h2>
        <p class="section-subtitle">${t('vision.subtitle')}</p>
      </div>

      <!-- Vision & Mission Banner -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--space-6); margin-bottom: var(--space-8);">
        <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); border-top: 4px solid var(--color-primary); box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 14 14"></polyline>
            </svg>
            <h3 style="font-size: var(--font-size-base); color: var(--color-primary-dark);">
              ${t('vision.visionHeading')}
            </h3>
          </div>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-main); line-height: 1.6;">
            ${vision}
          </p>
        </div>

        <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); border-top: 4px solid var(--color-accent); box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <h3 style="font-size: var(--font-size-base); color: var(--color-primary-dark);">
              ${t('vision.missionHeading')}
            </h3>
          </div>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-main); line-height: 1.6;">
            ${mission}
          </p>
        </div>
      </div>

      <!-- Core Priorities Grid -->
      <div>
        <h3 style="font-size: var(--font-size-lg); color: var(--color-primary-dark); margin-bottom: var(--space-4);">
          ${t('vision.prioritiesHeading')}
        </h3>

        <div class="priorities-grid">
          ${priorities.map(p => `
            <div class="priority-card">
              <div class="priority-icon">
                ${getPriorityIcon(p.icon)}
              </div>
              <div>
                <h4 style="font-size: var(--font-size-base); color: var(--color-primary-dark); margin-bottom: var(--space-1);">
                  ${getLocalized(p.title)}
                </h4>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0; line-height: 1.5;">
                  ${getLocalized(p.description)}
                </p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
