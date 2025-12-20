
import React, { useState } from 'react';
import { FlowNode, AgentConfiguration, SkillDefinition, SkillInput } from '../types';
import { 
  Zap, ArrowRight, GitBranch, ShieldAlert, CheckCircle2, 
  Activity, Play, Sparkles, Heart, 
  Calendar, Pill, HelpCircle, Briefcase, Coffee,
  Settings, Clock, Database, Shield, Sliders, ChevronLeft, Plus, Trash2, Edit2, Link, Globe, Smartphone, Phone,
  Mic, Cpu, PhoneForwarded, Radio, Volume2, MessageSquare, Terminal, Ear, Network, Lock, Fingerprint, Hammer, MessageCircle, UserPlus, Stethoscope, Hash, AlertTriangle, X, Book
} from 'lucide-react';

interface BuilderProps {
  flow: FlowNode[];
  config: AgentConfiguration;
  onUpdateFlow: (flow: FlowNode[]) => void;
  onUpdateConfig: (config: AgentConfiguration) => void;
}

// --- Icons Helper ---
const getSkillIcon = (id: string) => {
  if (id.includes('sched')) return Calendar;
  if (id.includes('refill')) return Pill;
  if (id.includes('triage')) return ShieldAlert;
  if (id.includes('faq')) return HelpCircle;
  return Zap;
};

