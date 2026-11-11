export const ANNOUNCEMENTS = [
  {
    id: 'ann-01',
    title: 'Mandatory High Security Registration Plates (HSRP) Enforcement Notice',
    category: 'Vehicle Compliance',
    date: '02 Nov 2026',
    priority: 'urgent',
    summary: 'All motor vehicles registered in Maharashtra prior to April 2019 must be fitted with certified High Security Registration Plates (HSRP) and color-coded fuel stickers.',
    details: 'Failure to comply will attract penalties under Section 192 of the Motor Vehicles Act (₹5,000 for first violation). Online booking can be completed via bookmyhsrp.com or through designated RTO authorized fitment centers.'
  },
  {
    id: 'ann-02',
    title: 'National Road Safety Month (Sadak Suraksha Abhiyan) 2026',
    category: 'Road Safety',
    date: '28 Oct 2026',
    priority: 'high',
    summary: 'Statewide interactive workshops, helmet compliance drives, and free medical eye-checkup camps for commercial truck and bus drivers at all 50 regional offices.',
    details: 'Citizens are encouraged to complete the online Road Safety Challenge and earn an official e-Certificate of Safe Driving through the SmartQueue learning portal.'
  },
  {
    id: 'ann-03',
    title: 'Digital Driving Licence & RC Legal Acceptance in DigiLocker / mParivahan',
    category: 'Legal Advisory',
    date: '15 Oct 2026',
    priority: 'medium',
    summary: 'Clarification regarding legal recognition of digital transport documents under Rule 139 of the Central Motor Vehicles Rules (CMVR).',
    details: 'Traffic enforcement authorities across Maharashtra have been directed to treat digital documents shown via DigiLocker or mParivahan as legally equivalent to physical original cards.'
  },
  {
    id: 'ann-04',
    title: 'Faceless Learner Licence (LL) Online Computerized Examination System',
    category: 'Citizen Service',
    date: '05 Oct 2026',
    priority: 'medium',
    summary: 'Citizens can apply, take the Aadhaar-authenticated computerized test from home, and download their Learner Licence instantly without visiting an RTO office.',
    details: 'Ensure your Aadhaar is linked with your current mobile number to receive the OTP during Sarathi authentication.'
  },
  {
    id: 'ann-05',
    title: 'Strict Enforcement of Bharat Stage VI (BS-VI) PUC Emission Standards',
    category: 'Environmental Norms',
    date: '20 Sep 2026',
    priority: 'medium',
    summary: 'Revised testing protocols and real-time cloud uploading of Pollution Under Control (PUC) certificates at all Maharashtra vehicle testing centers.',
    details: 'Vehicles plying without valid computerized PUC certificates will incur automated e-challan notices detected via toll plazas and surveillance cameras.'
  }
];

export const ROAD_SIGNS = [
  { id: 'sign-01', code: 'M_STOP', name: 'Stop', category: 'Mandatory', shape: 'Octagon', color: 'Red with White Lettering', icon: '🛑', meaning: 'Driver must bring vehicle to a complete dead stop before the stop line.', fine: '₹1,000 under Section 177 MVA' },
  { id: 'sign-02', code: 'M_GIVE_WAY', name: 'Give Way / Yield', category: 'Mandatory', shape: 'Inverted Triangle', color: 'Red border with White center', icon: '🔻', meaning: 'Slow down and yield right of way to vehicles on main carriageway.', fine: '₹1,000 under Section 177 MVA' },
  { id: 'sign-03', code: 'M_NO_ENTRY', name: 'No Entry', category: 'Mandatory', shape: 'Circle', color: 'Red background with White bar', icon: '⛔', meaning: 'Entry prohibited for all classes of vehicular traffic.', fine: '₹1,000 + 3-month licence suspension' },
  { id: 'sign-04', code: 'M_SPEED_50', name: 'Maximum Speed Limit 50 km/h', category: 'Mandatory', shape: 'Circle', color: 'White background, Red border, Black numbers', icon: '🚸', meaning: 'Vehicles must not exceed 50 km/h under any circumstances.', fine: '₹2,000 for LMV; ₹4,000 for Heavy Vehicles' },
  { id: 'sign-05', code: 'M_NO_PARKING', name: 'No Parking', category: 'Mandatory', shape: 'Circle', color: 'Blue background, Red diagonal slash and border', icon: '🅿️', meaning: 'Parking is strictly forbidden. Vehicle may be towed.', fine: '₹500 + Towing charges' },
  { id: 'sign-06', code: 'C_PED_CROSSING', name: 'Pedestrian Crossing Ahead', category: 'Cautionary', shape: 'Triangle', color: 'Red border with White center', icon: '🚶', meaning: 'Approaching zebra crossing. Slow down and prepare to yield to pedestrians.', fine: '₹1,000 under Section 184 MVA' },
  { id: 'sign-07', code: 'C_SCHOOL_AHEAD', name: 'School Ahead', category: 'Cautionary', shape: 'Triangle', color: 'Red border with child graphic', icon: '🏫', meaning: 'School zone. Reduce speed to 25 km/h and watch for children crossing.', fine: '₹2,000 under Section 184 (Dangerous Driving)' },
  { id: 'sign-08', code: 'I_HOSPITAL', name: 'Hospital Nearby', category: 'Informatory', shape: 'Rectangle', color: 'Blue rectangle with Red cross', icon: '🏥', meaning: 'Indicates hospital ahead. Avoid sounding horns (Silent Zone).', fine: '₹1,000 for unnecessary honking' }
];

export const LL_QUESTIONS = [
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
    explanation: 'Rule 11 of the Rules of the Road Regulations 1989 dictates that drivers must give way to pedestrians at zebra crossings.',
    category: 'Pedestrian Safety'
  },
  {
    id: 'q-02',
    question: 'What is the mandatory legal validity period of a Learner Licence issued under the Motor Vehicles Act across India?',
    options: [
      '30 days',
      '90 days',
      '6 months (180 days)',
      '1 year'
    ],
    correctIndex: 2,
    explanation: 'A Learner Licence is valid for exactly 180 days (6 months) across all of India.',
    category: 'Licensing Rules'
  },
  {
    id: 'q-03',
    question: 'An emergency ambulance or fire service vehicle approaches from behind with siren and flashing beacons active. What must you do?',
    options: [
      'Accelerate to stay ahead of the emergency vehicle',
      'Immediately draw to the left side of the road and stop to provide clear passage',
      'Continue at normal speed in the rightmost lane',
      'Stop immediately in the middle of your lane'
    ],
    correctIndex: 1,
    explanation: 'Section 194E of the Motor Vehicles Act mandates drawing to the side of the road for emergency vehicles. Fine: ₹10,000 and/or imprisonment.',
    category: 'Emergency Protocols'
  }
];

export const INITIAL_LEADERBOARD = [
  { rank: 1, name: 'Aarav Deshmukh', city: 'Pune (MH-12)', xp: 1450, badge: 'Road Safety Champion' },
  { rank: 2, name: 'Priya Kulkarni', city: 'Mumbai (MH-01)', xp: 1320, badge: 'Master Driver' },
  { rank: 3, name: 'Rohan Patil', city: 'Nashik (MH-15)', xp: 1180, badge: 'Hazard Expert' },
  { rank: 4, name: 'Ananya Joshi', city: 'Nagpur (MH-31)', xp: 950, badge: 'Signal Pro' },
  { rank: 5, name: 'Siddharth Shinde', city: 'Thane (MH-04)', xp: 410, badge: 'Learner' }
];
