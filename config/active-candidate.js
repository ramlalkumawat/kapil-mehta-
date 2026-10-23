/**
 * Active Candidate Resolver
 * Dynamically resolves the active candidate profile based on VITE_CANDIDATE_ID
 * and normalizes it to prevent missing field errors.
 */

import defaultConfig from './candidates/default.js';
import candidate001 from './candidates/candidate-001.js';
import candidate002 from './candidates/candidate-002.js';
import candidateKapilMehta from './candidates/candidate-kapil-mehta.js';
import { normalizeCandidateConfig, validateCandidateConfig } from './schema.js';

const candidateRegistry = {
  'default': defaultConfig,
  'candidate-001': candidate001,
  'candidate-002': candidate002,
  'candidate-kapil-mehta': candidateKapilMehta
};

// Determine candidate ID from Vite env (fallback to candidate-kapil-mehta)
const requestedCandidateId = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CANDIDATE_ID)
  ? import.meta.env.VITE_CANDIDATE_ID
  : 'candidate-kapil-mehta';

const rawConfig = candidateRegistry[requestedCandidateId] || candidateRegistry['candidate-kapil-mehta'] || candidate001 || defaultConfig;

// Validate config
const validation = validateCandidateConfig(rawConfig);
if (!validation.valid) {
  console.warn(`[SarpanchSetu] Candidate configuration validation warnings for "${requestedCandidateId}":`, validation.errors);
}

export const activeCandidate = normalizeCandidateConfig(rawConfig);
export const candidateId = requestedCandidateId;
export const allCandidateIds = Object.keys(candidateRegistry);
export { candidateRegistry };
export default activeCandidate;
