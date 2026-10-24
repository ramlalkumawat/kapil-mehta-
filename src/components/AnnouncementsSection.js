/**
 * Announcements & Gram Sabha Notices Section Component
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderAnnouncementsSection() {
  const notices = activeCandidate.announcements || [];

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

      ${notices.length === 0 ? `
        <div style="background-color: var(--color-surface); border: 2px dashed var(--color-border); border-radius: var(--radius-lg); padding: var(--space-8) var(--space-4); text-align: center; box-shadow: var(--shadow-sm); max-width: 680px; margin: 0 auto; width: 100%; box-sizing: border-box;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(217, 119, 6, 0.12); color: var(--color-accent); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-3);">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <span class="badge badge-accent" style="margin-bottom: var(--space-2); display: inline-block;">
            ⏳ ${t('announcements.comingSoonBadge')}
          </span>
          <h3 style="font-size: var(--font-size-lg); color: var(--color-primary-dark); margin: var(--space-2) 0;">
            ${t('announcements.comingSoonTitle')}
          </h3>
          <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.6; max-width: 480px; margin: 0 auto;">
            ${t('announcements.comingSoonDesc')}
          </p>
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: var(--space-4); width: 100%; min-width: 0;">
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
      `}
    </section>
  `;
}
