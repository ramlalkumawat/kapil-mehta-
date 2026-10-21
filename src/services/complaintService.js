/**
 * Complaint Submission, Tracking & Management Service
 * Supports both live Supabase RPC and secure local simulated persistence.
 */

import { supabase, isLiveBackendConfigured } from './supabase.js';

const LOCAL_STORAGE_KEY = 'sarpanch_setu_complaints';
const LOCAL_UPDATES_KEY = 'sarpanch_setu_updates';

// Generate a random 6-character non-sequential alphanumeric uppercase suffix
export function generateTrackingCode() {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Exclude ambiguous chars (0, 1, I, O)
  let code = '';
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  return `SETU-RJ-${code}`;
}

// Local mock initial seed for demonstration if empty
function getLocalComplaints() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    // Ignore
  }

  // Pre-seed 2 sample complaints so tracking & admin portal have immediate testable data
  const initial = [
    {
      id: 'demo-c-1',
      candidate_id: 'candidate-001',
      tracking_code: 'SETU-RJ-B7K92D',
      citizen_name: 'रामलाल कुमावत',
      citizen_mobile: '9829012345',
      mobile_last4: '2345',
      category: 'water',
      ward_locality: 'वार्ड संख्या 3, कुमावत मोहल्ला',
      description: 'मुख्य पेयजल पाइपलाइन में पिछले 4 दिन से लीकेज होने के कारण ढाणी में पानी का दबाव बहुत कम आ रहा है।',
      photo_url: null,
      status: 'in_progress',
      consent_given: true,
      created_at: new Date(Date.now() - 3600 * 48 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3600 * 12 * 1000).toISOString()
    },
    {
      id: 'demo-c-2',
      candidate_id: 'candidate-001',
      tracking_code: 'SETU-RJ-M4P8X1',
      citizen_name: 'सुरेश गुर्जर',
      citizen_mobile: '9414098765',
      mobile_last4: '8765',
      category: 'light',
      ward_locality: 'वार्ड संख्या 5, मुख्य चौराहा',
      description: 'पुराने कुएं के पास लगा सोलर लाइट का बल्ब फ्यूज हो गया है। रात में अंधेरा रहता है।',
      photo_url: null,
      status: 'submitted',
      consent_given: true,
      created_at: new Date(Date.now() - 3600 * 14 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3600 * 14 * 1000).toISOString()
    }
  ];

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

