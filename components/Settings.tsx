
import React from 'react';
import { AgentSettings } from '../types';
import { ShieldCheck, Stethoscope, AlertTriangle, Link as LinkIcon, Lock } from 'lucide-react';

interface SettingsProps {
  settings: AgentSettings;
  onUpdate: (settings: Partial<AgentSettings>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ settings, onUpdate }) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
       <div>
           <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
           <p className="text-gray-500 text-sm mt-1">Configure integrations, compliance, and behavior rules.</p>
       </div>

       {/* Clinic Profile */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Stethoscope size={18} className="text-yellow-600" />
            <h3 className="font-semibold text-gray-800">Clinic Profile</h3>
          </div>
          <div className="p-6 space-y-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                <input 
                  type="text" 
                  value={settings.clinicName}
                  onChange={e => onUpdate({ clinicName: e.target.value })}
                  className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Persona/Tone</label>
                <select 
                  value={settings.tone}
                  onChange={e => onUpdate({ tone: e.target.value })}
                  className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option>Empathetic & Professional</option>
                  <option>Direct & Efficient</option>
                  <option>Warm & Casual</option>
                </select>
             </div>
          </div>
       </div>

       {/* Integrations */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <LinkIcon size={18} className="text-yellow-600" />
            <h3 className="font-semibold text-gray-800">Integrations</h3>
          </div>
          <div className="p-6">
             <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-4">
                   <img src="https://picsum.photos/40/40?grayscale" alt="Athena" className="w-10 h-10 rounded-full bg-gray-100" />
                   <div>
                      <h4 className="font-bold text-gray-900">Athenahealth EHR</h4>
                      <p className="text-sm text-gray-500">Read schedule, write refills (Scope: v2.api)</p>
                   </div>
                </div>
                <button 
                  onClick={() => onUpdate({ athenaConnected: !settings.athenaConnected })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    settings.athenaConnected 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {settings.athenaConnected ? 'Connected' : 'Connect OAuth'}
                </button>
             </div>
          </div>
       </div>

       {/* Rules */}
       <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <ShieldCheck size={18} className="text-yellow-600" />
            <h3 className="font-semibold text-gray-800">Safety & Compliance</h3>
          </div>
          <div className="p-6 space-y-6">
             <div className="flex items-center justify-between">
                <div>
                   <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <Lock size={16} className="text-gray-400" /> HIPAA Compliance Mode
                   </h4>
                   <p className="text-sm text-gray-500">Auto-redact PHI in logs and require patient consent.</p>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                   <input 
                      type="checkbox" 
                      name="toggle" 
                      id="hipaa-toggle" 
                      checked={settings.hipaaEnabled}
                      onChange={() => onUpdate({ hipaaEnabled: !settings.hipaaEnabled })}
                      className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-primary-200 checked:right-0 checked:border-primary-500"
                      style={{ right: settings.hipaaEnabled ? '0' : 'auto', left: settings.hipaaEnabled ? 'auto' : '0' }}
                   />
                   <label htmlFor="hipaa-toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.hipaaEnabled ? 'bg-primary' : 'bg-gray-300'}`}></label>
                </div>
             </div>
             
             <div className="border-t border-gray-100 pt-6">
                 <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                       <AlertTriangle size={16} className="text-orange-500" /> Escalation Threshold
                    </h4>
                    <span className="text-sm font-bold bg-orange-100 text-orange-800 px-2 py-1 rounded">{(settings.escalationThreshold * 100).toFixed(0)}%</span>
                 </div>
                 <p className="text-sm text-gray-500 mb-4">If AI confidence is below this score, instantly route to human staff.</p>
                 <input 
                    type="range" 
                    min="0.5" 
                    max="0.99" 
                    step="0.01" 
                    value={settings.escalationThreshold} 
                    onChange={e => onUpdate({ escalationThreshold: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                 />
                 <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Aggressive (50%)</span>
                    <span>Conservative (99%)</span>
                 </div>
             </div>
          </div>
       </div>
    </div>
  );
};
