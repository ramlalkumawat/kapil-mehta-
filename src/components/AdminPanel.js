/**
 * Sarpanch / Staff Admin Panel Modal Component
 * Protected portal for authorized grievance inspection, status updates,
 * and public resolution note dispatches.
 */

import { t } from '../locales/i18n.js';
import { getStaffComplaints, updateComplaintStatus } from '../services/complaintService.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderAdminPanel() {
  return `
    <div id="modal-admin" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-modal-heading">
      <div class="modal-container" style="max-width: 720px;">
        <!-- Header -->
        <div class="modal-header">
          <div>
            <h3 id="admin-modal-heading" class="modal-title">${t('admin.title')}</h3>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
              अधिकृत जनप्रतिनिधि / सचिव कार्यक्षेत्र
            </p>
          </div>
          <button id="btn-close-admin-modal" class="modal-close-btn" aria-label="${t('actions.close')}">&times;</button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Auth Gate View -->
          <div id="admin-auth-view" style="max-width: 360px; margin: var(--space-4) auto; text-align: center;">
            <div style="width: 48px; height: 48px; background-color: var(--color-primary-subtle); color: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-3);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <h4 style="font-size: var(--font-size-base); color: var(--color-primary-dark); margin-bottom: var(--space-2);">
              ${t('admin.pinLabel')}
            </h4>

            <form id="form-admin-auth">
              <input 
                type="password" 
                id="admin-pin-input" 
                class="form-input" 
                placeholder="${t('admin.pinPlaceholder')}" 
                required 
                style="text-align: center; font-size: 1.1rem; letter-spacing: 0.15em; margin-bottom: var(--space-3);" 
              />
              <div id="admin-auth-err" class="form-error" style="display: none; margin-bottom: var(--space-3);">
                ${t('admin.invalidPin')}
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">
                ${t('admin.loginBtn')}
              </button>
            </form>
            <p style="font-size: 0.72rem; color: var(--color-text-light); margin-top: var(--space-3);">
              डेमो पिन: <code>sarpanch789</code>
            </p>
          </div>

          <!-- Authenticated Staff Management View (Hidden initially) -->
          <div id="admin-dashboard-view" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); border-bottom: 1px solid var(--color-border); padding-bottom: var(--space-2);">
              <span class="badge badge-success">
                🔒 ${t('admin.accessGranted')}
              </span>
              <button id="btn-admin-logout" class="btn btn-sm btn-outline">
                ${t('admin.logoutBtn')}
              </button>
            </div>

            <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
              ${t('admin.complaintListTitle')}
            </h4>

            <div id="admin-complaints-list" style="display: flex; flex-direction: column; gap: var(--space-3); max-height: 50vh; overflow-y: auto;">
              <!-- Dynamically populated complaints -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initAdminPanelEvents() {
  const modal = document.getElementById('modal-admin');
  const openBtn = document.getElementById('btn-open-admin');
  const closeBtn = document.getElementById('btn-close-admin-modal');
  const authForm = document.getElementById('form-admin-auth');
  const authView = document.getElementById('admin-auth-view');
  const dashView = document.getElementById('admin-dashboard-view');
  const authErr = document.getElementById('admin-auth-err');
  const logoutBtn = document.getElementById('btn-admin-logout');

  let currentPin = '';

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (!currentPin) {
        authView.style.display = 'block';
        dashView.style.display = 'none';
        authErr.style.display = 'none';
      }
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

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      currentPin = '';
      authView.style.display = 'block';
      dashView.style.display = 'none';
      document.getElementById('admin-pin-input').value = '';
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      authErr.style.display = 'none';
      const pin = document.getElementById('admin-pin-input').value;

      const result = await getStaffComplaints(activeCandidate.id, pin);
      if (result.success) {
        currentPin = pin;
        authView.style.display = 'none';
        dashView.style.display = 'block';
        renderAdminComplaints(result.complaints, pin);
      } else {
        authErr.style.display = 'block';
      }
    });
  }
}

function renderAdminComplaints(complaints, pin) {
  const container = document.getElementById('admin-complaints-list');
  if (!container) return;

  if (complaints.length === 0) {
    container.innerHTML = `<p style="font-size: var(--font-size-xs); color: var(--color-text-muted); text-align: center; padding: var(--space-4);">इस पंचायत के लिए कोई नई शिकायत दर्ज नहीं है।</p>`;
    return;
  }

  container.innerHTML = complaints.map(c => `
    <div style="background-color: var(--color-surface-subtle); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: var(--space-2); margin-bottom: var(--space-2);">
        <div>
          <strong style="color: var(--color-primary); font-size: var(--font-size-sm);">${c.tracking_code}</strong>
          <span style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-left: 6px;">(${c.citizen_name} - ${c.ward_locality})</span>
        </div>
        <span class="badge badge-primary">${t(`complaint.statuses.${c.status}`, c.status)}</span>
      </div>

      <p style="font-size: var(--font-size-xs); color: var(--color-text-main); margin-bottom: var(--space-3); line-height: 1.5;">
        ${c.description}
      </p>

      <!-- Status Updater Form -->
      <form class="form-admin-update-status" data-code="${c.tracking_code}" style="display: flex; flex-direction: column; gap: var(--space-2); border-top: 1px dashed var(--color-border); padding-top: var(--space-2);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2);">
          <div>
            <label style="font-size: 0.7rem; font-weight: 600; color: var(--color-text-muted);">${t('admin.updateStatusLabel')}</label>
            <select name="newStatus" class="form-select" style="padding: 0.4rem; font-size: var(--font-size-xs);">
              <option value="submitted" ${c.status === 'submitted' ? 'selected' : ''}>${t('complaint.statuses.submitted')}</option>
              <option value="under_review" ${c.status === 'under_review' ? 'selected' : ''}>${t('complaint.statuses.under_review')}</option>
              <option value="in_progress" ${c.status === 'in_progress' ? 'selected' : ''}>${t('complaint.statuses.in_progress')}</option>
              <option value="resolved" ${c.status === 'resolved' ? 'selected' : ''}>${t('complaint.statuses.resolved')}</option>
              <option value="closed" ${c.status === 'closed' ? 'selected' : ''}>${t('complaint.statuses.closed')}</option>
            </select>
          </div>

          <div>
            <label style="font-size: 0.7rem; font-weight: 600; color: var(--color-text-muted);">${t('admin.adminNotesLabel')}</label>
            <input type="text" name="publicNote" class="form-input" style="padding: 0.4rem; font-size: var(--font-size-xs);" placeholder="${t('admin.adminNotesPlaceholder')}" />
          </div>
        </div>

        <button type="submit" class="btn btn-sm btn-primary" style="align-self: flex-end;">
          ${t('admin.saveStatusBtn')}
        </button>
      </form>
    </div>
  `).join('');

  // Wire updater submissions
  container.querySelectorAll('.form-admin-update-status').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = form.getAttribute('data-code');
      const newStatus = form.newStatus.value;
      const note = form.publicNote.value;

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      const res = await updateComplaintStatus(code, newStatus, note, pin);
      if (res.success) {
        alert(t('admin.statusUpdatedSuccess'));
        const refreshed = await getStaffComplaints(activeCandidate.id, pin);
        renderAdminComplaints(refreshed.complaints, pin);
      } else {
        alert('Failed to update status');
      }
      submitBtn.disabled = false;
    });
  });
}
