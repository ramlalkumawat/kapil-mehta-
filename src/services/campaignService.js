/**
 * Campaign Management Service — Sarpanch Setu (Candidate Edition)
 * Manages Gram Panchayats, Polling Booths, Volunteers, Voter Registry,
 * Field Surveys/Visits, and Campaign Tasks with strict candidate data isolation.
 *
 * Supports both live Supabase client (when configured) and local persistent storage.
 */

import { supabase, isLiveBackendConfigured } from './supabase.js';
import { getStaffComplaints } from './complaintService.js';

const KEY_VOLUNTEERS = 'sarpanch_setu_volunteers';
const KEY_VOTERS = 'sarpanch_setu_voters';
const KEY_VISITS = 'sarpanch_setu_field_visits';
const KEY_TASKS = 'sarpanch_setu_tasks';
const KEY_CUSTOM_PANCHAYATS = 'sarpanch_setu_panchayats';
const KEY_CANDIDATE_PHOTO = 'sarpanch_setu_candidate_photos';

// Helper: Safe Local Storage Access
function readStore(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function writeStore(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`[CampaignService] Failed to write to store ${key}:`, e);
  }
}

// -----------------------------------------------------------------------------
// 1. Gram Panchayats & Booths Configuration
// -----------------------------------------------------------------------------

/**
 * Returns configured Gram Panchayats for candidate, merging candidate configuration
 * with any custom booths added by authorized administrator.
 */
export async function getGramPanchayats(candidate) {
  if (!candidate) return [];
  const baseGps = candidate.gramPanchayats || [];

  // Check if admin has customized booths locally
  const customStore = readStore(KEY_CUSTOM_PANCHAYATS);
  const candidateCustom = customStore.filter(c => c.candidate_id === candidate.id);

  if (candidateCustom.length === 0) {
    return baseGps;
  }

  // Merge custom booths
  return baseGps.map(gp => {
    const customMatch = candidateCustom.find(c => c.gp_id === gp.id);
    if (customMatch && Array.isArray(customMatch.booths)) {
      return {
        ...gp,
        booths: customMatch.booths
      };
    }
    return gp;
  });
}

/**
 * Adds a new polling booth to a configured Gram Panchayat
 */
export async function addBoothToPanchayat(candidateId, gpId, boothName) {
  if (!boothName || !boothName.trim()) {
    return { success: false, error: 'boothNameRequired' };
  }

  const customStore = readStore(KEY_CUSTOM_PANCHAYATS);
  let gpRecord = customStore.find(c => c.candidate_id === candidateId && c.gp_id === gpId);

  const newBooth = {
    id: `b-custom-${Date.now()}`,
    name: { hi: boothName.trim(), en: boothName.trim() }
  };

  if (!gpRecord) {
    gpRecord = {
      candidate_id: candidateId,
      gp_id: gpId,
      booths: [newBooth]
    };
    customStore.push(gpRecord);
  } else {
    gpRecord.booths = gpRecord.booths || [];
    gpRecord.booths.push(newBooth);
  }

  writeStore(KEY_CUSTOM_PANCHAYATS, customStore);
  return { success: true, booth: newBooth };
}

// -----------------------------------------------------------------------------
// 2. Volunteers Management
// -----------------------------------------------------------------------------

