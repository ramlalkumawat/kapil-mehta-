/**
 * English Localization Dictionary
 * Precise and professional English translations for all UI keys.
 */

export default {
  // App Identity
  appName: 'Sarpanch Setu',
  appSubtitle: 'Gram Panchayat Citizen Services & Engagement Bridge',
  governmentDisclaimerBadge: 'Independent Citizen Forum • Non-Government',

  // Navigation
  nav: {
    home: 'Home',
    profile: 'Candidate Profile',
    works: 'Development Works',
    vision: 'Vision & Priorities',
    services: 'Citizen Services',
    complaints: 'Grievance Redressal',
    schemes: 'Govt Schemes',
    announcements: 'Notices',
    helplines: 'Helplines',
    adminLogin: 'Staff Login'
  },

  // Common UI & Actions
  actions: {
    switchLang: 'हिन्दी',
    lodgeComplaint: 'Lodge Complaint',
    trackComplaint: 'Track Status',
    viewAllWorks: 'View All Works',
    viewAnnouncements: 'All Notices',
    contactSarpanch: 'Contact Directly',
    whatsappMessage: 'Send WhatsApp Message',
    callNow: 'Call Now',
    submit: 'Submit Grievance',
    submitting: 'Submitting...',
    reset: 'Reset Form',
    close: 'Close',
    copy: 'Copy Code',
    copied: 'Copied!',
    backToHome: 'Back to Home',
    readMore: 'Read More',
    showLess: 'Show Less',
    verifiedSource: 'View Verification Record',
    filterAll: 'All',
    searchPlaceholder: 'Search...'
  },

  // Hero Section
  hero: {
    verifiedBadge: 'Verified Grassroots Leader',
    connectPrompt: 'Dedicated to village progress, grievance redressal, and responsive governance.',
    quickHelpTitle: 'Citizen Quick Assistance',
    urgentEmergency: 'Emergency Contacts'
  },

  // Candidate Profile
  profile: {
    title: 'Candidate Profile & Experience',
    subtitle: 'Transparent, accountable, and people-first grassroots leadership',
    biography: 'Biography',
    education: 'Education',
    experience: 'Social & Administrative Experience',
    socialWork: 'Community Service & Welfare Initiatives',
    verifiedAchievements: 'Verified Milestones',
    visionQuote: 'Public Service Before Self'
  },

  // Development Works
  works: {
    title: 'Gram Panchayat Development Works Portfolio',
    subtitle: 'Transparent disclosure of completed, ongoing, and proposed projects',
    tabs: {
      all: 'All Works',
      completed: 'Completed (Verified)',
      ongoing: 'In Progress (Ongoing)',
      proposed: 'Proposed Workplan'
    },
    statusLabel: 'Status',
    locationLabel: 'Location',
    periodLabel: 'Timeline',
    sourceLabel: 'Verification Record',
    priorityLabel: 'Priority',
    proposedNotice: 'Note: Proposed works reflect developmental priorities and campaign pledges, distinct from completed public works.'
  },

  // Vision & Mission
  vision: {
    title: 'Pledge & Development Priorities',
    subtitle: 'Strategic roadmap for a self-sufficient, clean, and forward-looking Panchayat',
    visionHeading: 'Our Long-Term Vision',
    missionHeading: 'Our Action Mission',
    prioritiesHeading: 'Core 6 Development Pillars'
  },

  // Citizen Services Panel
  services: {
    title: 'Citizen Facilitation Centre',
    subtitle: 'One-touch access to Panchayat redressal, welfare schemes, and public notices',
    lodgeCardTitle: 'Lodge Grievance / Complaint',
    lodgeCardDesc: 'Report water supply, road repairs, streetlights, or sanitation issues. 72-hour review guarantee.',
    trackCardTitle: 'Track Grievance Status',
    trackCardDesc: 'Monitor real-time progress using your unique tracking code and last 4 mobile digits.',
    schemesCardTitle: 'Government Welfare Schemes',
    schemesCardDesc: 'Eligibility rules, required document checklists, and direct official application portals.',
    announcementsCardTitle: 'Gram Sabha & Public Notices',
    announcementsCardDesc: 'Vaccination schedules, Panchayat assemblies, administrative circulars, and dates.'
  },

  // Complaint System
  complaint: {
    modalTitle: 'Citizen Grievance Registration',
    modalSubtitle: 'Please provide precise details to facilitate prompt investigation and resolution.',
    trackModalTitle: 'Track Grievance Redressal',
    trackModalSubtitle: 'Enter your tracking reference and registered mobile digits.',
    fields: {
      name: 'Your Name (Citizen Name)',
      namePlaceholder: 'e.g. Mohan Lal Kumawat',
      mobile: 'Mobile Number (for updates & verification)',
      mobilePlaceholder: '10-digit Indian Mobile Number',
      category: 'Issue Category',
      categoryPlaceholder: '-- Select Issue Category --',
      ward: 'Ward Number / Hamlet / Locality',
      wardPlaceholder: 'e.g. Ward 3, Dhani Bagawali',
      description: 'Clear & Detailed Problem Description',
      descriptionPlaceholder: 'Describe the duration, exact spot, and nature of the issue...',
      photo: 'Problem Photograph (Optional, max 5MB)',
      consent: 'I certify that the information provided is genuine and consent to being contacted by Panchayat representatives for resolution.'
    },
    categories: {
      water: 'Drinking Water (Pipeline leak, tap breakdown, fluoride)',
      road: 'Roads & Pathways (Gravel repair, concrete paving, mud)',
      light: 'Street Lighting (Faulty bulb, broken pole, dark spots)',
      cleanliness: 'Sanitation & Solid Waste (Garbage accumulation, foul smell)',
      drainage: 'Drainage & Overflow (Clogged gutter, stagnant water)',
      infrastructure: 'Public Buildings / Schools / Cremation Grounds',
      scheme_guidance: 'Government Scheme Guidance & Enrollment',
      other: 'Other Local Public Issue'
    },
    privacyNotice: 'Privacy Guarantee: We never collect Aadhaar numbers, bank accounts, or sensitive financial data. Your mobile number is used strictly for authentication.',
    successTitle: 'Grievance Registered Successfully!',
    successMessage: 'Your issue has been securely registered in the priority queue. Please save your tracking code:',
    trackingIdLabel: 'Unique Tracking Reference (Tracking ID)',
    copyBtn: 'Copy Tracking ID',
    viewStatusBtn: 'Track Status Now',
    statuses: {
      submitted: 'Submitted (Received)',
      under_review: 'Under Review (Inspecting)',
      in_progress: 'In Progress (Active Work)',
      resolved: 'Resolved (Completed)',
      closed: 'Closed'
    },
    statusTimelines: {
      submittedDesc: 'Complaint registered by citizen on portal.',
      underReviewDesc: 'Physical verification and ground inspection initiated by Panchayat team.',
      inProgressDesc: 'Work order dispatched to line department / technical crew.',
      resolvedDesc: 'Corrective action implemented and verified.',
      closedDesc: 'Redressal lifecycle concluded.'
    },
    tracking: {
      inputCode: 'Enter Tracking ID (e.g. SETU-RJ-XXXXXX)',
      inputMobileLast4: 'Last 4 Digits of Registered Mobile',
      searchBtn: 'Track Grievance',
      searching: 'Querying status...',
      notFoundTitle: 'No Matching Grievance Found',
      notFoundMsg: 'Please verify the tracking code and the last 4 digits of your mobile number.',
      timelineTitle: 'Redressal Progress Timeline',
      submittedOn: 'Submission Date',
      currentStatus: 'Current Status',
      category: 'Category',
      villageLocality: 'Location',
      publicNote: 'Official Panchayat Resolution Note'
    },
    errors: {
      nameRequired: 'Please enter your name.',
      mobileInvalid: 'Please enter a valid 10-digit Indian mobile number.',
      categoryRequired: 'Please select an issue category.',
      wardRequired: 'Please mention your ward or locality.',
      descTooShort: 'Please describe the problem in at least 15 characters.',
      consentRequired: 'Consent declaration is required to proceed.',
      trackingCodeRequired: 'Please enter the tracking code.',
      last4Required: 'Please enter the last 4 digits of your mobile.',
      fileTooBig: 'Attached photo must be under 5MB.',
      fileInvalidType: 'Only JPG, PNG or WebP images are allowed.'
    }
  },

  // Government Schemes
  schemes: {
    title: 'Verified Government Welfare Schemes',
    subtitle: 'Authoritative scheme information, document checklists, and official links',
    filterAll: 'All Schemes',
    filterHousing: 'Housing & Civil',
    filterWater: 'Water & Sanitation',
    filterFarmer: 'Farmers & Livestock',
    filterHealth: 'Healthcare & Security',
    documentsNeeded: 'Required Document Checklist',
    eligibility: 'Eligibility Criteria',
    applicationProcess: 'How to Apply',
    officialPortal: 'Official Government Portal',
    lastVerified: 'Last Verified',
    officialDisclaimer: 'Notice: Information provided here is solely for citizen guidance. Final eligibility and grant sanction rests strictly with the concerned statutory department.'
  },

  // Staff / Admin Modal
  admin: {
    title: 'Authorized Panchayat / Sarpanch Portal',
    pinLabel: 'Enter Security PIN',
    pinPlaceholder: 'Security PIN',
    loginBtn: 'Authenticate',
    logoutBtn: 'Sign Out',
    accessGranted: 'Authorization Granted',
    invalidPin: 'Invalid Security PIN! Please recheck.',
    complaintListTitle: 'Active Citizen Grievances & Status Management',
    updateStatusLabel: 'Update Status To',
    adminNotesLabel: 'Public Note (Visible to citizen upon tracking)',
    adminNotesPlaceholder: 'e.g. Line crew deployed to repair 2-inch pipe crack on School Road...',
    saveStatusBtn: 'Update Status',
    statusUpdatedSuccess: 'Grievance status updated successfully!'
  },

  // Footer & Disclaimers
  footer: {
    aboutTitle: 'About Sarpanch Setu',
    officeTitle: 'Office & Secretariat Address',
    quickLinksTitle: 'Quick Links',
    emergencyTitle: 'Emergency Help Contacts',
    copyright: 'All Rights Reserved',
    privacyNotice: 'Citizen Privacy: We prioritize your privacy. Phone numbers are utilized solely for verification and status follow-ups. No data is ever sold or shared with commercial entities.',
    fullDisclaimer: 'Disclaimer: This web application is an independent community facilitation platform aimed at transparency and citizen accessibility. It is not an official government portal of India or Rajasthan, and does not provide legal guarantees of administrative decisions.'
  }
};
