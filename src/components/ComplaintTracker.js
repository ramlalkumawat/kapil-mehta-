/**
 * Complaint Tracking Modal & View Component
 * 2-factor privacy verified lookup by Tracking ID + Mobile Last 4.
 * Displays step progress timeline and official resolution notes.
 */

import { t, getCurrentLang } from '../locales/i18n.js';
import { trackComplaint } from '../services/complaintService.js';

export function renderComplaintTracker() {
  return `
    <div id="modal-tracker" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="tracker-modal-heading">
      <div class="modal-container">
        <!-- Header -->
        <div class="modal-header">
          <div>
            <h3 id="tracker-modal-heading" class="modal-title">${t('complaint.trackModalTitle')}</h3>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
              ${t('complaint.trackModalSubtitle')}
            </p>
          </div>
          <button id="btn-close-tracker-modal" class="modal-close-btn" aria-label="${t('actions.close')}">&times;</button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Search Form -->
          <form id="form-track-complaint" style="display: flex; flex-direction: column; gap: var(--space-3); margin-bottom: var(--space-6);">
            <div style="display: grid; grid-template-columns: 1fr; gap: var(--space-3);">
              <div class="form-group" style="margin: 0;">
                <label for="track-code-input" class="form-label">
                  ${t('complaint.tracking.inputCode')}
                </label>
                <input 
                  type="text" 
                  id="track-code-input" 
                  class="form-input" 
                  placeholder="SETU-RJ-XXXXXX" 
                  required 
                  autocomplete="off" 
                  style="text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em;" 
                />
              </div>

              <div class="form-group" style="margin: 0;">
                <label for="track-last4-input" class="form-label">
                  ${t('complaint.tracking.inputMobileLast4')}
                </label>
                <input 
                  type="text" 
                  id="track-last4-input" 
                  class="form-input" 
                  placeholder="1234" 
                  maxlength="4" 
                  pattern="[0-9]{4}" 
                  required 
                  autocomplete="off" 
                />
              </div>
            </div>

            <button type="submit" id="btn-submit-track" class="btn btn-primary" style="width: 100%;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <span>${t('complaint.tracking.searchBtn')}</span>
            </button>
          </form>

          <!-- Tracking Results Container -->
          <div id="track-results-area">
            <!-- Initial Prompt State -->
            <div id="track-initial-state" style="text-align: center; padding: var(--space-6) 0; color: var(--color-text-muted);">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto var(--space-2); color: var(--color-border);">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <p style="font-size: var(--font-size-xs);">
                पंजीकरण के समय मिला 6-अंकीय ट्रैकिंग कोड एवं मोबाइल के अंतिम 4 अंक दर्ज कर स्थिति देखें।
              </p>
            </div>

            <!-- Loading State -->
            <div id="track-loading-state" style="display: none; text-align: center; padding: var(--space-6) 0;">
              <span class="spinner" style="border-top-color: var(--color-primary); width: 24px; height: 24px;"></span>
              <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: var(--space-2);">
                ${t('complaint.tracking.searching')}
              </p>
            </div>

            <!-- Not Found State -->
            <div id="track-error-state" style="display: none; background-color: var(--color-danger-bg); border: 1px solid #fca5a5; border-radius: var(--radius-md); padding: var(--space-4); text-align: center;">
              <h4 style="color: var(--color-danger); font-size: var(--font-size-sm); margin-bottom: 4px;">
                ${t('complaint.tracking.notFoundTitle')}
              </h4>
              <p style="font-size: var(--font-size-xs); color: #7f1d1d; margin: 0;">
                ${t('complaint.tracking.notFoundMsg')}
              </p>
            </div>

            <!-- Success Details & Timeline State -->
            <div id="track-success-state" style="display: none;">
              <!-- Meta Card -->
              <div style="background-color: var(--color-surface-subtle); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-2); margin-bottom: var(--space-3);">
                  <div>
                    <span style="font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">
                      ${t('complaint.trackingIdLabel')}
                    </span>
                    <div id="track-res-code" style="font-size: var(--font-size-base); font-weight: 800; color: var(--color-primary);">
                      SETU-RJ-XXXXXX
                    </div>
                  </div>
                  <div id="track-res-badge"></div>
                </div>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-2); font-size: var(--font-size-xs); border-top: 1px dashed var(--color-border); padding-top: var(--space-2);">
                  <div>
                    <span style="color: var(--color-text-muted);">${t('complaint.tracking.category')}:</span>
                    <strong id="track-res-category"></strong>
                  </div>
                  <div>
                    <span style="color: var(--color-text-muted);">${t('complaint.tracking.villageLocality')}:</span>
                    <strong id="track-res-ward"></strong>
                  </div>
                  <div>
                    <span style="color: var(--color-text-muted);">${t('complaint.tracking.submittedOn')}:</span>
                    <span id="track-res-date"></span>
                  </div>
                </div>
              </div>

              <!-- Redressal Progress Timeline -->
              <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin-bottom: var(--space-2);">
                ${t('complaint.tracking.timelineTitle')}
              </h4>

              <div class="timeline" id="track-res-timeline">
                <!-- Timeline items injected dynamically -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function getStatusBadgeHtml(status) {
  switch (status) {
    case 'resolved':
      return `<span class="badge badge-success">${t('complaint.statuses.resolved')}</span>`;
    case 'in_progress':
      return `<span class="badge badge-warning">${t('complaint.statuses.in_progress')}</span>`;
    case 'under_review':
      return `<span class="badge badge-info">${t('complaint.statuses.under_review')}</span>`;
    case 'closed':
      return `<span class="badge" style="background:#e5e7eb; color:#374151;">${t('complaint.statuses.closed')}</span>`;
    case 'submitted':
    default:
      return `<span class="badge badge-primary">${t('complaint.statuses.submitted')}</span>`;
  }
}

export function initComplaintTrackerEvents() {
  const modal = document.getElementById('modal-tracker');
  const openBtn = document.getElementById('btn-open-track-modal');
  const closeBtn = document.getElementById('btn-close-tracker-modal');
  const form = document.getElementById('form-track-complaint');

  const initialState = document.getElementById('track-initial-state');
  const loadingState = document.getElementById('track-loading-state');
  const errorState = document.getElementById('track-error-state');
  const successState = document.getElementById('track-success-state');

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const trackingCode = document.getElementById('track-code-input').value;
      const last4 = document.getElementById('track-last4-input').value;

      initialState.style.display = 'none';
      errorState.style.display = 'none';
      successState.style.display = 'none';
      loadingState.style.display = 'block';

      try {
        const result = await trackComplaint(trackingCode, last4);
        loadingState.style.display = 'none';

        if (result.found && result.data) {
          successState.style.display = 'block';
          const d = result.data;

          document.getElementById('track-res-code').textContent = d.tracking_code;
          document.getElementById('track-res-badge').innerHTML = getStatusBadgeHtml(d.status);

          const categoryKey = `complaint.categories.${d.category}`;
          document.getElementById('track-res-category').textContent = t(categoryKey, d.category);
          document.getElementById('track-res-ward').textContent = d.ward_locality;

          const dateObj = new Date(d.submitted_at);
          document.getElementById('track-res-date').textContent = dateObj.toLocaleDateString('hi-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          // Build timeline items
          const timelineContainer = document.getElementById('track-res-timeline');
          timelineContainer.innerHTML = (d.history || []).map(item => {
            const itemDate = new Date(item.created_at).toLocaleString('hi-IN', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                    <strong>${t(`complaint.statuses.${item.status}`, item.status)}</strong>
                    <span style="color: var(--color-text-muted); font-size: 0.7rem;">${itemDate}</span>
                  </div>
                  <p style="margin: 0; color: var(--color-text-main); font-size: 0.8rem;">
                    ${item.public_note || t(`complaint.statusTimelines.${item.status}Desc`, '')}
                  </p>
                </div>
              </div>
            `;
          }).join('');

        } else {
          errorState.style.display = 'block';
        }
      } catch (err) {
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
      }
    });
  }
}
