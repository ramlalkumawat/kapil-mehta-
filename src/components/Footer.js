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

            <!-- Social Media Handles -->
            ${(activeCandidate.socialLinks?.instagram || activeCandidate.socialLinks?.facebook || activeCandidate.socialLinks?.whatsapp) ? `
              <div style="margin-top: var(--space-4); padding-top: var(--space-3); border-top: 1px solid rgba(255, 255, 255, 0.1);">
                <strong style="color: #f3f4f6; font-size: 0.85rem; display: block; margin-bottom: 8px;">${t('footer.socialTitle')}</strong>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  ${activeCandidate.socialLinks.instagram ? `
                    <a href="${activeCandidate.socialLinks.instagram}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%); color: #fff; padding: 6px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; text-decoration: none; box-shadow: 0 2px 6px rgba(0,0,0,0.3);" aria-label="Instagram Profile">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                      Instagram
                    </a>
                  ` : ''}
                  ${activeCandidate.socialLinks.facebook ? `
                    <a href="${activeCandidate.socialLinks.facebook}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; background: #1877f2; color: #fff; padding: 6px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; text-decoration: none; box-shadow: 0 2px 6px rgba(0,0,0,0.3);" aria-label="Facebook Profile">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                      Facebook
                    </a>
                  ` : ''}
                  ${activeCandidate.socialLinks.whatsapp ? `
                    <a href="${activeCandidate.socialLinks.whatsapp}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 6px; background: #25d366; color: #fff; padding: 6px 12px; border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 700; text-decoration: none; box-shadow: 0 2px 6px rgba(0,0,0,0.3);" aria-label="WhatsApp Chat">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                      WhatsApp
                    </a>
                  ` : ''}
                </div>
              </div>
            ` : ''}
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
