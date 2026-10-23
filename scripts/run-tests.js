/**
 * Sarpanch Setu - Automated Test Suite
 * Tests Candidate Schemas, i18n Dictionary Parity, Complaint Submission & Tracking,
 * Spam Protection, and Privacy Boundaries.
 */

import { validateCandidateConfig, normalizeCandidateConfig } from '../config/schema.js';
import defaultConfig from '../config/candidates/default.js';
import candidate001 from '../config/candidates/candidate-001.js';
import candidate002 from '../config/candidates/candidate-002.js';
import candidateKapilMehta from '../config/candidates/candidate-kapil-mehta.js';
import hiDict from '../src/locales/hi.js';
import enDict from '../src/locales/en.js';
import {
  generateTrackingCode,
  validateComplaintInput,
  submitComplaint,
  trackComplaint,
  updateComplaintStatus
} from '../src/services/complaintService.js';
import {
  addVolunteer,
  getVolunteers,
  addVoter,
  getVoters,
  importVotersCsv,
  exportVotersCsv,
  getCampaignMetrics
} from '../src/services/campaignService.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${testName}`);
    failedTests++;
  }
}

console.log('========================================================');
console.log('🧪 RUNNING SARPANCH SETU TEST SUITE');
console.log('========================================================\n');

// -------------------------------------------------------------------------
// SUITE 1: Candidate Configurations & Schema Normalization
// -------------------------------------------------------------------------
console.log('📦 Suite 1: Candidate Configurations & Schema Validation');

const defaultVal = validateCandidateConfig(defaultConfig);
assert(defaultVal.valid, 'default.js satisfies all required schema fields');

const c1Val = validateCandidateConfig(candidate001);
assert(c1Val.valid, 'candidate-001.js satisfies all required schema fields');

const c2Val = validateCandidateConfig(candidate002);
assert(c2Val.valid, 'candidate-002.js satisfies all required schema fields');

const kmVal = validateCandidateConfig(candidateKapilMehta);
assert(kmVal.valid, 'candidate-kapil-mehta.js satisfies all required schema fields');

const normalized = normalizeCandidateConfig({
  id: 'incomplete-cand',
  name: { hi: 'नाम', en: 'Name' },
  panchayatName: { hi: 'पंचायत', en: 'Panchayat' },
  village: { hi: 'गांव', en: 'Village' },
  tehsil: { hi: 'तहसील', en: 'Tehsil' },
  district: { hi: 'जिला', en: 'District' },
  state: { hi: 'राज्य', en: 'State' },
  contact: { phone: '123' }
});

assert(Array.isArray(normalized.completedWorks), 'Normalizer provides empty array for missing completedWorks');
assert(Array.isArray(normalized.priorities), 'Normalizer provides empty array for missing priorities');
assert(Array.isArray(normalized.gramPanchayats), 'Normalizer provides empty array for missing gramPanchayats');
assert(normalized.disclaimer && normalized.disclaimer.hi, 'Normalizer provides fallback statutory disclaimer');

// -------------------------------------------------------------------------
// SUITE 2: Candidate Isolation & Distinct Branding
// -------------------------------------------------------------------------
console.log('\n🔒 Suite 2: Candidate Isolation & Distinct Data Boundaries');
assert(candidate001.id !== candidate002.id, 'Candidate 001 and 002 have distinct identifiers');
assert(candidateKapilMehta.id !== candidate001.id, 'Kapil Mehta edition has distinct tenant ID');
assert(candidateKapilMehta.panchayatName.hi === 'जिला परिषद वार्ड संख्या 22', 'Kapil Mehta correctly assigned Zila Parishad Ward 22');
assert(candidateKapilMehta.wardNumber === '22', 'Kapil Mehta Ward Number verified as 22');
assert(candidateKapilMehta.district.hi === 'झालावाड़', 'Kapil Mehta District verified as Jhalawar');
assert(Array.isArray(candidateKapilMehta.gramPanchayats) && candidateKapilMehta.gramPanchayats.length === 7, 'Ward 22 configured with exactly 7 Gram Panchayats');

const expectedGps = ['अकोदिया', 'सरखंडिया', 'पनवाड़', 'बिशन खेड़ी', 'पखराना', 'लायफल', 'हरीगढ़'];
const actualGps = candidateKapilMehta.gramPanchayats.map(g => g.name.hi);
const allGpsMatch = expectedGps.every(name => actualGps.includes(name));
assert(allGpsMatch, 'All 7 specified Gram Panchayats are present with exact Hindi names');

