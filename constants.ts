
import { AppState, AgentConfiguration, CallLog, FlowNode, SkillDefinition, KBDocument } from './types';

export const INITIAL_KB = [
  { 
    id: '1', 
    question: 'Do you accept Blue Cross Blue Shield?', 
    answer: 'Yes, we are in-network with Blue Cross Blue Shield PPO and HMO plans. For HMO plans, please ensure you have a valid referral from your primary care physician before your visit.', 
    tags: ['insurance', 'billing'] 
  },
  { 
    id: '2', 
    question: 'What are your operating hours?', 
    answer: 'We are open Monday through Friday from 8:00 AM to 6:00 PM. We also have urgent care hours on Saturdays from 9:00 AM to 1:00 PM. We are closed on Sundays.', 
    tags: ['general', 'hours'] 
  },
  { 
    id: '3', 
    question: 'How do I refill a prescription?', 
    answer: 'You can request a refill by calling us and pressing 2, or by replying "Refill" to our text messages. Please have your medication name and pharmacy details ready.', 
    tags: ['refill', 'pharmacy'] 
  },
  { 
    id: '4', 
    question: 'Where can I park?', 
    answer: 'We have a dedicated patient parking garage attached to the building. Entry is on 4th Street. Bring your ticket inside for validation.', 
    tags: ['general', 'parking', 'location'] 
  },
  { 
    id: '5', 
    question: 'What is your cancellation policy?', 
    answer: 'We require at least 24 hours notice for cancellations. Missed appointments without notice may incur a $50 fee.', 
    tags: ['policy', 'scheduling'] 
  },
  { 
    id: '6', 
    question: 'Do you offer telehealth appointments?', 
    answer: 'Yes, we offer telehealth for follow-ups and minor consultations. Please mention "telehealth" when booking your appointment.', 
    tags: ['scheduling', 'telehealth'] 
  },
  { 
    id: '7', 
    question: 'What should I bring to my first visit?', 
    answer: 'Please bring a valid photo ID, your current insurance card, and a list of current medications. Arrive 15 minutes early to complete paperwork.', 
    tags: ['new-patient', 'check-in'] 
  },
  {
    id: '8', 
    question: 'Do you accept Medicaid or Medicare?', 
    answer: 'We accept standard Medicare Part B. We are currently not accepting new Medicaid patients, but we can refer you to a local clinic that does.', 
    tags: ['insurance', 'billing'] 
  }
];

export const INITIAL_DOCUMENTS: KBDocument[] = [
  { id: 'doc-1', name: '2024_Patient_Policy.pdf', type: 'pdf', size: '2.4 MB', uploadDate: 'Oct 12, 2024', status: 'indexed' },
  { id: 'doc-2', name: 'Accepted_Insurance_List_Q4.xlsx', type: 'csv', size: '1.1 MB', uploadDate: 'Nov 01, 2024', status: 'indexed' },
  { id: 'doc-3', name: 'Post_Op_Instructions_Knee.docx', type: 'docx', size: '850 KB', uploadDate: 'Nov 15, 2024', status: 'indexed' },
];

export const INITIAL_FLOW: FlowNode[] = [
  { 
    id: '1', 
    type: 'trigger', 
    title: 'Inbound Contact', 
    description: 'Triggers on incoming Voice Call or SMS' 
  },
  { 
    id: '2', 
    type: 'intent', 
    title: 'Intent Classification', 
    description: 'Detects: Scheduling, Refill, Triage, Billing' 
  },
  { 
    id: '3', 
    type: 'logic', 
    title: 'Safety Check', 
    description: 'If "Severe Pain" or "Emergency" -> Immediate Transfer',
    branches: [
      { id: 'b1', label: 'Routine', condition: 'Score < 0.8' },
      { id: 'b2', label: 'Urgent', condition: 'Score > 0.8' }
    ]
  },
  { 
    id: '4', 
    type: 'action', 
    title: 'EHR Lookup', 
    description: 'Query Athena via API for Patient ID' 
  },
  { 
    id: '5', 
    type: 'action', 
    title: 'Execute Task', 
    description: 'Book Slot / Queue Refill / Answer FAQ' 
  }
];

