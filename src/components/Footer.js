/**
 * Footer Component
 * Public-service disclaimers, privacy statements, office contacts,
 * and emergency directory.
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderFooter() {
  const officeAddress = getLocalized(activeCandidate.contact?.officeAddress);
  const phone = activeCandidate.contact?.phone || '';
  const email = activeCandidate.contact?.email || '';
  const panchayatName = getLocalized(activeCandidate.panchayatName);
  const candidateName = getLocalized(activeCandidate.name);
  const disclaimerText = getLocalized(activeCandidate.disclaimer);

  return `
    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <!-- Prominent Non-Government Disclaimer Banner -->
        <div class="disclaimer-banner">
          <div style="display: flex; gap: var(--space-3); align-items: flex-start;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" style="flex-shrink: 0; margin-top: 2px;">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <strong style="color: #fef3c7; display: block; margin-bottom: 2px;">
                ${t('footer.fullDisclaimer')}
              </strong>
              <span>${disclaimerText}</span>
            </div>
          </div>
        </div>

        <!-- 3-Column Footer Grid -->
        <div class="footer-grid">
          <!-- Col 1: Identity & Office Contact -->
          <div class="footer-col">
            <h4>${candidateName} • ${panchayatName}</h4>
            <p style="color: #9ca3af; margin-bottom: var(--space-3); line-height: 1.6;">
              ${getLocalized(activeCandidate.tagline)}
            </p>
            <div style="display: flex; flex-direction: column; gap: 6px; color: #d1d5db;">
              <div>📍 <strong>${t('footer.officeTitle')}:</strong> ${officeAddress}</div>
              <div>📞 <strong>संपर्क:</strong> <a href="tel:${phone.replace(/[^0-9+]/g, '')}" style="color: #6ee7b7;">${phone}</a></div>
              ${activeCandidate.contact?.whatsapp ? `<div>💬 <strong>व्हाट्सएप:</strong> <a href="https://wa.me/${activeCandidate.contact.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" rel="noopener noreferrer" style="color: #6ee7b7;">+91 ${activeCandidate.contact.whatsapp.replace(/[^0-9]/g, '').slice(-10)}</a></div>` : ''}
              ${email ? `<div>✉️ <strong>ईमेल:</strong> <a href="mailto:${email}" style="color: #6ee7b7;">${email}</a></div>` : ''}
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div class="footer-col">
            <h4>${t('footer.quickLinksTitle')}</h4>
            <ul class="footer-links">
              <li><a href="#home">${t('nav.home')}</a></li>
              <li><a href="#profile">${t('nav.profile')}</a></li>
              <li><a href="#works">${t('nav.works')}</a></li>
              <li><a href="#vision">${t('nav.vision')}</a></li>
              <li><a href="#gallery">${t('nav.gallery')}</a></li>
              <li><a href="#services">${t('nav.services')}</a></li>
              <li><a href="#schemes">${t('nav.schemes')}</a></li>
              <li><a href="#announcements">${t('nav.announcements')}</a></li>
            </ul>
          </div>

          <!-- Col 3: Emergency Helpline Directory -->
          <div class="footer-col">
            <h4>${t('footer.emergencyTitle')}</h4>
            <ul class="footer-links">
              ${(activeCandidate.emergencyNumbers || []).map(num => `
                <li>
                  <a href="tel:${num.number.split('/')[0].trim()}">
                    ${getLocalized(num.name)}: <span style="color: #fca5a5; font-weight: 700;">${num.number}</span>
                  </a>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>

        <!-- Privacy Assurance Note -->
        <div style="background-color: rgba(255, 255, 255, 0.03); border-radius: var(--radius-sm); padding: var(--space-3); margin-bottom: var(--space-4); color: #9ca3af; font-size: 0.72rem; line-height: 1.5;">
          🔒 ${t('footer.privacyNotice')}
        </div>

        <!-- Footer Bottom Bar -->
        <div class="footer-bottom">
          <div>
            &copy; ${new Date().getFullYear()} ${panchayatName}. ${t('footer.copyright')}.
          </div>
          <div style="display: flex; align-items: center; gap: var(--space-4);">
            <span>${t('appName')} v1.0 (राजस्थान)</span>
            <span>•</span>
            <span style="color: #10b981;">● सुरक्षित एवं सत्यापित</span>
          </div>
        </div>
      </div>
    </footer>
  `;
}
