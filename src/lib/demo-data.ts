export type CareStage = 'registered' | 'triaged' | 'consulted' | 'referred' | 'appointment' | 'arrived' | 'treated' | 'follow-up' | 'closed';
export type ReferralStatus = 'created' | 'accepted' | 'appointment-booked' | 'patient-arrived' | 'consultation-completed' | 'diagnostics-completed' | 'treatment-completed' | 'follow-up' | 'closed' | 'missed';

export interface Vitals {
  bp: string;
  spo2: number;
  pulse: number;
  temperature: number;
  recordedAt: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  village: string;
  phone: string;
  primaryCondition: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastVisit: string;
  nextFollowUp: string;
  careStage: CareStage;
  vitals?: Vitals;
  medicalHistory: string[];
  assignedWorker: string;
}

export interface ReferralTimelineEntry {
  status: ReferralStatus;
  timestamp: string;
  facility: string;
  user: string;
  notes: string;
}

export interface Referral {
  id: string;
  patientId: string;
  patientName: string;
  reason: string;
  specialty: string;
  diagnosticTests: string[];
  urgency: 'routine' | 'priority' | 'emergency';
  status: ReferralStatus;
  sourceFacility: string;
  destinationFacility: string;
  createdAt: string;
  appointmentDate?: string;
  timeline: ReferralTimelineEntry[];
}

export interface Facility {
  id: string;
  name: string;
  type: 'PHC' | 'Rural Hospital' | 'District Hospital';
  distance: number;
  doctors: { name: string; specialty: string; available: boolean }[];
  diagnostics: { name: string; available: boolean; nextSlot?: string }[];
  medicines: { name: string; stock: number; threshold: number; status: 'available' | 'low' | 'critical' | 'out-of-stock' }[];
  queueLength: number;
  status: 'operational' | 'limited' | 'closed';
  matchScore?: number;
}

export interface FollowUp {
  id: string;
  patientId: string;
  patientName: string;
  condition: string;
  followUpDate: string;
  assignedWorker: string;
  priority: 'routine' | 'priority' | 'urgent';
  status: 'scheduled' | 'due' | 'missed' | 'completed';
}

export interface Notification {
  id: string;
  type: 'emergency' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  entityId: string;
  entityType: string;
  status: string;
}

export interface DemoJourneyStep {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'in-progress' | 'pending';
  icon: string;
}

export interface KPI {
  label: string;
  value: string | number;
  trend: string;
  status: 'positive' | 'negative' | 'neutral';
  subtitle: string;
}

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const formatDate = (date: Date) => date.toISOString();
const formatDateShort = (date: Date) => date.toISOString().split('T')[0];