export const MOCK_LOGS: CallLog[] = [
  {
    id: 'log-101',
    patientName: 'Michael Chen',
    phoneNumber: '+1 (555) 019-2834',
    timestamp: 'Today, 2:15 PM',
    type: 'voice',
    status: 'resolved',
    intent: 'scheduling',
    duration: '2m 14s',
    audioUrl: 'mock-audio-1.mp3',
    extractedData: {
      patientName: 'Michael Chen',
      dob: '09/04/1982',
      appointmentTime: 'Thursday, 2:00 PM',
      intent: 'New Appointment (Back Pain)'
    },
    transcript: [
      { role: 'assistant', text: 'Thank you for calling Downtown Family Practice. This is Alite, your automated assistant. How can I help you today?', timestamp: '14:15:05' },
      { role: 'user', text: 'Hi, I need to see Dr. Smith. My back is killing me.', timestamp: '14:15:12' },
      { role: 'assistant', text: 'I\'m sorry to hear you\'re in pain. I can help you book an appointment. Are you a current patient?', timestamp: '14:15:18' },
      { role: 'user', text: 'Yes, I am. Michael Chen.', timestamp: '14:15:25' },
      { role: 'assistant', text: 'Thank you, Michael. For verification, could you please state your date of birth?', timestamp: '14:15:30' },
      { role: 'user', text: 'September 4th, 1982.', timestamp: '14:15:35' },
      { role: 'assistant', text: 'Thanks. I have verified your profile. Dr. Smith has an opening this Thursday at 2:00 PM or Friday at 10:30 AM. Which works best?', timestamp: '14:15:45' },
      { role: 'user', text: 'Thursday at 2 works.', timestamp: '14:15:52' },
      { role: 'assistant', text: 'Great. I have booked you for Thursday at 2:00 PM. You will receive a confirmation text shortly.', timestamp: '14:16:05' }
    ]
  },
  {
    id: 'log-102',
    patientName: 'Sarah Jenkins',
    phoneNumber: '+1 (555) 123-4567',
    timestamp: 'Today, 10:42 AM',
    type: 'voice',
    status: 'action_required',
    intent: 'refill',
    duration: '1m 24s',
    audioUrl: 'mock-audio.mp3',
    extractedData: {
      patientName: 'Sarah Jenkins',
      dob: '05/12/1984',
      medication: 'Lisinopril 10mg',
      intent: 'Refill Request'
    },
    transcript: [
      { role: 'assistant', text: 'Hello, Downtown Family Practice. How can I help?', timestamp: '10:42:05' },
      { role: 'user', text: 'I need a refill on my blood pressure meds.', timestamp: '10:42:10' },
      { role: 'assistant', text: 'I can help with that. Could you please say the name of the medication and your date of birth?', timestamp: '10:42:15' },
      { role: 'user', text: 'It\'s Lisinopril, 10 milligrams. DOB is May 12th, 1984.', timestamp: '10:42:25' },
      { role: 'assistant', text: 'Thank you, Sarah. I found your prescription. I have queued a request for Dr. Smith to approve the Lisinopril 10mg refill. We will notify your pharmacy (CVS Main St) once signed.', timestamp: '10:42:35' }
    ]
  },
  {
    id: 'log-103',
    patientName: 'Unknown Caller',
    phoneNumber: '+1 (555) 987-6543',
    timestamp: 'Today, 9:15 AM',
    type: 'sms',
    status: 'escalated',
    intent: 'triage',
    duration: '0m 45s',
    escalationReason: 'Urgent keyword: "Chest pain"',
    extractedData: {
      intent: 'Medical Emergency'
    },
    transcript: [
      { role: 'user', text: 'I have sharp chest pain and trouble breathing.', timestamp: '09:15:00' },
      { role: 'assistant', text: 'I am detecting symptoms of a potential medical emergency. If you are experiencing chest pain, please hang up and dial 911 immediately. I am escalating this conversation to our on-call nurse now.', timestamp: '09:15:05' },
      { role: 'system', text: 'SMS Alert sent to Nurse Station (High Priority).', timestamp: '09:15:07' }
    ]
  },
  {
    id: 'log-105',
    patientName: 'Emily Blunt',
    phoneNumber: '+1 (555) 444-5555',
    timestamp: 'Today, 8:30 AM',
    type: 'voice',
    status: 'resolved',
    intent: 'insurance',
    duration: '1m 50s',
    extractedData: {
       intent: 'Insurance Verification',
       insuranceProvider: 'UnitedHealthcare',
       policyNumber: 'Member ID Captured'
    },
    transcript: [
       { role: 'assistant', text: 'Good morning, Downtown Family Practice.', timestamp: '08:30:05' },
       { role: 'user', text: 'Hi, I recently switched jobs and have UnitedHealthcare now. Do you guys take that?', timestamp: '08:30:12' },
       { role: 'assistant', text: 'Yes, we are in-network with most UnitedHealthcare plans. I can verify your specific policy if you have your card handy.', timestamp: '08:30:20' },
       { role: 'user', text: 'Yeah, Member ID is 998877665.', timestamp: '08:30:35' },
       { role: 'assistant', text: 'One moment while I check... Okay, I see your active policy. It has a $20 co-pay for visits. I have updated your file.', timestamp: '08:30:50' },
       { role: 'user', text: 'Perfect, thanks!', timestamp: '08:31:00' }
    ]
  },
  {
    id: 'log-106',
    patientName: 'Robert Fox',
    phoneNumber: '+1 (555) 777-9999',
    timestamp: 'Yesterday, 5:15 PM',
    type: 'sms',
    status: 'resolved',
    intent: 'billing',
    duration: '—',
    extractedData: {
       intent: 'Invoice Inquiry'
    },
    transcript: [
       { role: 'user', text: 'I got a bill for $150 but I thought my insurance covered the x-ray.', timestamp: '17:15:00' },
       { role: 'assistant', text: 'I can help clarify that. It looks like the $150 is the deductible portion for your Aetna plan. The total cost was $400, and insurance covered $250.', timestamp: '17:15:15' },
       { role: 'user', text: 'Oh, I see. Can I pay that online?', timestamp: '17:15:45' },
       { role: 'assistant', text: 'Yes, you can pay via our secure portal here: [Link]. Or I can connect you to billing if you want to set up a payment plan.', timestamp: '17:16:00' },
       { role: 'user', text: 'I will use the link. Thanks.', timestamp: '17:16:20' }
    ]
  },
  {
    id: 'log-107',
    patientName: 'Maria Rodriguez',
    phoneNumber: '+1 (555) 222-3333',
    timestamp: 'Yesterday, 3:45 PM',
    type: 'voice',
    status: 'escalated',
    intent: 'triage',
    duration: '2m 10s',
    escalationReason: 'Complex symptoms (dizziness + blurred vision)',
    extractedData: {
       intent: 'Symptom Triage'
    },
    transcript: [
       { role: 'assistant', text: 'Downtown Family Practice, Alite speaking.', timestamp: '15:45:00' },
       { role: 'user', text: 'Hi, I have been feeling really dizzy since this morning and my vision is kinda blurry.', timestamp: '15:45:10' },
       { role: 'assistant', text: 'I understand. Are you experiencing any chest pain or difficulty speaking?', timestamp: '15:45:18' },
       { role: 'user', text: 'No chest pain, but I feel weak.', timestamp: '15:45:25' },
       { role: 'assistant', text: 'Given your symptoms of dizziness and vision changes, I want to be safe. I am transferring you to our triage nurse immediately to assess if you need urgent care.', timestamp: '15:45:35' }
    ]
  },
  {
    id: 'log-108',
    patientName: 'James Wilson',
    phoneNumber: '+1 (555) 666-1111',
    timestamp: 'Yesterday, 1:20 PM',
    type: 'sms',
    status: 'resolved',
    intent: 'scheduling',
    duration: '—',
    extractedData: {
       intent: 'Rescheduling',
       appointmentTime: 'Next Wednesday, 9AM'
    },
    transcript: [
       { role: 'user', text: 'I need to move my appointment tomorrow. Something came up.', timestamp: '13:20:00' },
       { role: 'assistant', text: 'No problem, James. I see you are booked for tomorrow at 2 PM. When would you like to reschedule?', timestamp: '13:20:05' },
       { role: 'user', text: 'Do you have anything next Wednesday morning?', timestamp: '13:20:25' },
       { role: 'assistant', text: 'Yes, Dr. Smith has an opening at 9:00 AM or 11:15 AM on Wednesday.', timestamp: '13:20:35' },
       { role: 'user', text: '9 AM is good.', timestamp: '13:20:45' },
       { role: 'assistant', text: 'Confirmed. You are moved to next Wednesday at 9:00 AM.', timestamp: '13:20:50' }
    ]
  },
  {
    id: 'log-109',
    patientName: 'Linda Kim',
    phoneNumber: '+1 (555) 888-2222',
    timestamp: 'Yesterday, 11:00 AM',
    type: 'voice',
    status: 'resolved',
    intent: 'general',
    duration: '1m 05s',
    extractedData: {
       intent: 'Lab Results Inquiry'
    },
    transcript: [
       { role: 'user', text: 'Hi, are my blood test results back yet?', timestamp: '11:00:10' },
       { role: 'assistant', text: 'Let me check your file, Linda. Yes, the lipid panel results arrived this morning. The doctor has reviewed them and marked them as normal. Would you like a copy mailed to you?', timestamp: '11:00:25' },
       { role: 'user', text: 'That is a relief. Yes, please mail them.', timestamp: '11:00:40' },
       { role: 'assistant', text: 'Done. You should receive them in 3-5 business days.', timestamp: '11:00:50' }
    ]
  }
];

