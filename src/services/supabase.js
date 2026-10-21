/**
 * Supabase Client & Local Mock Fallback Service
 * Ensures seamless operation whether live Supabase credentials are provided
 * or if running locally/offline in verified demo mode.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_URL) || '';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) || '';

const isPlaceholder = (val) => !val || val.includes('your-project') || val.includes('your-anon');

export const isLiveBackendConfigured = Boolean(supabaseUrl && supabaseAnonKey && !isPlaceholder(supabaseUrl) && !isPlaceholder(supabaseAnonKey));

let client = null;

if (isLiveBackendConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
    console.info('[SarpanchSetu] Connected to live Supabase backend:', supabaseUrl);
  } catch (err) {
    console.warn('[SarpanchSetu] Failed to initialize Supabase client:', err);
    client = null;
  }
} else {
  console.info('[SarpanchSetu] Running with local secure storage engine (Pending Supabase credentials).');
}

export const supabase = client;
export default supabase;
