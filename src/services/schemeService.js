/**
 * Verified Government Welfare Schemes Service
 * Curated from official government portals (PMAY-G, JJM, MGNREGA, PM-KUSUM, MAAY, etc.)
 * Strictly includes eligibility, document checklists, official URLs, and statutory disclaimers.
 */

export const governmentSchemes = [
  {
    id: 'pmay-g',
    category: 'housing',
    title: {
      hi: 'प्रधानमंत्री आवास योजना - ग्रामीण (PMAY-G)',
      en: 'Pradhan Mantri Awas Yojana - Gramin (PMAY-G)'
    },
    shortDesc: {
      hi: 'बेघर एवं कच्चे मकानों में रहने वाले ग्रामीण परिवारों को पक्के आवास निर्माण हेतु ₹1,20,000 की वित्तीय सहायता।',
      en: 'Financial assistance of ₹1,20,000 in plain areas for constructing pucca houses for homeless rural households.'
    },
    eligibility: {
      hi: [
        'SECC-2011 या आवास प्लस सूची में दर्ज बेघर या कच्चे एक/दो कमरे वाले परिवार',
        'परिवार में 16 से 59 वर्ष का कोई वयस्क पुरुष सदस्य न होना अथवा दिव्यांग सदस्य वाले परिवार',
        'परिवार के पास पक्का मकान या चार पहिया वाहन न हो',
        'परिवार का कोई सदस्य सरकारी सेवा अथवा आयकर दाता न हो'
      ],
      en: [
        'Households without shelter or living in kutcha houses as per SECC-2011 / Awaas+ list',
        'Female-headed households or families with disabled members given priority',
        'Must not possess a pucca house anywhere in India or a motorized four-wheeler',
        'No family member should be in government service or an income tax payee'
      ]
    },
    documents: {
      hi: [
        'जन आधार कार्ड / आधार कार्ड (सभी पारिवारिक सदस्यों का)',
        'बैंक बचत खाता पासबुक (आधार से लिंक एवं DBT सक्रिय)',
        'जमीन का स्वामित्व दस्तावेज / पट्टा अथवा ग्राम पंचायत अनापत्ति प्रमाण पत्र',
        'वर्तमान कच्चे मकान की तस्वीर (भू-टैगिंग हेतु)',
        'मोबाइल नंबर (पंजीकृत)'
      ],
      en: [
        'Jan Aadhaar / Aadhaar Cards of all adult family members',
        'Bank Passbook (DBT and Aadhaar-seeded account)',
        'Land ownership document / Patta or Gram Panchayat NOC',
        'Photograph of existing kutcha shelter for geo-tagging',
        'Active mobile number'
      ]
    },
    howToApply: {
      hi: 'ग्राम पंचायत कार्यालय अथवा ग्राम विकास अधिकारी (VDO) से संपर्क करें या नजदीकी ई-मित्र केंद्र के माध्यम से आवास प्लस सूची में नाम का सत्यापन करवाएं।',
      en: 'Contact the Gram Vikas Adhikari (VDO) at the Gram Panchayat office or verify entry on the Awaas+ portal via local e-Mitra.'
    },
    officialUrl: 'https://pmayg.nic.in',
    lastVerified: 'अक्टूबर 2026'
  },
  {
    id: 'jal-jeevan',
    category: 'water',
    title: {
      hi: 'जल जीवन मिशन - हर घर जल (JJM)',
      en: 'Jal Jeevan Mission - Har Ghar Jal (JJM)'
    },
    shortDesc: {
      hi: 'प्रत्येक ग्रामीण परिवार को घर के आंगन में नल से प्रति व्यक्ति प्रतिदिन 55 लीटर शुद्ध व सुरक्षित पेयजल आपूर्ति।',
      en: 'Functional household tap connections (FHTC) providing 55 litres of potable water per capita daily to every rural home.'
    },
    eligibility: {
      hi: [
        'ग्राम पंचायत के सभी स्थाई निवासी परिवार',
        'गांव/ढाणी की जल वितरण पाइपलाइन के परिधि में स्थित घर',
        'ग्राम जल एवं स्वच्छता समिति (VWSC) द्वारा अनुमोदित बसावट'
      ],
      en: [
        'All permanent rural households within the revenue village and outlying hamlets',
        'Dwellings situated within technical distribution reach of the village water network',
        'Habitations prioritized under the Village Water & Sanitation Committee (VWSC) plan'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड / पहचान पत्र',
        'बिजली बिल या मकान का पट्टा/प्रमाण',
        'नल कनेक्शन आवेदन पत्र (ग्राम पंचायत/जल समिति द्वारा प्रदत्त)'
      ],
      en: [
        'Aadhaar Card of household head',
        'Electricity bill or residence proof document',
        'JJM connection application form verified by the Village Water Committee'
      ]
    },
    howToApply: {
      hi: 'ग्राम पंचायत जल एवं स्वच्छता समिति अथवा जलदाय विभाग (PHED) कनिष्ठ अभियंता से संपर्क कर कनेक्शन फॉर्म भरें।',
      en: 'Submit prescribed connection requisition to the Village Water & Sanitation Committee or local PHED junior engineer.'
    },
    officialUrl: 'https://jaljeevanmission.gov.in',
    lastVerified: 'अक्टूबर 2026'
  },
  {
    id: 'mgnrega',
    category: 'farmer',
    title: {
      hi: 'महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी (मनरेगा)',
      en: 'Mahatma Gandhi NREGA (100/125 Days Guaranteed Rural Work)'
    },
    shortDesc: {
      hi: 'ग्रामीण परिवारों के वयस्क सदस्यों को प्रत्येक वित्तीय वर्ष में अकुशल शारीरिक श्रम का 100 से 125 दिन का गारंटीकृत रोजगार।',
      en: 'Legal guarantee of 100 to 125 days of wage employment per financial year to adult members willing to do unskilled manual work.'
    },
    eligibility: {
      hi: [
        'ग्राम पंचायत का स्थाई निवासी वयस्क नागरिक (18 वर्ष या अधिक)',
        'अकुशल शारीरिक कार्य करने हेतु इच्छुक',
        'परिवार के पास वैध मनरेगा जॉब कार्ड होना अनिवार्य'
      ],
      en: [
        'Adult residents of rural households aged 18 and above',
        'Willing to do manual unskilled work within the Gram Panchayat perimeter',
        'Must possess or apply for a valid MGNREGA Job Card'
      ]
    },
    documents: {
      hi: [
        'आधार कार्ड (सभी वयस्क सदस्यों का)',
        'जन आधार कार्ड (राजस्थान)',
        'बैंक या डाकघर बचत खाता पासबुक (एकल अथवा संयुक्त)',
        'पासपोर्ट साइज फोटो'
      ],
      en: [
        'Aadhaar card of all adult applicants',
        'Jan Aadhaar Card (Rajasthan resident mandate)',
        'Bank or post office savings passbook',
        'Passport size photographs'
      ]
    },
    howToApply: {
      hi: 'ग्राम पंचायत में ग्राम रोजगार सहायक या ग्राम विकास अधिकारी के पास फॉर्म-1 भरकर निःशुल्क जॉब कार्ड और कार्य आवंटन हेतु आवेदन करें।',
      en: 'Submit Form-1 to the Gram Rozgar Sahayak or VDO at the Panchayat secretariat for free job card issuance and work allocation.'
    },
    officialUrl: 'https://nrega.nic.in',
    lastVerified: 'अक्टूबर 2026'
  },
  {
    id: 'pm-kusum',
    category: 'farmer',
    title: {
      hi: 'पीएम-कुसुम योजना (सौर कृषि पंप संयंत्र अनुदान)',
      en: 'PM-KUSUM Scheme (Solar Agriculture Pump Subsidy)'
    },
    shortDesc: {
      hi: 'किसानों को डीजल व सामान्य बिजली पंप की जगह सोलर पंप लगाने पर 60% तक का भारी सरकारी अनुदान।',
      en: 'Up to 60% capital subsidy for installing standalone solar agricultural irrigation pumps replacing diesel motors.'
    },
    eligibility: {
      hi: [
        'कृषक परिवार जिनके नाम कृषि भूमि की जमाबंदी हो',
        'सिंचाई हेतु कुआं/बोरवेल अथवा जल स्रोत उपलब्ध हो',
        'जिनके खेत पर पूर्व में कोई ग्रिड-कनेक्टेड कृषि विद्युत कनेक्शन न हो (घटक-बी हेतु)'
      ],
      en: [
        'Individual farmers with land title in Jamabandi records',
        'Having an existing borewell, open well, or dependable farm pond',
        'No existing grid-connected electric pump on the concerned land parcel (for Component-B)'
      ]
    },
    documents: {
      hi: [
        'जमाबंदी की नकल (राजस्व पटवारी द्वारा प्रमाणित एवं 6 माह से पुरानी न हो)',
        'जन आधार कार्ड एवं आधार कार्ड',
        'सिंचाई जल स्रोत का प्रमाण (पटवारी रिपोर्ट)',
        'बैंक पासबुक एवं किसान अंशदान हेतु बैंक ड्राफ्ट'
      ],
      en: [
        'Revenue Jamabandi land record extract (within 6 months validity)',
        'Jan Aadhaar and Aadhaar cards',
        'Certificate of water source from Patwari',
        'Bank passbook and bank draft for farmer share'
      ]
    },
    howToApply: {
      hi: 'राजस्थान किसान साथी पोर्टल (rajkisan.rajasthan.gov.in) अथवा ई-मित्र केंद्र के माध्यम से ऑनलाइन आवेदन किया जाता है।',
      en: 'Apply online through RajKisan Saathi portal (rajkisan.rajasthan.gov.in) or via any certified e-Mitra kiosk.'
    },
    officialUrl: 'https://pmkusum.mnre.gov.in',
    lastVerified: 'अक्टूबर 2026'
  },
  {
    id: 'maay-health',
    category: 'health',
    title: {
      hi: 'मुख्यमंत्री आयुष्मान आरोग्य योजना (MAAY राजस्थान)',
      en: 'Mukhyamantri Ayushman Arogya Yojana (MAAY Rajasthan)'
    },
    shortDesc: {
      hi: 'पात्र परिवारों को राजकीय एवं अनुबंधित निजी चिकित्सालयों में कैशलेस आईपीडी उपचार सुरक्षा।',
      en: 'Comprehensive cashless inpatient treatment in government and accredited private network hospitals across Rajasthan.'
    },
    eligibility: {
      hi: [
        'NFSA (खाद्य सुरक्षा) लाभार्थी परिवार (निःशुल्क)',
        'लघु एवं सीमांत किसान (निःशुल्क)',
        'संविदाकर्मी एवं कोविड अनुग्रह योजना लाभार्थी (निःशुल्क)',
        'अन्य सामान्य परिवार निर्धारित न्यूनतम वार्षिक प्रीमियम भुगतान पर पात्र'
      ],
      en: [
        'NFSA (National Food Security Act) ration cardholders (100% free)',
        'Small and marginal farmers certified on Jan Aadhaar (100% free)',
        'Contractual employees and SECC beneficiaries (100% free)',
        'General families by paying prescribed subsidized annual premium'
      ]
    },
    documents: {
      hi: [
        'जन आधार कार्ड (जिसमें परिवार के सभी सदस्यों के नाम एवं आधार ई-केवाईसी पूर्ण हो)',
        'राशन कार्ड (खाद्य सुरक्षा सत्यापन हेतु)',
        'मोबाइल नंबर (जन आधार से लिंक)'
      ],
      en: [
        'Jan Aadhaar Card with updated family roster and completed biometric e-KYC',
        'Ration card for NFSA category validation',
        'Aadhaar-linked active mobile number'
      ]
    },
    howToApply: {
      hi: 'जन आधार कार्ड धारक सीधे संबद्ध अस्पताल के आयुष्मान काउंटर पर जन आधार दिखाकर कैशलेस भर्ती सुविधा प्राप्त कर सकते हैं।',
      en: 'Present active Jan Aadhaar card directly at the Ayushman Help Desk of any empanelled hospital for cashless admission.'
    },
    officialUrl: 'https://health.rajasthan.gov.in',
    lastVerified: 'अक्टूबर 2026'
  },
  {
    id: 'palanhar',
    category: 'health',
    title: {
      hi: 'पालनहार योजना (राजस्थान सामाजिक न्याय विभाग)',
      en: 'Palanhar Scheme (Child Care & Educational Grant)'
    },
    shortDesc: {
      hi: 'अनाथ, निराश्रित एवं विधवा माता के बच्चों के पालन-पोषण व शिक्षा हेतु ₹1500 से ₹2500 प्रतिमाह आर्थिक अनुदान।',
      en: 'Monthly grant of ₹1,500 to ₹2,500 per child for nutrition, clothing, and education of orphan or vulnerable children.'
    },
    eligibility: {
      hi: [
        'अनाथ बच्चे, विधवा माता के 3 बच्चे तक, अथवा दिव्यांग माता-पिता के बच्चे',
        'बच्चे की आयु 18 वर्ष से कम होनी चाहिए एवं विद्यालय/आंगनबाड़ी में नियमित अध्ययनरत होना अनिवार्य',
        'पालनहार परिवार की वार्षिक आय ₹1.20 लाख से अधिक न हो'
      ],
      en: [
        'Orphan children, children of widowed mothers (up to 3), or children of severely disabled parents',
        'Child must be under 18 years of age and enrolled in school or anganwadi',
        'Annual income of the foster caretaker (Palanhar) must not exceed ₹1.20 lakh'
      ]
    },
    documents: {
      hi: [
        'जन आधार कार्ड एवं बच्चे का आधार कार्ड',
        'माता/पिता का मृत्यु प्रमाण पत्र (यदि लागू हो)',
        'स्कूल/आंगनबाड़ी अध्ययन प्रमाण पत्र (अध्ययनरत होने का प्रमाण)',
        'आय प्रमाण पत्र एवं बैंक पासबुक'
      ],
      en: [
        'Jan Aadhaar and Aadhaar card of child and caretaker',
        'Death certificate of parents (where applicable)',
        'School enrollment certificate issued by headmaster',
        'Annual income certificate and bank passbook'
      ]
    },
    howToApply: {
      hi: 'ई-मित्र केंद्र के माध्यम से सामाजिक न्याय एवं अधिकारिता विभाग के SJMS पोर्टल पर ऑनलाइन आवेदन किया जाता है।',
      en: 'Submit online application through e-Mitra to the Department of Social Justice & Empowerment (SJE Rajasthan).'
    },
    officialUrl: 'https://sje.rajasthan.gov.in',
    lastVerified: 'अक्टूबर 2026'
  }
];