// Helper for default tools
const DEFAULT_TOOLS = {
    sms: { enabled: false, template: '', triggerKeywords: [] },
    transfer: { enabled: false, targetNumber: '+15550000000', whisperMessage: 'Connecting user...', conditions: [] },
    calendar: { enabled: false, provider: 'athena' as const, lookaheadDays: 7 },
    ehr: { enabled: false, provider: 'athena' as const, writeAccess: false },
    ivr: { enabled: false, triggerDigit: '', voicePrompt: '' }
};

const SCHEDULING_SKILL: SkillDefinition = {
  id: 'scheduling',
  name: 'Patient Scheduling',
  description: 'Gap-fill slots 24/7. Handles new and follow-up booking.',
  category: 'healthcare',
  enabled: true,
  channels: { sms: true, voice: false },
  metrics: { expectedCallsPerDay: 45, targetResolutionRate: 0.85 },
  schedule: {
    enabled: true, timezone: 'America/New_York', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startTime: '00:00', endTime: '23:59', holidays: true
  },
  inputs: [
    { id: 'patient_dob', label: 'Date of Birth', type: 'date', required: true, description: 'Required for Athena Lookup' },
    { id: 'appt_reason', label: 'Reason for Visit', type: 'text', required: true, description: 'Back pain, follow-up, etc.' },
    { id: 'insurance_card', label: 'Insurance Card', type: 'file', required: false, description: 'Image upload for new patients' }
  ],
  tools: {
    ...DEFAULT_TOOLS,
    sms: { enabled: true, template: "Book here: {{link}}", triggerKeywords: ["book"] },
    calendar: { enabled: true, provider: 'athena', lookaheadDays: 14 },
    ehr: { enabled: true, provider: 'athena', writeAccess: false },
    ivr: { enabled: true, triggerDigit: '1', voicePrompt: 'For appointments and scheduling, press 1.' }
  },
  integration: {
    provider: 'athena', authType: 'oauth',
    endpoints: [
      { name: 'Get Slots', url: '/v1/appointments/open', method: 'GET' },
      { name: 'Book Slot', url: '/v1/appointments/book', method: 'POST' }
    ],
    fieldMapping: { 'patient_dob': 'dob', 'appt_reason': 'appointmentreasonid' }
  },
  logic: { tone: 'efficient', escalationThreshold: 0.70, fallbackAction: 'transfer', urgentKeywords: [] },
  compliance: { hipaa: true, recording: false, redaction: true, consentRequired: true, disclosures: ['Replies are automated.'] }
};

