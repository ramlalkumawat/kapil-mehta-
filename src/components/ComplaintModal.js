/**
 * Complaint Registration Modal Component — Kapil Mehta Jan Shikayat Portal
 * Fully integrated with Google Cloud Run complaint submission microservice.
 * Accessible grievance submission dialog with validation, spam protection,
 * and copyable tracking code receipt.
 */

import { t } from '../locales/i18n.js';
import { submitComplaint, validateComplaintInput } from '../services/complaintService.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderComplaintModal() {
  const candidateId = activeCandidate.id || 'candidate-kapil-mehta';

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
          <!-- General Submission Error Banner -->
          <div id="form-general-error" class="alert alert-danger" style="display: none; margin-bottom: var(--space-4); background-color: #fee2e2; color: #b91c1c; padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid #f87171; font-size: var(--font-size-xs);" role="alert"></div>

          <!-- Submission Form State -->
          <form id="form-lodge-complaint" novalidate>
            <!-- Honeypot for spam bots (invisible) -->
            <input type="text" name="_honeypot" style="display: none !important;" tabindex="-1" autocomplete="off" />

            <!-- Hidden Candidate ID -->
            <input type="hidden" name="candidate_id" id="complaint-candidate-id" value="${candidateId}" />

            <!-- 1. Citizen Full Name -->
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
                autocomplete="name"
              />
              <div id="err-name" class="form-error" style="display: none;"></div>
            </div>

            <!-- 2. Mobile Number -->
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
                autocomplete="tel"
              />
              <div id="err-mobile" class="form-error" style="display: none;"></div>
            </div>

            <!-- 3. Category (Optional, defaults to general) -->
            <div class="form-group">
              <label for="complaint-category" class="form-label">
                ${t('complaint.fields.category')}
              </label>
              <select id="complaint-category" name="category" class="form-select">
                <option value="">${t('complaint.fields.categoryPlaceholder')}</option>
                <option value="road">${t('complaint.categories.road')}</option>
                <option value="water">${t('complaint.categories.water')}</option>
                <option value="electricity">${t('complaint.categories.electricity')}</option>
                <option value="sanitation">${t('complaint.categories.sanitation')}</option>
                <option value="street_light">${t('complaint.categories.street_light')}</option>
                <option value="drainage">${t('complaint.categories.drainage')}</option>
                <option value="general">${t('complaint.categories.general')}</option>
              </select>
              <div id="err-category" class="form-error" style="display: none;"></div>
            </div>

            <!-- 4. Ward / Area / Locality -->
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

            <!-- 5. Complaint Description -->
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
                minlength="1" 
                maxlength="1000"
              ></textarea>
              <div id="err-desc" class="form-error" style="display: none;"></div>
            </div>

            <!-- Privacy Reassurance Notice -->
            <div style="background-color: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid var(--color-border-light); margin-top: var(--space-3);">
              <p style="font-size: 0.72rem; color: var(--color-text-muted); margin: 0;">
                🛡️ ${t('complaint.privacyNotice')}
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

          <!-- Success Confirmation View (Hidden initially) -->
          <div id="complaint-success-view" style="display: none; text-align: center; padding: var(--space-3) 0;">
            <!-- Green Checkmark Circle -->
            <div style="width: 60px; height: 60px; background-color: var(--color-success-bg, #dcfce7); color: var(--color-success, #16a34a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-3); box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>

            <!-- Heading -->
            <h3 style="color: var(--color-primary-dark); font-size: var(--font-size-xl); font-weight: 700; margin-bottom: var(--space-2);">
              ${t('complaint.successTitle')}
            </h3>

            <p style="font-size: var(--font-size-sm); color: var(--color-text-muted); margin-bottom: var(--space-4);">
              ${t('complaint.successMessage')}
            </p>

            <!-- Prominent Tracking Code Card -->
            <div style="background-color: var(--color-surface-subtle); border: 2px dashed var(--color-primary); border-radius: var(--radius-lg); padding: var(--space-4); margin-bottom: var(--space-4);">
              <div style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-primary-dark); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-1);">
                ${t('complaint.trackingIdLabel')}
              </div>
              
              <div id="receipt-tracking-code" style="font-family: monospace, sans-serif; font-size: 1.75rem; font-weight: 800; color: var(--color-primary); letter-spacing: 0.08em; padding: var(--space-2) var(--space-4); background-color: #ffffff; border-radius: var(--radius-md); display: inline-block; margin: var(--space-2) 0; border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
                SETU-RJ-XXXXXX
              </div>

              <!-- Status Badge -->
              <div style="margin: var(--space-2) 0 var(--space-3); display: flex; align-items: center; justify-content: center; gap: var(--space-2);">
                <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); font-weight: var(--font-weight-medium);">${t('complaint.statusLabel')}</span>
                <span id="receipt-status-badge" style="background-color: var(--color-success-bg, #dcfce7); color: var(--color-success, #16a34a); font-weight: 700; font-size: var(--font-size-xs); padding: 0.2rem 0.65rem; border-radius: var(--radius-full); border: 1px solid rgba(22, 163, 74, 0.3);">
                  ${t('complaint.statusSubmitted')}
                </span>
              </div>

              <!-- Copy Button -->
              <div>
                <button id="btn-copy-tracking-code" type="button" class="btn btn-sm btn-secondary" style="margin: 0 auto; display: inline-flex; align-items: center; gap: var(--space-1);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  <span id="copy-btn-text">${t('complaint.copyBtn')}</span>
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: var(--space-3); justify-content: center; flex-wrap: wrap;">
              <button id="btn-submit-another" type="button" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: var(--space-1);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>${t('complaint.submitAnotherBtn')}</span>
              </button>
              <button id="btn-finish-receipt" type="button" class="btn btn-secondary">
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
  const generalError = document.getElementById('form-general-error');

  let isSubmitting = false;

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Only reset views if not already showing success receipt
      if (successView && successView.style.display !== 'block') {
        form.style.display = 'block';
        successView.style.display = 'none';
        clearErrors();
      }
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function clearErrors() {
    ['name', 'mobile', 'category', 'ward', 'desc'].forEach(id => {
      const el = document.getElementById(`err-${id}`);
      if (el) {
        el.style.display = 'none';
        el.textContent = '';
      }
    });
    if (generalError) {
      generalError.style.display = 'none';
      generalError.textContent = '';
    }
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

      // Prevent accidental double submissions
      if (isSubmitting) return;

      clearErrors();

      const nameVal = form.name.value.trim();
      const mobileRaw = form.mobile.value.trim();
      const cleanMobile = mobileRaw.replace(/[^0-9]/g, '');
      const categoryVal = form.category.value;
      const wardVal = form.ward.value.trim();
      const descriptionVal = form.description.value.trim();
      const candidateIdVal = form.candidate_id ? form.candidate_id.value : 'candidate-kapil-mehta';

      const formData = {
        candidate_id: candidateIdVal,
        name: nameVal,
        mobile: cleanMobile,
        category: categoryVal || 'general',
        ward: wardVal,
        description: descriptionVal,
        _honeypot: form._honeypot ? form._honeypot.value : ''
      };

      // Client validation
      const validation = validateComplaintInput(formData);
      if (!validation.valid) {
        if (validation.errors.name) {
          const el = document.getElementById('err-name');
          if (el) {
            el.textContent = t(`complaint.errors.${validation.errors.name}`) || t('complaint.errors.nameRequired');
            el.style.display = 'block';
          }
        }
        if (validation.errors.mobile) {
          const el = document.getElementById('err-mobile');
          if (el) {
            el.textContent = t(`complaint.errors.${validation.errors.mobile}`) || t('complaint.errors.mobileInvalid');
            el.style.display = 'block';
          }
        }
        if (validation.errors.category) {
          const el = document.getElementById('err-category');
          if (el) {
            el.textContent = t(`complaint.errors.${validation.errors.category}`) || t('complaint.errors.categoryRequired');
            el.style.display = 'block';
          }
        }
        if (validation.errors.ward) {
          const el = document.getElementById('err-ward');
          if (el) {
            el.textContent = t(`complaint.errors.${validation.errors.ward}`) || t('complaint.errors.wardRequired');
            el.style.display = 'block';
          }
        }
        if (validation.errors.description) {
          const el = document.getElementById('err-desc');
          if (el) {
            el.textContent = t(`complaint.errors.${validation.errors.description}`) || t('complaint.errors.descRequired');
            el.style.display = 'block';
          }
        }
        return;
      }

      // Enter loading state
      isSubmitting = true;
      const submitBtn = document.getElementById('btn-submit-complaint');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner" style="display: inline-block; width: 14px; height: 14px; border: 2px solid #ffffff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 6px;"></span> <span>${t('complaint.submitting')}</span>`;
      }

      try {
        const result = await submitComplaint(formData, candidateIdVal);

        if (result && result.success) {
          // Reset the form only after a verified successful submission
          form.reset();

          // Switch to visually polished confirmation section
          form.style.display = 'none';
          if (generalError) generalError.style.display = 'none';
          successView.style.display = 'block';

          // Display server-generated tracking code
          const codeDisplay = document.getElementById('receipt-tracking-code');
          if (codeDisplay) {
            codeDisplay.textContent = result.tracking_code;
          }

          // Display status
          const statusBadge = document.getElementById('receipt-status-badge');
          if (statusBadge) {
            statusBadge.textContent = t('complaint.statusSubmitted');
          }

          // Wire up copy tracking code button
          const copyBtn = document.getElementById('btn-copy-tracking-code');
          const copyText = document.getElementById('copy-btn-text');
          if (copyBtn && copyText) {
            copyBtn.onclick = () => {
              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(result.tracking_code).then(() => {
                  copyText.textContent = t('complaint.copiedBtn');
                  setTimeout(() => {
                    copyText.textContent = t('complaint.copyBtn');
                  }, 2500);
                }).catch(() => fallbackCopy(result.tracking_code, copyText));
              } else {
                fallbackCopy(result.tracking_code, copyText);
              }
            };
          }

          // Wire up "Submit Another Complaint" button
          const submitAnotherBtn = document.getElementById('btn-submit-another');
          if (submitAnotherBtn) {
            submitAnotherBtn.onclick = () => {
              form.reset();
              clearErrors();
              successView.style.display = 'none';
              form.style.display = 'block';
              const nameInput = document.getElementById('complaint-name');
              if (nameInput) nameInput.focus();
            };
          }
        } else {
          throw new Error(result?.error || t('complaint.errors.generalError'));
        }
      } catch (err) {
        console.warn('[SarpanchSetu] Grievance submission error:', err.message || err);
        if (generalError) {
          generalError.textContent = err.message || t('complaint.errors.generalError');
          generalError.style.display = 'block';
          generalError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        isSubmitting = false;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<span>${t('actions.submit')}</span>`;
        }
      }
    });
  }

  function fallbackCopy(text, targetSpan) {
    try {
      const temp = document.createElement('input');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      targetSpan.textContent = t('complaint.copiedBtn');
      setTimeout(() => {
        targetSpan.textContent = t('complaint.copyBtn');
      }, 2500);
    } catch (e) {
      targetSpan.textContent = text;
    }
  }
}
