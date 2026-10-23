/**
 * Candidate Configuration Schema & Validator
 * Ensures that candidate files conform to all required fields,
 * provides sensible defaults, and prevents crashes from missing optional fields.
 */

export const requiredFields = [
  'id',
  'name',
  'designation',
  'panchayatName',
  'village',
  'tehsil',
  'district',
  'state',
  'contact'
];

/**
 * Validates a candidate configuration object.
 * Returns { valid: boolean, errors: string[], warnings: string[] }
 */
export function validateCandidateConfig(config) {
  const errors = [];
  const warnings = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Candidate configuration must be an object'], warnings: [] };
  }

  for (const field of requiredFields) {
    if (!config[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check bilingual name
  if (config.name && (typeof config.name !== 'object' || !config.name.hi || !config.name.en)) {
    warnings.push('Candidate name should provide both "hi" and "en" translations.');
  }

  // Check contact
  if (config.contact) {
    if (!config.contact.phone) {
      warnings.push('Missing contact.phone');
    }
    if (!config.contact.whatsapp) {
      warnings.push('Missing contact.whatsapp (used for quick citizen assistance)');
    }
  }

  // Check development works arrays
  if (!Array.isArray(config.completedWorks)) {
    warnings.push('completedWorks should be an array (defaulting to empty array)');
  }
  if (!Array.isArray(config.ongoingWorks)) {
    warnings.push('ongoingWorks should be an array (defaulting to empty array)');
  }
  if (!Array.isArray(config.proposedWorks)) {
    warnings.push('proposedWorks should be an array (defaulting to empty array)');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Normalizes candidate configuration with safe defaults
 */
export function normalizeCandidateConfig(rawConfig) {
  if (!rawConfig) return null;

  return {
    id: rawConfig.id || 'default',
    name: {
      hi: rawConfig.name?.hi || 'सरपंच प्रत्याशी',
      en: rawConfig.name?.en || 'Sarpanch Candidate'
    },
    designation: {
      hi: rawConfig.designation?.hi || 'सरपंच प्रत्याशी',
      en: rawConfig.designation?.en || 'Sarpanch Candidate'
    },
    tagline: {
      hi: rawConfig.tagline?.hi || 'सक्षम ग्राम पंचायत, सशक्त नागरिक',
      en: rawConfig.tagline?.en || 'Empowered Gram Panchayat, Resilient Citizens'
    },
    panchayatName: {
      hi: rawConfig.panchayatName?.hi || 'ग्राम पंचायत',
      en: rawConfig.panchayatName?.en || 'Gram Panchayat'
    },
    village: {
      hi: rawConfig.village?.hi || '',
      en: rawConfig.village?.en || ''
    },
    tehsil: {
      hi: rawConfig.tehsil?.hi || '',
      en: rawConfig.tehsil?.en || ''
    },
    district: {
      hi: rawConfig.district?.hi || 'जयपुर',
      en: rawConfig.district?.en || 'Jaipur'
    },
    state: {
      hi: rawConfig.state?.hi || 'राजस्थान',
      en: rawConfig.state?.en || 'Rajasthan'
    },
    photo: rawConfig.photo || null, // null triggers neutral SVG avatar
    symbol: rawConfig.symbol || null, // election or panchayat emblem
    bio: {
      hi: rawConfig.bio?.hi || '',
      en: rawConfig.bio?.en || ''
    },
    education: {
      hi: rawConfig.education?.hi || '',
      en: rawConfig.education?.en || ''
    },
    experience: {
      hi: rawConfig.experience?.hi || '',
      en: rawConfig.experience?.en || ''
    },
    socialWork: Array.isArray(rawConfig.socialWork) ? rawConfig.socialWork : [],
    verifiedAchievements: Array.isArray(rawConfig.verifiedAchievements) ? rawConfig.verifiedAchievements : [],
    completedWorks: Array.isArray(rawConfig.completedWorks) ? rawConfig.completedWorks : [],
    ongoingWorks: Array.isArray(rawConfig.ongoingWorks) ? rawConfig.ongoingWorks : [],
    proposedWorks: Array.isArray(rawConfig.proposedWorks) ? rawConfig.proposedWorks : [],
    vision: {
      hi: rawConfig.vision?.hi || '',
      en: rawConfig.vision?.en || ''
    },
    mission: {
      hi: rawConfig.mission?.hi || '',
      en: rawConfig.mission?.en || ''
    },
    priorities: Array.isArray(rawConfig.priorities) ? rawConfig.priorities : [],
    contact: {
      phone: rawConfig.contact?.phone || '+91-9876543210',
      whatsapp: rawConfig.contact?.whatsapp || '919876543210',
      email: rawConfig.contact?.email || '',
      officeAddress: {
        hi: rawConfig.contact?.officeAddress?.hi || 'ग्राम पंचायत भवन के सामने, राजस्थान',
        en: rawConfig.contact?.officeAddress?.en || 'Opposite Gram Panchayat Bhawan, Rajasthan'
      }
    },
    socialLinks: rawConfig.socialLinks || {},
    emergencyNumbers: Array.isArray(rawConfig.emergencyNumbers) ? rawConfig.emergencyNumbers : [
      { name: { hi: 'ग्राम पंचायत हेल्पलाइन', en: 'Panchayat Helpline' }, number: '181' },
      { name: { hi: 'एम्बुलेंस (आपातकालीन)', en: 'Ambulance (Emergency)' }, number: '108' },
      { name: { hi: 'महिला हेल्पलाइन', en: 'Women Helpline' }, number: '1090' },
      { name: { hi: 'किसान कॉल सेन्टर', en: 'Kisan Call Centre' }, number: '1800-180-1551' }
    ],
    announcements: Array.isArray(rawConfig.announcements) ? rawConfig.announcements : [],
    wardNumber: rawConfig.wardNumber || '',
    editionName: rawConfig.editionName || null,
    gramPanchayats: Array.isArray(rawConfig.gramPanchayats) ? rawConfig.gramPanchayats : [],
    personalDetails: rawConfig.personalDetails || null,
    educationTimeline: Array.isArray(rawConfig.educationTimeline) ? rawConfig.educationTimeline : [],
    politicalJourney: Array.isArray(rawConfig.politicalJourney) ? rawConfig.politicalJourney : [],
    theme: {
      primaryColor: rawConfig.theme?.primaryColor || '#1b4332',
      accentColor: rawConfig.theme?.accentColor || '#d97706',
      surfaceColor: rawConfig.theme?.surfaceColor || '#fbf9f4'
    },
    disclaimer: {
      hi: rawConfig.disclaimer?.hi || 'यह मंच एक स्वतंत्र नागरिक सुविधा और संवाद माध्यम है, यह कोई आधिकारिक सरकारी पोर्टल नहीं है। सरकारी योजनाओं की आधिकारिक पुष्टि संबंधित विभाग से की जानी चाहिए।',
      en: rawConfig.disclaimer?.en || 'This platform is an independent citizen facilitation and dialogue initiative and not an official government portal. Official scheme benefits and rules must be verified with respective government departments.'
    }
  };
}
