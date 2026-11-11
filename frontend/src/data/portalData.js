/**
 * Maharashtra Motor Vehicles Department Citizen Services Portal Data
 * Official reference: https://transport.maharashtra.gov.in
 */

export const OFFICIAL_EXTERNAL_LINKS = {
  maharashtraTransport: 'https://transport.maharashtra.gov.in',
  parivahanSewa: 'https://parivahan.gov.in',
  sarathiParivahan: 'https://sarathi.parivahan.gov.in',
  vahanParivahan: 'https://vahan.parivahan.gov.in',
  digiLocker: 'https://www.digilocker.gov.in',
  mParivahanPlayStore: 'https://play.google.com/store/apps/details?id=com.nic.mparivahan'
};

export const ANNOUNCEMENTS = [
  {
    id: 'ann-01',
    date: '2026-10-24',
    category: 'Advisory',
    title: 'Mandatory High Security Registration Plates (HSRP) Enforcement Notice',
    summary: 'All vehicles registered in Maharashtra prior to April 2019 must obtain certified HSRP plates and colour-coded fuel stickers through authorized portals.',
    urgent: true,
    portalLink: 'https://transport.maharashtra.gov.in'
  },
  {
    id: 'ann-02',
    date: '2026-10-18',
    category: 'Services',
    title: 'Expansion of 100% Faceless Online Learner Licence Services Across All Maharashtra RTOs',
    summary: 'Citizens can apply, take the Aadhaar-authenticated computerized test from home, and download their Learner Licence instantly without visiting an RTO office.',
    urgent: false,
    portalLink: 'https://sarathi.parivahan.gov.in'
  },
  {
    id: 'ann-03',
    date: '2026-10-10',
    category: 'Road Safety',
    title: 'Maharashtra Road Safety Month 2026: Zero Tolerance for Helmet & Seatbelt Violations',
    summary: 'Joint highway surveillance campaign active across Mumbai-Pune Expressway, Samruddhi Mahamarg, and major state corridors.',
    urgent: false,
    portalLink: 'https://transport.maharashtra.gov.in'
  },
  {
    id: 'ann-04',
    date: '2026-09-28',
    category: 'Technology',
    title: 'SmartQueue AI Deployment: Live Waiting Time Transparency Pilot',
    summary: 'Regional Transport Offices introduce explainable wait-time estimation and queue tracking to reduce congestion and waiting times for citizens.',
    urgent: false,
    portalLink: '/queue'
  },
  {
    id: 'ann-05',
    date: '2026-09-15',
    category: 'Vehicle Fitness',
    title: 'Automated Vehicle Testing Stations (ATS) Operational in Pune and Nashik',
    summary: 'Commercial vehicle fitness renewals will now be processed through state-of-the-art automated sensor inspection tracks.',
    urgent: false,
    portalLink: 'https://vahan.parivahan.gov.in'
  }
];

