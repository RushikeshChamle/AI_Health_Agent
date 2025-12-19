
export type View = 'dashboard' | 'builder' | 'kb' | 'settings' | 'activity';

export interface KBItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface KBDocument {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'csv' | 'url';
  size: string;
  uploadDate: string;
  status: 'indexed' | 'processing' | 'error';
}

export interface FlowBranch {
  id: string;
  label: string;
  condition: string;
}

export interface FlowNode {
  id: string;
  type: 'trigger' | 'intent' | 'action' | 'logic';
  title: string;
  description: string;
  config?: any;
  branches?: FlowBranch[];
}

// --- Skill Framework Types ---

export interface SkillSchedule {
  enabled: boolean;
  timezone: string;
  days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun')[];
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  holidays: boolean;
}

export interface SkillInput {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'phone' | 'boolean' | 'file';
  required: boolean;
  description?: string;
  mappedField?: string; // For integration mapping
}

export interface SkillIntegration {
  provider: 'athena' | 'salesforce' | 'custom' | 'none';
  authType: 'oauth' | 'api_key' | 'none';
  endpoints: {
    name: string;
    url: string;
    method: 'GET' | 'POST';
  }[];
  fieldMapping: Record<string, string>; // Local Field ID -> External Field ID
}

export interface SkillCompliance {
  hipaa: boolean;
  recording: boolean;
  redaction: boolean;
  consentRequired: boolean;
  disclosures: string[];
}

// New: Per-Skill Tools Configuration
export interface SkillTools {
  sms: {
    enabled: boolean;
    template: string; // e.g., "Here is the secure link: {{url}}"
    triggerKeywords: string[];
  };
  transfer: {
    enabled: boolean;
    targetNumber: string;
    whisperMessage: string; // Message played to the agent before connecting
    conditions: string[]; // e.g., "sentiment_negative", "unknown_intent"
  };
  calendar: {
    enabled: boolean;
    provider: 'athena' | 'google' | 'outlook';
    lookaheadDays: number;
  };
  ehr: {
    enabled: boolean;
    provider: 'athena' | 'epic' | 'cerner';
    writeAccess: boolean;
  };
  // New: IVR Navigation Logic
  ivr: {
    enabled: boolean;
    triggerDigit: string; // e.g. "1"
    voicePrompt: string; // e.g. "Press 1 for Scheduling"
  };
}

export interface SkillDefinition {
  id: string;
  name: string;
  description: string;
  category: 'healthcare' | 'fintech' | 'real_estate' | 'saas' | 'general';
  
  // Channel Support
  channels: {
    sms: boolean;
    voice: boolean;
  };
  
  // 1. Overview
  metrics: {
    expectedCallsPerDay: number;
    targetResolutionRate: number;
  };

  // 2. Availability
  schedule: SkillSchedule;

  // 3. Inputs
  inputs: SkillInput[];

  // 4. Tools (Includes IVR)
  tools: SkillTools;

  // 5. Integrations
  integration: SkillIntegration;

  // 6. Logic & Tone
  logic: {
    tone: string;
    escalationThreshold: number;
    fallbackAction: 'transfer' | 'message' | 'hangup';
    urgentKeywords: string[];
  };

  // 7. Compliance
  compliance: SkillCompliance;

  // State
  enabled: boolean;
}

export interface AgentConfiguration {
  identity: {
    name: string;
    tone: 'empathetic' | 'efficient' | 'casual';
    voiceId: string;
    phoneNumber?: string; // New: Phone Number assigned to this agent
  };
  
  // New Scalable Skill Map
  skills: Record<string, SkillDefinition>;

  // RAG / Knowledge Base Settings
  knowledge: {
    enabled: boolean;
    confidenceThreshold: number;
    searchStrategy: 'vector' | 'keyword' | 'hybrid';
    kbId?: string; 
  };

  // Legacy Handoff (kept for backward compatibility)
  handoff: {
    behavior: 'transfer' | 'message';
    transferNumber: string;
  };
  
  model: {
    provider: string;
    model: string;
    temperature: number;
    systemPrompt: string;
    maxTokens: number;
  };
  voice: {
    provider: string;
    voiceId: string; 
    speed: number;
    pitch: number;
    backgroundSound: string;
  };
  transcriber: {
    provider: string;
    language: string;
    confidence: number;
  };
  callSettings: {
    silenceTimeout: number;
    maxDuration: number;
    voicemailDetection: boolean;
    endCallMessage: string;
    voicemailMessage: string;
  };
}

export interface AgentSettings {
  tone: string;
  escalationThreshold: number;
  athenaConnected: boolean;
  hipaaEnabled: boolean;
  clinicName: string;
}

export interface ConversationTurn {
  role: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
}

export interface ExtractedEntities {
  patientName?: string;
  dob?: string;
  medication?: string;
  appointmentTime?: string;
  intent?: string;
  insuranceProvider?: string;
  policyNumber?: string;
}

export interface CallLog {
  id: string;
  patientName: string; 
  phoneNumber: string;
  timestamp: string;
  type: 'voice' | 'sms';
  status: 'resolved' | 'escalated' | 'action_required';
  intent: 'refill' | 'scheduling' | 'triage' | 'general' | 'billing' | 'insurance';
  duration: string;
  transcript: ConversationTurn[];
  extractedData: ExtractedEntities;
  audioUrl?: string; 
  escalationReason?: string;
}

export interface AppState {
  name: string;
  stats: {
    missedRevenue: number[];
    staffHoursSaved: number[];
    inquiryCaptureRate: number;
    setupComplete: boolean;
  };
  kb: KBItem[];
  documents: KBDocument[];
  flow: FlowNode[];
  logs: CallLog[];
  settings: AgentSettings;
  agentConfig: AgentConfiguration;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}
