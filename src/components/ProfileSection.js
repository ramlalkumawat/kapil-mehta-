/**
 * Profile Section Component
 * Candidate biography, educational background, public experience,
 * verified social work, and community contributions.
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderProfileSection() {
  const bio = getLocalized(activeCandidate.bio);
  const education = getLocalized(activeCandidate.education);
  const experience = getLocalized(activeCandidate.experience);
  const socialWorkList = activeCandidate.socialWork || [];
  const achievements = activeCandidate.verifiedAchievements || [];

  return `
    <section id="profile" class="section container">
      <div class="section-header">
        <span class="section-tag">${t('nav.profile')}</span>
        <h2 class="section-title">${t('profile.title')}</h2>
        <p class="section-subtitle">${t('profile.subtitle')}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-6);">
        <!-- Biography & Qualifications Card -->
        <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); box-shadow: var(--shadow-sm);">
          <h3 style="font-size: var(--font-size-lg); color: var(--color-primary-dark); margin-bottom: var(--space-3); border-bottom: 2px solid var(--color-primary-subtle); padding-bottom: var(--space-2);">
            ${t('profile.biography')}
          </h3>
          <p style="font-size: var(--font-size-base); color: var(--color-text-main); line-height: 1.7; margin-bottom: var(--space-5);">
            ${bio}
          </p>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4); background-color: var(--color-surface-subtle); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">
            <div>
              <span style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">
                ${t('profile.education')}
              </span>
              <p style="font-size: var(--font-size-sm); font-weight: 600; color: var(--color-primary-dark); margin-top: 2px;">
                ${education || '—'}
              </p>
            </div>

            <div>
              <span style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">
                ${t('profile.experience')}
              </span>
              <p style="font-size: var(--font-size-sm); font-weight: 600; color: var(--color-primary-dark); margin-top: 2px;">
                ${experience || '—'}
              </p>
            </div>
          </div>
        </div>

        <!-- Social Work & Community Welfare -->
        ${socialWorkList.length > 0 ? `
          <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); box-shadow: var(--shadow-sm);">
            <h3 style="font-size: var(--font-size-lg); color: var(--color-primary-dark); margin-bottom: var(--space-4); border-bottom: 2px solid var(--color-primary-subtle); padding-bottom: var(--space-2);">
              ${t('profile.socialWork')}
            </h3>

            <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-4);">
              ${socialWorkList.map(item => `
                <div style="display: flex; gap: var(--space-4); align-items: flex-start; padding: var(--space-3); background-color: var(--color-surface-subtle); border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);">
                  <div style="background-color: var(--color-primary); color: #fff; font-size: var(--font-size-xs); font-weight: 700; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); white-space: nowrap;">
                    ${item.year || 'सेवा कार्य'}
                  </div>
                  <div>
                    <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin-bottom: 2px;">
                      ${getLocalized(item.title)}
                    </h4>
                    <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
                      ${getLocalized(item.description)}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Verified Achievements -->
        ${achievements.length > 0 ? `
          <div style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-6); box-shadow: var(--shadow-sm);">
            <h3 style="font-size: var(--font-size-lg); color: var(--color-primary-dark); margin-bottom: var(--space-4); border-bottom: 2px solid var(--color-primary-subtle); padding-bottom: var(--space-2);">
              ${t('profile.verifiedAchievements')}
            </h3>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4);">
              ${achievements.map(a => `
                <div style="background-color: var(--color-surface-subtle); border: 1px solid var(--color-border-light); border-radius: var(--radius-md); padding: var(--space-4);">
                  <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-1);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark);">
                      ${getLocalized(a.title)}
                    </h4>
                  </div>
                  <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
                    ${getLocalized(a.detail)}
                  </p>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </section>
  `;
}
