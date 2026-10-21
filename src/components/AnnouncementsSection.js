/**
 * Announcements & Gram Sabha Notices Section Component
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderAnnouncementsSection() {
  const notices = activeCandidate.announcements || [];

  if (notices.length === 0) {
    return '';
  }

  return `
    <section id="announcements" class="section container">
      <div class="section-header">
        <span class="section-tag">${t('nav.announcements')}</span>
        <h2 class="section-title">
          ${t('services.announcementsCardTitle')}
        </h2>
        <p class="section-subtitle">
          ${t('services.announcementsCardDesc')}
        </p>
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-4);">
        ${notices.map(notice => {
          const dateStr = notice.date ? new Date(notice.date).toLocaleDateString('hi-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : '';

          return `
            <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-left: 4px solid var(--color-primary); border-radius: var(--radius-lg); padding: var(--space-5); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; justify-content: space-between; gap: var(--space-3);">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-2); margin-bottom: var(--space-2);">
                  <span class="badge badge-primary">
                    ${getLocalized(notice.tag) || 'सार्वजनिक सूचना'}
                  </span>
                  <span style="font-size: 0.72rem; color: var(--color-text-light); font-weight: 500;">
                    ${dateStr}
                  </span>
                </div>

                <h3 style="font-size: var(--font-size-base); color: var(--color-primary-dark); margin-bottom: var(--space-2);">
                  ${getLocalized(notice.title)}
                </h3>

                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); line-height: 1.6; margin: 0;">
                  ${getLocalized(notice.content)}
                </p>
              </div>

              <div style="border-top: 1px dashed var(--color-border); padding-top: var(--space-2); font-size: 0.72rem; color: var(--color-text-light);">
                📍 ${getLocalized(activeCandidate.panchayatName)} सचिवालय
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}
