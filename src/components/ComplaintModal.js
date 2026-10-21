/**
 * Complaint Registration Modal Component
 * Accessible grievance submission dialog with validation, spam protection,
 * and copyable tracking code receipt.
 */

import { t } from '../locales/i18n.js';
import { submitComplaint, validateComplaintInput } from '../services/complaintService.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderComplaintModal() {
  return `
    <div id="modal-complaint" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="complaint-modal-heading">
      <div class="modal-container">
        <!-- Header -->
        <div class="modal-header">
          <div>
            <h3 id="complaint-modal-heading" class="modal-title">${t('complaint.modalTitle')}</h3>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
              ${t('complaint.modalSubtitle')}
            </p>
          </div>
          <button id="btn-close-complaint-modal" class="modal-close-btn" aria-label="${t('actions.close')}">&times;</button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Submission Form State -->
          <form id="form-lodge-complaint" novalidate>
            <!-- Honeypot for spam bots (invisible) -->
            <input type="text" name="_honeypot" style="display: none !important;" tabindex="-1" autocomplete="off" />

            <!-- Citizen Name -->
            <div class="form-group">
              <label for="complaint-name" class="form-label">
                ${t('complaint.fields.name')} <span style="color: var(--color-danger);">*</span>
              </label>
              <input 
                type="text" 
                id="complaint-name" 
                name="name" 
                class="form-input" 
                placeholder="${t('complaint.fields.namePlaceholder')}" 
                required 
                maxlength="100" 
              />
              <div id="err-name" class="form-error" style="display: none;"></div>
            </div>

            <!-- Mobile Number -->
            <div class="form-group">
              <label for="complaint-mobile" class="form-label">
                ${t('complaint.fields.mobile')} <span style="color: var(--color-danger);">*</span>
              </label>
              <input 
                type="tel" 
                id="complaint-mobile" 
                name="mobile" 
                class="form-input" 
                placeholder="${t('complaint.fields.mobilePlaceholder')}" 
                required 
                maxlength="10" 
                pattern="[0-9]{10}" 
              />
              <div id="err-mobile" class="form-error" style="display: none;"></div>
            </div>

            <!-- Category -->
            <div class="form-group">
              <label for="complaint-category" class="form-label">
                ${t('complaint.fields.category')} <span style="color: var(--color-danger);">*</span>
              </label>
              <select id="complaint-category" name="category" class="form-select" required>
                <option value="">${t('complaint.fields.categoryPlaceholder')}</option>
                <option value="water">${t('complaint.categories.water')}</option>
                <option value="road">${t('complaint.categories.road')}</option>
                <option value="light">${t('complaint.categories.light')}</option>
                <option value="cleanliness">${t('complaint.categories.cleanliness')}</option>
                <option value="drainage">${t('complaint.categories.drainage')}</option>
                <option value="infrastructure">${t('complaint.categories.infrastructure')}</option>
                <option value="scheme_guidance">${t('complaint.categories.scheme_guidance')}</option>
                <option value="other">${t('complaint.categories.other')}</option>
              </select>
              <div id="err-category" class="form-error" style="display: none;"></div>
            </div>

            <!-- Ward / Locality -->
            <div class="form-group">
              <label for="complaint-ward" class="form-label">
                ${t('complaint.fields.ward')} <span style="color: var(--color-danger);">*</span>
              </label>
              <input 
                type="text" 
                id="complaint-ward" 
                name="ward" 
                class="form-input" 
                placeholder="${t('complaint.fields.wardPlaceholder')}" 
                required 
                maxlength="100" 
              />
              <div id="err-ward" class="form-error" style="display: none;"></div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label for="complaint-desc" class="form-label">
                ${t('complaint.fields.description')} <span style="color: var(--color-danger);">*</span>
              </label>
              <textarea 
                id="complaint-desc" 
                name="description" 
                class="form-textarea" 
                placeholder="${t('complaint.fields.descriptionPlaceholder')}" 
                required 
                minlength="15" 
                maxlength="1000"
              ></textarea>
              <div id="err-desc" class="form-error" style="display: none;"></div>
            </div>

            <!-- Photo Upload (Optional) -->
            <div class="form-group">
              <label for="complaint-photo" class="form-label">
                ${t('complaint.fields.photo')}
              </label>
              <input 
                type="file" 
                id="complaint-photo" 
                name="photo" 
                accept="image/jpeg,image/png,image/webp" 
                class="form-input" 
              />
              <div id="err-photo" class="form-error" style="display: none;"></div>
            </div>

            <!-- Privacy Notice & Consent -->
            <div class="form-group" style="background-color: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid var(--color-border-light);">
              <label class="form-checkbox-label">
                <input type="checkbox" id="complaint-consent" name="consent" required />
                <span>${t('complaint.fields.consent')}</span>
              </label>
              <div id="err-consent" class="form-error" style="display: none;"></div>
              
              <p style="font-size: 0.72rem; color: var(--color-text-muted); margin-top: var(--space-2); margin-left: 20px;">
                ${t('complaint.privacyNotice')}
              </p>
            </div>

            <!-- Form Actions -->
            <div style="display: flex; gap: var(--space-3); margin-top: var(--space-4);">
              <button type="submit" id="btn-submit-complaint" class="btn btn-primary" style="flex: 1;">
                <span>${t('actions.submit')}</span>
              </button>
              <button type="button" id="btn-cancel-complaint" class="btn btn-secondary">
                ${t('actions.close')}
              </button>
            </div>
          </form>

          <!-- Success Receipt View (Hidden initially) -->
          <div id="complaint-success-view" style="display: none; text-align: center; padding: var(--space-4) 0;">
            <div style="width: 56px; height: 56px; background-color: var(--color-success-bg); color: var(--color-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-3);">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <h3 style="color: var(--color-primary-dark); font-size: var(--font-size-xl); margin-bottom: var(--space-2);">
              ${t('complaint.successTitle')}
            </h3>

            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-4);">
              ${t('complaint.successMessage')}
            </p>

            <!-- Tracking Code Display Box -->
            <div style="background-color: var(--color-primary-subtle); border: 2px dashed var(--color-primary); border-radius: var(--radius-lg); padding: var(--space-4); margin-bottom: var(--space-5);">
              <span style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-primary-dark); text-transform: uppercase;">
                ${t('complaint.trackingIdLabel')}
              </span>
              <div id="receipt-tracking-code" style="font-size: 1.5rem; font-weight: 800; color: var(--color-primary); letter-spacing: 0.08em; margin: var(--space-2) 0;">
                SETU-RJ-XXXXXX
              </div>
              <button id="btn-copy-tracking-code" class="btn btn-sm btn-secondary" style="margin: 0 auto;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span id="copy-btn-text">${t('complaint.copyBtn')}</span>
              </button>
            </div>

            <div style="display: flex; gap: var(--space-3); justify-content: center;">
              <button id="btn-track-this-now" class="btn btn-primary">
                ${t('complaint.viewStatusBtn')}
              </button>
              <button id="btn-finish-receipt" class="btn btn-secondary">
                ${t('actions.close')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initComplaintModalEvents() {
  const modal = document.getElementById('modal-complaint');
  const openBtn = document.getElementById('btn-open-complaint-modal');
  const closeBtn = document.getElementById('btn-close-complaint-modal');
  const cancelBtn = document.getElementById('btn-cancel-complaint');
  const finishBtn = document.getElementById('btn-finish-receipt');
  const form = document.getElementById('form-lodge-complaint');
  const successView = document.getElementById('complaint-success-view');

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Reset views
      form.style.display = 'block';
      successView.style.display = 'none';
      form.reset();
      clearErrors();
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function clearErrors() {
    ['name', 'mobile', 'category', 'ward', 'desc', 'consent', 'photo'].forEach(id => {
      const el = document.getElementById(`err-${id}`);
      if (el) {
        el.style.display = 'none';
        el.textContent = '';
      }
    });
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (finishBtn) finishBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const formData = {
        name: form.name.value,
        mobile: form.mobile.value,
        category: form.category.value,
        ward: form.ward.value,
        description: form.description.value,
        consent: form.consent.checked,
        _honeypot: form._honeypot.value
      };

      // Client validation
      const validation = validateComplaintInput(formData);
      if (!validation.valid) {
        if (validation.errors.name) {
          const el = document.getElementById('err-name');
          el.textContent = t(`complaint.errors.${validation.errors.name}`);
          el.style.display = 'block';
        }
        if (validation.errors.mobile) {
          const el = document.getElementById('err-mobile');
          el.textContent = t(`complaint.errors.${validation.errors.mobile}`);
          el.style.display = 'block';
        }
        if (validation.errors.category) {
          const el = document.getElementById('err-category');
          el.textContent = t(`complaint.errors.${validation.errors.category}`);
          el.style.display = 'block';
        }
        if (validation.errors.ward) {
          const el = document.getElementById('err-ward');
          el.textContent = t(`complaint.errors.${validation.errors.ward}`);
          el.style.display = 'block';
        }
        if (validation.errors.description) {
          const el = document.getElementById('err-desc');
          el.textContent = t(`complaint.errors.${validation.errors.description}`);
          el.style.display = 'block';
        }
        if (validation.errors.consent) {
          const el = document.getElementById('err-consent');
          el.textContent = t(`complaint.errors.${validation.errors.consent}`);
          el.style.display = 'block';
        }
        return;
      }

      // Check photo size limit
      const photoFile = form.photo.files[0];
      if (photoFile) {
        if (photoFile.size > 5 * 1024 * 1024) {
          const el = document.getElementById('err-photo');
          el.textContent = t('complaint.errors.fileTooBig');
          el.style.display = 'block';
          return;
        }
      }

      // Show submitting state
      const submitBtn = document.getElementById('btn-submit-complaint');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner"></span> <span>${t('actions.submitting')}</span>`;

      try {
        const result = await submitComplaint(formData, activeCandidate.id);
        if (result.success) {
          // Switch to success view
          form.style.display = 'none';
          successView.style.display = 'block';

          const codeDisplay = document.getElementById('receipt-tracking-code');
          codeDisplay.textContent = result.tracking_code;

          // Wire up copy button
          const copyBtn = document.getElementById('btn-copy-tracking-code');
          const copyText = document.getElementById('copy-btn-text');
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(result.tracking_code).then(() => {
              copyText.textContent = t('actions.copied');
              setTimeout(() => {
                copyText.textContent = t('complaint.copyBtn');
              }, 2500);
            });
          };

          // Wire up track-this-now button
          const trackNowBtn = document.getElementById('btn-track-this-now');
          trackNowBtn.onclick = () => {
            closeModal();
            const trackModalBtn = document.getElementById('btn-open-track-modal');
            if (trackModalBtn) trackModalBtn.click();
            // Pre-fill tracker fields
            setTimeout(() => {
              const codeInput = document.getElementById('track-code-input');
              const last4Input = document.getElementById('track-last4-input');
              if (codeInput) codeInput.value = result.tracking_code;
              if (last4Input) last4Input.value = formData.mobile.slice(-4);
              const searchTrigger = document.getElementById('btn-submit-track');
              if (searchTrigger) searchTrigger.click();
            }, 250);
          };
        }
      } catch (err) {
        alert('Error submitting grievance. Please try again.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>${t('actions.submit')}</span>`;
      }
    });
  }
}