export const patients: Patient[] = [
  {
    id: 'P-1042',
    name: 'Ravi Kumar',
    age: 54,
    gender: 'male',
    village: 'Rampur',
    phone: '+91-9876543210',
    primaryCondition: 'Hypertension',
    riskLevel: 'critical',
    lastVisit: formatDateShort(yesterday),
    nextFollowUp: formatDateShort(nextWeek),
    careStage: 'follow-up',
    vitals: {
      bp: '178/104',
      spo2: 91,
      pulse: 98,
      temperature: 37.2,
      recordedAt: formatDate(yesterday),
    },
    medicalHistory: ['Hypertension (5 years)', 'Type 2 Diabetes (3 years)', 'Obesity'],
    assignedWorker: 'ASHA-17',
  },
  {
    id: 'P-1043',
    name: 'Fatima Begum',
    age: 28,
    gender: 'female',
    village: 'Nandgram',
    phone: '+91-9876543211',
    primaryCondition: 'Pregnancy - 3rd Trimester',
    riskLevel: 'medium',
    lastVisit: formatDateShort(today),
    nextFollowUp: formatDateShort(tomorrow),
    careStage: 'consulted',
    vitals: {
      bp: '128/82',
      spo2: 98,
      pulse: 85,
      temperature: 37.0,
      recordedAt: formatDate(today),
    },
    medicalHistory: ['Pregnancy (25 weeks)', 'Anemia'],
    assignedWorker: 'ANM-03',
  },
  {
    id: 'P-1044',
    name: 'Venkat Rao',
    age: 62,
    gender: 'male',
    village: 'Gopalpalli',
    phone: '+91-9876543212',
    primaryCondition: 'Diabetes with complications',
    riskLevel: 'high',
    lastVisit: formatDateShort(yesterday),
    nextFollowUp: formatDateShort(nextWeek),
    careStage: 'referred',
    vitals: {
      bp: '155/92',
      spo2: 94,
      pulse: 88,
      temperature: 37.1,
      recordedAt: formatDate(yesterday),
    },
    medicalHistory: ['Type 2 Diabetes (10 years)', 'Neuropathy', 'Chronic Kidney Disease Stage 2'],
    assignedWorker: 'ASHA-12',
  },
  {
    id: 'P-1045',
    name: 'Meena Devi',
    age: 35,
    gender: 'female',
    village: 'Devapur',
    phone: '+91-9876543213',
    primaryCondition: 'Respiratory infection',
    riskLevel: 'low',
    lastVisit: formatDateShort(today),
    nextFollowUp: formatDateShort(tomorrow),
    careStage: 'triaged',
    vitals: {
      bp: '118/76',
      spo2: 96,
      pulse: 82,
      temperature: 38.2,
      recordedAt: formatDate(today),
    },
    medicalHistory: ['Asthma', 'Seasonal allergies'],
    assignedWorker: 'ANM-02',
  },
  {
    id: 'P-1046',
    name: 'Salim Khan',
    age: 47,
    gender: 'male',
    village: 'Motipur',
    phone: '+91-9876543214',
    primaryCondition: 'Gastrointestinal disorder',
    riskLevel: 'medium',
    lastVisit: formatDateShort(yesterday),
    nextFollowUp: formatDateShort(nextWeek),
    careStage: 'consulted',
    vitals: {
      bp: '132/85',
      spo2: 97,
      pulse: 80,
      temperature: 36.8,
      recordedAt: formatDate(yesterday),
    },
    medicalHistory: ['GERD', 'Peptic ulcer (treated)'],
    assignedWorker: 'ASHA-08',
  },
  {
    id: 'P-1047',
    name: 'Ashoka Reddy',
    age: 41,
    gender: 'male',
    village: 'Chintapalli',
    phone: '+91-9876543215',
    primaryCondition: 'Acute fever',
    riskLevel: 'low',
    lastVisit: formatDateShort(today),
    nextFollowUp: formatDateShort(tomorrow),
    careStage: 'triaged',
    vitals: {
      bp: '122/78',
      spo2: 97,
      pulse: 85,
      temperature: 39.1,
      recordedAt: formatDate(today),
    },
    medicalHistory: [],
    assignedWorker: 'ANM-01',
  },
  {
    id: 'P-1048',
    name: 'Sunita Sharma',
    age: 52,
    gender: 'female',
    village: 'Bhaipur',
    phone: '+91-9876543216',
    primaryCondition: 'Arthritis',
    riskLevel: 'low',
    lastVisit: formatDateShort(yesterday),
    nextFollowUp: formatDateShort(nextWeek),
    careStage: 'closed',
    vitals: {
      bp: '130/80',
      spo2: 98,
      pulse: 76,
      temperature: 37.0,
      recordedAt: formatDate(yesterday),
    },
    medicalHistory: ['Osteoarthritis', 'Hypertension'],
    assignedWorker: 'ASHA-19',
  },
  {
    id: 'P-1049',
    name: 'Priya Patel',
    age: 24,
    gender: 'female',
    village: 'Kalpur',
    phone: '+91-9876543217',
    primaryCondition: 'Routine checkup',
    riskLevel: 'low',
    lastVisit: formatDateShort(today),
    nextFollowUp: formatDateShort(nextWeek),
    careStage: 'triaged',
    vitals: {
      bp: '116/74',
      spo2: 99,
      pulse: 72,
      temperature: 36.9,
      recordedAt: formatDate(today),
    },
    medicalHistory: [],
    assignedWorker: 'ANM-04',
  },
];