assert(candidateKapilMehta.personalDetails.nativeVillage.hi === 'गणेशपुरा (चोंसला)', 'Candidate native village verified as Ganeshpura (Chonsla)');
assert(candidateKapilMehta.personalDetails.tehsil.hi === 'खानपुर', 'Candidate tehsil verified as Khanpur');
assert(candidateKapilMehta.educationTimeline.length === 6, 'Candidate has exactly 6 verified educational qualifications');
assert(candidateKapilMehta.politicalJourney.length === 6, 'Candidate has exactly 6 chronological political milestones (2014-2025)');

// -------------------------------------------------------------------------
// SUITE 3: i18n Translation Dictionary Key Parity
// -------------------------------------------------------------------------
console.log('\n🌐 Suite 3: Bilingual (Hindi / English) Dictionary Parity');

function getObjectKeys(obj, prefix = '') {
  let keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      keys = keys.concat(getObjectKeys(v, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const hiKeys = new Set(getObjectKeys(hiDict));
const enKeys = new Set(getObjectKeys(enDict));

let missingInEn = [];
for (const k of hiKeys) {
  if (!enKeys.has(k)) missingInEn.push(k);
}

let missingInHi = [];
for (const k of enKeys) {
  if (!hiKeys.has(k)) missingInHi.push(k);
}

assert(missingInEn.length === 0, `All Hindi keys present in English dictionary (Missing: ${missingInEn.join(', ') || 'None'})`);
assert(missingInHi.length === 0, `All English keys present in Hindi dictionary (Missing: ${missingInHi.join(', ') || 'None'})`);

// -------------------------------------------------------------------------
// SUITE 4: Complaint Form Validation & Honeypot Protection
// -------------------------------------------------------------------------
console.log('\n📝 Suite 4: Complaint Validation & Anti-Spam Honeypot');

const validPayload = {
  name: 'किशन शर्मा',
  mobile: '9829054321',
  category: 'water',
  ward: 'वार्ड 2',
  description: 'पाइपलाइन में 5 दिन से रिसाव हो रहा है और पानी की आपूर्ति बाधित है।',
  consent: true,
  _honeypot: ''
};

const valRes = validateComplaintInput(validPayload);
assert(valRes.valid, 'Valid complaint input successfully passes validation');

const invalidMobile = validateComplaintInput({ ...validPayload, mobile: '12345' });
assert(!invalidMobile.valid && invalidMobile.errors.mobile === 'mobileInvalid', 'Rejects invalid mobile number (< 10 digits)');

const shortDesc = validateComplaintInput({ ...validPayload, description: 'पानी नहीं' });
assert(!shortDesc.valid && shortDesc.errors.description === 'descTooShort', 'Rejects description under 15 characters');

const noConsent = validateComplaintInput({ ...validPayload, consent: false });
assert(!noConsent.valid && noConsent.errors.consent === 'consentRequired', 'Rejects submission without citizen consent');

const spamPayload = validateComplaintInput({ ...validPayload, _honeypot: 'bot-content' });
assert(!spamPayload.valid && spamPayload.errors._honeypot, 'Honeypot detects and catches automated spam bot submissions');

// -------------------------------------------------------------------------
// SUITE 5: Tracking Code Generation & Entropy
// -------------------------------------------------------------------------
console.log('\n🔑 Suite 5: Tracking Code Generation & Uniqueness');

const code = generateTrackingCode();
assert(/^SETU-RJ-[2-9A-HJ-NP-Z]{6}$/.test(code), `Generated code "${code}" conforms to format SETU-RJ-XXXXXX`);

const generatedCodes = new Set();
for (let i = 0; i < 100; i++) {
  generatedCodes.add(generateTrackingCode());
}
assert(generatedCodes.size === 100, '100 generated tracking codes are 100% unique (high entropy, non-sequential)');

// -------------------------------------------------------------------------
// SUITE 6: Complaint Redressal & 2-Factor Privacy Verification
// -------------------------------------------------------------------------
console.log('\n🛡️ Suite 6: Complaint Submission, Privacy Verification & Tracking');

// Mock localStorage in Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = {};
  globalThis.localStorage = {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
}

const submitResult = await submitComplaint(validPayload, 'candidate-001');
assert(submitResult.success && submitResult.tracking_code, `Complaint submitted successfully with code: ${submitResult.tracking_code}`);

// Track with valid code AND valid last 4 digits (54321 -> 4321)
const trackSuccess = await trackComplaint(submitResult.tracking_code, '4321');
assert(trackSuccess.found === true, 'Tracking succeeds when both Tracking ID and last 4 mobile digits match');
assert(trackSuccess.data.status === 'submitted', 'New complaint has status "submitted"');
assert(trackSuccess.data.citizen_mobile === undefined, 'Privacy Shield: Full citizen phone number is NOT exposed in tracking response');
assert(trackSuccess.data.citizen_name === undefined, 'Privacy Shield: Citizen full name is NOT exposed in tracking response');

// Track with WRONG last 4 digits
const trackWrongPhone = await trackComplaint(submitResult.tracking_code, '9999');
assert(trackWrongPhone.found === false, 'Privacy Shield: Tracking query is rejected if mobile last 4 digits do not match');

// -------------------------------------------------------------------------
// SUITE 7: Authorized Staff Status Update Workflow
// -------------------------------------------------------------------------
console.log('\n⚙️ Suite 7: Staff Management & Status Transition Workflow');

// Status update with WRONG pin
const unauthorizedUpdate = await updateComplaintStatus(submitResult.tracking_code, 'in_progress', 'Note', 'wrong_pin');
assert(!unauthorizedUpdate.success && unauthorizedUpdate.error === 'invalidPin', 'Unauthorized status update without correct PIN is rejected');

// Status update with CORRECT pin
const authorizedUpdate = await updateComplaintStatus(
  submitResult.tracking_code,
  'in_progress',
  'लाइनमैन को मरम्मत हेतु मौके पर भेजा गया।',
  'sarpanch789'
);
assert(authorizedUpdate.success, 'Authorized Sarpanch/Staff can update status with valid PIN');

// Verify updated status and timeline in tracking
const updatedTrack = await trackComplaint(submitResult.tracking_code, '4321');
assert(updatedTrack.data.status === 'in_progress', 'Tracked complaint reflects updated status "in_progress"');
assert(updatedTrack.data.history.length >= 2, 'Complaint history timeline contains updated audit events');

// -------------------------------------------------------------------------
// SUITE 8: Ward 22 Campaign Management, Volunteers & Voter Registry
// -------------------------------------------------------------------------
console.log('\n🗳️ Suite 8: Campaign Management, Volunteers & Voter Registry (Ward 22)');

// Add Volunteer
const volRes = await addVolunteer('candidate-kapil-mehta', {
  name: 'राकेश शर्मा',
  mobile: '9829011122',
  gramPanchayat: 'अकोदिया',
  assignedBooth: 'रा.उ.मा.वि. अकोदिया',
  role: 'बूथ संयोजक'
});
assert(volRes.success && volRes.volunteer.name === 'राकेश शर्मा', 'Successfully registered volunteer for Akodiya');

// Fetch volunteers filtered by GP
const akdVolunteers = await getVolunteers('candidate-kapil-mehta', 'अकोदिया');
assert(akdVolunteers.length >= 1, 'Volunteers query correctly filters by Gram Panchayat (Akodiya)');

const otherGpVolunteers = await getVolunteers('candidate-kapil-mehta', 'पनवाड़');
assert(otherGpVolunteers.length === 0, 'No false cross-contamination between different Gram Panchayats');

// Import Voters via CSV
const sampleCsv = `voter_id,full_name,relative_name,age,gender,gram_panchayat,booth,mobile\r\nRJ/12/345/001,मोहन लाल,रामचन्द्र,38,M,पनवाड़,रा.उ.मा.वि. पनवाड़,9829033344\r\nRJ/12/345/002,कौशल्या देवी,मोहन लाल,34,F,पनवाड़,रा.उ.मा.वि. पनवाड़,9829033345`;
const csvImportRes = await importVotersCsv('candidate-kapil-mehta', sampleCsv);
assert(csvImportRes.success && csvImportRes.imported === 2, 'CSV import successfully parses and ingests 2 valid voter records');

// Query voters
const voters = await getVoters('candidate-kapil-mehta', { filterGp: 'पनवाड़' });
assert(voters.length === 2, 'Voter registry correctly retrieves imported voters for Panwad Gram Panchayat');

// CSV Export
const exportedCsv = await exportVotersCsv('candidate-kapil-mehta', 'पनवाड़');
assert(exportedCsv.includes('मोहन लाल') && exportedCsv.includes('कौशल्या देवी'), 'CSV export generates valid data including imported voter records');

// Metric calculation (strictly query-based, zero fake numbers)
const metrics = await getCampaignMetrics(candidateKapilMehta, '', 'sarpanch789');
assert(metrics.totalConfiguredGps === 7, 'Campaign metrics correctly returns 7 configured Gram Panchayats');
assert(metrics.volunteerCount >= 1, 'Volunteer count dynamically computed from actual database records');
assert(metrics.voterCount >= 2, 'Voter count dynamically computed from actual database records');

// -------------------------------------------------------------------------
// SUMMARY
// -------------------------------------------------------------------------
console.log('\n========================================================');
console.log(`🏁 TEST RESULTS: ${passedTests} Passed | ${failedTests} Failed`);
console.log('========================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