function getLocalUpdates() {
  try {
    const data = localStorage.getItem(LOCAL_UPDATES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {}

  const initialUpdates = [
    {
      complaint_id: 'demo-c-1',
      tracking_code: 'SETU-RJ-B7K92D',
      previous_status: null,
      new_status: 'submitted',
      public_note: 'नागरिक द्वारा पेयजल लीकेज समस्या पोर्टल पर दर्ज की गई।',
      created_at: new Date(Date.now() - 3600 * 48 * 1000).toISOString()
    },
    {
      complaint_id: 'demo-c-1',
      tracking_code: 'SETU-RJ-B7K92D',
      previous_status: 'submitted',
      new_status: 'under_review',
      public_note: 'पंचायत प्रतिनिधि द्वारा वार्ड पंच के साथ पाइपलाइन स्थल का भौतिक निरीक्षण किया गया।',
      created_at: new Date(Date.now() - 3600 * 24 * 1000).toISOString()
    },
    {
      complaint_id: 'demo-c-1',
      tracking_code: 'SETU-RJ-B7K92D',
      previous_status: 'under_review',
      new_status: 'in_progress',
      public_note: 'जलदाय विभाग के तकनीकी दल को 2 इंच लाइन मरम्मत सामग्री के साथ मौके पर भेजा गया है।',
      created_at: new Date(Date.now() - 3600 * 12 * 1000).toISOString()
    },
    {
      complaint_id: 'demo-c-2',
      tracking_code: 'SETU-RJ-M4P8X1',
      previous_status: null,
      new_status: 'submitted',
      public_note: 'स्ट्रीट लाइट खराबी शिकायत प्राप्त हुई। समीक्षाधीन।',
      created_at: new Date(Date.now() - 3600 * 14 * 1000).toISOString()
    }
  ];

  try {
    localStorage.setItem(LOCAL_UPDATES_KEY, JSON.stringify(initialUpdates));
  } catch (e) {}
  return initialUpdates;
}

/**
 * Validate complaint form input data
 */
export function validateComplaintInput(data) {
  const errors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'nameRequired';
  }

  const cleanMobile = (data.mobile || '').replace(/[^0-9]/g, '');
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    errors.mobile = 'mobileInvalid';
  }

  if (!data.category) {
    errors.category = 'categoryRequired';
  }

  if (!data.ward || data.ward.trim().length < 2) {
    errors.ward = 'wardRequired';
  }

  if (!data.description || data.description.trim().length < 15) {
    errors.description = 'descTooShort';
  }

  if (!data.consent) {
    errors.consent = 'consentRequired';
  }

  // Honeypot check for spam bots
  if (data._honeypot && data._honeypot.trim() !== '') {
    errors._honeypot = 'Spam detected';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Submit a citizen complaint
 */
export async function submitComplaint(data, candidateId = 'candidate-001') {
  // Validate
  const validation = validateComplaintInput(data);
  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  const cleanMobile = data.mobile.replace(/[^0-9]/g, '');
  const mobileLast4 = cleanMobile.slice(-4);

  // If live Supabase backend is configured:
  if (isLiveBackendConfigured && supabase) {
    try {
      const { data: result, error } = await supabase.rpc('submit_complaint', {
        p_candidate_id: candidateId,
        p_citizen_name: data.name.trim(),
        p_citizen_mobile: cleanMobile,
        p_category: data.category,
        p_ward_locality: data.ward.trim(),
        p_description: data.description.trim(),
        p_photo_url: data.photoUrl || null
      });

      if (error) {
        console.error('[SarpanchSetu] Supabase submit_complaint error:', error);
        throw error;
      }

      return {
        success: true,
        tracking_code: result.tracking_code,
        status: result.status || 'submitted',
        isDemo: false
      };
    } catch (err) {
      console.warn('[SarpanchSetu] Live submit failed, falling back to local simulation:', err.message);
    }
  }

  // Local secure simulation fallback
  const trackingCode = generateTrackingCode();
  const complaints = getLocalComplaints();
  const updates = getLocalUpdates();

  const newId = `c-${Date.now()}`;
  const now = new Date().toISOString();

  const newRecord = {
    id: newId,
    candidate_id: candidateId,
    tracking_code: trackingCode,
    citizen_name: data.name.trim(),
    citizen_mobile: cleanMobile,
    mobile_last4: mobileLast4,
    category: data.category,
    ward_locality: data.ward.trim(),
    description: data.description.trim(),
    photo_url: data.photoUrl || null,
    status: 'submitted',
    consent_given: true,
    created_at: now,
    updated_at: now
  };

  complaints.unshift(newRecord);
  updates.push({
    complaint_id: newId,
    tracking_code: trackingCode,
    previous_status: null,
    new_status: 'submitted',
    public_note: 'नागरिक द्वारा शिकायत सफलतापूर्वक दर्ज की गई। 72 घंटे में संज्ञान लिया जाएगा।',
    created_at: now
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
    localStorage.setItem(LOCAL_UPDATES_KEY, JSON.stringify(updates));
  } catch (e) {}

  return {
    success: true,
    tracking_code: trackingCode,
    status: 'submitted',
    isDemo: true
  };
}

/**
 * Track an existing complaint with 2-factor privacy verification:
 * Must provide BOTH tracking code AND matching last 4 digits of registered phone number.
 */
export async function trackComplaint(trackingCode, mobileLast4) {
  const cleanCode = (trackingCode || '').trim().toUpperCase();
  const cleanLast4 = (mobileLast4 || '').replace(/[^0-9]/g, '');

  if (!cleanCode) {
    return { found: false, error: 'trackingCodeRequired' };
  }
  if (!cleanLast4 || cleanLast4.length !== 4) {
    return { found: false, error: 'last4Required' };
  }

  // If live Supabase backend is configured:
  if (isLiveBackendConfigured && supabase) {
    try {
      const { data: result, error } = await supabase.rpc('track_complaint', {
        p_tracking_code: cleanCode,
        p_mobile_last4: cleanLast4
      });

      if (!error && result && result.found) {
        return {
          found: true,
          data: result,
          isDemo: false
        };
      }
    } catch (err) {
      console.warn('[SarpanchSetu] Live tracking query error, falling back to local:', err.message);
    }
  }

  // Local simulation fallback
  const complaints = getLocalComplaints();
  const updates = getLocalUpdates();

  const match = complaints.find(
    c => c.tracking_code.toUpperCase() === cleanCode && c.mobile_last4 === cleanLast4
  );

  if (!match) {
    return {
      found: false,
      message: 'No record found matching this tracking code and phone verification digits.'
    };
  }

  const timeline = updates
    .filter(u => u.tracking_code.toUpperCase() === cleanCode)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  // Redacted public view (Strict privacy protection: no personal phone number or full name returned)
  return {
    found: true,
    data: {
      tracking_code: match.tracking_code,
      category: match.category,
      ward_locality: match.ward_locality,
      status: match.status,
      submitted_at: match.created_at,
      updated_at: match.updated_at,
      history: timeline
    },
    isDemo: true
  };
}

/**
 * Administrative Staff / Sarpanch status updater
 */
export async function updateComplaintStatus(trackingCode, newStatus, publicNote, pin) {
  const expectedPin = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_ACCESS_PIN) || 'sarpanch789';

  if (pin !== expectedPin) {
    return { success: false, error: 'invalidPin' };
  }

  const validStatuses = ['submitted', 'under_review', 'in_progress', 'resolved', 'closed'];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: 'invalidStatus' };
  }

  const complaints = getLocalComplaints();
  const updates = getLocalUpdates();

  const record = complaints.find(c => c.tracking_code.toUpperCase() === trackingCode.trim().toUpperCase());
  if (!record) {
    return { success: false, error: 'notFound' };
  }

  const previousStatus = record.status;
  record.status = newStatus;
  record.updated_at = new Date().toISOString();

  updates.push({
    complaint_id: record.id,
    tracking_code: record.tracking_code,
    previous_status: previousStatus,
    new_status: newStatus,
    public_note: publicNote ? publicNote.trim() : `स्थिति बदलकर '${newStatus}' की गई।`,
    created_at: new Date().toISOString()
  });

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
    localStorage.setItem(LOCAL_UPDATES_KEY, JSON.stringify(updates));
  } catch (e) {}

  return { success: true };
}

/**
 * Get all complaints for active candidate (Staff View Only)
 */
export async function getStaffComplaints(candidateId, pin) {
  const expectedPin = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ADMIN_ACCESS_PIN) || 'sarpanch789';
  if (pin !== expectedPin) {
    return { success: false, error: 'invalidPin' };
  }

  const complaints = getLocalComplaints();
  const filtered = complaints.filter(c => !candidateId || c.candidate_id === candidateId);
  return { success: true, complaints: filtered };
}