export const Builder: React.FC<BuilderProps> = ({ flow, config, onUpdateFlow, onUpdateConfig }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'settings'>('skills');
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  // --- Actions ---

  const handleUpdateSkill = (skillId: string, updates: Partial<SkillDefinition>) => {
    const currentSkill = config.skills[skillId];
    onUpdateConfig({
      ...config,
      skills: {
        ...config.skills,
        [skillId]: { ...currentSkill, ...updates }
      }
    });
  };

  const handleToggleSkill = (skillId: string) => {
    const current = config.skills[skillId];
    handleUpdateSkill(skillId, { enabled: !current.enabled });
  };

  const handleAddSkill = () => {
    const newId = `custom_skill_${Date.now()}`;
    const newSkill: SkillDefinition = {
      id: newId,
      name: 'New Custom Skill',
      description: 'Define your custom business logic',
      category: 'general',
      enabled: false,
      channels: { sms: true, voice: true },
      metrics: { expectedCallsPerDay: 0, targetResolutionRate: 0.8 },
      schedule: { enabled: true, timezone: 'America/New_York', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], startTime: '09:00', endTime: '17:00', holidays: false },
      inputs: [],
      // Default Tools
      tools: {
        sms: { enabled: false, template: '', triggerKeywords: [] },
        transfer: { enabled: false, targetNumber: '', whisperMessage: '', conditions: [] },
        calendar: { enabled: false, provider: 'athena', lookaheadDays: 7 },
        ehr: { enabled: false, provider: 'athena', writeAccess: false },
        ivr: { enabled: false, triggerDigit: '', voicePrompt: '' }
      },
      integration: { provider: 'none', authType: 'none', endpoints: [], fieldMapping: {} },
      logic: { tone: 'professional', escalationThreshold: 0.7, fallbackAction: 'transfer', urgentKeywords: [] },
      compliance: { hipaa: false, recording: true, redaction: false, consentRequired: false, disclosures: [] }
    };
    
    onUpdateConfig({
      ...config,
      skills: { ...config.skills, [newId]: newSkill }
    });
    setEditingSkillId(newId);
  };

  // --- RENDERERS ---

  // 1. Skill Editor
  const renderSkillEditor = () => {
    if (!editingSkillId) return null;
    const skill = config.skills[editingSkillId];
    if (!skill) return <div>Skill not found</div>;

    return (
      <SkillEditor 
        skill={skill} 
        onUpdate={(updates) => handleUpdateSkill(editingSkillId, updates)} 
        onBack={() => setEditingSkillId(null)}
      />
    );
  };

  // 2. Skill Catalogue
  const renderSkillCatalogue = () => {
    return (
      <div className="h-full overflow-y-auto pr-2 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.values(config.skills).map((skill) => {
            const Icon = getSkillIcon(skill.id);
            return (
              <div 
                key={skill.id} 
                onClick={() => setEditingSkillId(skill.id)}
                className={`group relative bg-white rounded-xl border transition-all hover:shadow-md hover:border-primary-400 cursor-pointer overflow-hidden ${
                  skill.enabled ? 'border-primary-200 shadow-sm' : 'border-gray-200 opacity-80'
                }`}
              >
                {/* Status Bar */}
                <div className={`h-1.5 w-full ${skill.enabled ? 'bg-primary-500' : 'bg-gray-200'}`} />

                <div className="p-6">
                   <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          skill.enabled ? 'bg-primary-50 text-black' : 'bg-gray-50 text-gray-400'
                      }`}>
                          <Icon size={24} />
                      </div>
                      {skill.tools?.ivr?.enabled && skill.tools.ivr.triggerDigit && (
                          <div className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded border border-gray-200">
                             DTMF {skill.tools.ivr.triggerDigit}
                          </div>
                       )}
                   </div>

                   <h3 className="text-lg font-bold text-gray-900 mb-2">{skill.name}</h3>
                   <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px] mb-4">{skill.description}</p>
                   
                   <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                      {skill.channels?.sms && <span className="flex items-center gap-1"><Smartphone size={12} /> SMS</span>}
                      {skill.channels?.voice && <span className="flex items-center gap-1"><Phone size={12} /> Voice</span>}
                      <span className="ml-auto text-yellow-700">{(skill.metrics.targetResolutionRate * 100).toFixed(0)}% automation</span>
                   </div>
                </div>

                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between group-hover:bg-primary-50 transition-colors">
                   <span 
                     className={`text-xs font-bold uppercase tracking-wider ${
                        skill.enabled ? 'text-green-600' : 'text-gray-400'
                     }`}
                   >
                     {skill.enabled ? '● Active' : '○ Disabled'}
                   </span>
                   <span className="text-black text-sm font-medium flex items-center gap-1">
                     Configure <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </span>
                </div>
              </div>
            );
          })}

          <button 
            onClick={handleAddSkill}
            className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-colors group h-full min-h-[240px]"
          >
             <div className="w-14 h-14 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-primary-500 mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <Plus size={28} />
             </div>
             <span className="font-bold text-gray-700 group-hover:text-black">Add New Skill</span>
             <span className="text-sm text-gray-400 mt-1">Create custom business logic</span>
          </button>
        </div>
      </div>
    );
  };

  // 3. Advanced Settings Renderer
  const renderAgentSettings = () => {
    return (
      <AgentSettingsPanel config={config} onUpdate={onUpdateConfig} />
    );
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      {/* Header */}
      {!editingSkillId && (
        <div className="flex items-center justify-between mb-8 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Agent Capabilities</h2>
            <p className="text-gray-500 text-sm mt-1">Manage the core skills and business logic of your agent.</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
              onClick={() => setActiveTab('skills')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'skills' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Sparkles size={16} className={activeTab === 'skills' ? 'text-yellow-600' : ''} /> Catalogue
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === 'settings' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings size={16} /> Agent Settings
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden relative">
        {editingSkillId ? (
          renderSkillEditor()
        ) : activeTab === 'skills' ? (
          renderSkillCatalogue()
        ) : (
          renderAgentSettings()
        )}
      </div>
    </div>
  );
};

// --- Sub-Component: Comprehensive Agent Settings Panel ---

const AgentSettingsPanel: React.FC<{
  config: AgentConfiguration;
  onUpdate: (config: AgentConfiguration) => void;
}> = ({ config, onUpdate }) => {
  const [tab, setTab] = useState<'general' | 'brain' | 'voice' | 'ear' | 'connect'>('general');

  const tabs = [
    { id: 'general', label: 'Identity & Behavior', icon: Fingerprint },
    { id: 'brain', label: 'Intelligence & RAG', icon: Cpu },
    { id: 'voice', label: 'Voice (TTS)', icon: Volume2 },
    { id: 'ear', label: 'Hearing (STT)', icon: Ear },
   //  { id: 'connect', label: 'Connectivity', icon: Network },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Settings Sidebar */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-100">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Configuration</h3>
          </div>
          <div className="p-3 space-y-1 overflow-y-auto flex-1">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    tab === t.id ? 'bg-yellow-50 text-black shadow-sm ring-1 ring-primary-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className={tab === t.id ? 'text-yellow-600' : 'text-gray-400'} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          
          {/* 1. Identity & Behavior */}
          {tab === 'general' && (
             <div className="max-w-2xl space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Identity</h3>
                  <p className="text-sm text-gray-500">How the agent presents itself to patients.</p>
                </div>

                <div className="space-y-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                      <input 
                        type="text" 
                        value={config.identity.name}
                        onChange={e => onUpdate({...config, identity: {...config.identity, name: e.target.value}})}
                        className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Persona Tone</label>
                      <select 
                         value={config.identity.tone}
                         onChange={e => onUpdate({...config, identity: {...config.identity, tone: e.target.value as any}})}
                         className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                         <option value="empathetic">Empathetic (Healthcare)</option>
                         <option value="efficient">Efficient (Transactional)</option>
                         <option value="casual">Casual (Friendly)</option>
                      </select>
                   </div>
                </div>
             </div>
          )}

          {/* 2. Intelligence & RAG */}
          {tab === 'brain' && (
             <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
                <div className="border-b border-gray-100 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">Intelligence Engine</h3>
                  <p className="text-sm text-gray-500">Model configuration and Knowledge Retrieval (RAG) settings.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Model Provider</label>
                      <select 
                         value={config.model.provider}
                         onChange={e => onUpdate({...config, model: {...config.model, provider: e.target.value}})}
                         className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      >
                         <option value="openai">OpenAI (GPT-4o)</option>
                         <option value="anthropic">Anthropic (Claude 3.5 Sonnet)</option>
                         <option value="groq">Groq (Llama 3 70B)</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                      <div className="flex items-center gap-3">
                        <input 
                           type="range" min="0" max="1" step="0.1"
                           value={config.model.temperature}
                           onChange={e => onUpdate({...config, model: {...config.model, temperature: parseFloat(e.target.value)}})}
                           className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                        <span className="text-sm font-mono text-gray-600">{config.model.temperature}</span>
                      </div>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Base System Prompt</label>
                   <div className="relative">
                      <Terminal className="absolute left-3 top-3 text-gray-500" size={16} />
                      <textarea 
                         rows={8}
                         value={config.model.systemPrompt}
                         onChange={e => onUpdate({...config, model: {...config.model, systemPrompt: e.target.value}})}
                         className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 font-mono text-xs rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                         spellCheck={false}
                      />
                   </div>
                </div>

                {/* New Knowledge Base Section */}
                {config.knowledge && (
                    <div className="border-t border-gray-100 pt-6 mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Book size={18} className="text-primary-600" /> Knowledge Base Access
                          </h3>
                          <p className="text-sm text-gray-500">Allow agent to read from your defined Q&A to answer queries.</p>
                        </div>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                           <input 
                              type="checkbox" 
                              checked={config.knowledge.enabled}
                              onChange={() => onUpdate({ ...config, knowledge: { ...config.knowledge, enabled: !config.knowledge.enabled } })}
                              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-primary-200 checked:right-0 checked:border-primary-500"
                              style={{ right: config.knowledge.enabled ? '0' : 'auto', left: config.knowledge.enabled ? 'auto' : '0' }}
                           />
                           <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${config.knowledge.enabled ? 'bg-primary' : 'bg-gray-300'}`}></label>
                        </div>
                      </div>
                      
                      {config.knowledge.enabled && (
                        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Confidence Threshold</label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="range" min="0.5" max="0.95" step="0.05"
                                  value={config.knowledge.confidenceThreshold}
                                  onChange={e => onUpdate({ ...config, knowledge: { ...config.knowledge, confidenceThreshold: parseFloat(e.target.value) } })}
                                  className="flex-1 accent-primary-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="font-bold text-gray-900">{(config.knowledge.confidenceThreshold * 100).toFixed(0)}%</span>
                              </div>
                              <p className="text-xs text-gray-400 mt-2">Minimum similarity score to trigger a KB response.</p>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Retrieval Strategy</label>
                              <select 
                                 value={config.knowledge.searchStrategy}
                                 onChange={e => onUpdate({ ...config, knowledge: { ...config.knowledge, searchStrategy: e.target.value as any } })}
                                 className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm"
                              >
                                 <option value="hybrid">Hybrid (Keyword + Vector)</option>
                                 <option value="vector">Semantic (Vector Only)</option>
                                 <option value="keyword">Exact Match (Keyword Only)</option>
                              </select>
                           </div>
                        </div>
                      )}
                    </div>
                )}
             </div>
          )}

           {/* 3. Voice (Placeholder for Brevity) */}
           {tab === 'voice' && (
             <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
               <div className="border-b border-gray-100 pb-4 mb-4">
                 <h3 className="text-xl font-bold text-gray-900">Voice Synthesis (TTS)</h3>
                 <p className="text-sm text-gray-500">Configure how the agent sounds to patients.</p>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voice Provider</label>
                  <select 
                     value={config.voice.provider}
                     className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                     <option value="cartesia">Cartesia (Sonic)</option>
                     <option value="elevenlabs">ElevenLabs</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Voice ID</label>
                  <select 
                     value={config.voice.voiceId}
                     className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                     <option value="246-professional-female">Professional Female (Sarah)</option>
                     <option value="247-calm-male">Calm Male (David)</option>
                  </select>
               </div>
             </div>
           )}
           {/* 4. Ear (Placeholder) */}
           {tab === 'ear' && (
             <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
               <div className="border-b border-gray-100 pb-4 mb-4">
                 <h3 className="text-xl font-bold text-gray-900">Transcription (STT)</h3>
                 <p className="text-sm text-gray-500">Configure how the agent hears patients.</p>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">STT Provider</label>
                  <select 
                     value={config.transcriber.provider}
                     className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                     <option value="deepgram">Deepgram Nova-2 (Medical)</option>
                     <option value="whisper">OpenAI Whisper</option>
                  </select>
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Component: Skill Editor (Updated Colors) ---
const SkillEditor: React.FC<{
  skill: SkillDefinition; 
  onUpdate: (u: Partial<SkillDefinition>) => void;
  onBack: () => void;
}> = ({ skill, onUpdate, onBack }) => {
  const [tab, setTab] = useState<'overview' | 'availability' | 'inputs' | 'tools' | 'integrations' | 'logic' | 'compliance'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Briefcase },
    { id: 'availability', label: 'Availability', icon: Clock },
    { id: 'inputs', label: 'Data & Inputs', icon: Sliders },
    { id: 'tools', label: 'Tools & Actions', icon: Hammer }, 
    { id: 'integrations', label: 'Integrations', icon: Database },
    { id: 'logic', label: 'Logic', icon: GitBranch },
    { id: 'compliance', label: 'Governance', icon: Shield },
  ];

  // Helper for array management (days, keywords)
  const toggleArrayItem = <T extends string>(arr: T[], item: T): T[] => {
    return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Detail Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition">
             <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {skill.name}
              {skill.enabled && <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full uppercase">Active</span>}
            </h2>
            <p className="text-xs text-gray-500">{skill.category.toUpperCase()} • {skill.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg text-sm font-medium">Discard</button>
          <button onClick={onBack} className="px-4 py-2 bg-primary hover:bg-primary-400 text-black rounded-lg text-sm font-bold">Save Changes</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          <div className="p-4 overflow-y-auto space-y-1">
            {tabs.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.id ? 'bg-yellow-50 text-black shadow-sm border border-primary-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} className={tab === t.id ? 'text-yellow-600' : 'text-gray-400'} />
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          
          {/* TAB 1: OVERVIEW */}
          {tab === 'overview' && (
            <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                 <input 
                   type="text" value={skill.name} onChange={e => onUpdate({name: e.target.value})}
                   className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                 <textarea 
                   rows={3}
                   value={skill.description} 
                   onChange={e => onUpdate({description: e.target.value})}
                   className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                 />
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                 <select 
                    value={skill.category}
                    onChange={e => onUpdate({category: e.target.value as any})}
                    className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                 >
                    <option value="healthcare">Healthcare</option>
                    <option value="general">General</option>
                    <option value="fintech">Fintech</option>
                 </select>
               </div>
               
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="text-xs font-bold text-gray-500 uppercase">Target Resolution Rate</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input 
                      type="range" min="0.5" max="1.0" step="0.05"
                      value={skill.metrics.targetResolutionRate}
                      onChange={e => onUpdate({ metrics: { ...skill.metrics, targetResolutionRate: parseFloat(e.target.value) }})}
                      className="flex-1 accent-primary-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="font-bold text-gray-900">{(skill.metrics.targetResolutionRate * 100).toFixed(0)}%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Percentage of queries handled without human intervention.</p>
               </div>
            </div>
          )}

          {/* TAB 2: AVAILABILITY */}
          {tab === 'availability' && (
             <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                   <div>
                      <h4 className="font-medium text-gray-900">Skill Status</h4>
                      <p className="text-sm text-gray-500">Enable or disable this skill globally.</p>
                   </div>
                   <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input type="checkbox" checked={skill.enabled} onChange={() => onUpdate({enabled: !skill.enabled})} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-primary-200 checked:right-0 checked:border-primary-500" style={{ right: skill.enabled ? '0' : 'auto', left: skill.enabled ? 'auto' : '0' }}/>
                        <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${skill.enabled ? 'bg-primary' : 'bg-gray-300'}`}></label>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Active Days</label>
                   <div className="flex gap-2">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                         <button 
                           key={day}
                           onClick={() => onUpdate({ schedule: { ...skill.schedule, days: toggleArrayItem(skill.schedule.days, day as any) }})}
                           className={`px-3 py-2 rounded-lg text-sm font-medium border ${
                              skill.schedule.days.includes(day as any) 
                                ? 'bg-primary-500 text-black border-primary-600' 
                                : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                           }`}
                         >
                            {day}
                         </button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                      <input 
                        type="time" 
                        value={skill.schedule.startTime}
                        onChange={e => onUpdate({ schedule: { ...skill.schedule, startTime: e.target.value }})}
                        className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                      <input 
                        type="time" 
                        value={skill.schedule.endTime}
                        onChange={e => onUpdate({ schedule: { ...skill.schedule, endTime: e.target.value }})}
                        className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg"
                      />
                   </div>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                   <select 
                      value={skill.schedule.timezone}
                      onChange={e => onUpdate({ schedule: { ...skill.schedule, timezone: e.target.value }})}
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg"
                   >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                   </select>
                </div>
             </div>
          )}

          {/* TAB 3: INPUTS */}
          {tab === 'inputs' && (
             <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center mb-4">
                   <h3 className="text-lg font-bold text-gray-900">Required Information</h3>
                   <button 
                     onClick={() => {
                        const newInput: SkillInput = { id: `field_${Date.now()}`, label: 'New Field', type: 'text', required: true };
                        onUpdate({ inputs: [...skill.inputs, newInput] });
                     }}
                     className="text-sm text-primary-700 font-bold hover:underline flex items-center gap-1"
                   >
                      <Plus size={16} /> Add Field
                   </button>
                </div>

                <div className="space-y-3">
                   {skill.inputs.length === 0 && (
                      <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                         No inputs defined. The agent won't collect specific data.
                      </div>
                   )}
                   {skill.inputs.map((input, idx) => (
                      <div key={input.id} className="p-4 bg-gray-50 border border-gray-200 rounded-xl flex gap-4 items-start group">
                         <div className="mt-1 text-gray-400 font-mono text-xs w-6">{idx + 1}.</div>
                         <div className="flex-1 grid grid-cols-2 gap-3">
                            <input 
                               type="text" value={input.label} placeholder="Field Label"
                               onChange={e => {
                                  const newInputs = [...skill.inputs];
                                  newInputs[idx].label = e.target.value;
                                  onUpdate({ inputs: newInputs });
                               }}
                               className="px-3 py-1.5 bg-white text-gray-900 border border-gray-300 rounded text-sm"
                            />
                            <select 
                               value={input.type}
                               onChange={e => {
                                  const newInputs = [...skill.inputs];
                                  newInputs[idx].type = e.target.value as any;
                                  onUpdate({ inputs: newInputs });
                               }}
                               className="px-3 py-1.5 bg-white text-gray-900 border border-gray-300 rounded text-sm"
                            >
                               <option value="text">Text</option>
                               <option value="number">Number</option>
                               <option value="date">Date</option>
                               <option value="phone">Phone Number</option>
                            </select>
                            <div className="col-span-2 flex items-center gap-4 text-xs text-gray-600">
                               <label className="flex items-center gap-2">
                                  <input 
                                    type="checkbox" checked={input.required} 
                                    onChange={e => {
                                        const newInputs = [...skill.inputs];
                                        newInputs[idx].required = e.target.checked;
                                        onUpdate({ inputs: newInputs });
                                    }}
                                  />
                                  Required
                               </label>
                               <span className="text-gray-400 font-mono">ID: {input.id}</span>
                            </div>
                         </div>
                         <button 
                           onClick={() => onUpdate({ inputs: skill.inputs.filter((_, i) => i !== idx) })}
                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition opacity-0 group-hover:opacity-100"
                         >
                            <Trash2 size={16} />
                         </button>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {/* TAB 4: TOOLS */}
          {tab === 'tools' && (
             <div className="max-w-3xl space-y-8 animate-in fade-in duration-300">
                {/* SMS Tool */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                   <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <MessageSquare size={18} className="text-gray-600" />
                         <span className="font-bold text-gray-900">SMS / Text Capability</span>
                      </div>
                      <div className="relative inline-block w-10 align-middle select-none">
                         <input type="checkbox" checked={skill.tools.sms.enabled} onChange={() => onUpdate({ tools: { ...skill.tools, sms: { ...skill.tools.sms, enabled: !skill.tools.sms.enabled } } })} className="absolute block w-5 h-5 rounded-full bg-white border-2 border-gray-300 appearance-none cursor-pointer checked:right-0 checked:bg-primary-500 checked:border-primary-500" style={{ right: skill.tools.sms.enabled ? '0' : 'auto', left: skill.tools.sms.enabled ? 'auto' : '0' }}/>
                      </div>
                   </div>
                   {skill.tools.sms.enabled && (
                      <div className="p-4 space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trigger Keywords (Comma separated)</label>
                            <input 
                               type="text" 
                               value={skill.tools.sms.triggerKeywords.join(', ')}
                               onChange={e => onUpdate({ tools: { ...skill.tools, sms: { ...skill.tools.sms, triggerKeywords: e.target.value.split(',').map(s => s.trim()) } } })}
                               className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm"
                               placeholder="e.g. book, schedule, refill"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Response Template</label>
                            <textarea 
                               value={skill.tools.sms.template}
                               onChange={e => onUpdate({ tools: { ...skill.tools, sms: { ...skill.tools.sms, template: e.target.value } } })}
                               className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm font-mono"
                               placeholder="Use {{link}} for dynamic URLs"
                            />
                         </div>
                      </div>
                   )}
                </div>

                {/* IVR Tool */}
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                   <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <Hash size={18} className="text-gray-600" />
                         <span className="font-bold text-gray-900">IVR / Phone Menu</span>
                      </div>
                      <input type="checkbox" checked={skill.tools.ivr.enabled} onChange={() => onUpdate({ tools: { ...skill.tools, ivr: { ...skill.tools.ivr, enabled: !skill.tools.ivr.enabled } } })} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                   </div>
                   {skill.tools.ivr.enabled && (
                      <div className="p-4 grid grid-cols-3 gap-4">
                         <div className="col-span-1">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trigger Digit (DTMF)</label>
                            <input 
                               type="text" maxLength={1}
                               value={skill.tools.ivr.triggerDigit}
                               onChange={e => onUpdate({ tools: { ...skill.tools, ivr: { ...skill.tools.ivr, triggerDigit: e.target.value } } })}
                               className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-center font-bold text-lg"
                               placeholder="#"
                            />
                         </div>
                         <div className="col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Voice Prompt</label>
                            <input 
                               type="text"
                               value={skill.tools.ivr.voicePrompt}
                               onChange={e => onUpdate({ tools: { ...skill.tools, ivr: { ...skill.tools.ivr, voicePrompt: e.target.value } } })}
                               className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm"
                               placeholder="e.g. For scheduling, press 1."
                            />
                         </div>
                      </div>
                   )}
                </div>

                {/* Transfer Tool */}
                 <div className="border border-gray-200 rounded-xl overflow-hidden">
                   <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                         <PhoneForwarded size={18} className="text-gray-600" />
                         <span className="font-bold text-gray-900">Call Transfer</span>
                      </div>
                      <input type="checkbox" checked={skill.tools.transfer.enabled} onChange={() => onUpdate({ tools: { ...skill.tools, transfer: { ...skill.tools.transfer, enabled: !skill.tools.transfer.enabled } } })} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                   </div>
                   {skill.tools.transfer.enabled && (
                      <div className="p-4 space-y-4">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Phone Number</label>
                            <input 
                               type="text" 
                               value={skill.tools.transfer.targetNumber}
                               onChange={e => onUpdate({ tools: { ...skill.tools, transfer: { ...skill.tools.transfer, targetNumber: e.target.value } } })}
                               className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm"
                               placeholder="+1 (555) ..."
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Whisper Message (to Agent)</label>
                            <input 
                               type="text"
                               value={skill.tools.transfer.whisperMessage}
                               onChange={e => onUpdate({ tools: { ...skill.tools, transfer: { ...skill.tools.transfer, whisperMessage: e.target.value } } })}
                               className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm"
                               placeholder="e.g. Incoming transfer from AI..."
                            />
                         </div>
                      </div>
                   )}
                </div>
             </div>
          )}

          {/* TAB 5: INTEGRATIONS */}
          {tab === 'integrations' && (
             <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div className="p-4 bg-white border border-gray-200 rounded-xl flex items-start gap-4 shadow-sm">
                   <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl font-bold text-gray-400">
                      A
                   </div>
                   <div className="flex-1">
                      <h4 className="font-bold text-gray-900">Athenahealth EHR</h4>
                      <p className="text-xs text-gray-500 mb-3">Primary integration for schedules and patient records.</p>
                      
                      <div className="flex items-center gap-4 text-sm">
                         <label className="flex items-center gap-2">
                            <input 
                               type="radio" 
                               checked={skill.integration.provider === 'athena'} 
                               onChange={() => onUpdate({ integration: { ...skill.integration, provider: 'athena' } })}
                               className="text-primary-600 focus:ring-primary-500"
                            />
                            Use Athena
                         </label>
                         <label className="flex items-center gap-2">
                            <input 
                               type="radio" 
                               checked={skill.integration.provider === 'none'} 
                               onChange={() => onUpdate({ integration: { ...skill.integration, provider: 'none' } })}
                               className="text-primary-600 focus:ring-primary-500"
                            />
                            No Integration
                         </label>
                      </div>
                   </div>
                </div>

                {skill.integration.provider === 'athena' && (
                   <div className="space-y-4 border-l-2 border-primary-200 pl-4">
                      <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Auth Type</label>
                         <select 
                            value={skill.integration.authType}
                            onChange={e => onUpdate({ integration: { ...skill.integration, authType: e.target.value as any } })}
                            className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm"
                         >
                            <option value="oauth">OAuth 2.0 (Recommended)</option>
                            <option value="api_key">API Key (Legacy)</option>
                         </select>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg">
                         <h5 className="text-xs font-bold text-gray-500 uppercase mb-2">Mapped Endpoints</h5>
                         {skill.integration.endpoints.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">No specific endpoints configured.</p>
                         ) : (
                            <ul className="space-y-2">
                               {skill.integration.endpoints.map((ep, idx) => (
                                  <li key={idx} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-gray-200">
                                     <span className="font-mono text-xs bg-gray-100 px-1 rounded">{ep.method}</span>
                                     <span className="font-medium text-gray-700">{ep.name}</span>
                                     <span className="text-gray-400 text-xs truncate max-w-[150px]">{ep.url}</span>
                                  </li>
                               ))}
                            </ul>
                         )}
                      </div>
                   </div>
                )}
             </div>
          )}

          {/* TAB 6: LOGIC */}
          {tab === 'logic' && (
             <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Conversation Tone</label>
                   <select 
                      value={skill.logic.tone}
                      onChange={e => onUpdate({ logic: { ...skill.logic, tone: e.target.value } })}
                      className="w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg"
                   >
                      <option value="empathetic">Empathetic (Healthcare Default)</option>
                      <option value="efficient">Efficient & Direct</option>
                      <option value="casual">Casual & Friendly</option>
                   </select>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                   <div className="flex items-center gap-2 mb-2 text-orange-800">
                      <AlertTriangle size={16} />
                      <h4 className="font-bold text-sm">Escalation Rules</h4>
                   </div>
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Escalation Threshold</label>
                         <div className="flex items-center gap-2">
                             <input 
                               type="range" min="0.5" max="0.99" step="0.01"
                               value={skill.logic.escalationThreshold}
                               onChange={e => onUpdate({ logic: { ...skill.logic, escalationThreshold: parseFloat(e.target.value) } })}
                               className="flex-1 accent-orange-500 h-2 bg-orange-200 rounded-lg"
                             />
                             <span className="font-bold text-orange-900">{(skill.logic.escalationThreshold * 100).toFixed(0)}%</span>
                         </div>
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Urgent Keywords (Trigger immediate handoff)</label>
                         <input 
                            type="text" 
                            value={skill.logic.urgentKeywords.join(', ')}
                            onChange={e => onUpdate({ logic: { ...skill.logic, urgentKeywords: e.target.value.split(',').map(s => s.trim()) } })}
                            className="w-full px-3 py-2 bg-white text-gray-900 border border-orange-200 rounded-lg text-sm focus:ring-orange-500 focus:border-orange-500"
                            placeholder="pain, emergency, bleeding..."
                         />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fallback Action</label>
                         <select 
                            value={skill.logic.fallbackAction}
                            onChange={e => onUpdate({ logic: { ...skill.logic, fallbackAction: e.target.value as any } })}
                            className="w-full px-3 py-2 bg-white text-gray-900 border border-orange-200 rounded-lg text-sm"
                         >
                            <option value="transfer">Transfer to Human Agent</option>
                            <option value="message">Take a Message / VM</option>
                            <option value="hangup">Polite Hangup</option>
                         </select>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {/* TAB 7: COMPLIANCE */}
          {tab === 'compliance' && (
             <div className="max-w-2xl space-y-6 animate-in fade-in duration-300">
                <div className="space-y-2">
                   <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div>
                         <h4 className="font-bold text-gray-900 flex items-center gap-2"><Lock size={16} /> HIPAA Compliance Mode</h4>
                         <p className="text-xs text-gray-500">Auto-redact PHI and enforce strict logging.</p>
                      </div>
                      <input type="checkbox" checked={skill.compliance.hipaa} onChange={() => onUpdate({ compliance: { ...skill.compliance, hipaa: !skill.compliance.hipaa } })} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                   </div>
                   
                   <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div>
                         <h4 className="font-bold text-gray-900 flex items-center gap-2"><Mic size={16} /> Call Recording</h4>
                         <p className="text-xs text-gray-500">Record conversations for quality assurance.</p>
                      </div>
                      <input type="checkbox" checked={skill.compliance.recording} onChange={() => onUpdate({ compliance: { ...skill.compliance, recording: !skill.compliance.recording } })} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                   </div>

                   <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg">
                      <div>
                         <h4 className="font-bold text-gray-900 flex items-center gap-2"><Shield size={16} /> Require Consent</h4>
                         <p className="text-xs text-gray-500">Ask for explicit permission before processing info.</p>
                      </div>
                      <input type="checkbox" checked={skill.compliance.consentRequired} onChange={() => onUpdate({ compliance: { ...skill.compliance, consentRequired: !skill.compliance.consentRequired } })} className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500" />
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Legal Disclosures (Played at start)</label>
                   {skill.compliance.disclosures.map((disc, idx) => (
                      <div key={idx} className="flex gap-2 mb-2">
                         <input 
                            type="text" 
                            value={disc}
                            onChange={e => {
                               const newD = [...skill.compliance.disclosures];
                               newD[idx] = e.target.value;
                               onUpdate({ compliance: { ...skill.compliance, disclosures: newD } });
                            }}
                            className="flex-1 px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg text-sm"
                         />
                         <button 
                            onClick={() => {
                               const newD = skill.compliance.disclosures.filter((_, i) => i !== idx);
                               onUpdate({ compliance: { ...skill.compliance, disclosures: newD } });
                            }}
                            className="text-gray-400 hover:text-red-500"
                         >
                            <X size={16} />
                         </button>
                      </div>
                   ))}
                   <button 
                     onClick={() => onUpdate({ compliance: { ...skill.compliance, disclosures: [...skill.compliance.disclosures, ""] } })}
                     className="text-xs font-bold text-primary-700 hover:underline flex items-center gap-1 mt-1"
                   >
                      <Plus size={12} /> Add Disclosure
                   </button>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