export async function getVolunteers(candidateId, filterGp = '') {
  if (!candidateId) return [];

  if (isLiveBackendConfigured && supabase) {
    try {
      let query = supabase
        .from('volunteers')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (filterGp) {
        query = query.eq('gram_panchayat', filterGp);
      }
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {
      console.warn('[CampaignService] Supabase volunteers fetch failed, using local store:', err);
    }
  }

  const all = readStore(KEY_VOLUNTEERS);
  return all
    .filter(v => v.candidate_id === candidateId)
    .filter(v => (!filterGp || v.gram_panchayat === filterGp));
}

export async function addVolunteer(candidateId, volunteerData) {
  if (!candidateId) return { success: false, error: 'missingCandidateId' };
  if (!volunteerData.name || !volunteerData.name.trim()) {
    return { success: false, error: 'nameRequired' };
  }
  const cleanMobile = (volunteerData.mobile || '').replace(/[^0-9]/g, '');
  if (cleanMobile.length < 10) {
    return { success: false, error: 'mobileInvalid' };
  }
  if (!volunteerData.gramPanchayat) {
    return { success: false, error: 'gpRequired' };
  }

  const record = {
    id: `vol-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    candidate_id: candidateId,
    name: volunteerData.name.trim(),
    mobile: cleanMobile,
    gram_panchayat: volunteerData.gramPanchayat,
    assigned_booth: (volunteerData.assignedBooth || '').trim(),
    role: volunteerData.role || 'कार्यकर्ता / Volunteer',
    status: 'active',
    created_at: new Date().toISOString()
  };

  if (isLiveBackendConfigured && supabase) {
    try {
      const { error } = await supabase.from('volunteers').insert(record);
      if (!error) return { success: true, volunteer: record };
    } catch (err) {
      console.warn('[CampaignService] Live volunteer insert failed, saving to local store:', err);
    }
  }

  const all = readStore(KEY_VOLUNTEERS);
  all.unshift(record);
  writeStore(KEY_VOLUNTEERS, all);
  return { success: true, volunteer: record };
}

export async function deleteVolunteer(candidateId, volunteerId) {
  if (isLiveBackendConfigured && supabase) {
    try {
      await supabase
        .from('volunteers')
        .delete()
        .eq('id', volunteerId)
        .eq('candidate_id', candidateId);
    } catch (err) {}
  }

  const all = readStore(KEY_VOLUNTEERS);
  const updated = all.filter(v => !(v.id === volunteerId && v.candidate_id === candidateId));
  writeStore(KEY_VOLUNTEERS, updated);
  return { success: true };
}

// -----------------------------------------------------------------------------
// 3. Voter Management & CSV Import/Export
// -----------------------------------------------------------------------------

export async function getVoters(candidateId, options = {}) {
  const { filterGp = '', search = '' } = options;
  if (!candidateId) return [];

  let voters = [];

  if (isLiveBackendConfigured && supabase) {
    try {
      let query = supabase
        .from('voters')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (filterGp) query = query.eq('gram_panchayat', filterGp);
      if (search) query = query.ilike('full_name', `%${search}%`);

      const { data, error } = await query;
      if (!error && data) voters = data;
    } catch (err) {
      console.warn('[CampaignService] Supabase voters fetch failed, using local store:', err);
    }
  }

  if (voters.length === 0) {
    const all = readStore(KEY_VOTERS);
    voters = all.filter(v => v.candidate_id === candidateId);
  }

  if (filterGp) {
    voters = voters.filter(v => v.gram_panchayat === filterGp);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    voters = voters.filter(v =>
      (v.full_name && v.full_name.toLowerCase().includes(q)) ||
      (v.voter_id_epic && v.voter_id_epic.toLowerCase().includes(q)) ||
      (v.mobile && v.mobile.includes(q))
    );
  }

  return voters;
}

export async function addVoter(candidateId, voterData) {
  if (!candidateId) return { success: false, error: 'missingCandidateId' };
  if (!voterData.fullName || !voterData.fullName.trim()) {
    return { success: false, error: 'nameRequired' };
  }
  if (!voterData.gramPanchayat) {
    return { success: false, error: 'gpRequired' };
  }

  const record = {
    id: `vtr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    candidate_id: candidateId,
    voter_id_epic: (voterData.epic || '').trim().toUpperCase(),
    full_name: voterData.fullName.trim(),
    relative_name: (voterData.relativeName || '').trim(),
    age: parseInt(voterData.age, 10) || null,
    gender: voterData.gender || '',
    gram_panchayat: voterData.gramPanchayat,
    booth_name: (voterData.boothName || '').trim(),
    mobile: (voterData.mobile || '').replace(/[^0-9]/g, ''),
    address: (voterData.address || '').trim(),
    status: voterData.status || 'verified',
    created_at: new Date().toISOString()
  };

  if (isLiveBackendConfigured && supabase) {
    try {
      const { error } = await supabase.from('voters').insert(record);
      if (!error) return { success: true, voter: record };
    } catch (err) {}
  }

  const all = readStore(KEY_VOTERS);
  all.unshift(record);
  writeStore(KEY_VOTERS, all);
  return { success: true, voter: record };
}

export async function deleteVoter(candidateId, voterId) {
  if (isLiveBackendConfigured && supabase) {
    try {
      await supabase
        .from('voters')
        .delete()
        .eq('id', voterId)
        .eq('candidate_id', candidateId);
    } catch (err) {}
  }

  const all = readStore(KEY_VOTERS);
  const updated = all.filter(v => !(v.id === voterId && v.candidate_id === candidateId));
  writeStore(KEY_VOTERS, updated);
  return { success: true };
}

/**
 * Parses and imports voters from a CSV text
 * Format expected:
 * voter_id,full_name,relative_name,age,gender,gram_panchayat,booth,mobile
 */
export async function importVotersCsv(candidateId, csvText) {
  if (!csvText || !csvText.trim()) {
    return { success: false, imported: 0, errors: ['CSV फ़ाइल रिक्त है / Empty CSV file'] };
  }

  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) {
    return { success: false, imported: 0, errors: ['CSV फ़ाइल में कोई डेटा पंक्ति नहीं मिली / No data rows found'] };
  }

  const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  const idxEpic = header.findIndex(h => h.includes('epic') || h.includes('voter_id') || h.includes('पहचान'));
  const idxName = header.findIndex(h => h.includes('name') || h.includes('नाम'));
  const idxRelative = header.findIndex(h => h.includes('relative') || h.includes('पिता') || h.includes('पति'));
  const idxAge = header.findIndex(h => h.includes('age') || h.includes('उम्र') || h.includes('आयु'));
  const idxGender = header.findIndex(h => h.includes('gender') || h.includes('लिंग'));
  const idxGp = header.findIndex(h => h.includes('panchayat') || h.includes('पंचायत') || h.includes('gp'));
  const idxBooth = header.findIndex(h => h.includes('booth') || h.includes('बूथ'));
  const idxMobile = header.findIndex(h => h.includes('mobile') || h.includes('phone') || h.includes('मोबाइल'));

  if (idxName === -1) {
    return { success: false, imported: 0, errors: ['नाम (full_name) कॉलम अनिवार्य है / Missing name column'] };
  }

  const importedRecords = [];
  const parseErrors = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (rawCols.length < 2) continue;

    const name = rawCols[idxName];
    if (!name) {
      parseErrors.push(`पंक्ति ${i + 1}: मतदाता नाम रिक्त है`);
      continue;
    }

    const epic = idxEpic !== -1 ? rawCols[idxEpic] : '';
    const relative = idxRelative !== -1 ? rawCols[idxRelative] : '';
    const age = idxAge !== -1 ? parseInt(rawCols[idxAge], 10) || null : null;
    const gender = idxGender !== -1 ? rawCols[idxGender] : '';
    const gp = idxGp !== -1 ? rawCols[idxGp] : 'अकोदिया';
    const booth = idxBooth !== -1 ? rawCols[idxBooth] : '';
    const mobile = idxMobile !== -1 ? rawCols[idxMobile].replace(/[^0-9]/g, '') : '';

    importedRecords.push({
      id: `vtr-csv-${Date.now()}-${i}`,
      candidate_id: candidateId,
      voter_id_epic: epic.toUpperCase(),
      full_name: name,
      relative_name: relative,
      age,
      gender,
      gram_panchayat: gp,
      booth_name: booth,
      mobile,
      address: '',
      status: 'verified',
      created_at: new Date().toISOString()
    });
  }

  if (importedRecords.length === 0) {
    return { success: false, imported: 0, errors: parseErrors.length > 0 ? parseErrors : ['कोई मान्य रिकॉर्ड नहीं मिला'] };
  }

  const all = readStore(KEY_VOTERS);
  const merged = [...importedRecords, ...all];
  writeStore(KEY_VOTERS, merged);

  return {
    success: true,
    imported: importedRecords.length,
    errors: parseErrors
  };
}

