/**
 * i18n Translation & Localization Controller
 * Provides reactive language state, translation lookups, and document lang synchronization.
 */

import hi from './hi.js';
import en from './en.js';

const dictionaries = { hi, en };

const STORAGE_KEY = 'sarpanch_setu_lang';

// Retrieve initial language (default to Hindi 'hi')
let currentLang = 'hi';
try {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'hi' || saved === 'en') {
    currentLang = saved;
  }
} catch (e) {
  // localStorage may be disabled in some environments
  currentLang = 'hi';
}

// Listeners for reactive language change
const listeners = new Set();

export function getCurrentLang() {
  return currentLang;
}

export function setLanguage(lang) {
  if (lang !== 'hi' && lang !== 'en') return;
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // Ignore storage errors
  }

  // Update root html lang attribute for screen readers & styling
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
  }

  // Notify all registered listeners
  listeners.forEach(fn => fn(currentLang));
}

export function toggleLanguage() {
  const nextLang = currentLang === 'hi' ? 'en' : 'hi';
  setLanguage(nextLang);
  return nextLang;
}

export function onLanguageChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/**
 * Look up key in dictionary with dot notation support (e.g., 'nav.home')
 */
export function t(key, fallback = '') {
  const dict = dictionaries[currentLang] || dictionaries.hi;
  const parts = key.split('.');
  let current = dict;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      // Fallback to Hindi if English key missing
      let hiFallback = dictionaries.hi;
      for (const p of parts) {
        if (hiFallback && typeof hiFallback === 'object' && p in hiFallback) {
          hiFallback = hiFallback[p];
        } else {
          hiFallback = null;
          break;
        }
      }
      return (typeof hiFallback === 'string') ? hiFallback : fallback || key;
    }
  }

  return (typeof current === 'string') ? current : fallback || key;
}

/**
 * Extracts localized string from bilingual candidate object { hi: "...", en: "..." }
 */
export function getLocalized(bilingualObj, fallback = '') {
  if (!bilingualObj) return fallback;
  if (typeof bilingualObj === 'string') return bilingualObj;
  return bilingualObj[currentLang] || bilingualObj.hi || bilingualObj.en || fallback;
}