export const DRIVING_LICENCE_SERVICES = [
  {
    id: 'dl-01',
    code: 'LL_NEW',
    title: "Learner's Licence (New)",
    category: 'Learner Licence',
    description: 'Online application, knowledge test, and instant digital issuance of learning licence for two-wheelers, cars, and transport vehicles.',
    eligibility: '16+ years for gearless two-wheeler up to 50cc; 18+ years for light motor vehicles (LMV); 20+ years for commercial transport.',
    documentsRequired: ['Aadhaar Card / Age Proof', 'Address Proof (Electricity / Ration Card)', 'Form 1 (Self Declaration of Fitness) / Form 1A', 'Passport Size Photograph'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/newLLDet.do',
    smartQueueSupported: true,
    serviceCode: 'LL'
  },
  {
    id: 'dl-02',
    code: 'DL_NEW',
    title: 'Permanent Driving Licence',
    category: 'Driving Licence',
    description: 'Practical driving test booking on automated test track, biometric verification, and issuance of smart-card driving licence.',
    eligibility: 'Must hold an active Learner Licence for at least 30 days and not older than 180 days.',
    documentsRequired: ['Valid Learner Licence', 'Application Form 2', 'Driving School Certificate (Form 5 for commercial)', 'Slot Booking Receipt'],
    visitRequired: true,
    onlineFaceless: false,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/newDLDet.do',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-03',
    code: 'DL_RENEW',
    title: 'Driving Licence Renewal',
    category: 'Driving Licence',
    description: 'Renewal of expired or expiring driving licences with digital biometric revalidation and updated address endorsements.',
    eligibility: 'Can be applied within 1 year before expiry or up to 1 year after expiry without re-test.',
    documentsRequired: ['Original Driving Licence', 'Form 1A Medical Certificate (for age 40+ or transport)', 'Form 2 Application', 'Address Proof'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/dlServicesDet.do',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-04',
    code: 'DL_DUP',
    title: 'Duplicate Driving Licence',
    category: 'Driving Licence',
    description: 'Reissuance of lost, torn, mutilated, or destroyed driving licence smart card.',
    eligibility: 'Existing driving licence holders registered on Sarathi portal.',
    documentsRequired: ['FIR / Police Missing Report (for lost licence)', 'Affidavit in prescribed format', 'Damaged licence card (if mutilated)', 'Aadhaar Card'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/dlServicesDet.do',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-05',
    code: 'DL_NAME',
    title: 'Change of Name in Driving Licence',
    category: 'Alterations',
    description: 'Official correction or post-marriage name alteration on driving licence records.',
    eligibility: 'Holders of valid Maharashtra driving licence.',
    documentsRequired: ['Gazette Notification / Marriage Certificate', 'Aadhaar Card with updated name', 'Original DL'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/dlServicesDet.do',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-06',
    code: 'DL_ADDR',
    title: 'Change of Address in Driving Licence',
    category: 'Alterations',
    description: 'Update residential address in driving licence record across Maharashtra RTO jurisdictions.',
    eligibility: 'Holders relocating within Maharashtra or arriving from another Indian state.',
    documentsRequired: ['Aadhaar Card with updated address', 'Electricity bill / Passport / Rent agreement', 'Original DL'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/dlServicesDet.do',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-07',
    code: 'DL_DOB',
    title: 'Correction of Date of Birth in DL',
    category: 'Alterations',
    description: 'Rectification of clerical or typographical date-of-birth errors on driving licence.',
    eligibility: 'Must provide government birth certificate or Class 10 board certificate.',
    documentsRequired: ['Birth Certificate issued by Municipal Authority', 'SSC / 10th Board Certificate', 'Original DL'],
    visitRequired: true,
    onlineFaceless: false,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/dlServicesDet.do',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-08',
    code: 'DL_AEDL',
    title: 'Addition of Vehicle Class (AEDL)',
    category: 'Endorsement',
    description: 'Endorsement of new category (e.g. adding 4-wheeler LMV to an existing 2-wheeler MCWG licence).',
    eligibility: 'Must hold active driving licence and relevant learner licence for the added class.',
    documentsRequired: ['Existing Driving Licence', 'Valid Learner Licence for new class', 'Form 5 Driving School Certificate (if commercial)'],
    visitRequired: true,
    onlineFaceless: false,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/dlServicesDet.do',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-09',
    code: 'DL_IDP',
    title: 'International Driving Permit (IDP)',
    category: 'Special Permits',
    description: 'Official permit issued under Geneva Convention permitting driving abroad in member countries.',
    eligibility: 'Indian citizen with valid permanent Indian driving licence and valid passport/visa.',
    documentsRequired: ['Valid Indian Driving Licence', 'Valid Passport & Visa', 'Confirmed Air Ticket', 'Medical Certificate Form 1A'],
    visitRequired: true,
    onlineFaceless: false,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/dlServicesDet.do',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-10',
    code: 'DL_EXTRACT',
    title: 'Driving Licence Extract (B-Register)',
    category: 'Records',
    description: 'Certified official history transcript of driving licence for employment, insurance, or court verification.',
    eligibility: 'Licence holder or authorized government agency.',
    documentsRequired: ['Original DL copy', 'Application Form', 'Fee receipt'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/dlServicesDet.do',
    smartQueueSupported: false,
    serviceCode: 'DL'
  },
  {
    id: 'dl-11',
    code: 'DL_COND',
    title: 'Conductor Licence (New / Renewal)',
    category: 'Public Transport',
    description: 'Licence for stage carriage bus conductors under Maharashtra Motor Vehicles Rules.',
    eligibility: 'Minimum 18 years, 10th pass, St. John Ambulance First Aid certificate.',
    documentsRequired: ['First Aid Certificate (St. John Ambulance)', 'Medical Fitness Certificate', 'Educational Proof (SSC)', 'Police Clearance Certificate'],
    visitRequired: true,
    onlineFaceless: false,
    sarathiUrl: 'https://sarathi.parivahan.gov.in',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-12',
    code: 'DL_SLOT',
    title: 'Driving Test Slot Booking & Reschedule',
    category: 'Appointments',
    description: 'Select or modify appointment date and time for automated test track driving evaluation.',
    eligibility: 'Holders of active Learner Licence past the mandatory 30-day waiting period.',
    documentsRequired: ['Learner Licence Number', 'Date of Birth'],
    visitRequired: true,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/slotbooking.do',
    smartQueueSupported: true,
    serviceCode: 'DL'
  },
  {
    id: 'dl-13',
    code: 'LL_MOCK',
    title: "Learner's Licence Practice Mock Test",
    category: 'Education',
    description: 'Simulated computer-based practice test covering traffic signs, rules, and road safety questions.',
    eligibility: 'Open to all citizens preparing for learner licence test.',
    documentsRequired: ['None (Free educational tool)'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: '/road-safety/mock-test',
    smartQueueSupported: false,
    serviceCode: 'LL'
  },
  {
    id: 'dl-14',
    code: 'DL_STATUS',
    title: 'Application Status Tracking',
    category: 'Inquiries',
    description: 'Track real-time approval status, dispatch, and smart card printing of your licence application.',
    eligibility: 'Anyone with an active Sarathi application number.',
    documentsRequired: ['Application Number', 'Date of Birth'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/applViewStatus.do',
    smartQueueSupported: false,
    serviceCode: 'DL'
  },
  {
    id: 'dl-15',
    code: 'DL_DOCS',
    title: 'Upload Pending Documents / Photos',
    category: 'Self Service',
    description: 'Upload required documents, signature, or photograph for pending licence applications.',
    eligibility: 'Applicants with incomplete Sarathi applications.',
    documentsRequired: ['Application Number', 'Scanned PDF/JPEG of documents under 200KB'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/uploadFiles.do',
    smartQueueSupported: false,
    serviceCode: 'DL'
  },
  {
    id: 'dl-16',
    code: 'DL_FEE',
    title: 'Fee Payment & Receipt Download',
    category: 'Payments',
    description: 'Pay prescribed statutory government fees online via GRAS / Bharatkosh and download official receipts.',
    eligibility: 'Applicants with pending fee stage.',
    documentsRequired: ['Application Number', 'Debit Card / UPI / Net Banking'],
    visitRequired: false,
    onlineFaceless: true,
    sarathiUrl: 'https://sarathi.parivahan.gov.in/sarathiservice/epayment.do',
    smartQueueSupported: false,
    serviceCode: 'DL'
  }
];

export const VEHICLE_SERVICES = [
  {
    id: 'vr-01',
    code: 'VR_NEW',
    title: 'New Vehicle Registration (Permanent)',
    category: 'Registration',
    description: 'Dealer-point or RTO registration of newly purchased motor vehicles, chassis verification, and smart card issuance.',
    eligibility: 'Purchaser of brand new motor vehicle with valid invoice and insurance.',
    documentsRequired: ['Form 20 Application', 'Form 21 Sale Certificate', 'Form 22 Roadworthiness Certificate', 'Valid Motor Insurance', 'Aadhaar / Address Proof'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'VR'
  },
  {
    id: 'vr-02',
    code: 'VR_TEMP',
    title: 'Temporary Vehicle Registration',
    category: 'Registration',
    description: 'Temporary registration for moving newly purchased chassis or vehicles to another registration authority.',
    eligibility: 'Vehicle buyers requiring transit movement prior to permanent registration.',
    documentsRequired: ['Form 20 Application', 'Sale Certificate', 'Temporary Insurance'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://vahan.parivahan.gov.in',
    smartQueueSupported: false,
    serviceCode: 'VR'
  },
  {
    id: 'vr-03',
    code: 'RC_RENEW',
    title: 'Renewal of Registration Certificate (RC)',
    category: 'Fitness & Renewal',
    description: 'Mandatory 5-year renewal of registration certificate for non-transport vehicles older than 15 years.',
    eligibility: 'Vehicles reaching 15 years from original registration date.',
    documentsRequired: ['Form 25 Application', 'Original Registration Certificate (RC)', 'Valid Pollution Under Control (PUC)', 'Valid Insurance Certificate', 'Green Tax Payment Receipt'],
    visitRequired: true,
    onlineFaceless: false,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'RC'
  },
  {
    id: 'vr-04',
    code: 'RC_DUP',
    title: 'Duplicate Registration Certificate (RC)',
    category: 'Registration',
    description: 'Reissuance of lost, stolen, or damaged Registration Certificate booklet or smart card.',
    eligibility: 'Registered owner of vehicle in Maharashtra.',
    documentsRequired: ['Form 26 Application', 'Police Missing Report / FIR (if lost)', 'Original damaged card (if mutilated)', 'Valid Insurance & PUC'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'RC'
  },
  {
    id: 'vr-05',
    code: 'VR_TO',
    title: 'Transfer of Vehicle Ownership (TO)',
    category: 'Ownership',
    description: 'Legal transfer of vehicle title upon sale, inheritance, or public auction to new registered owner.',
    eligibility: 'Seller and buyer of registered vehicle in Maharashtra.',
    documentsRequired: ['Form 29 (Notice of Transfer)', 'Form 30 (Application for Transfer)', 'Original RC', 'Valid Insurance & PUC', 'Chassis pencil print', 'PAN Card / Form 60'],
    visitRequired: true,
    onlineFaceless: false,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'TO'
  },
  {
    id: 'vr-06',
    code: 'RC_ADDR',
    title: 'Change of Address in RC',
    category: 'Alterations',
    description: 'Recording changes in residential or business address of vehicle owner on RC database.',
    eligibility: 'Vehicle owners relocating residence or office.',
    documentsRequired: ['Form 33 Application', 'Aadhaar / Electricity bill / Passport', 'Original RC', 'Valid Insurance & PUC'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'RC'
  },
  {
    id: 'vr-07',
    code: 'VR_HYPA',
    title: 'Hypothecation Endorsement (Addition)',
    category: 'Finance',
    description: 'Recording bank / financier loan hypothecation agreement on vehicle registration record.',
    eligibility: 'Vehicle purchased with auto loan from bank or NBFC.',
    documentsRequired: ['Form 34 Application signed by owner & financier', 'Loan Agreement copy', 'Original RC', 'Valid Insurance'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'VR'
  },
  {
    id: 'vr-08',
    code: 'VR_HYPT',
    title: 'Hypothecation Termination (Loan Closure)',
    category: 'Finance',
    description: 'Removal of bank hypothecation endorsement after full repayment of vehicle loan.',
    eligibility: 'Vehicle loan fully paid off with NOC issued by bank.',
    documentsRequired: ['Form 35 Application (two copies signed by bank)', 'Bank NOC / Loan Closure Letter', 'Original RC', 'Valid Insurance & PUC'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'VR'
  },
  {
    id: 'vr-09',
    code: 'VR_NOC',
    title: 'Issue of No Objection Certificate (NOC)',
    category: 'Interstate',
    description: 'NOC for transferring vehicle registration outside Maharashtra or to another RTO district.',
    eligibility: 'Vehicle owner moving vehicle permanently to another jurisdiction.',
    documentsRequired: ['Form 28 Application (4 copies with chassis print)', 'Original RC', 'Valid Insurance & PUC', 'Crime Record Bureau (NCRB) clearance'],
    visitRequired: true,
    onlineFaceless: false,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'TO'
  },
  {
    id: 'vr-10',
    code: 'VR_FIT',
    title: 'Fitness Certificate for Transport Vehicles',
    category: 'Commercial',
    description: 'Mandatory mechanical fitness testing and certification for commercial taxis, buses, and trucks.',
    eligibility: 'All transport / commercial vehicle operators.',
    documentsRequired: ['Form 38 Application', 'Previous Fitness Certificate', 'Tax Clearance Certificate', 'Valid Insurance, PUC & Speed Governor Certificate'],
    visitRequired: true,
    onlineFaceless: false,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'RC'
  },
  {
    id: 'vr-11',
    code: 'VR_FIT_REN',
    title: 'Renewal of Fitness Certificate',
    category: 'Commercial',
    description: 'Annual or biennial renewal of commercial vehicle fitness test.',
    eligibility: 'Commercial vehicles nearing fitness expiration.',
    documentsRequired: ['Form 38 Application', 'Original RC', 'Speed Governor & Fastag validation', 'Insurance & PUC'],
    visitRequired: true,
    onlineFaceless: false,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: true,
    serviceCode: 'RC'
  },
  {
    id: 'vr-12',
    code: 'VR_TAX',
    title: 'Vehicle Motor Tax & Green Tax Payment',
    category: 'Taxation',
    description: 'Online payment of road tax, quarterly commercial permit tax, and 15-year green tax.',
    eligibility: 'All vehicle owners in Maharashtra.',
    documentsRequired: ['Registration Number', 'Chassis Number (last 5 digits)'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/',
    smartQueueSupported: false,
    serviceCode: 'VR'
  },
  {
    id: 'vr-13',
    code: 'VR_PERMIT',
    title: 'Commercial Permit Services (Goods / Passenger)',
    category: 'Commercial',
    description: 'Issuance and renewal of Auto-rickshaw, Tourist Taxi, Stage Carriage, and National Goods permits.',
    eligibility: 'Commercial fleet and transport operators.',
    documentsRequired: ['Permit Application Form', 'Valid RC, Fitness, Insurance & Tax receipt'],
    visitRequired: true,
    onlineFaceless: false,
    vahanUrl: 'https://vahan.parivahan.gov.in',
    smartQueueSupported: true,
    serviceCode: 'VR'
  },
  {
    id: 'vr-14',
    code: 'VR_FANCY',
    title: 'Fancy & Choice Registration Numbers',
    category: 'Registration',
    description: 'Online auction and reservation of VIP / Choice registration numbers (0001, 9999, 0007, etc.).',
    eligibility: 'Purchasers of new vehicles in Maharashtra.',
    documentsRequired: ['Form of Reservation', 'Identity Proof', 'Advance Auction Demand Draft / UPI Payment'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://fancy.parivahan.gov.in',
    smartQueueSupported: false,
    serviceCode: 'VR'
  },
  {
    id: 'vr-15',
    code: 'VR_HSRP',
    title: 'High Security Registration Plate (HSRP) Booking',
    category: 'Plates & Stickers',
    description: 'Booking laser-etched aluminium tamper-proof HSRP plates and colour-coded fuel stickers.',
    eligibility: 'All vehicles in Maharashtra registered prior to April 2019.',
    documentsRequired: ['RC Details', 'Engine & Chassis Number', 'Vehicle Fuel Type'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://transport.maharashtra.gov.in',
    smartQueueSupported: false,
    serviceCode: 'VR'
  },
  {
    id: 'vr-16',
    code: 'VR_STATUS',
    title: 'Vahan Application Status Verification',
    category: 'Inquiries',
    description: 'Track processing milestones, inspection clearance, and smart card printing for vehicle services.',
    eligibility: 'Applicants with valid Vahan application number.',
    documentsRequired: ['Application Number'],
    visitRequired: false,
    onlineFaceless: true,
    vahanUrl: 'https://vahan.parivahan.gov.in/vahanservice/vahan/ui/appl_status/form_Appl_Status.xhtml',
    smartQueueSupported: false,
    serviceCode: 'VR'
  },
  {
    id: 'vr-17',
    code: 'VR_APPT',
    title: 'RTO Vehicle Inspection Appointment',
    category: 'Appointments',
    description: 'Reserve physical inspection slot for chassis verification, fitness, or ownership transfer.',
    eligibility: 'Citizens requiring physical inspection at designated RTO tracks.',
    documentsRequired: ['Application Number', 'Vehicle Registration Number'],
    visitRequired: true,
    onlineFaceless: true,
    vahanUrl: 'https://vahan.parivahan.gov.in',
    smartQueueSupported: true,
    serviceCode: 'VR'
  }
];

export const MOBILE_APPS = [
  {
    id: 'app-01',
    name: 'mParivahan',
    tagline: 'Official MoRTH Citizen Transportation App',
    developer: 'National Informatics Centre (NIC) / MoRTH',
    rating: 4.2,
    downloads: '100M+',
    description: 'Store legally valid digital Driving Licence and Registration Certificate (RC), search vehicle details, pay e-challans, and check vehicle insurance validity on the go.',
    features: [
      'Digital Virtual DL & RC legally valid under IT Act 2000',
      'Instant Vehicle Owner & Fitness Information Search',
      'E-Challan payment and violation status',
      'Emergency SOS notification feature',
      'Share digital vehicle credentials with authorized drivers'
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.nic.mparivahan',
    verified: true,
    badge: 'Official MoRTH App'
  },
  {
    id: 'app-02',
    name: 'NextGen mParivahan',
    tagline: 'Advanced Citizen Mobile Services',
    developer: 'Ministry of Road Transport and Highways (MoRTH)',
    rating: 4.1,
    downloads: '10M+',
    description: 'Upgraded version featuring streamlined Aadhaar authentication, contactless licence services, and real-time push alerts for pending transport renewals.',
    features: [
      'Biometric and Aadhaar-authenticated digital login',
      'One-tap renewal reminders for DL, RC, and Insurance',
      'Near-me RTO Office & Automated Inspection Track locator',
      'Multilingual support (English, Hindi, Marathi)'
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.nic.mparivahan',
    verified: true,
    badge: 'Official MoRTH App'
  },
  {
    id: 'app-03',
    name: 'DigiLocker',
    tagline: 'Government of India Digital Document Wallet',
    developer: 'Ministry of Electronics and IT (MeitY)',
    rating: 4.5,
    downloads: '100M+',
    description: 'National digital wallet legally recognized across all Maharashtra Police and RTO checkpoints for storing electronic Driving Licences, Registration Certificates, and PUC.',
    features: [
      'Rule 139 of Central Motor Vehicles Rules compliant',
      'Real-time pull from National Parivahan Registry',
      'Tamper-proof digital QR code verification',
      'Accepted nationwide by traffic enforcement'
    ],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.digilocker.android',
    verified: true,
    badge: 'National Wallet'
  },
  {
    id: 'app-04',
    name: 'MahaTranscom Portal Services',
    tagline: 'Maharashtra Transport Department Web & Mobile Portal',
    developer: 'Transport Commissionerate, Maharashtra',
    rating: 4.0,
    downloads: '1M+',
    description: 'Official digital gateway for Maharashtra regional office contact directories, public transport advisories, and state transport permits.',
    features: [
      'Official Maharashtra RTO contact directories and jurisdictions',
      'State road safety campaign advisories',
      'Public transport tariff and fare guidelines'
    ],
    playStoreUrl: 'https://transport.maharashtra.gov.in',
    verified: true,
    badge: 'State Department'
  }
];

export const VERIFIED_MOBILE_APPS = MOBILE_APPS;

export const ROAD_SIGNS = [
  // --- Mandatory Signs (Circular) ---
  {
    id: 'sign-01',
    code: 'M_STOP',
    name: 'Stop Sign',
    category: 'Mandatory',
    shape: 'Octagonal (Red with White Letters)',
    description: 'Mandates driver to bring vehicle to a complete halt before the stop line, observe cross traffic, and proceed only when clear.',
    penalty: '₹1,000 for violation under MVA Sec 177 / 179.',
    svgType: 'stop'
  },
  {
    id: 'sign-02',
    code: 'M_GIVE_WAY',
    name: 'Give Way / Yield',
    category: 'Mandatory',
    shape: 'Inverted Triangle (Red border, White background)',
    description: 'Instructs driver to slow down or halt to yield right-of-way to vehicles traveling on the main road.',
    penalty: '₹1,000 for failure to yield.',
    svgType: 'give_way'
  },
  {
    id: 'sign-03',
    code: 'M_NO_ENTRY',
    name: 'No Entry',
    category: 'Mandatory',
    shape: 'Red Circle with White Horizontal Bar',
    description: 'Strict prohibition against entry for all vehicular traffic into the road or lane.',
    penalty: '₹1,000 - ₹5,000 for dangerous one-way violation.',
    svgType: 'no_entry'
  },
  {
    id: 'sign-04',
    code: 'M_ONE_WAY',
    name: 'One Way Traffic',
    category: 'Mandatory',
    shape: 'Circle with one barred arrow',
    description: 'Vehicles must travel only in the direction indicated by the open arrow. Entering in opposite direction is strictly prohibited.',
    penalty: '₹1,500 under Section 184 (Dangerous Driving).',
    svgType: 'one_way'
  },
  {
    id: 'sign-05',
    code: 'M_SPEED_50',
    name: 'Maximum Speed Limit (50 km/h)',
    category: 'Mandatory',
    shape: 'Red circle with black numeral 50',
    description: 'Specifies the maximum permissible vehicular speed under normal road conditions on this corridor.',
    penalty: '₹1,000 - ₹2,000 for overspeeding (MVA Sec 183).',
    svgType: 'speed_50'
  },
  {
    id: 'sign-06',
    code: 'M_NO_PARKING',
    name: 'No Parking',
    category: 'Mandatory',
    shape: 'Blue circle with red border and single red diagonal stripe',
    description: 'Vehicles cannot be parked or left unattended. Stopping momentarily to drop or pick up passengers is permitted.',
    penalty: '₹500 + towing charges.',
    svgType: 'no_parking'
  },
  {
    id: 'sign-07',
    code: 'M_NO_STOPPING',
    name: 'No Stopping / No Standing',
    category: 'Mandatory',
    shape: 'Blue circle with red border and red cross (X)',
    description: 'Vehicles must not stop or stand for any reason, including passenger pick-up or cargo unloading.',
    penalty: '₹1,000 for obstruction.',
    svgType: 'no_stopping'
  },
  {
    id: 'sign-08',
    code: 'M_NO_HORN',
    name: 'Horn Prohibited (Silence Zone)',
    category: 'Mandatory',
    shape: 'Red circle with horn symbol crossed by diagonal red line',
    description: 'Strictly prohibits sounding vehicular horn near hospitals, courts, educational institutions, and silence zones.',
    penalty: '₹1,000 under noise pollution rules.',
    svgType: 'no_horn'
  },

  // --- Cautionary Signs (Triangular) ---
  {
    id: 'sign-09',
    code: 'C_RIGHT_CURVE',
    name: 'Sharp Right Curve Ahead',
    category: 'Cautionary',
    shape: 'Equilateral Triangle pointing up (Red border)',
    description: 'Warns driver of a sharp rightward curve ahead. Driver should reduce speed and refrain from overtaking.',
    penalty: 'Advisory warning; reckless driving incurs ₹1,500 - ₹5,000.',
    svgType: 'right_curve'
  },
  {
    id: 'sign-10',
    code: 'C_PED_CROSS',
    name: 'Pedestrian Crossing Ahead',
    category: 'Cautionary',
    shape: 'Equilateral Triangle with person walking on zebra lines',
    description: 'Alerts drivers that a zebra crossing is nearby. Driver must slow down and be prepared to stop for pedestrians.',
    penalty: '₹1,000 for failing to yield to crossing pedestrians.',
    svgType: 'pedestrian'
  },
  {
    id: 'sign-11',
    code: 'C_SCHOOL',
    name: 'School Zone Ahead',
    category: 'Cautionary',
    shape: 'Equilateral Triangle with running school children',
    description: 'Warns of school grounds nearby. Driver must maintain strict low speed (under 25 km/h) and remain alert for children.',
    penalty: 'Strict speed monitoring zone.',
    svgType: 'school'
  },
  {
    id: 'sign-12',
    code: 'C_SPEED_BREAKER',
    name: 'Speed Breaker / Hump Ahead',
    category: 'Cautionary',
    shape: 'Equilateral Triangle with hump symbol',
    description: 'Warns of a physical speed breaker on the road ahead. Driver should brake smoothly to avoid loss of vehicle control.',
    penalty: 'Advisory warning for vehicle safety.',
    svgType: 'speed_breaker'
  },
  {
    id: 'sign-13',
    code: 'C_ROUNDABOUT',
    name: 'Roundabout Ahead',
    category: 'Cautionary',
    shape: 'Equilateral Triangle with rotary arrows',
    description: 'Approaching a traffic circle. Driver must slow down, yield right of way to traffic already circulating from the right.',
    penalty: 'Failure to follow rotary discipline incurs ₹1,000 fine.',
    svgType: 'roundabout'
  },
  {
    id: 'sign-14',
    code: 'C_NARROW_BRIDGE',
    name: 'Narrow Bridge Ahead',
    category: 'Cautionary',
    shape: 'Equilateral Triangle with narrowing roadway',
    description: 'Road narrows down to a single or dual-lane bridge ahead. Opposing traffic must take turns with mutual courtesy.',
    penalty: 'Hazard warning.',
    svgType: 'narrow_bridge'
  },

  // --- Informatory Signs (Rectangular) ---
  {
    id: 'sign-15',
    code: 'I_HOSPITAL',
    name: 'Hospital Facility',
    category: 'Informatory',
    shape: 'Blue Rectangle with white bed and red cross',
    description: 'Indicates medical hospital facility nearby with emergency casualty service. Drivers should maintain low noise.',
    penalty: 'Informational.',
    svgType: 'hospital'
  },
  {
    id: 'sign-16',
    code: 'I_PETROL',
    name: 'Fuel / Petrol Pump',
    category: 'Informatory',
    shape: 'Blue Rectangle with fuel dispenser symbol',
    description: 'Informs travelers of fuel and charging station availability on this corridor.',
    penalty: 'Informational.',
    svgType: 'fuel'
  },
  {
    id: 'sign-17',
    code: 'I_FIRST_AID',
    name: 'First Aid Post',
    category: 'Informatory',
    shape: 'Blue Rectangle with red cross',
    description: 'Designates roadside emergency first-aid station equipped for crash trauma assistance.',
    penalty: 'Informational.',
    svgType: 'first_aid'
  },
  {
    id: 'sign-18',
    code: 'I_PARKING',
    name: 'Authorized Parking Area',
    category: 'Informatory',
    shape: 'Blue Rectangle with white P letter',
    description: 'Designated legal parking lot for motor vehicles. Follow parking bay lines.',
    penalty: 'Informational.',
    svgType: 'parking'
  }
];

export const ROAD_SAFETY_QUIZ_QUESTIONS = [
  {
    id: 'q-01',
    question: 'While approaching an uncontrolled pedestrian zebra crossing, pedestrians are waiting to cross the road. What should you do?',
    options: [
      'Sound horn and accelerate quickly to pass before they step out',
      'Stop the vehicle, wait for pedestrians to cross safely, then proceed',
      'Slow down slightly but maintain your right-of-way over pedestrians',
      'Flash high-beam headlights to warn them to stay back'
    ],
    correctIndex: 1,
    explanation: 'Pedestrians have absolute right-of-way at zebra crossings. Drivers must halt behind the stop line and wait for them to finish crossing.',
    category: 'Pedestrian Safety'
  },
  {
    id: 'q-02',
    question: 'What does a flashing AMBER (Yellow) traffic signal indicate at an intersection?',
    options: [
      'Stop completely and wait for green light',
      'The signal is broken, proceed at maximum speed',
      'Slow down, look in all directions for cross traffic, and proceed with caution',
      'Accelerate before the light turns red'
    ],
    correctIndex: 2,
    explanation: 'A flashing amber signal alerts drivers that the intersection is active; they must slow down, check both ways, yield to pedestrians, and proceed with caution.',
    category: 'Traffic Signals'
  },
  {
    id: 'q-03',
    question: 'Under the Motor Vehicles (Amendment) Act, what is the mandatory safety gear requirement for two-wheeler pillion riders in Maharashtra?',
    options: [
      'Only the rider needs a helmet; pillion is exempt inside city limits',
      'Both the rider and pillion rider must wear certified BIS/ISI helmets with chin strap fastened',
      'Helmets are only mandatory on national expressways',
      'Pillion rider can wear an industrial construction hard-hat'
    ],
    correctIndex: 1,
    explanation: 'Section 129 of the Motor Vehicles Act strictly mandates that every person driving or riding as a pillion on a two-wheeler must wear protective headgear conforming to Bureau of Indian Standards (BIS).',
    category: 'Helmet Safety'
  },
  {
    id: 'q-04',
    question: 'What is the legally permissible Blood Alcohol Content (BAC) limit for operating a motor vehicle in India?',
    options: [
      'Up to 50 mg per 100 ml of blood',
      'Up to 30 mg per 100 ml of blood',
      'Up to 100 mg per 100 ml of blood',
      'There is no limit as long as driving is stable'
    ],
    correctIndex: 1,
    explanation: 'Section 185 of MVA establishes that alcohol exceeding 30 mg per 100 ml of blood detected by breath analyser constitutes drunken driving, punishable with fine up to ₹10,000 and/or imprisonment.',
    category: 'Drunk Driving Laws'
  },
  {
    id: 'q-05',
    question: 'When is overtaking a vehicle from the LEFT side legally permissible in India?',
    options: [
      'Whenever the left lane is clear and moving faster',
      'When the driver of the vehicle ahead has signaled their intention to turn right and moved toward the center',
      'Anytime on high-speed four-lane expressways',
      'Never under any circumstances'
    ],
    correctIndex: 1,
    explanation: 'Under Indian Rules of the Road Regulations, vehicles must normally be overtaken on their right. Overtaking on the left is permitted ONLY when the preceding vehicle has signaled to turn right and has pulled to the center of the road.',
    category: 'Overtaking Rules'
  },
  {
    id: 'q-06',
    question: 'What is the minimum safe following distance behind a preceding vehicle on open highways under dry conditions?',
    options: [
      'Exactly 1 meter',
      'The 2-Second or 3-Second rule distance (safe stopping buffer)',
      'Half a car length regardless of speed',
      'Touching the rear bumper to minimize air resistance'
    ],
    correctIndex: 1,
    explanation: 'The 3-Second rule allows adequate reaction time and braking distance. When the vehicle ahead passes a fixed object, you should count at least 3 seconds before your vehicle passes the same landmark.',
    category: 'Safe Driving'
  },
  {
    id: 'q-07',
    question: 'What does a solid continuous WHITE line drawn in the center of a two-way road mean?',
    options: [
      'Overtaking is encouraged at all times',
      'Lane changing and overtaking is strictly prohibited; stay within your lane',
      'Parking is allowed along the white line',
      'Speed limit is 100 km/h'
    ],
    correctIndex: 1,
    explanation: 'A solid unbroken white or yellow line indicates that crossing or straddling the line to overtake is strictly forbidden due to limited visibility or road hazards.',
    category: 'Road Markings'
  },
  {
    id: 'q-08',
    question: 'An emergency ambulance or fire service vehicle approaches from behind with siren and flashing beacons active. What must you do?',
    options: [
      'Accelerate quickly to stay ahead of the ambulance',
      'Immediately pull over to the side of the road and halt to allow a clear path',
      'Sound your horn to alert vehicles in front of you',
      'Follow closely behind the ambulance to bypass traffic'
    ],
    correctIndex: 1,
    explanation: 'Under Section 194E of the MVA, failing to allow free passage to emergency vehicles attracts a severe penalty of up to ₹10,000 and/or imprisonment up to 6 months.',
    category: 'Emergency Protocol'
  },
  {
    id: 'q-09',
    question: 'What is the validity period of a Learner Licence (LL) issued in Maharashtra?',
    options: [
      '30 days',
      '6 months (180 days)',
      '1 year',
      '5 years'
    ],
    correctIndex: 1,
    explanation: 'A Learner Licence is valid for exactly 180 days (6 months) across all of India. The holder can apply for a permanent driving licence 30 days after the LL issuance date.',
    category: 'Licence Rules'
  },
  {
    id: 'q-10',
    question: 'Why is using a handheld mobile phone while driving considered one of the highest crash risks?',
    options: [
      'It discharges the phone battery quickly',
      'It causes cognitive, visual, and manual distraction, increasing crash risk by over 400%',
      'It blocks the view through the rear-view mirror only',
      'It only affects commercial truck drivers'
    ],
    correctIndex: 1,
    explanation: 'Mobile phone usage creates multi-sensory distraction: visual (eyes off the road), manual (hands off the wheel), and cognitive (mind off driving). Section 184(c) prescribes penalties up to ₹5,000.',
    category: 'Distracted Driving'
  }
];

export const LL_MOCK_TEST_QUESTIONS = [
  ...ROAD_SAFETY_QUIZ_QUESTIONS,
  {
    id: 'q-11',
    question: 'What does an octagonal red sign with the word STOP mean?',
    options: [
      'Slow down and look left',
      'Stop completely, check all directions, proceed only when safe',
      'Parking is available ahead',
      'Yield to vehicles approaching from behind'
    ],
    correctIndex: 1,
    explanation: 'The STOP sign is an octagonal mandatory sign that requires a 100% complete halt behind the line.',
    category: 'Road Signs'
  },
  {
    id: 'q-12',
    question: 'A triangular sign pointing upwards with a red border is what type of traffic sign?',
    options: [
      'Mandatory Sign',
      'Cautionary / Warning Sign',
      'Informatory Sign',
      'Route Marker'
    ],
    correctIndex: 1,
    explanation: 'Equilateral triangular signs pointing upwards are Cautionary signs that warn drivers of upcoming road conditions or hazards.',
    category: 'Road Signs'
  },
  {
    id: 'q-13',
    question: 'Who is exempt from wearing a safety seatbelt in a moving motor vehicle under Central Motor Vehicle Rules?',
    options: [
      'Drivers on short trips under 2 km',
      'Rear-seat passengers on city roads',
      'No one is exempt; all occupants must wear seatbelts',
      'Elderly passengers above 60 years'
    ],
    correctIndex: 2,
    explanation: 'Rule 125(1) mandates seatbelt compliance for driver and all front and rear passengers equipped with designated seatbelts.',
    category: 'Seatbelt Safety'
  },
  {
    id: 'q-14',
    question: 'What is the maximum permissible speed for motor cars on the Mumbai-Pune Expressway under Maharashtra notification?',
    options: [
      '80 km/h',
      '100 km/h (except ghat sections restricted to 50 km/h)',
      '120 km/h throughout',
      'No speed limit applies'
    ],
    correctIndex: 1,
    explanation: 'The official speed limit for four-wheelers on the Mumbai-Pune Expressway is 100 km/h on flat sections and 50 km/h on ghat / ghat curve sections.',
    category: 'Speed Limits'
  },
  {
    id: 'q-15',
    question: 'When driving in heavy fog or rain, which lights should be illuminated?',
    options: [
      'High-beam headlights to pierce the fog',
      'Low-beam headlights along with fog lights',
      'Only interior cabin lights',
      'Hazard warning flashers while driving at regular speed'
    ],
    correctIndex: 1,
    explanation: 'High beams reflect off water droplets causing blinding glare. Low beams cast light downward along the road surface.',
    category: 'Weather Safety'
  }
];

export const LL_QUESTIONS = ROAD_SAFETY_QUIZ_QUESTIONS.map(q => ({
  ...q,
  correct: q.correctIndex !== undefined ? q.correctIndex : q.correct
}));