export const facilities: Facility[] = [
  {
    id: 'FAC-001',
    name: 'PHC A - Rampur',
    type: 'PHC',
    distance: 2,
    doctors: [
      { name: 'Dr. Rajesh Kumar', specialty: 'General Practice', available: true },
      { name: 'Dr. Priya Singh', specialty: 'Pediatrics', available: false },
    ],
    diagnostics: [
      { name: 'Blood Glucose', available: true, nextSlot: 'Now' },
      { name: 'CBC', available: true, nextSlot: '2:00 PM' },
      { name: 'BP Monitor', available: true, nextSlot: 'Now' },
    ],
    medicines: [
      { name: 'Metformin', stock: 150, threshold: 100, status: 'available' },
      { name: 'Lisinopril', stock: 45, threshold: 100, status: 'low' },
      { name: 'Insulin', stock: 12, threshold: 50, status: 'critical' },
      { name: 'Aspirin', stock: 200, threshold: 50, status: 'available' },
    ],
    queueLength: 4,
    status: 'operational',
  },
  {
    id: 'FAC-002',
    name: 'Rural Hospital B - Devapur',
    type: 'Rural Hospital',
    distance: 18,
    doctors: [
      { name: 'Dr. Amit Kumar', specialty: 'Internal Medicine', available: true },
      { name: 'Dr. Sneha Gupta', specialty: 'Surgery', available: true },
      { name: 'Dr. Harish Patel', specialty: 'Orthopedics', available: false },
    ],
    diagnostics: [
      { name: 'ECG', available: true, nextSlot: '1:30 PM' },
      { name: 'X-ray', available: true, nextSlot: '3:00 PM' },
      { name: 'Ultrasound', available: false, nextSlot: '10:00 AM (Tomorrow)' },
      { name: 'CBC', available: true, nextSlot: 'Now' },
      { name: 'Blood Glucose', available: true, nextSlot: '1:00 PM' },
    ],
    medicines: [
      { name: 'Metformin', stock: 300, threshold: 100, status: 'available' },
      { name: 'Atorvastatin', stock: 0, threshold: 50, status: 'out-of-stock' },
      { name: 'Amlodipine', stock: 30, threshold: 100, status: 'low' },
      { name: 'Insulin', stock: 80, threshold: 50, status: 'available' },
    ],
    queueLength: 8,
    status: 'operational',
  },
  {
    id: 'FAC-003',
    name: 'District Hospital - Central City',
    type: 'District Hospital',
    distance: 35,
    doctors: [
      { name: 'Dr. V. Prabhu Kumar', specialty: 'Cardiology', available: true },
      { name: 'Dr. Anita Sharma', specialty: 'Neurology', available: true },
      { name: 'Dr. Ravi Khanna', specialty: 'Orthopedics', available: true },
      { name: 'Dr. Sarah Ahmed', specialty: 'General Surgery', available: false },
    ],
    diagnostics: [
      { name: 'ECG', available: true, nextSlot: 'Now' },
      { name: 'X-ray', available: true, nextSlot: 'Now' },
      { name: 'Ultrasound', available: true, nextSlot: '11:30 AM' },
      { name: 'CT', available: true, nextSlot: '2:00 PM' },
      { name: 'MRI', available: false, nextSlot: '9:00 AM (Tomorrow)' },
      { name: 'CBC', available: true, nextSlot: 'Now' },
      { name: 'Blood Glucose', available: true, nextSlot: 'Now' },
    ],
    medicines: [
      { name: 'Metformin', stock: 500, threshold: 100, status: 'available' },
      { name: 'Atorvastatin', stock: 120, threshold: 50, status: 'available' },
      { name: 'Amlodipine', stock: 200, threshold: 100, status: 'available' },
      { name: 'Insulin', stock: 300, threshold: 50, status: 'available' },
      { name: 'Aspirin', stock: 400, threshold: 50, status: 'available' },
    ],
    queueLength: 12,
    status: 'operational',
  },
];