const REFILL_SKILL: SkillDefinition = {
  id: 'refills',
  name: 'Rx Refills (IVR)',
  description: 'Async VM extraction for refills. "Press 2" flow.',
  category: 'healthcare',
  enabled: true,
  channels: { sms: false, voice: true },
  metrics: { expectedCallsPerDay: 20, targetResolutionRate: 0.90 },
  schedule: {
    enabled: true, timezone: 'America/New_York', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], startTime: '00:00', endTime: '23:59', holidays: false
  },
  inputs: [
    { id: 'rx_med_name', label: 'Medication Name', type: 'text', required: true, description: 'e.g. Gabapentin' },
    { id: 'rx_dosage', label: 'Dosage', type: 'text', required: true, description: 'e.g. 300mg' },
    { id: 'pharmacy_details', label: 'Pharmacy Name', type: 'text', required: true }
  ],
  tools: {
      ...DEFAULT_TOOLS,
      ehr: { enabled: true, provider: 'athena', writeAccess: true },
      ivr: { enabled: true, triggerDigit: '2', voicePrompt: 'For prescription refills, press 2.' }
  },
  integration: {
    provider: 'athena', authType: 'oauth',
    endpoints: [{ name: 'Create Task', url: '/v1/tasks/refill', method: 'POST' }],
    fieldMapping: { 'rx_med_name': 'medicationid' }
  },
  logic: { tone: 'empathetic', escalationThreshold: 0.80, fallbackAction: 'message', urgentKeywords: [] },
  compliance: { hipaa: true, recording: true, redaction: true, consentRequired: false, disclosures: [] }
};

