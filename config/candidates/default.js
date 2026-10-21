/**
 * Default Template Configuration for Sarpanch Setu
 * All placeholder texts are clearly marked. Use this as a starter for new candidates.
 */

export default {
  id: 'default',
  name: {
    hi: 'श्री/श्रीमती [प्रत्याशी का नाम]',
    en: 'Shri/Smt. [Candidate Name]'
  },
  designation: {
    hi: 'सरपंच प्रत्याशी',
    en: 'Sarpanch Candidate'
  },
  tagline: {
    hi: 'ईमानदार नेतृत्व, समग्र ग्रामीण विकास',
    en: 'Honest Leadership, Comprehensive Village Development'
  },
  panchayatName: {
    hi: 'ग्राम पंचायत [पंचायत का नाम]',
    en: 'Gram Panchayat [Panchayat Name]'
  },
  village: {
    hi: '[गांव का नाम]',
    en: '[Village Name]'
  },
  tehsil: {
    hi: '[तहसील का नाम]',
    en: '[Tehsil Name]'
  },
  district: {
    hi: 'जयपुर',
    en: 'Jaipur'
  },
  state: {
    hi: 'राजस्थान',
    en: 'Rajasthan'
  },
  photo: null, // null defaults to clean SVG avatar
  symbol: null,
  bio: {
    hi: 'ग्राम पंचायत के स्थानीय निवासी एवं सक्रिय सामाजिक कार्यकर्ता। गांव के बुनियादी विकास और जनसमस्याओं के समाधान हेतु संकल्पबद्ध। [अधिकृत परिचय]',
    en: 'Local resident and active community volunteer committed to fundamental village development and transparent public service. [Official Bio]'
  },
  education: {
    hi: 'स्नातक (कला संकाय)',
    en: 'Bachelor of Arts (B.A.)'
  },
  experience: {
    hi: '10+ वर्षों का ग्रामीण सामाजिक सेवा एवं सामुदायिक विकास अनुभव',
    en: '10+ years in rural social service and community welfare'
  },
  socialWork: [
    {
      title: { hi: 'पेयजल संकट समाधान प्रयास', en: 'Drinking Water Relief Efforts' },
      description: {
        hi: 'गर्मी के मौसम में ढाणियों में टैंकर व्यवस्था और हैंडपंप मरम्मत की निगरानी।',
        en: 'Supervised tanker logistics and hand-pump maintenance for outlying hamlets during summer.'
      },
      year: '2023'
    },
    {
      title: { hi: 'सामुदायिक स्वास्थ्य शिविर आयोजन', en: 'Community Health Camp Organization' },
      description: {
        hi: 'नेत्र जांच और सामान्य स्वास्थ्य परीक्षण शिविर का सफल आयोजन।',
        en: 'Facilitated eye checkup and free medical diagnostic camps for elders.'
      },
      year: '2024'
    }
  ],
  verifiedAchievements: [
    {
      title: { hi: 'स्थानीय जल संरक्षण में जनसहभागिता', en: 'Community Water Conservation Drive' },
      detail: {
        hi: 'तालाब की गाद निकालने में 150+ ग्रामीणों का श्रमदान समन्वय।',
        en: 'Coordinated voluntary de-silting of the community pond with 150+ villagers.'
      }
    }
  ],
  completedWorks: [
    {
      id: 'cw-1',
      title: { hi: 'मुख्य विद्यालय संपर्क मार्ग पर ग्रेवल कार्य', en: 'Gravel Road to Primary School' },
      description: {
        hi: 'छात्रों के आवागमन की सुविधा के लिए 600 मीटर संपर्क मार्ग की मरम्मत।',
        en: '600-meter connecting path repaired for safe student and pedestrian transit.'
      },
      location: { hi: 'वार्ड संख्या 3, मुख्य विद्यालय मार्ग', en: 'Ward 3, Main School Lane' },
      period: 'दिसंबर 2023 / Dec 2023',
      status: 'completed',
      source: { hi: 'पंचायत संकल्प रजिस्टर 2023', en: 'Panchayat Resolution Register 2023' }
    }
  ],
  ongoingWorks: [
    {
      id: 'ow-1',
      title: { hi: 'सार्वजनिक आरओ वाटर प्लांट स्थापना कार्य', en: 'Community RO Water Plant Installation' },
      description: {
        hi: 'स्वच्छ फ्लोराइड मुक्त पेयजल उपलब्ध कराने हेतु आरओ प्लांट का निर्माण जारी।',
        en: 'Civil work and equipment setup underway for fluoride-free potable water.'
      },
      location: { hi: 'ग्राम चौक, पुराना कुआं परिसर', en: 'Village Square, Old Well Complex' },
      period: 'प्रगति पर / In Progress (लक्ष्य: नव. 2026)',
      status: 'ongoing'
    }
  ],
  proposedWorks: [
    {
      id: 'pw-1',
      title: { hi: 'सभी मुख्य चौराहों पर सौर ऊर्जा स्ट्रीट लाइट', en: 'Solar Street Lights at Main Crossings' },
      description: {
        hi: 'अंधेरे मार्गों एवं सार्वजनिक स्थलों पर 50 नए सोलर लाइट खंभे लगवाने का प्रस्ताव।',
        en: 'Proposal to install 50 high-efficiency solar lighting poles on poorly lit roads.'
      },
      priority: 'उच्च / High',
      status: 'proposed'
    },
    {
      id: 'pw-2',
      title: { hi: 'डिजिटल नागरिक सुविधा केंद्र (ई-मित्र सेवा विस्तार)', en: 'Digital Citizen Service Facilitation Centre' },
      description: {
        hi: 'पंचायत भवन में बुजुर्गों और महिलाओं के लिए निशुल्क फॉर्म भरने की सुविधा।',
        en: 'Free form-filling assistance counter for elders and women at the Panchayat building.'
      },
      priority: 'मध्यम / Medium',
      status: 'proposed'
    }
  ],
  vision: {
    hi: 'एक आत्मनिर्भर, स्वच्छ, शिक्षित और पारदर्शी ग्राम पंचायत का निर्माण जहां हर नागरिक की बात सुनी जाए।',
    en: 'To foster a self-reliant, clean, educated, and transparent Gram Panchayat where every resident has an active voice.'
  },
  mission: {
    hi: 'समयबद्ध जनसमस्या निवारण, सरकारी योजनाओं का शत-प्रतिशत पात्र परिवारों तक लाभ और युवाओं के लिए कौशल अवसर।',
    en: 'Time-bound grievance redressal, ensuring 100% eligible access to government schemes, and digital opportunities for rural youth.'
  },
  priorities: [
    {
      icon: 'water',
      title: { hi: 'घर-घर शुद्ध पेयजल', en: 'Clean Tap Drinking Water' },
      description: {
        hi: 'जल जीवन मिशन पाइपलाइन की नियमित आपूर्ति और लीकेज की तुरंत मरम्मत।',
        en: 'Ensure steady Jal Jeevan tap supply and rapid repair of distribution line leaks.'
      }
    },
    {
      icon: 'road',
      title: { hi: 'पक्की सड़कें और जल निकासी', en: 'Paved Roads & Drainage' },
      description: {
        hi: 'कच्चे रास्तों का सीसीकरण और जलभराव रोकने के लिए ढकी हुई नालियां।',
        en: 'Concrete paving of dirt roads and covered drainage to end seasonal waterlogging.'
      }
    },
    {
      icon: 'light',
      title: { hi: 'प्रकाश व्यवस्था और सुरक्षा', en: 'Street Illumination & Safety' },
      description: {
        hi: 'मुख्य मार्गों पर स्वचालित एलईडी व सोलर लाइट की व्यवस्था।',
        en: 'Systematic LED & solar illumination across key village crossroads.'
      }
    },
    {
      icon: 'education',
      title: { hi: 'विद्यालय सुधार एवं पुस्तकालय', en: 'School Upgrades & Library' },
      description: {
        hi: 'राजकीय विद्यालयों में खेल सामग्री, साफ शौचालय और प्रतियोगी परीक्षा हेतु वाचनालय।',
        en: 'Hygienic school sanitation, sports supplies, and a quiet reading room for youth.'
      }
    },
    {
      icon: 'health',
      title: { hi: 'प्राथमिक स्वास्थ्य और दवा उपलब्धता', en: 'Primary Health & Medicine' },
      description: {
        hi: 'उपकेंद्र पर एएनएम उपस्थिति, आवश्यक दवाइयां और समय पर एम्बुलेंस सेवा।',
        en: 'Regular ANM attendance, essential generic medicines, and prompt ambulance dispatch.'
      }
    },
    {
      icon: 'clean',
      title: { hi: 'स्वच्छता और कचरा प्रबंधन', en: 'Sanitation & Waste Disposal' },
      description: {
        hi: 'डोर-टू-डोर कचरा संग्रहण ट्रॉली और नियमित कीटनाशक छिड़काव।',
        en: 'Scheduled door-to-door refuse cart collection and periodic pest control.'
      }
    }
  ],
  contact: {
    phone: '+91-9876543210',
    whatsapp: '919876543210',
    email: 'sarpanch.sewa@example.org',
    officeAddress: {
      hi: 'ग्राम पंचायत भवन, मुख्य चौक, राजस्थान',
      en: 'Gram Panchayat Bhawan, Main Chowk, Rajasthan'
    }
  },
  socialLinks: {
    facebook: 'https://facebook.com',
    whatsapp: 'https://wa.me/919876543210',
    youtube: 'https://youtube.com'
  },
  emergencyNumbers: [
    { name: { hi: 'राजस्थान संपर्क हेल्पलाइन (शिकायत)', en: 'Rajasthan Sampark Helpline' }, number: '181' },
    { name: { hi: 'आपातकालीन एम्बुलेंस', en: 'Emergency Ambulance' }, number: '108' },
    { name: { hi: 'महिला हेल्पलाइन', en: 'Women Safety Helpline' }, number: '1090' },
    { name: { hi: 'किसान कॉल सेन्टर', en: 'Kisan Call Centre' }, number: '1800-180-1551' },
    { name: { hi: 'पुलिस सहायता', en: 'Police Assistance' }, number: '100 / 112' }
  ],
  announcements: [
    {
      id: 'ann-1',
      date: '2026-10-25',
      title: { hi: 'आगामी विशेष ग्राम सभा बैठक', en: 'Upcoming Special Gram Sabha Meeting' },
      content: {
        hi: 'दिनांक 25 अक्टूबर को पंचायत भवन में ग्राम सभा आयोजित होगी। वार्षिक विकास कार्य योजना पर चर्चा होगी। सभी ग्रामवासी सादर आमंत्रित हैं।',
        en: 'Special Gram Sabha scheduled on 25th October at Panchayat Bhawan to finalize village development priorities. All residents are invited.'
      },
      tag: { hi: 'महत्वपूर्ण सूचना', en: 'Important Notice' }
    },
    {
      id: 'ann-2',
      date: '2026-10-28',
      title: { hi: 'पशु टीकाकरण एवं जांच शिविर', en: 'Livestock Vaccination & Health Camp' },
      content: {
        hi: 'पशुपालन विभाग द्वारा दुधारू पशुओं के लिए निशुल्क खुरपका-मुंहपका टीकाकरण शिविर का आयोजन उपकेंद्र परिसर में किया जाएगा।',
        en: 'Free livestock vaccination drive against FMD will be held at the Veterinary Sub-centre.'
      },
      tag: { hi: 'पशु स्वास्थ्य', en: 'Livestock Care' }
    }
  ],
  theme: {
    primaryColor: '#1b4332',
    accentColor: '#d97706',
    surfaceColor: '#fbf9f4'
  },
  disclaimer: {
    hi: 'यह वेब ऐप एक स्वतंत्र नागरिक संवाद और सुविधा मंच है। यह भारत सरकार या राजस्थान सरकार का आधिकारिक पोर्टल नहीं है। योजनाओं का औपचारिक लाभ संबंधित सरकारी कार्यालय से प्राप्त किया जा सकता है।',
    en: 'This web app is an independent citizen engagement and service platform. It is not an official government portal. Statutory benefits must be verified through the respective government departments.'
  }
};