/**
 * Generates CSV string for voters of candidate
 */
export async function exportVotersCsv(candidateId, filterGp = '') {
  const voters = await getVoters(candidateId, { filterGp });
  const headers = ['voter_id_epic', 'full_name', 'relative_name', 'age', 'gender', 'gram_panchayat', 'booth_name', 'mobile', 'status'];

  const rows = voters.map(v => [
    `"${v.voter_id_epic || ''}"`,
    `"${v.full_name || ''}"`,
    `"${v.relative_name || ''}"`,
    `"${v.age || ''}"`,
    `"${v.gender || ''}"`,
    `"${v.gram_panchayat || ''}"`,
    `"${v.booth_name || ''}"`,
    `"${v.mobile || ''}"`,
    `"${v.status || 'verified'}"`
  ].join(','));

  return [headers.join(','), ...rows].join('\r\n');
}

// -----------------------------------------------------------------------------
// 4. Field Visits & Door-to-Door Surveys
// -----------------------------------------------------------------------------

export async function getFieldVisits(candidateId, filterGp = '') {
  if (!candidateId) return [];

  if (isLiveBackendConfigured && supabase) {
    try {
      let query = supabase
        .from('field_visits')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('visit_date', { ascending: false });

      if (filterGp) query = query.eq('gram_panchayat', filterGp);
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {}
  }

  const all = readStore(KEY_VISITS);
  return all
    .filter(v => v.candidate_id === candidateId)
    .filter(v => (!filterGp || v.gram_panchayat === filterGp));
}

export async function addFieldVisit(candidateId, visitData) {
  if (!candidateId) return { success: false, error: 'missingCandidateId' };
  if (!visitData.gramPanchayat) return { success: false, error: 'gpRequired' };
  if (!visitData.volunteerName || !visitData.volunteerName.trim()) {
    return { success: false, error: 'volunteerRequired' };
  }

  const record = {
    id: `vst-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    candidate_id: candidateId,
    gram_panchayat: visitData.gramPanchayat,
    village_locality: (visitData.villageLocality || '').trim(),
    volunteer_name: visitData.volunteerName.trim(),
    visit_date: visitData.visitDate || new Date().toISOString().split('T')[0],
    issues_raised: (visitData.issuesRaised || '').trim(),
    sentiment: visitData.sentiment || 'positive', // positive, neutral, concerned
    notes: (visitData.notes || '').trim(),
    created_at: new Date().toISOString()
  };

  if (isLiveBackendConfigured && supabase) {
    try {
      const { error } = await supabase.from('field_visits').insert(record);
      if (!error) return { success: true, visit: record };
    } catch (err) {}
  }

  const all = readStore(KEY_VISITS);
  all.unshift(record);
  writeStore(KEY_VISITS, all);
  return { success: true, visit: record };
}

// -----------------------------------------------------------------------------
// 5. Campaign Tasks & Follow-up
// -----------------------------------------------------------------------------

export async function getCampaignTasks(candidateId, filterGp = '') {
  if (!candidateId) return [];

  if (isLiveBackendConfigured && supabase) {
    try {
      let query = supabase
        .from('campaign_tasks')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('created_at', { ascending: false });

      if (filterGp) query = query.eq('gram_panchayat', filterGp);
      const { data, error } = await query;
      if (!error && data) return data;
    } catch (err) {}
  }

  const all = readStore(KEY_TASKS);
  return all
    .filter(t => t.candidate_id === candidateId)
    .filter(t => (!filterGp || t.gram_panchayat === filterGp || t.gram_panchayat === 'all'));
}

export async function addCampaignTask(candidateId, taskData) {
  if (!candidateId) return { success: false, error: 'missingCandidateId' };
  if (!taskData.title || !taskData.title.trim()) {
    return { success: false, error: 'titleRequired' };
  }

  const record = {
    id: `tsk-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    candidate_id: candidateId,
    title: taskData.title.trim(),
    assigned_to: (taskData.assignedTo || '').trim(),
    gram_panchayat: taskData.gramPanchayat || 'all',
    due_date: taskData.dueDate || '',
    priority: taskData.priority || 'medium', // high, medium, low
    status: 'pending', // pending, in_progress, completed
    created_at: new Date().toISOString()
  };

  if (isLiveBackendConfigured && supabase) {
    try {
      const { error } = await supabase.from('campaign_tasks').insert(record);
      if (!error) return { success: true, task: record };
    } catch (err) {}
  }

  const all = readStore(KEY_TASKS);
  all.unshift(record);
  writeStore(KEY_TASKS, all);
  return { success: true, task: record };
}

export async function toggleTaskStatus(candidateId, taskId) {
  const all = readStore(KEY_TASKS);
  const item = all.find(t => t.id === taskId && t.candidate_id === candidateId);
  if (!item) return { success: false, error: 'notFound' };

  if (item.status === 'pending') item.status = 'in_progress';
  else if (item.status === 'in_progress') item.status = 'completed';
  else item.status = 'pending';

  writeStore(KEY_TASKS, all);
  return { success: true, status: item.status };
}

// -----------------------------------------------------------------------------
// 6. Campaign Metrics & Dashboard Summaries (Computed strictly from real queries)
// -----------------------------------------------------------------------------

export async function getCampaignMetrics(candidate, filterGp = '', pin = 'sarpanch789') {
  if (!candidate) return { gpsCount: 0, volunteerCount: 0, voterCount: 0, visitCount: 0, taskCount: 0, complaintsCount: 0 };

  const candidateId = candidate.id;
  const gps = await getGramPanchayats(candidate);
  const gpsCount = filterGp ? 1 : gps.length;

  const volunteers = await getVolunteers(candidateId, filterGp);
  const voters = await getVoters(candidateId, { filterGp });
  const visits = await getFieldVisits(candidateId, filterGp);
  const tasks = await getCampaignTasks(candidateId, filterGp);

  let complaintsCount = 0;
  try {
    const compRes = await getStaffComplaints(candidateId, pin);
    if (compRes && compRes.success && Array.isArray(compRes.complaints)) {
      if (filterGp) {
        complaintsCount = compRes.complaints.filter(c =>
          (c.ward_locality && c.ward_locality.includes(filterGp))
        ).length;
      } else {
        complaintsCount = compRes.complaints.length;
      }
    }
  } catch (e) {}

  return {
    gpsCount,
    totalConfiguredGps: gps.length,
    volunteerCount: volunteers.length,
    voterCount: voters.length,
    visitCount: visits.length,
    taskCount: tasks.length,
    complaintsCount
  };
}

// -----------------------------------------------------------------------------
// 7. Candidate Photo Upload & Retrieval
// -----------------------------------------------------------------------------

export function getCustomCandidatePhoto(candidateId) {
  try {
    const store = readStore(KEY_CANDIDATE_PHOTO);
    const found = store.find(p => p.candidate_id === candidateId);
    return found ? found.data_url : null;
  } catch (e) {
    return null;
  }
}

export function saveCustomCandidatePhoto(candidateId, dataUrl) {
  try {
    const store = readStore(KEY_CANDIDATE_PHOTO);
    const existingIdx = store.findIndex(p => p.candidate_id === candidateId);
    if (existingIdx !== -1) {
      store[existingIdx].data_url = dataUrl;
    } else {
      store.push({ candidate_id: candidateId, data_url: dataUrl });
    }
    writeStore(KEY_CANDIDATE_PHOTO, store);
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