export const referrals: Referral[] = [
  {
    id: 'REF-10234',
    patientId: 'P-1042',
    patientName: 'Ravi Kumar',
    reason: 'Hypertension with cardiac risk - requires ECG and specialist evaluation',
    specialty: 'Cardiology',
    diagnosticTests: ['ECG', 'Blood pressure monitoring'],
    urgency: 'priority',
    status: 'closed',
    sourceFacility: 'PHC A - Rampur',
    destinationFacility: 'District Hospital - Central City',
    createdAt: formatDateShort(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
    appointmentDate: formatDateShort(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
    timeline: [
      {
        status: 'created',
        timestamp: formatDate(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
        facility: 'PHC A - Rampur',
        user: 'ASHA-17',
        notes: 'Referral created for hypertension evaluation',
      },
      {
        status: 'accepted',
        timestamp: formatDate(new Date(today.getTime() - 6.8 * 24 * 60 * 60 * 1000)),
        facility: 'District Hospital - Central City',
        user: 'Dr. V. Prabhu Kumar',
        notes: 'Referral accepted',
      },
      {
        status: 'appointment-booked',
        timestamp: formatDate(new Date(today.getTime() - 6.5 * 24 * 60 * 60 * 1000)),
        facility: 'District Hospital - Central City',
        user: 'Receptionist',
        notes: 'Appointment scheduled for Sep 1',
      },
      {
        status: 'patient-arrived',
        timestamp: formatDate(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
        facility: 'District Hospital - Central City',
        user: 'ANM',
        notes: 'Patient arrived at facility',
      },
      {
        status: 'diagnostics-completed',
        timestamp: formatDate(new Date(today.getTime() - 5.8 * 24 * 60 * 60 * 1000)),
        facility: 'District Hospital - Central City',
        user: 'Technician',
        notes: 'ECG completed - results normal',
      },
      {
        status: 'consultation-completed',
        timestamp: formatDate(new Date(today.getTime() - 5.5 * 24 * 60 * 60 * 1000)),
        facility: 'District Hospital - Central City',
        user: 'Dr. V. Prabhu Kumar',
        notes: 'Specialist consultation completed',
      },
      {
        status: 'treatment-completed',
        timestamp: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
        facility: 'District Hospital - Central City',
        user: 'Dr. V. Prabhu Kumar',
        notes: 'Treatment plan completed',
      },
      {
        status: 'follow-up',
        timestamp: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
        facility: 'PHC A - Rampur',
        user: 'ASHA-17',
        notes: 'Follow-up appointment scheduled',
      },
      {
        status: 'closed',
        timestamp: formatDate(today),
        facility: 'PHC A - Rampur',
        user: 'ASHA-17',
        notes: 'Care completed and case closed',
      },
    ],
  },
  {
    id: 'REF-10235',
    patientId: 'P-1044',
    patientName: 'Venkat Rao',
    reason: 'Diabetes with neuropathy complications - requires endocrinology evaluation',
    specialty: 'Endocrinology',
    diagnosticTests: ['HbA1c', 'Renal function test'],
    urgency: 'routine',
    status: 'appointment-booked',
    sourceFacility: 'PHC A - Rampur',
    destinationFacility: 'District Hospital - Central City',
    createdAt: formatDateShort(yesterday),
    appointmentDate: formatDateShort(tomorrow),
    timeline: [
      {
        status: 'created',
        timestamp: formatDate(yesterday),
        facility: 'PHC A - Rampur',
        user: 'ASHA-12',
        notes: 'Referral created',
      },
      {
        status: 'accepted',
        timestamp: formatDate(today),
        facility: 'District Hospital - Central City',
        user: 'Dr. Amit Kumar',
        notes: 'Referral accepted',
      },
      {
        status: 'appointment-booked',
        timestamp: formatDate(today),
        facility: 'District Hospital - Central City',
        user: 'Receptionist',
        notes: 'Appointment confirmed for tomorrow at 10:00 AM',
      },
    ],
  },
  {
    id: 'REF-10236',
    patientId: 'P-1043',
    patientName: 'Fatima Begum',
    reason: 'High-risk pregnancy - requires obstetric consultation',
    specialty: 'Obstetrics',
    diagnosticTests: ['Ultrasound', 'NST'],
    urgency: 'priority',
    status: 'created',
    sourceFacility: 'PHC A - Rampur',
    destinationFacility: 'District Hospital - Central City',
    createdAt: formatDateShort(today),
    timeline: [
      {
        status: 'created',
        timestamp: formatDate(today),
        facility: 'PHC A - Rampur',
        user: 'ANM-03',
        notes: 'Referral created for high-risk pregnancy',
      },
    ],
  },
  {
    id: 'REF-10237',
    patientId: 'P-1045',
    patientName: 'Meena Devi',
    reason: 'Acute respiratory infection - requires pulmonologist evaluation',
    specialty: 'Pulmonology',
    diagnosticTests: ['Chest X-ray', 'Sputum test'],
    urgency: 'priority',
    status: 'missed',
    sourceFacility: 'PHC A - Rampur',
    destinationFacility: 'Rural Hospital B - Devapur',
    createdAt: formatDateShort(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
    appointmentDate: formatDateShort(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    timeline: [
      {
        status: 'created',
        timestamp: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
        facility: 'PHC A - Rampur',
        user: 'ANM-02',
        notes: 'Referral created',
      },
      {
        status: 'appointment-booked',
        timestamp: formatDate(new Date(today.getTime() - 2.5 * 24 * 60 * 60 * 1000)),
        facility: 'Rural Hospital B - Devapur',
        user: 'Receptionist',
        notes: 'Appointment scheduled',
      },
      {
        status: 'missed',
        timestamp: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
        facility: 'Rural Hospital B - Devapur',
        user: 'ANM',
        notes: 'Patient did not arrive for appointment',
      },
    ],
  },
];

export const followUps: FollowUp[] = [
  {
    id: 'FU-001',
    patientId: 'P-1042',
    patientName: 'Ravi Kumar',
    condition: 'Hypertension post-treatment',
    followUpDate: formatDateShort(nextWeek),
    assignedWorker: 'ASHA-17',
    priority: 'urgent',
    status: 'due',
  },
  {
    id: 'FU-002',
    patientId: 'P-1043',
    patientName: 'Fatima Begum',
    condition: 'Pregnancy monitoring',
    followUpDate: formatDateShort(tomorrow),
    assignedWorker: 'ANM-03',
    priority: 'priority',
    status: 'scheduled',
  },
  {
    id: 'FU-003',
    patientId: 'P-1044',
    patientName: 'Venkat Rao',
    condition: 'Diabetes control check',
    followUpDate: formatDateShort(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
    assignedWorker: 'ASHA-12',
    priority: 'priority',
    status: 'scheduled',
  },
  {
    id: 'FU-004',
    patientId: 'P-1047',
    patientName: 'Ashoka Reddy',
    condition: 'Fever follow-up',
    followUpDate: formatDateShort(tomorrow),
    assignedWorker: 'ANM-01',
    priority: 'routine',
    status: 'scheduled',
  },
  {
    id: 'FU-005',
    patientId: 'P-1046',
    patientName: 'Salim Khan',
    condition: 'GERD management',
    followUpDate: formatDateShort(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
    assignedWorker: 'ASHA-08',
    priority: 'routine',
    status: 'scheduled',
  },
  {
    id: 'FU-006',
    patientId: 'P-1049',
    patientName: 'Priya Patel',
    condition: 'Routine health check-up',
    followUpDate: formatDateShort(nextWeek),
    assignedWorker: 'ANM-04',
    priority: 'routine',
    status: 'scheduled',
  },
];

export const notifications: Notification[] = [
  {
    id: 'NOT-001',
    type: 'emergency',
    title: 'Emergency Case Escalation',
    message: 'Ravi Kumar requires immediate cardiology evaluation',
    timestamp: formatDate(new Date(today.getTime() - 10 * 60 * 1000)),
    read: false,
  },
  {
    id: 'NOT-002',
    type: 'warning',
    title: 'Missed Follow-up Alert',
    message: '5 high-risk patients have missed scheduled follow-ups',
    timestamp: formatDate(new Date(today.getTime() - 30 * 60 * 1000)),
    read: false,
  },
  {
    id: 'NOT-003',
    type: 'warning',
    title: 'Medicine Stock Alert',
    message: 'Insulin availability below threshold at PHC A',
    timestamp: formatDate(new Date(today.getTime() - 1 * 60 * 60 * 1000)),
    read: false,
  },
  {
    id: 'NOT-004',
    type: 'warning',
    title: 'Diagnostic Unavailable',
    message: 'Ultrasound not available at Rural Hospital B until tomorrow 10:00 AM',
    timestamp: formatDate(new Date(today.getTime() - 2 * 60 * 60 * 1000)),
    read: true,
  },
  {
    id: 'NOT-005',
    type: 'info',
    title: 'Referral Accepted',
    message: 'REF-10235 (Venkat Rao) has been accepted by District Hospital',
    timestamp: formatDate(new Date(today.getTime() - 3 * 60 * 60 * 1000)),
    read: true,
  },
  {
    id: 'NOT-006',
    type: 'success',
    title: 'Referral Completed',
    message: 'REF-10234 (Ravi Kumar) care journey completed and case closed',
    timestamp: formatDate(new Date(today.getTime() - 4 * 60 * 60 * 1000)),
    read: true,
  },
  {
    id: 'NOT-007',
    type: 'warning',
    title: 'Appointment Reminder',
    message: 'Venkat Rao appointment at District Hospital tomorrow at 10:00 AM',
    timestamp: formatDate(new Date(today.getTime() - 5 * 60 * 60 * 1000)),
    read: true,
  },
  {
    id: 'NOT-008',
    type: 'info',
    title: 'New Teleconsultation Request',
    message: 'Dr. Rajesh Kumar - 2 patients waiting for consultation',
    timestamp: formatDate(new Date(today.getTime() - 6 * 60 * 60 * 1000)),
    read: true,
  },
];

export const auditLog: AuditEntry[] = [
  {
    id: 'AUD-001',
    timestamp: formatDate(today),
    user: 'ASHA-17',
    action: 'Case Closed',
    entityId: 'REF-10234',
    entityType: 'Referral',
    status: 'Completed',
  },
  {
    id: 'AUD-002',
    timestamp: formatDate(new Date(today.getTime() - 60 * 60 * 1000)),
    user: 'Dr. V. Prabhu Kumar',
    action: 'Treatment Completed',
    entityId: 'P-1042',
    entityType: 'Patient',
    status: 'Completed',
  },
  {
    id: 'AUD-003',
    timestamp: formatDate(new Date(today.getTime() - 2 * 60 * 60 * 1000)),
    user: 'ANM',
    action: 'Diagnostics Completed',
    entityId: 'REF-10234',
    entityType: 'Referral',
    status: 'Completed',
  },
  {
    id: 'AUD-004',
    timestamp: formatDate(new Date(today.getTime() - 3 * 60 * 60 * 1000)),
    user: 'ASHA-12',
    action: 'Created Referral',
    entityId: 'REF-10235',
    entityType: 'Referral',
    status: 'Created',
  },
  {
    id: 'AUD-005',
    timestamp: formatDate(new Date(today.getTime() - 4 * 60 * 60 * 1000)),
    user: 'ANM-03',
    action: 'Patient Registration',
    entityId: 'P-1043',
    entityType: 'Patient',
    status: 'Registered',
  },
];

export const demoJourneySteps: DemoJourneyStep[] = [
  {
    id: 1,
    title: 'Patient Registered',
    description: 'Ravi Kumar, 54 years old, from Rampur village with hypertension history',
    timestamp: formatDateShort(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'UserPlus',
  },
  {
    id: 2,
    title: 'Vitals Recorded',
    description: 'BP 178/104, SpO2 91%, Pulse 98, Temperature 37.2°C',
    timestamp: formatDateShort(new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'Heart',
  },
  {
    id: 3,
    title: 'Digital Triage Completed',
    description: 'Risk Assessment: RED (High-priority) - Immediate clinical evaluation required',
    timestamp: formatDateShort(new Date(today.getTime() - 6.8 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'AlertTriangle',
  },
  {
    id: 4,
    title: 'Teleconsultation',
    description: 'Doctor consultation with Dr. Rajesh Kumar at PHC A',
    timestamp: formatDateShort(new Date(today.getTime() - 6.5 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'Phone',
  },
  {
    id: 5,
    title: 'Referral Created',
    description: 'REF-10234: Cardiology consultation + ECG at District Hospital',
    timestamp: formatDateShort(new Date(today.getTime() - 6.3 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'Send',
  },
  {
    id: 6,
    title: 'Facility Matched',
    description: 'District Hospital identified as best match (92% fit) for cardiology services',
    timestamp: formatDateShort(new Date(today.getTime() - 6.2 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'MapPin',
  },
  {
    id: 7,
    title: 'Appointment Booked',
    description: 'September 1, 10:30 AM at District Hospital - Cardiology Department',
    timestamp: formatDateShort(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'Calendar',
  },
  {
    id: 8,
    title: 'Patient Arrived',
    description: 'Ravi Kumar successfully arrived at District Hospital',
    timestamp: formatDateShort(new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'CheckCircle',
  },
  {
    id: 9,
    title: 'Diagnostic Test',
    description: 'ECG performed - Results normal, no cardiac abnormalities detected',
    timestamp: formatDateShort(new Date(today.getTime() - 5.8 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'Activity',
  },
  {
    id: 10,
    title: 'Specialist Consultation',
    description: 'Consultation with Dr. V. Prabhu Kumar (Cardiologist)',
    timestamp: formatDateShort(new Date(today.getTime() - 5.5 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'Stethoscope',
  },
  {
    id: 11,
    title: 'Treatment Plan',
    description: 'Medication adjusted, lifestyle recommendations provided',
    timestamp: formatDateShort(new Date(today.getTime() - 5.3 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'Pill',
  },
  {
    id: 12,
    title: 'Follow-up Scheduled',
    description: 'Follow-up appointment scheduled for September 9',
    timestamp: formatDateShort(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'RotateCw',
  },
  {
    id: 13,
    title: 'Outreach Task',
    description: 'ASHA-17 created follow-up outreach task',
    timestamp: formatDateShort(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
    status: 'completed',
    icon: 'Users',
  },
  {
    id: 14,
    title: 'Follow-up Completed',
    description: 'Patient completed follow-up examination - all vital signs normal',
    timestamp: formatDateShort(today),
    status: 'completed',
    icon: 'CheckCircle2',
  },
  {
    id: 15,
    title: 'Case Review',
    description: 'Treatment outcomes reviewed - patient responding well to therapy',
    timestamp: formatDateShort(today),
    status: 'completed',
    icon: 'ClipboardList',
  },
  {
    id: 16,
    title: 'Case Closed',
    description: 'Complete care journey from first contact to completed care',
    timestamp: formatDateShort(today),
    status: 'completed',
    icon: 'Flag',
  },
];

export const dashboardKPIs: KPI[] = [
  { label: 'Patients Today', value: 84, trend: '+12%', status: 'positive', subtitle: 'vs. yesterday' },
  { label: 'Pending Referrals', value: 8, trend: '-2', status: 'positive', subtitle: 'this week' },
  { label: 'Follow-ups Due', value: 17, trend: '+5', status: 'neutral', subtitle: 'this week' },
  { label: 'High-Risk Patients', value: 5, trend: '-1', status: 'positive', subtitle: 'under monitoring' },
  { label: 'Medicine Alerts', value: 4, trend: '+2', status: 'negative', subtitle: 'critical stock' },
  { label: 'Diagnostics Unavailable', value: 3, trend: '-1', status: 'neutral', subtitle: 'next 24h' },
  { label: 'Average Waiting Time', value: '34 min', trend: '-5 min', status: 'positive', subtitle: 'from registration' },
  { label: 'Referral Completion', value: '82%', trend: '+4%', status: 'positive', subtitle: 'this month' },
];
