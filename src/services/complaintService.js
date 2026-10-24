/**
 * Complaint Submission, Tracking & Management Service
 * Directly integrated with Google Cloud Run microservice and secure local client persistence.
 */


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

const COMPLAINT_API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_COMPLAINT_API_URL || import.meta.env.VITE_GCP_COMPLAINT_URL)) ||
  "https://submit-complaint-giiw7bvowq-el.a.run.app";

function cacheSubmittedComplaintLocally(result, candidateId, name, mobile, category, ward, description) {
  try {
    const complaints = getLocalComplaints();
    const updates = getLocalUpdates();
    const newId = result.id || `c-${Date.now()}`;
    const now = new Date().toISOString();
    const mobileLast4 = (mobile || '').slice(-4);
    const trackingCode = result.tracking_code;

    complaints.unshift({
      id: newId,
      candidate_id: candidateId,
      tracking_code: trackingCode,
      citizen_name: name,
      citizen_mobile: mobile,
      mobile_last4: mobileLast4,
      category,
      ward_locality: ward,
      description,
      status: result.status || 'submitted',
      consent_given: true,
      created_at: now,
      updated_at: now
    });

    updates.push({
      complaint_id: newId,
      tracking_code: trackingCode,
      previous_status: null,
      new_status: result.status || 'submitted',
      public_note: 'शिकायत पोर्टल पर दर्ज की गई। 72 घंटे में संज्ञान लिया जाएगा।',
      created_at: now
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(complaints));
    localStorage.setItem(LOCAL_UPDATES_KEY, JSON.stringify(updates));
  } catch (e) {}
}

/**
 * Validate complaint form input data
 */
export function validateComplaintInput(data) {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'nameRequired';
  }

  const cleanMobile = (data.mobile || '').replace(/[^0-9]/g, '');
  if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
    errors.mobile = 'mobileInvalid';
  }

  const validCategories = [
    'road',
    'water',
    'electricity',
    'sanitation',
    'street_light',
    'drainage',
    'general',
    'cleanliness',
    'light',
    'suggestion',
    'other'
  ];
  if (data.category && !validCategories.includes(data.category)) {
    errors.category = 'categoryRequired';
  }

  if (!data.ward || data.ward.trim().length === 0) {
    errors.ward = 'wardRequired';
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.description = 'descRequired';
  } else if (data.description.trim().length < 15) {
    errors.description = 'descTooShort';
  }

  if (data.consent !== undefined && data.consent === false) {
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
 * Submit a citizen complaint to the live Google Cloud Run microservice
 */
export async function submitComplaint(formData, candidateId = 'candidate-kapil-mehta') {
  const candidate_id = formData.candidate_id || candidateId || 'candidate-kapil-mehta';
  const name = (formData.name || '').trim();
  const mobile = (formData.mobile || '').replace(/[^0-9]/g, '');
  const category = formData.category || 'general';
  const ward = (formData.ward || '').trim();
  const description = (formData.description || '').trim();

  // Validate
  const validation = validateComplaintInput({
    ...formData,
    name,
    mobile,
    category,
    ward,
    description
  });

  if (!validation.valid) {
    return { success: false, errors: validation.errors };
  }

  // Check if mock mode is requested (for automated test suite to avoid polluting live Firestore with junk data)
  const isTestEnv = typeof process !== 'undefined' && process.env && (process.env.NODE_ENV === 'test' || process.env.MOCK_COMPLAINT_API === 'true');
  if (isTestEnv) {
    const mockTrackingCode = generateTrackingCode();
    const mockId = `mock-${Date.now()}`;
    const mockResult = {
      success: true,
      id: mockId,
      tracking_code: mockTrackingCode,
      status: 'submitted'
    };
    cacheSubmittedComplaintLocally(mockResult, candidate_id, name, mobile, category, ward, description);
    return mockResult;
  }

  // Real Cloud Run API Request
  const response = await fetch(COMPLAINT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      candidate_id,
      name,
      mobile,
      category,
      ward,
      description
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data || !data.success) {
    const errorMsg = (data && data.error) || 'शिकायत दर्ज नहीं हो सकी।';
    throw new Error(errorMsg);
  }

  // Cache locally for instant client-side inspection / tracking
  cacheSubmittedComplaintLocally(data, candidate_id, name, mobile, category, ward, description);

  return data;
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

  // Client storage lookup & timeline retrieval
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
