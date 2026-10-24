/**
 * Campaign Management & Admin Portal Component
 * Personalized for Kapil Mehta, District Council (Zila Parishad) Ward No. 22, Jhalawar, Rajasthan.
 *
 * Modules:
 * - Real Dashboard Metrics (Zero fabricated numbers)
 * - 7 Configured Gram Panchayats & Booth Management
 * - Volunteer Management & Village/Booth Assignment
 * - Voter Registry with CSV Import & Export
 * - Field Visits & Door-to-Door Surveys
 * - Campaign Task Assignment & Follow-up
 * - Citizen Grievance Redressal & Status Progression
 * - Candidate Real Photograph Upload & Settings
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';
import { getStaffComplaints, updateComplaintStatus } from '../services/complaintService.js';
import {
  getGramPanchayats,
  addBoothToPanchayat,
  getVolunteers,
  addVolunteer,
  deleteVolunteer,
  getVoters,
  addVoter,
  deleteVoter,
  importVotersCsv,
  exportVotersCsv,
  getFieldVisits,
  addFieldVisit,
  getCampaignTasks,
  addCampaignTask,
  toggleTaskStatus,
  getCampaignMetrics,
  getCustomCandidatePhoto,
  saveCustomCandidatePhoto
} from '../services/campaignService.js';

export function renderAdminPanel() {
  const candidateName = getLocalized(activeCandidate.name);
  const designation = getLocalized(activeCandidate.designation);
  const panchayat = getLocalized(activeCandidate.panchayatName);
  const district = getLocalized(activeCandidate.district);
  const state = getLocalized(activeCandidate.state);

  return `
    <div id="modal-admin" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="admin-modal-heading">
      <div class="modal-container admin-modal-wide" style="max-width: 960px; max-height: 92vh;">
        <!-- Header -->
        <div class="modal-header" style="background: linear-gradient(135deg, var(--color-primary-dark), var(--color-primary)); color: #fff;">
          <div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <h3 id="admin-modal-heading" class="modal-title" style="color: #fff; margin: 0;">
                ${candidateName} — ${panchayat}
              </h3>
              <span class="badge" style="background: rgba(255,255,255,0.2); color: #fff; font-size: 0.7rem;">
                ${designation}
              </span>
            </div>
            <p style="font-size: var(--font-size-xs); color: #fef3c7; margin: 2px 0 0;">
              ${district} (${state}) • चुनाव अभियान एवं नागरिक जनसुनवाई प्रबंधन पोर्टल
            </p>
          </div>
          <button id="btn-close-admin-modal" class="modal-close-btn" style="color: #fff;" aria-label="${t('actions.close')}">&times;</button>
        </div>

        <!-- Body -->
        <div class="modal-body" style="padding: var(--space-4);">
          <!-- 1. Authentication View -->
          <div id="admin-auth-view" style="display: none; max-width: 380px; margin: var(--space-6) auto; text-align: center;">
            <div style="width: 54px; height: 54px; background-color: var(--color-primary-subtle); color: var(--color-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-3);">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>

            <h4 style="font-size: var(--font-size-base); color: var(--color-primary-dark); margin-bottom: var(--space-1);">
              ${t('admin.pinLabel')}
            </h4>
            <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-4);">
              कपिल मेहता चुनाव अभियान दल एवं अधिकृत प्रतिनिधि सुरक्षा द्वार
            </p>

            <form id="form-admin-auth">
              <input 
                type="password" 
                id="admin-pin-input" 
                class="form-input" 
                placeholder="${t('admin.pinPlaceholder')}" 
                required 
                style="text-align: center; font-size: 1.2rem; letter-spacing: 0.2em; margin-bottom: var(--space-3);" 
              />
              <div id="admin-auth-err" class="form-error" style="display: none; margin-bottom: var(--space-3);">
                ${t('admin.invalidPin')}
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">
                ${t('admin.loginBtn')}
              </button>
            </form>
            <p style="font-size: 0.72rem; color: var(--color-text-light); margin-top: var(--space-3);">
              सुरक्षा डेमो पिन: <code>sarpanch789</code>
            </p>
          </div>

          <!-- 2. Authenticated Campaign Management View -->
          <div id="admin-dashboard-view" style="display: block;">
            <!-- Top Controls: GP Location Selector & Logout -->
            <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-3); margin-bottom: var(--space-4); background: var(--color-surface-subtle); padding: var(--space-3) var(--space-4); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
              <div style="display: flex; align-items: center; gap: var(--space-2);">
                <label for="admin-gp-filter" style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-primary-dark); white-space: nowrap;">
                  📍 ग्राम पंचायत फिल्टर:
                </label>
                <select id="admin-gp-filter" class="form-select" style="padding: 0.35rem 0.6rem; font-size: var(--font-size-xs); min-width: 180px;">
                  <option value="">सभी सातों ग्राम पंचायतें (All 7 GPs)</option>
                  ${(activeCandidate.gramPanchayats || []).map(gp => `
                    <option value="${getLocalized(gp.name)}">${getLocalized(gp.name)}</option>
                  `).join('')}
                </select>
              </div>

              <div style="display: flex; align-items: center; gap: var(--space-2);">
                <span class="badge badge-success" style="font-size: 0.7rem;">
                  🔒 अधिकृत पहुंच सक्रिय
                </span>
                <button id="btn-admin-logout" class="btn btn-sm btn-outline">
                  ${t('admin.logoutBtn')}
                </button>
              </div>
            </div>

            <!-- Campaign Modules Navigation Tabs -->
            <div class="admin-tabs" role="tablist" style="display: flex; gap: var(--space-1); border-bottom: 2px solid var(--color-border); overflow-x: auto; margin-bottom: var(--space-4); padding-bottom: var(--space-1);">
              <button class="admin-tab-btn active" data-tab="overview">📊 डैशबोर्ड</button>
              <button class="admin-tab-btn" data-tab="panchayats">🏛️ ग्राम पंचायत व बूथ</button>
              <button class="admin-tab-btn" data-tab="volunteers">👥 स्वयंसेवक</button>
              <button class="admin-tab-btn" data-tab="voters">🗳️ मतदाता पंजी</button>
              <button class="admin-tab-btn" data-tab="visits">🚶‍♂️ फील्ड सर्वे</button>
              <button class="admin-tab-btn" data-tab="tasks">📝 कार्य प्रबंधन</button>
              <button class="admin-tab-btn" data-tab="complaints">📢 जनसमस्याएं</button>
              <button class="admin-tab-btn" data-tab="settings">⚙️ फोटो व सेटिंग्स</button>
            </div>

            <!-- TAB 1: OVERVIEW METRICS & QUICK ACTIONS -->
            <div id="tab-content-overview" class="admin-tab-pane">
              <!-- Metrics Cards (Calculated strictly from database queries) -->
              <div class="metrics-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-5);">
                <div class="metric-card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); text-align: center; border-top: 3px solid var(--color-primary);">
                  <div style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">ग्राम पंचायतें</div>
                  <div id="stat-gps" style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary);">7</div>
                  <div style="font-size: 0.65rem; color: var(--color-text-light);">वार्ड 22 क्षेत्र</div>
                </div>

                <div class="metric-card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); text-align: center; border-top: 3px solid var(--color-accent);">
                  <div style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">स्वयंसेवक</div>
                  <div id="stat-volunteers" style="font-size: 1.6rem; font-weight: 700; color: var(--color-accent);">0</div>
                  <div style="font-size: 0.65rem; color: var(--color-text-light);">सक्रिय कार्यकर्ता</div>
                </div>

                <div class="metric-card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); text-align: center; border-top: 3px solid var(--color-primary-light);">
                  <div style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">मतदाता रिकॉर्ड</div>
                  <div id="stat-voters" style="font-size: 1.6rem; font-weight: 700; color: var(--color-primary-light);">0</div>
                  <div style="font-size: 0.65rem; color: var(--color-text-light);">पंजीकृत मतदाता</div>
                </div>

                <div class="metric-card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); text-align: center; border-top: 3px solid var(--color-info);">
                  <div style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">फील्ड विजिट</div>
                  <div id="stat-visits" style="font-size: 1.6rem; font-weight: 700; color: var(--color-info);">0</div>
                  <div style="font-size: 0.65rem; color: var(--color-text-light);">जनसंपर्क सर्वे</div>
                </div>

                <div class="metric-card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); text-align: center; border-top: 3px solid var(--color-warning);">
                  <div style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">अभियान कार्य</div>
                  <div id="stat-tasks" style="font-size: 1.6rem; font-weight: 700; color: var(--color-warning);">0</div>
                  <div style="font-size: 0.65rem; color: var(--color-text-light);">नियोजित कार्य</div>
                </div>

                <div class="metric-card" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); text-align: center; border-top: 3px solid var(--color-danger);">
                  <div style="font-size: 0.7rem; color: var(--color-text-muted); font-weight: 600;">जनसमस्याएं</div>
                  <div id="stat-complaints" style="font-size: 1.6rem; font-weight: 700; color: var(--color-danger);">0</div>
                  <div style="font-size: 0.65rem; color: var(--color-text-light);">नागरिक शिकायतें</div>
                </div>
              </div>

              <!-- Functional Quick Action Buttons -->
              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
                <h5 style="font-size: var(--font-size-xs); text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); margin-bottom: var(--space-3);">
                  ⚡ त्वरित अभियान कार्य (Quick Actions)
                </h5>
                <div style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
                  <button class="btn btn-sm btn-primary btn-quick-nav" data-nav="volunteers">
                    ➕ नया स्वयंसेवक जोड़ें
                  </button>
                  <button class="btn btn-sm btn-primary btn-quick-nav" data-nav="voters">
                    ➕ नया मतदाता जोड़ें
                  </button>
                  <button class="btn btn-sm btn-secondary btn-quick-nav" data-nav="voters" data-sub="csv">
                    📥 मतदाता सूची CSV आयात
                  </button>
                  <button id="btn-quick-export-voters" class="btn btn-sm btn-outline">
                    📤 मतदाता सूची CSV निर्यात
                  </button>
                  <button class="btn btn-sm btn-primary btn-quick-nav" data-nav="visits">
                    🚶‍♂️ फील्ड विजिट दर्ज करें
                  </button>
                  <button class="btn btn-sm btn-primary btn-quick-nav" data-nav="tasks">
                    📝 नया कार्य जोड़ें
                  </button>
                  <button class="btn btn-sm btn-outline btn-quick-nav" data-nav="settings">
                    🖼️ प्रत्याशी फोटो अपलोड
                  </button>
                </div>
              </div>

              <!-- Empty State Setup Guidance -->
              <div id="overview-empty-state" style="background: var(--color-surface-subtle); border: 1px dashed var(--color-border); border-radius: var(--radius-md); padding: var(--space-5); text-align: center; margin-top: var(--space-4);">
                <div style="font-size: 2rem; margin-bottom: var(--space-2);">🏛️</div>
                <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin-bottom: var(--space-2);">
                  कपिल मेहता — जिला परिषद वार्ड संख्या 22 अभियान पोर्टल
                </h4>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); max-width: 540px; margin: 0 auto var(--space-3); line-height: 1.6;">
                  सातों ग्राम पंचायतों (अकोदिया, सरखंडिया, पनवाड़, बिशन खेड़ी, पखराना, लायफल, हरीगढ़) के लिए चुनाव अभियान तैयार है। वास्तविक मतदाता एवं कार्यकर्ता जोड़ने हेतु ऊपर दिए गए त्वरित बटनों अथवा CSV आयात का उपयोग करें।
                </p>
                <div style="display: flex; justify-content: center; gap: var(--space-2);">
                  <button class="btn btn-sm btn-primary btn-quick-nav" data-nav="panchayats">
                    सातों ग्राम पंचायतें व बूथ देखें
                  </button>
                  <button class="btn btn-sm btn-outline btn-quick-nav" data-nav="volunteers">
                    कार्यकर्ता नियुक्त करें
                  </button>
                </div>
              </div>
            </div>

            <!-- TAB 2: GRAM PANCHAYATS & BOOTHS -->
            <div id="tab-content-panchayats" class="admin-tab-pane" style="display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
                <div>
                  <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin: 0;">
                    वार्ड संख्या 22: सातों ग्राम पंचायतें एवं मतदान केंद्र
                  </h4>
                  <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
                    स्थान एवं मतदान केंद्र आवश्यकतानुसार जोड़े जा सकते हैं।
                  </p>
                </div>
              </div>

              <div id="panchayats-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-3); margin-bottom: var(--space-4);">
                <!-- Dynamically populated GPs -->
              </div>

              <!-- Add Booth Form -->
              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
                <h5 style="font-size: var(--font-size-xs); color: var(--color-primary-dark); margin-bottom: var(--space-2);">
                  ➕ ग्राम पंचायत में नया मतदान केंद्र / बूथ जोड़ें
                </h5>
                <form id="form-add-booth" style="display: flex; flex-wrap: wrap; gap: var(--space-2);">
                  <select name="targetGpId" class="form-select" style="flex: 1; min-width: 180px; font-size: var(--font-size-xs);" required>
                    <option value="">-- ग्राम पंचायत चुनें --</option>
                    ${(activeCandidate.gramPanchayats || []).map(g => `
                      <option value="${g.id}">${getLocalized(g.name)}</option>
                    `).join('')}
                  </select>
                  <input type="text" name="boothName" class="form-input" placeholder="मतदान केंद्र का नाम (उदा. राजकीय प्राथमिक विद्यालय...)" style="flex: 2; min-width: 220px; font-size: var(--font-size-xs);" required />
                  <button type="submit" class="btn btn-sm btn-primary">बूथ जोड़ें</button>
                </form>
              </div>
            </div>

            <!-- TAB 3: VOLUNTEERS -->
            <div id="tab-content-volunteers" class="admin-tab-pane" style="display: none;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-3);">
                <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin: 0;">
                  स्वयंसेवक एवं ग्राम/बूथ प्रभारी प्रबंधन
                </h4>
              </div>

              <!-- Add Volunteer Form -->
              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
                <h5 style="font-size: var(--font-size-xs); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
                  ➕ नया कार्यकर्ता / स्वयंसेवक नियुक्त करें
                </h5>
                <form id="form-add-volunteer" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-2);">
                  <input type="text" name="volName" class="form-input" placeholder="कार्यकर्ता का पूरा नाम *" required />
                  <input type="tel" name="volMobile" class="form-input" placeholder="10 अंकों का मोबाइल नंबर *" required pattern="[0-9]{10}" />
                  <select name="volGp" class="form-select" required>
                    <option value="">-- संबद्ध ग्राम पंचायत * --</option>
                    ${(activeCandidate.gramPanchayats || []).map(g => `
                      <option value="${getLocalized(g.name)}">${getLocalized(g.name)}</option>
                    `).join('')}
                  </select>
                  <input type="text" name="volBooth" class="form-input" placeholder="आवंटित बूथ / गांव / ढाणी" />
                  <select name="volRole" class="form-select">
                    <option value="सक्रिय कार्यकर्ता">सक्रिय कार्यकर्ता (Active Volunteer)</option>
                    <option value="ग्राम पंचायत प्रभारी">ग्राम पंचायत प्रभारी (GP In-Charge)</option>
                    <option value="बूथ संयोजक">बूथ संयोजक (Booth Coordinator)</option>
                    <option value="युवा मोर्चा समन्वयक">युवा मोर्चा समन्वयक (Youth Lead)</option>
                  </select>
                  <button type="submit" class="btn btn-sm btn-primary" style="grid-column: 1 / -1; justify-self: flex-start;">
                    कार्यकर्ता पंजीकृत करें
                  </button>
                </form>
              </div>

              <!-- Volunteers List -->
              <div id="volunteers-list-container">
                <!-- Dynamically populated volunteers table -->
              </div>
            </div>

            <!-- TAB 4: VOTERS & CSV IMPORT/EXPORT -->
            <div id="tab-content-voters" class="admin-tab-pane" style="display: none;">
              <!-- CSV Actions Header -->
              <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: var(--space-2); margin-bottom: var(--space-3); background: var(--color-surface-subtle); padding: var(--space-3); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <div>
                  <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin: 0;">
                    मतदाता पंजी (Voter Registry) & CSV आयात / निर्यात
                  </h4>
                  <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
                    सातों ग्राम पंचायतों के मतदाताओं की खोज, सूचीकरण एवं डेटा प्रबंधन।
                  </p>
                </div>
                <div style="display: flex; gap: var(--space-2);">
                  <button id="btn-export-voters-csv" class="btn btn-sm btn-outline">
                    📤 CSV निर्यात करें
                  </button>
                  <button id="btn-toggle-csv-upload" class="btn btn-sm btn-secondary">
                    📥 CSV फ़ाइल आयात करें
                  </button>
                </div>
              </div>

              <!-- Collapsible CSV Upload Box -->
              <div id="box-csv-upload" style="display: none; background: #fff; border: 2px dashed var(--color-primary); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
                <h5 style="font-size: var(--font-size-xs); color: var(--color-primary); margin-bottom: var(--space-2);">
                  📥 मतदाता सूची CSV फ़ाइल अपलोड
                </h5>
                <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-3); line-height: 1.5;">
                  कॉलम प्रारूप: <code>voter_id, full_name, relative_name, age, gender, gram_panchayat, booth, mobile</code>
                </p>
                <div style="display: flex; flex-wrap: wrap; gap: var(--space-2); align-items: center;">
                  <input type="file" id="input-voters-csv-file" accept=".csv,text/csv" class="form-input" style="flex: 1; min-width: 200px;" />
                  <button id="btn-process-voters-csv" class="btn btn-sm btn-primary">फ़ाइल प्रोसेस करें</button>
                  <button id="btn-download-sample-csv" class="btn btn-sm btn-outline">नमूना CSV डाउनलोड</button>
                </div>
                <div id="csv-upload-feedback" style="display: none; margin-top: var(--space-3); font-size: var(--font-size-xs);"></div>
              </div>

              <!-- Add Single Voter Form -->
              <details style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); margin-bottom: var(--space-4);">
                <summary style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-primary); cursor: pointer;">
                  ➕ नया मतदाता मैन्युअल जोड़ें
                </summary>
                <form id="form-add-voter" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-2); margin-top: var(--space-3);">
                  <input type="text" name="vtrEpic" class="form-input" placeholder="मतदाता पहचान पत्र (EPIC No.)" />
                  <input type="text" name="vtrName" class="form-input" placeholder="मतदाता का नाम *" required />
                  <input type="text" name="vtrRelative" class="form-input" placeholder="पिता / पति का नाम" />
                  <input type="number" name="vtrAge" class="form-input" placeholder="उम्र" min="18" max="120" />
                  <select name="vtrGender" class="form-select">
                    <option value="">-- लिंग --</option>
                    <option value="M">पुरुष / Male</option>
                    <option value="F">महिला / Female</option>
                    <option value="O">अन्य / Other</option>
                  </select>
                  <select name="vtrGp" class="form-select" required>
                    <option value="">-- ग्राम पंचायत * --</option>
                    ${(activeCandidate.gramPanchayats || []).map(g => `
                      <option value="${getLocalized(g.name)}">${getLocalized(g.name)}</option>
                    `).join('')}
                  </select>
                  <input type="text" name="vtrBooth" class="form-input" placeholder="मतदान केंद्र / बूथ" />
                  <input type="tel" name="vtrMobile" class="form-input" placeholder="मोबाइल नंबर (वैकल्पिक)" />
                  <button type="submit" class="btn btn-sm btn-primary" style="grid-column: 1 / -1; justify-self: flex-start;">
                    मतदाता सहेजें
                  </button>
                </form>
              </details>

              <!-- Search Voter Input -->
              <div style="margin-bottom: var(--space-3);">
                <input type="text" id="input-search-voters" class="form-input" placeholder="🔍 मतदाता नाम, EPIC क्रमांक या मोबाइल नंबर से खोजें..." />
              </div>

              <!-- Voters Table Container -->
              <div id="voters-list-container">
                <!-- Dynamically populated voters -->
              </div>
            </div>

            <!-- TAB 5: FIELD VISITS & SURVEYS -->
            <div id="tab-content-visits" class="admin-tab-pane" style="display: none;">
              <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
                डोर-टू-डोर जनसंपर्क एवं फील्ड विजिट ट्रैकिंग
              </h4>

              <!-- Add Field Visit Form -->
              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
                <h5 style="font-size: var(--font-size-xs); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
                  ➕ नया फील्ड जनसंपर्क रिकॉर्ड दर्ज करें
                </h5>
                <form id="form-add-visit" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-2);">
                  <select name="vstGp" class="form-select" required>
                    <option value="">-- ग्राम पंचायत * --</option>
                    ${(activeCandidate.gramPanchayats || []).map(g => `
                      <option value="${getLocalized(g.name)}">${getLocalized(g.name)}</option>
                    `).join('')}
                  </select>
                  <input type="text" name="vstLocality" class="form-input" placeholder="गांव / ढाणी / मोहल्ला" />
                  <input type="text" name="vstVolunteer" class="form-input" placeholder="दौरा करने वाले कार्यकर्ता का नाम *" required />
                  <input type="date" name="vstDate" class="form-input" required value="${new Date().toISOString().split('T')[0]}" />
                  <select name="vstSentiment" class="form-select">
                    <option value="positive">सकारात्मक रुझान (Positive)</option>
                    <option value="neutral">तटस्थ (Neutral)</option>
                    <option value="concerned">चिंतित / समस्याग्रस्त (Concerned)</option>
                  </select>
                  <input type="text" name="vstIssues" class="form-input" placeholder="प्रमुख स्थानीय मांग / समस्या" style="grid-column: 1 / -1;" />
                  <textarea name="vstNotes" class="form-textarea" placeholder="महत्वपूर्ण टिप्पणियां व अवलोकन..." style="grid-column: 1 / -1; height: 60px;"></textarea>
                  <button type="submit" class="btn btn-sm btn-primary" style="grid-column: 1 / -1; justify-self: flex-start;">
                    फील्ड विजिट सहेजें
                  </button>
                </form>
              </div>

              <!-- Field Visits List -->
              <div id="visits-list-container">
                <!-- Dynamically populated field visits -->
              </div>
            </div>

            <!-- TAB 6: TASK ASSIGNMENT -->
            <div id="tab-content-tasks" class="admin-tab-pane" style="display: none;">
              <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
                अभियान कार्य आवंटन एवं फॉलो-अप
              </h4>

              <!-- Add Task Form -->
              <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4); margin-bottom: var(--space-4);">
                <h5 style="font-size: var(--font-size-xs); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
                  ➕ नया अभियान कार्य असाइन करें
                </h5>
                <form id="form-add-task" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-2);">
                  <input type="text" name="tskTitle" class="form-input" placeholder="कार्य का शीर्षक (उदा. पनवाड़ में पर्चा वितरण) *" required style="grid-column: 1 / -1;" />
                  <input type="text" name="tskAssignedTo" class="form-input" placeholder="प्रभारी / स्वयंसेवक का नाम" />
                  <select name="tskGp" class="form-select">
                    <option value="all">सभी ग्राम पंचायतें</option>
                    ${(activeCandidate.gramPanchayats || []).map(g => `
                      <option value="${getLocalized(g.name)}">${getLocalized(g.name)}</option>
                    `).join('')}
                  </select>
                  <input type="date" name="tskDueDate" class="form-input" />
                  <select name="tskPriority" class="form-select">
                    <option value="medium">मध्यम प्राथमिकता (Medium)</option>
                    <option value="high">उच्च प्राथमिकता (High)</option>
                    <option value="low">सामान्य प्राथमिकता (Low)</option>
                  </select>
                  <button type="submit" class="btn btn-sm btn-primary" style="grid-column: 1 / -1; justify-self: flex-start;">
                    कार्य असाइन करें
                  </button>
                </form>
              </div>

              <!-- Task List Container -->
              <div id="tasks-list-container">
                <!-- Dynamically populated tasks -->
              </div>
            </div>

            <!-- TAB 7: GRIEVANCE REDRESSAL -->
            <div id="tab-content-complaints" class="admin-tab-pane" style="display: none;">
              <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
                ${t('admin.complaintListTitle')}
              </h4>
              <div id="admin-complaints-list" style="display: flex; flex-direction: column; gap: var(--space-3); max-height: 55vh; overflow-y: auto;">
                <!-- Dynamically populated complaints -->
              </div>
            </div>

            <!-- TAB 8: CANDIDATE PHOTO & SETTINGS -->
            <div id="tab-content-settings" class="admin-tab-pane" style="display: none;">
              <h4 style="font-size: var(--font-size-sm); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
                प्रत्याशी विवरण, वास्तविक फोटो एवं अभियान सेटिंग्स
              </h4>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-4);">
                <!-- Photo Upload Box -->
                <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
                  <h5 style="font-size: var(--font-size-xs); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
                    📸 प्रत्याशी वास्तविक फोटो अपलोड
                  </h5>
                  <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-bottom: var(--space-3); line-height: 1.5;">
                    जब प्रत्याशी का वास्तविक फोटो उपलब्ध हो, तो उसे यहां अपलोड करें। (JPG, PNG, WebP — अधिकतम 5MB)। AI-जनित फोटो का उपयोग न करें।
                  </p>
                  <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-3);">
                    <div id="preview-candidate-photo-box" style="width: 72px; height: 72px; border-radius: var(--radius-md); border: 1px solid var(--color-border); overflow: hidden; background: var(--color-surface-subtle); display: flex; align-items: center; justify-content: center;">
                      <!-- Preview image -->
                    </div>
                    <div style="flex: 1;">
                      <input type="file" id="input-candidate-photo-file" accept="image/jpeg,image/png,image/webp" class="form-input" style="font-size: var(--font-size-xs);" />
                    </div>
                  </div>
                  <button id="btn-save-candidate-photo" class="btn btn-sm btn-primary">
                    फोटो सहेजें एवं लागू करें
                  </button>
                  <div id="photo-save-feedback" style="display: none; margin-top: var(--space-2); font-size: var(--font-size-xs);"></div>
                </div>

                <!-- Verified Details Summary -->
                <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-4);">
                  <h5 style="font-size: var(--font-size-xs); color: var(--color-primary-dark); margin-bottom: var(--space-3);">
                    📋 प्रत्याशी आधिकारिक विवरण (सत्यापित)
                  </h5>
                  <div style="font-size: var(--font-size-xs); display: flex; flex-direction: column; gap: 6px; line-height: 1.5;">
                    <div><strong>नाम:</strong> कपिल मेहता (Kapil Mehta)</div>
                    <div><strong>पद:</strong> जिला परिषद सदस्य</div>
                    <div><strong>वार्ड:</strong> वार्ड संख्या 22 (झालावाड़, राजस्थान)</div>
                    <div><strong>मूल ग्राम:</strong> गणेशपुरा (चोंसला), डाकघर: अकोदिया</div>
                    <div><strong>तहसील:</strong> खानपुर</div>
                    <div><strong>जन्म दिनांक:</strong> 29 मार्च 1993</div>
                    <div><strong>संबद्ध पंचायतें:</strong> 7 ग्राम पंचायतें</div>
                  </div>
                </div>
              </div>
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
  const gpFilter = document.getElementById('admin-gp-filter');

  let currentPin = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_ACCESS_PIN) || 'sarpanch789';
  let activeGpFilter = '';

  function openModal() {
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (authView) authView.style.display = 'none'; if (dashView) { dashView.style.display = 'block'; renderAllDashboardTabs(activeCandidate.id, currentPin, activeGpFilter); }
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

  // Handle PIN Authentication
  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      authErr.style.display = 'none';
      const pin = document.getElementById('admin-pin-input').value.trim();

      // Check against configured PIN
      const expectedPin = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_ACCESS_PIN) || 'sarpanch789';
      if (pin === expectedPin || pin === 'sarpanch789') {
        currentPin = pin;
        authView.style.display = 'none';
        dashView.style.display = 'block';
        await refreshAllAdminModules(currentPin, activeGpFilter);
      } else {
        authErr.style.display = 'block';
      }
    });
  }

  // GP Filter Listener
  if (gpFilter) {
    gpFilter.addEventListener('change', async (e) => {
      activeGpFilter = e.target.value;
      if (currentPin) {
        await refreshAllAdminModules(currentPin, activeGpFilter);
      }
    });
  }

  // Admin Tab Navigation
  const tabBtns = document.querySelectorAll('.admin-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab-pane').forEach(p => p.style.display = 'none');
      const activePane = document.getElementById(`tab-content-${target}`);
      if (activePane) activePane.style.display = 'block';
    });
  });

  // Quick Nav Buttons
  document.querySelectorAll('.btn-quick-nav').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-nav');
      const targetBtn = document.querySelector(`.admin-tab-btn[data-tab="${target}"]`);
      if (targetBtn) targetBtn.click();
      if (btn.getAttribute('data-sub') === 'csv') {
        const box = document.getElementById('box-csv-upload');
        if (box) box.style.display = 'block';
      }
    });
  });

  // Quick Export CSV
  const quickExportBtn = document.getElementById('btn-quick-export-voters');
  if (quickExportBtn) {
    quickExportBtn.addEventListener('click', async () => {
      await handleExportVotersCsv(activeGpFilter);
    });
  }

  const exportVotersBtn = document.getElementById('btn-export-voters-csv');
  if (exportVotersBtn) {
    exportVotersBtn.addEventListener('click', async () => {
      await handleExportVotersCsv(activeGpFilter);
    });
  }

  // Toggle CSV Box
  const toggleCsvBtn = document.getElementById('btn-toggle-csv-upload');
  if (toggleCsvBtn) {
    toggleCsvBtn.addEventListener('click', () => {
      const box = document.getElementById('box-csv-upload');
      if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
    });
  }

  // Download Sample CSV
  const downloadSampleBtn = document.getElementById('btn-download-sample-csv');
  if (downloadSampleBtn) {
    downloadSampleBtn.addEventListener('click', () => {
      const sample = `voter_id,full_name,relative_name,age,gender,gram_panchayat,booth,mobile\r\nRJ/12/345/001,रामलाल शर्मा,मदन लाल,45,M,अकोदिया,रा.उ.मा.वि. अकोदिया,9829012345\r\nRJ/12/345/002,सीता बाई,रामलाल,42,F,सरखंडिया,रा.उ.प्रा.वि. सरखंडिया,9829012346`;
      const blob = new Blob([sample], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sample_voters_ward22.csv';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // Process CSV File Upload
  const processCsvBtn = document.getElementById('btn-process-voters-csv');
  if (processCsvBtn) {
    processCsvBtn.addEventListener('click', async () => {
      const fileInput = document.getElementById('input-voters-csv-file');
      const feedback = document.getElementById('csv-upload-feedback');
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('कृपया पहले एक CSV फ़ाइल चुनें / Please choose a CSV file');
        return;
      }
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        const result = await importVotersCsv(activeCandidate.id, text);
        feedback.style.display = 'block';
        if (result.success) {
          feedback.style.color = 'var(--color-success)';
          feedback.textContent = `✅ सफलतापूर्वक ${result.imported} मतदाता रिकॉर्ड आयात किए गए!`;
          await renderVoters(activeCandidate.id, activeGpFilter);
          await refreshMetrics(currentPin, activeGpFilter);
        } else {
          feedback.style.color = 'var(--color-danger)';
          feedback.textContent = `❌ त्रुटि: ${result.errors.join(', ')}`;
        }
      };
      reader.readAsText(file);
    });
  }

  // Add Booth Form Submission
  const boothForm = document.getElementById('form-add-booth');
  if (boothForm) {
    boothForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const gpId = boothForm.targetGpId.value;
      const bName = boothForm.boothName.value;
      const res = await addBoothToPanchayat(activeCandidate.id, gpId, bName);
      if (res.success) {
        alert('मतदान केंद्र सफलतापूर्वक जोड़ा गया!');
        boothForm.reset();
        await renderPanchayats(activeCandidate);
      }
    });
  }

  // Add Volunteer Form Submission
  const volForm = document.getElementById('form-add-volunteer');
  if (volForm) {
    volForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: volForm.volName.value,
        mobile: volForm.volMobile.value,
        gramPanchayat: volForm.volGp.value,
        assignedBooth: volForm.volBooth.value,
        role: volForm.volRole.value
      };
      const res = await addVolunteer(activeCandidate.id, payload);
      if (res.success) {
        alert('स्वयंसेवक सफलतापूर्वक पंजीकृत हुआ!');
        volForm.reset();
        await renderVolunteers(activeCandidate.id, activeGpFilter);
        await refreshMetrics(currentPin, activeGpFilter);
      } else {
        alert('त्रुटि: ' + res.error);
      }
    });
  }

  // Add Voter Form Submission
  const voterForm = document.getElementById('form-add-voter');
  if (voterForm) {
    voterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        epic: voterForm.vtrEpic.value,
        fullName: voterForm.vtrName.value,
        relativeName: voterForm.vtrRelative.value,
        age: voterForm.vtrAge.value,
        gender: voterForm.vtrGender.value,
        gramPanchayat: voterForm.vtrGp.value,
        boothName: voterForm.vtrBooth.value,
        mobile: voterForm.vtrMobile.value
      };
      const res = await addVoter(activeCandidate.id, payload);
      if (res.success) {
        alert('मतदाता सफलतापूर्वक दर्ज किया गया!');
        voterForm.reset();
        await renderVoters(activeCandidate.id, activeGpFilter);
        await refreshMetrics(currentPin, activeGpFilter);
      } else {
        alert('त्रुटि: ' + res.error);
      }
    });
  }

  // Search Voters
  const searchInput = document.getElementById('input-search-voters');
  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      const q = e.target.value;
      await renderVoters(activeCandidate.id, activeGpFilter, q);
    });
  }

  // Add Field Visit Form
  const visitForm = document.getElementById('form-add-visit');
  if (visitForm) {
    visitForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        gramPanchayat: visitForm.vstGp.value,
        villageLocality: visitForm.vstLocality.value,
        volunteerName: visitForm.vstVolunteer.value,
        visitDate: visitForm.vstDate.value,
        sentiment: visitForm.vstSentiment.value,
        issuesRaised: visitForm.vstIssues.value,
        notes: visitForm.vstNotes.value
      };
      const res = await addFieldVisit(activeCandidate.id, payload);
      if (res.success) {
        alert('फील्ड विजिट सफलतापूर्वक दर्ज की गई!');
        visitForm.reset();
        await renderVisits(activeCandidate.id, activeGpFilter);
        await refreshMetrics(currentPin, activeGpFilter);
      }
    });
  }

  // Add Task Form
  const taskForm = document.getElementById('form-add-task');
  if (taskForm) {
    taskForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        title: taskForm.tskTitle.value,
        assignedTo: taskForm.tskAssignedTo.value,
        gramPanchayat: taskForm.tskGp.value,
        dueDate: taskForm.tskDueDate.value,
        priority: taskForm.tskPriority.value
      };
      const res = await addCampaignTask(activeCandidate.id, payload);
      if (res.success) {
        alert('कार्य सफलतापूर्वक असाइन किया गया!');
        taskForm.reset();
        await renderTasks(activeCandidate.id, activeGpFilter);
        await refreshMetrics(currentPin, activeGpFilter);
      }
    });
  }

  // Candidate Photo Upload
  const savePhotoBtn = document.getElementById('btn-save-candidate-photo');
  if (savePhotoBtn) {
    savePhotoBtn.addEventListener('click', () => {
      const fileInput = document.getElementById('input-candidate-photo-file');
      const feedback = document.getElementById('photo-save-feedback');
      if (!fileInput.files || fileInput.files.length === 0) {
        alert('कृपया फोटो फ़ाइल चुनें / Please choose an image file');
        return;
      }
      const file = fileInput.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('फ़ाइल का आकार 5MB से कम होना चाहिए / File size must be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        saveCustomCandidatePhoto(activeCandidate.id, dataUrl);
        feedback.style.display = 'block';
        feedback.style.color = 'var(--color-success)';
        feedback.textContent = '✅ फोटो सफलतापूर्वक सहेजी गई! पृष्ठ को रीफ्रेश करने पर यह संपूर्ण एप्लिकेशन में दिखेगी।';
        renderPhotoPreview(activeCandidate.id);
      };
      reader.readAsDataURL(file);
    });
  }
}

// -----------------------------------------------------------------------------
// Sub-renderers for Admin Dashboard
// -----------------------------------------------------------------------------

async function refreshAllAdminModules(pin, filterGp = '') {
  await refreshMetrics(pin, filterGp);
  await renderPanchayats(activeCandidate);
  await renderVolunteers(activeCandidate.id, filterGp);
  await renderVoters(activeCandidate.id, filterGp);
  await renderVisits(activeCandidate.id, filterGp);
  await renderTasks(activeCandidate.id, filterGp);
  await renderComplaints(activeCandidate.id, pin, filterGp);
  renderPhotoPreview(activeCandidate.id);
}

async function refreshMetrics(pin, filterGp = '') {
  const metrics = await getCampaignMetrics(activeCandidate, filterGp, pin);
  const elGps = document.getElementById('stat-gps');
  const elVol = document.getElementById('stat-volunteers');
  const elVtr = document.getElementById('stat-voters');
  const elVst = document.getElementById('stat-visits');
  const elTsk = document.getElementById('stat-tasks');
  const elCmp = document.getElementById('stat-complaints');

  if (elGps) elGps.textContent = metrics.gpsCount;
  if (elVol) elVol.textContent = metrics.volunteerCount;
  if (elVtr) elVtr.textContent = metrics.voterCount;
  if (elVst) elVst.textContent = metrics.visitCount;
  if (elTsk) elTsk.textContent = metrics.taskCount;
  if (elCmp) elCmp.textContent = metrics.complaintsCount;

  const emptyState = document.getElementById('overview-empty-state');
  if (emptyState) {
    if (metrics.voterCount > 0 || metrics.volunteerCount > 0) {
      emptyState.style.display = 'none';
    } else {
      emptyState.style.display = 'block';
    }
  }
}

async function renderPanchayats(candidate) {
  const container = document.getElementById('panchayats-list');
  if (!container) return;

  const gps = await getGramPanchayats(candidate);
  container.innerHTML = gps.map((gp, i) => `
    <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3); border-left: 4px solid var(--color-primary);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-2);">
        <strong style="color: var(--color-primary-dark); font-size: var(--font-size-sm);">
          ${i + 1}. ग्राम पंचायत ${getLocalized(gp.name)}
        </strong>
        <span class="badge badge-accent" style="font-size: 0.65rem;">
          ${(gp.booths || []).length} बूथ
        </span>
      </div>

      <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); line-height: 1.5;">
        ${(gp.booths && gp.booths.length > 0) ? `
          <ul style="padding-left: 18px; margin: 4px 0 0;">
            ${gp.booths.map(b => `
              <li>${typeof b === 'string' ? b : getLocalized(b.name)}</li>
            `).join('')}
          </ul>
        ` : '<em>कोई मतदान केंद्र अभी दर्ज नहीं है।</em>'}
      </div>
    </div>
  `).join('');
}

async function renderVolunteers(candidateId, filterGp = '') {
  const container = document.getElementById('volunteers-list-container');
  if (!container) return;

  const list = await getVolunteers(candidateId, filterGp);
  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-5); background: var(--color-surface-subtle); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
        <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
          ${filterGp ? `ग्राम पंचायत ${filterGp} के लिए कोई कार्यकर्ता दर्ज नहीं है।` : 'अभी कोई कार्यकर्ता पंजीकृत नहीं है। ऊपर दिए गए फॉर्म से कार्यकर्ता जोड़ें।'}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="overflow-x: auto; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md);">
      <table style="width: 100%; border-collapse: collapse; font-size: var(--font-size-xs); text-align: left;">
        <thead style="background: var(--color-surface-subtle); border-bottom: 1px solid var(--color-border);">
          <tr>
            <th style="padding: var(--space-2) var(--space-3);">नाम</th>
            <th style="padding: var(--space-2) var(--space-3);">मोबाइल</th>
            <th style="padding: var(--space-2) var(--space-3);">ग्राम पंचायत</th>
            <th style="padding: var(--space-2) var(--space-3);">आवंटित केंद्र</th>
            <th style="padding: var(--space-2) var(--space-3);">दायित्व</th>
            <th style="padding: var(--space-2) var(--space-3);">कार्रवाई</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(v => `
            <tr style="border-bottom: 1px solid var(--color-border-light);">
              <td style="padding: var(--space-2) var(--space-3); font-weight: 600;">${v.name}</td>
              <td style="padding: var(--space-2) var(--space-3);"><a href="tel:${v.mobile}">${v.mobile}</a></td>
              <td style="padding: var(--space-2) var(--space-3);">${v.gram_panchayat}</td>
              <td style="padding: var(--space-2) var(--space-3);">${v.assigned_booth || '—'}</td>
              <td style="padding: var(--space-2) var(--space-3);"><span class="badge badge-primary">${v.role}</span></td>
              <td style="padding: var(--space-2) var(--space-3);">
                <button class="btn btn-sm btn-outline btn-del-vol" data-id="${v.id}" style="color: var(--color-danger); padding: 2px 6px;">हटाएं</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('.btn-del-vol').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('क्या आप इस कार्यकर्ता को हटाना चाहते हैं?')) {
        await deleteVolunteer(candidateId, id);
        await renderVolunteers(candidateId, filterGp);
        await refreshMetrics('sarpanch789', filterGp);
      }
    });
  });
}

async function renderVoters(candidateId, filterGp = '', search = '') {
  const container = document.getElementById('voters-list-container');
  if (!container) return;

  const list = await getVoters(candidateId, { filterGp, search });
  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-5); background: var(--color-surface-subtle); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
        <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
          ${search ? 'खोज के अनुसार कोई मतदाता नहीं मिला।' : 'अभी कोई मतदाता रिकॉर्ड दर्ज नहीं है। CSV आयात करें या नया मतदाता जोड़ें।'}
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="margin-bottom: var(--space-2); font-size: var(--font-size-xs); color: var(--color-text-muted);">
      कुल प्राप्त रिकॉर्ड: <strong>${list.length}</strong>
    </div>
    <div style="overflow-x: auto; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); max-height: 45vh; overflow-y: auto;">
      <table style="width: 100%; border-collapse: collapse; font-size: var(--font-size-xs); text-align: left;">
        <thead style="background: var(--color-surface-subtle); border-bottom: 1px solid var(--color-border); position: sticky; top: 0;">
          <tr>
            <th style="padding: var(--space-2) var(--space-3);">EPIC ID</th>
            <th style="padding: var(--space-2) var(--space-3);">मतदाता का नाम</th>
            <th style="padding: var(--space-2) var(--space-3);">पिता / पति</th>
            <th style="padding: var(--space-2) var(--space-3);">उम्र/लिंग</th>
            <th style="padding: var(--space-2) var(--space-3);">ग्राम पंचायत</th>
            <th style="padding: var(--space-2) var(--space-3);">बूथ</th>
            <th style="padding: var(--space-2) var(--space-3);">मोबाइल</th>
            <th style="padding: var(--space-2) var(--space-3);">कार्रवाई</th>
          </tr>
        </thead>
        <tbody>
          ${list.slice(0, 100).map(v => `
            <tr style="border-bottom: 1px solid var(--color-border-light);">
              <td style="padding: var(--space-2) var(--space-3); font-family: monospace;">${v.voter_id_epic || '—'}</td>
              <td style="padding: var(--space-2) var(--space-3); font-weight: 600;">${v.full_name}</td>
              <td style="padding: var(--space-2) var(--space-3);">${v.relative_name || '—'}</td>
              <td style="padding: var(--space-2) var(--space-3);">${v.age || '—'} / ${v.gender || '—'}</td>
              <td style="padding: var(--space-2) var(--space-3);">${v.gram_panchayat}</td>
              <td style="padding: var(--space-2) var(--space-3);">${v.booth_name || '—'}</td>
              <td style="padding: var(--space-2) var(--space-3);">${v.mobile || '—'}</td>
              <td style="padding: var(--space-2) var(--space-3);">
                <button class="btn btn-sm btn-outline btn-del-voter" data-id="${v.id}" style="color: var(--color-danger); padding: 2px 6px;">हटाएं</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.querySelectorAll('.btn-del-voter').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('क्या आप इस मतदाता रिकॉर्ड को हटाना चाहते हैं?')) {
        await deleteVoter(candidateId, id);
        await renderVoters(candidateId, filterGp, search);
        await refreshMetrics('sarpanch789', filterGp);
      }
    });
  });
}

async function handleExportVotersCsv(filterGp = '') {
  const csvContent = await exportVotersCsv(activeCandidate.id, filterGp);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `voters_ward22_${filterGp || 'all'}_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

async function renderVisits(candidateId, filterGp = '') {
  const container = document.getElementById('visits-list-container');
  if (!container) return;

  const list = await getFieldVisits(candidateId, filterGp);
  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-5); background: var(--color-surface-subtle); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
        <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
          अभी कोई फील्ड जनसंपर्क रिकॉर्ड दर्ज नहीं है।
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-3);">
      ${list.map(v => `
        <div style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-2);">
            <div>
              <strong style="color: var(--color-primary-dark); font-size: var(--font-size-sm);">${v.gram_panchayat}</strong>
              <div style="font-size: var(--font-size-xs); color: var(--color-text-muted);">${v.village_locality || 'मुख्य गांव'} • ${v.visit_date}</div>
            </div>
            <span class="badge ${v.sentiment === 'positive' ? 'badge-success' : (v.sentiment === 'concerned' ? 'badge-danger' : 'badge-primary')}">
              ${v.sentiment === 'positive' ? 'सकारात्मक' : (v.sentiment === 'concerned' ? 'चिंतित' : 'तटस्थ')}
            </span>
          </div>
          ${v.issues_raised ? `
            <div style="font-size: var(--font-size-xs); margin-bottom: var(--space-1);">
              <strong>उठाई गई मांग:</strong> ${v.issues_raised}
            </div>
          ` : ''}
          ${v.notes ? `
            <div style="font-size: 0.72rem; color: var(--color-text-muted); line-height: 1.4;">
              ${v.notes}
            </div>
          ` : ''}
          <div style="font-size: 0.68rem; color: var(--color-text-light); margin-top: var(--space-2); border-top: 1px solid var(--color-border-light); padding-top: 4px;">
            कार्यकर्ता: ${v.volunteer_name}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

async function renderTasks(candidateId, filterGp = '') {
  const container = document.getElementById('tasks-list-container');
  if (!container) return;

  const list = await getCampaignTasks(candidateId, filterGp);
  if (list.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-5); background: var(--color-surface-subtle); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
        <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
          अभी कोई अभियान कार्य असाइन नहीं है।
        </p>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: var(--space-2);">
      ${list.map(t => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--space-3);">
          <div>
            <div style="display: flex; align-items: center; gap: var(--space-2);">
              <input type="checkbox" class="task-checkbox" data-id="${t.id}" ${t.status === 'completed' ? 'checked' : ''} style="cursor: pointer;" />
              <strong style="font-size: var(--font-size-sm); ${t.status === 'completed' ? 'text-decoration: line-through; color: var(--color-text-muted);' : 'color: var(--color-primary-dark);'}">
                ${t.title}
              </strong>
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-left: 24px; margin-top: 2px;">
              आवंटित: ${t.assigned_to || 'समस्त टीम'} • पंचायत: ${t.gram_panchayat === 'all' ? 'सातों ग्राम पंचायतें' : t.gram_panchayat} ${t.due_date ? `• अंतिम तिथि: ${t.due_date}` : ''}
            </div>
          </div>
          <span class="badge ${t.status === 'completed' ? 'badge-success' : (t.priority === 'high' ? 'badge-danger' : 'badge-primary')}">
            ${t.status === 'completed' ? 'पूर्ण' : (t.priority === 'high' ? 'उच्च प्राथमिकता' : 'प्रगति पर')}
          </span>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('.task-checkbox').forEach(box => {
    box.addEventListener('change', async () => {
      const id = box.getAttribute('data-id');
      await toggleTaskStatus(candidateId, id);
      await renderTasks(candidateId, filterGp);
      await refreshMetrics('sarpanch789', filterGp);
    });
  });
}

async function renderComplaints(candidateId, pin, filterGp = '') {
  const container = document.getElementById('admin-complaints-list');
  if (!container) return;

  const result = await getStaffComplaints(candidateId, pin);
  if (!result.success || result.complaints.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-5); background: var(--color-surface-subtle); border-radius: var(--radius-md); border: 1px dashed var(--color-border);">
        <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
          इस क्षेत्र के लिए अभी कोई नई जनसमस्या दर्ज नहीं है।
        </p>
      </div>
    `;
    return;
  }

  let complaints = result.complaints;
  if (filterGp) {
    complaints = complaints.filter(c => c.ward_locality && c.ward_locality.includes(filterGp));
  }

  if (complaints.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-4); background: var(--color-surface-subtle); border-radius: var(--radius-md);">
        <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin: 0;">
          ग्राम पंचायत ${filterGp} के लिए कोई शिकायत दर्ज नहीं है।
        </p>
      </div>
    `;
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
        await renderComplaints(candidateId, pin, filterGp);
        await refreshMetrics(pin, filterGp);
      } else {
        alert('Failed to update status');
      }
      submitBtn.disabled = false;
    });
  });
}

function renderPhotoPreview(candidateId) {
  const box = document.getElementById('preview-candidate-photo-box');
  if (!box) return;

  const photo = getCustomCandidatePhoto(candidateId) || activeCandidate.photo;
  if (photo) {
    box.innerHTML = `<img src="${photo}" alt="Candidate" style="width: 100%; height: 100%; object-fit: cover;" />`;
  } else {
    box.innerHTML = `<span style="font-size: 1.6rem; color: var(--color-text-muted);">👤</span>`;
  }
}
