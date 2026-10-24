/**
 * Profile Section Component
 * Candidate biography, verified personal details, educational qualifications timeline,
 * political journey timeline, public experience, and community welfare.
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderProfileSection() {
  const bio = getLocalized(activeCandidate.bio);
  const education = getLocalized(activeCandidate.education);
  const experience = getLocalized(activeCandidate.experience);
  const personalDetails = activeCandidate.personalDetails;
  const educationTimeline = activeCandidate.educationTimeline || [];
  const politicalJourney = activeCandidate.politicalJourney || [];
  const socialWorkList = activeCandidate.socialWork || [];
  const achievements = activeCandidate.verifiedAchievements || [];

  return `
    <section id="profile" class="section container">
      <div class="section-header">
        <span class="section-tag">${t('nav.profile')}</span>
        <h2 class="section-title">${t('profile.title')}</h2>
        <p class="section-subtitle">${t('profile.subtitle')}</p>
      </div>

      <div class="profile-cards-stack">
        <!-- 1. Verified Personal Details Card -->
        ${personalDetails ? `
          <div class="profile-card profile-details-card" style="border-top: 4px solid var(--color-primary);">
            <div class="profile-card-header">
              <h3 class="profile-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                ${t('profile.personalDetailsHeading')}
              </h3>
              <span class="badge badge-success">✓ ${t('hero.verifiedBadge')}</span>
            </div>

            <div class="profile-details-body">
              ${(activeCandidate.photoNamaste || activeCandidate.photo) ? `
                <div class="profile-photo-wrapper">
                  <img src="${activeCandidate.photoNamaste || activeCandidate.photo}" alt="${getLocalized(personalDetails.fullName)}" />
                </div>
              ` : ''}

              <div class="personal-details-grid">
                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.fullName')}</span>
                  <strong class="detail-val">${getLocalized(personalDetails.fullName)}</strong>
                </div>

                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.dob')}</span>
                  <strong class="detail-val">${personalDetails.dobLocalized ? getLocalized(personalDetails.dobLocalized) : personalDetails.dob}</strong>
                </div>

                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.nativeVillage')}</span>
                  <strong class="detail-val">${getLocalized(personalDetails.nativeVillage)}</strong>
                </div>

                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.postOffice')}</span>
                  <strong class="detail-val">${getLocalized(personalDetails.postOffice)}</strong>
                </div>

                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.tehsil')}</span>
                  <strong class="detail-val">${getLocalized(personalDetails.tehsil)}</strong>
                </div>

                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.district')}</span>
                  <strong class="detail-val">${getLocalized(personalDetails.district)}</strong>
                </div>

                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.position')}</span>
                  <strong class="detail-val" style="color: var(--color-primary);">${getLocalized(personalDetails.position)}</strong>
                </div>

                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.ward')}</span>
                  <strong class="detail-val" style="color: var(--color-accent);">${getLocalized(personalDetails.ward)}</strong>
                </div>

                ${(personalDetails.mobile || activeCandidate.contact?.phone) ? `
                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.mobile')}</span>
                  <strong class="detail-val">
                    <a href="tel:${(personalDetails.mobile || activeCandidate.contact?.phone).replace(/[^0-9+]/g, '')}" style="color: var(--color-primary); text-decoration: none; font-weight: 700;">
                      ${personalDetails.mobile || activeCandidate.contact?.phone}
                    </a>
                  </strong>
                </div>
                ` : ''}

                ${(personalDetails.whatsapp || activeCandidate.contact?.whatsapp) ? `
                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.whatsapp')}</span>
                  <strong class="detail-val">
                    <a href="https://wa.me/${(personalDetails.whatsapp || activeCandidate.contact?.whatsapp).replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" style="color: #059669; text-decoration: none; font-weight: 700;">
                      +91 ${(personalDetails.whatsapp || activeCandidate.contact?.whatsapp).replace(/[^0-9]/g, '').slice(-10)}
                    </a>
                  </strong>
                </div>
                ` : ''}

                ${activeCandidate.socialLinks?.instagram ? `
                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.instagram')}</span>
                  <strong class="detail-val">
                    <a href="${activeCandidate.socialLinks.instagram}" target="_blank" rel="noopener noreferrer" style="color: #e1306c; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                      @kapil_mehta_bjp ↗
                    </a>
                  </strong>
                </div>
                ` : ''}

                ${activeCandidate.socialLinks?.facebook ? `
                <div class="personal-detail-item">
                  <span class="detail-label">${t('profile.labels.facebook')}</span>
                  <strong class="detail-val">
                    <a href="${activeCandidate.socialLinks.facebook}" target="_blank" rel="noopener noreferrer" style="color: #1877f2; text-decoration: none; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
                      Facebook Profile ↗
                    </a>
                  </strong>
                </div>
                ` : ''}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 2. Candidate Biography Card -->
        <div class="profile-card">
          <div class="profile-card-header">
            <h3 class="profile-card-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              ${t('profile.biography')}
            </h3>
          </div>
          <p style="font-size: var(--font-size-base); color: var(--color-text-main); line-height: 1.8; margin-bottom: var(--space-4);">
            ${bio}
          </p>

          ${!educationTimeline.length ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); gap: var(--space-4); background-color: var(--color-surface-subtle); padding: var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">
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
          ` : ''}
        </div>

        <!-- 3. Educational Qualifications Timeline (Card-based layout) -->
        ${educationTimeline.length > 0 ? `
          <div class="profile-card">
            <div class="profile-card-header">
              <h3 class="profile-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
                ${t('profile.educationTimelineHeading')}
              </h3>
              <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); font-weight: 500;">
                क्रमशः शैक्षणिक पृष्ठभूमि
              </span>
            </div>

            <div class="education-grid">
              ${educationTimeline.map((item, idx) => `
                <div class="edu-card">
                  <div class="edu-badge">${item.step || idx + 1}</div>
                  <div class="edu-info">
                    <h4 class="edu-level">${getLocalized(item.level)}</h4>
                    <p class="edu-inst">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline; vertical-align: middle; margin-right: 4px;">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      ${getLocalized(item.institution)}
                    </p>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- 4. Political Journey Chronological Timeline -->
        ${politicalJourney.length > 0 ? `
          <div class="profile-card">
            <div class="profile-card-header">
              <h3 class="profile-card-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                ${t('profile.politicalJourneyHeading')}
              </h3>
              <span class="badge badge-accent">2014 – 2025</span>
            </div>

            <div class="journey-timeline">
              ${politicalJourney.map(item => `
                <div class="journey-item">
                  <div class="journey-year-col">
                    <span class="journey-year">${item.year}</span>
                    <span class="journey-line"></span>
                  </div>
                  <div class="journey-content-box">
                    <p class="journey-role">${getLocalized(item.role)}</p>
                    ${item.organization ? `
                      <span class="journey-org">
                        🏛️ ${item.organization}
                      </span>
                    ` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Social Work & Community Welfare (If present in candidate) -->
        ${socialWorkList.length > 0 ? `
          <div class="profile-card">
            <div class="profile-card-header">
              <h3 class="profile-card-title">
                ${t('profile.socialWork')}
              </h3>
            </div>

            <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-4);">
              ${socialWorkList.map(item => `
                <div style="display: flex; gap: var(--space-4); align-items: flex-start; padding: var(--space-3); background-color: var(--color-surface-subtle); border-radius: var(--radius-md); border-left: 4px solid var(--color-primary);">
                  <div style="background-color: var(--color-primary); color: #fff; font-size: var(--font-size-xs); font-weight: 700; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); white-space: nowrap;">
                    ${item.year || 'सेवा कार्य'}
                  </div>
                  <div style="min-width: 0; word-break: break-word;">
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

        <!-- Verified Achievements (If present in candidate) -->
        ${achievements.length > 0 ? `
          <div class="profile-card">
            <div class="profile-card-header">
              <h3 class="profile-card-title">
                ${t('profile.verifiedAchievements')}
              </h3>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); gap: var(--space-4);">
              ${achievements.map(a => `
                <div style="background-color: var(--color-surface-subtle); border: 1px solid var(--color-border-light); border-radius: var(--radius-md); padding: var(--space-4); min-width: 0; word-break: break-word;">
                  <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: var(--space-1);">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" style="flex-shrink: 0;">
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