const TRIAGE_SKILL: SkillDefinition = {
  id: 'triage',
  name: 'Urgency Triage',
  description: 'Detects "severe pain" or emergencies. Routes to on-call.',
  category: 'healthcare',
  enabled: true,
  channels: { sms: true, voice: true },
  metrics: { expectedCallsPerDay: 10, targetResolutionRate: 1.0 },
  schedule: {
    enabled: true, timezone: 'America/New_York', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], startTime: '18:00', endTime: '08:00', holidays: true
  },
  inputs: [
    { id: 'symptoms', label: 'Symptoms', type: 'text', required: true },
    { id: 'pain_level', label: 'Pain Level (1-10)', type: 'number', required: true }
  ],
  tools: {
    ...DEFAULT_TOOLS,
    transfer: { 
        enabled: true, 
        targetNumber: '+1911', 
        whisperMessage: 'EMERGENCY: Patient reporting severe symptoms.', 
        conditions: ['sentiment_negative'] 
    },
    ivr: { enabled: true, triggerDigit: '9', voicePrompt: 'For medical emergencies, press 9.' }
  },
  integration: { provider: 'none', authType: 'none', endpoints: [], fieldMapping: {} },
  logic: { tone: 'empathetic', escalationThreshold: 0.95, fallbackAction: 'transfer', urgentKeywords: ['chest pain', 'bleeding', 'breath', 'unconscious', 'stroke', 'suicide'] },
  compliance: { hipaa: true, recording: true, redaction: true, consentRequired: true, disclosures: ['If this is an emergency, hang up and dial 911.'] }
};

export const INITIAL_AGENT_CONFIG: AgentConfiguration = {
  identity: {
    name: 'Alite Assistant',
    tone: 'empathetic',
    voiceId: '246-professional-female',
    phoneNumber: '+1 (555) 123-4567'
  },
  knowledge: {
    enabled: true,
    confidenceThreshold: 0.75,
    searchStrategy: 'hybrid',
    kbId: 'global-kb-1'
  },
  skills: {
    'scheduling': SCHEDULING_SKILL,
    'refills': REFILL_SKILL,
    'triage': TRIAGE_SKILL,
    'faq': { 
        ...SCHEDULING_SKILL, 
        id: 'faq', 
        name: 'General FAQ', 
        description: 'Answer hours, location, and policy questions.', 
        inputs: [], 
        tools: { ...DEFAULT_TOOLS },
        integration: { provider: 'none', authType: 'none', endpoints: [], fieldMapping: {} } 
    }
  },
  handoff: {
    behavior: 'transfer',
    transferNumber: '+15550123456'
  },
  
  model: {
    provider: 'openai',
    model: 'gpt-4o',
    temperature: 0.7,
    maxTokens: 250,
    systemPrompt: `You are an empathetic medical receptionist for Downtown Family Practice. Your goal is to help patients schedule appointments, handle refill requests, and answer general questions. You must always verify the patient's identity (Name/DOB) before accessing records. If a patient expresses severe pain or emergency symptoms, escalate immediately to 911.`, 
  },
  voice: {
    provider: 'cartesia',
    voiceId: '246-professional-female',
    speed: 1.0,
    pitch: 1.0,
    backgroundSound: 'office-ambience',
  },
  transcriber: {
    provider: 'deepgram',
    language: 'en',
    confidence: 0.8,
  },
  callSettings: {
    silenceTimeout: 30,
    maxDuration: 600,
    voicemailDetection: true,
    endCallMessage: "Thank you for calling Downtown Family Practice. Have a healthy day!",
    voicemailMessage: "Hello, you've reached Downtown Family Practice. Please leave your name, number, and reason for calling, and we'll return your call shortly.",
  },
};

export const MOCK_STATS = {
  missedRevenue: [800, 1200, 1500, 1800, 2400, 3100, 3850], 
  staffHoursSaved: [2, 5, 8, 12, 18, 24, 32], 
  inquiryCaptureRate: 88,
  setupComplete: true,
};

export const INITIAL_APP_STATE: AppState = {
  name: 'Front Desk Assistant',
  stats: {
    missedRevenue: MOCK_STATS.missedRevenue,
    staffHoursSaved: MOCK_STATS.staffHoursSaved,
    inquiryCaptureRate: MOCK_STATS.inquiryCaptureRate,
    setupComplete: true,
  },
  kb: INITIAL_KB,
  documents: INITIAL_DOCUMENTS,
  flow: INITIAL_FLOW,
  logs: MOCK_LOGS,
  settings: {
    tone: 'Empathetic & Professional',
    escalationThreshold: 0.75,
    athenaConnected: false,
    hipaaEnabled: true,
    clinicName: 'Downtown Family Practice'
  },
  agentConfig: INITIAL_AGENT_CONFIG,
};
