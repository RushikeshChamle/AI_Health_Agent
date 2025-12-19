
import React, { useState } from 'react';
import { X, Check, ArrowRight, Heart, Briefcase, Coffee, Smartphone, Phone } from 'lucide-react';

interface WizardProps {
  onClose: () => void;
  onComplete: (config: any) => void;
}

export const SetupWizard: React.FC<WizardProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState({
    name: 'Front Desk Assistant',
    clinicName: '',
    template: 'healthcare_standard', // Story 1.1: Template Selection
    channels: { sms: true, voice: true },
    tone: 'Empathetic & Professional',
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(config);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
           <div>
              <h2 className="text-xl font-bold text-gray-900">AI Agent Setup</h2>
              <div className="flex gap-2 mt-2">
                 {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${step >= i ? 'bg-brand-600' : 'bg-gray-200'}`} />
                 ))}
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20} /></button>
        </div>

        {/* Content */}
        <div className="p-8 flex-1 overflow-y-auto">
          
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-semibold text-gray-800">First, tell us about your practice.</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
                <input 
                  type="text" 
                  value={config.clinicName}
                  onChange={e => setConfig({...config, clinicName: e.target.value})}
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none text-lg"
                  placeholder="e.g. Downtown Pain Management"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name (Internal)</label>
                <input 
                  type="text" 
                  value={config.name}
                  onChange={e => setConfig({...config, name: e.target.value})}
                  className="w-full px-4 py-3 bg-white text-gray-900 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g. Front Desk Assistant"
                />
              </div>
            </div>
          )}

          {/* STEP 2: TEMPLATE (Story 1.1) */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-semibold text-gray-800">Select a Capability Template</h3>
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setConfig({...config, template: 'healthcare_standard'})}
                  className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md flex items-start gap-4 ${config.template === 'healthcare_standard' ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}
                >
                   <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                      <Briefcase size={24} />
                   </div>
                   <div>
                      <div className="font-bold text-gray-900 text-lg">Full Front Desk</div>
                      <p className="text-sm text-gray-600 mt-1">Includes <b>Scheduling</b> (Athena), <b>Rx Refills</b> (IVR), and <b>Triage</b>. Best for established clinics.</p>
                      <div className="mt-2 flex gap-2">
                         <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">HIPAA Ready</span>
                         <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">Athena Integrated</span>
                      </div>
                   </div>
                </button>
                <button 
                  onClick={() => setConfig({...config, template: 'afterhours'})}
                  className={`p-5 rounded-xl border-2 text-left transition-all hover:shadow-md flex items-start gap-4 ${config.template === 'afterhours' ? 'border-brand-500 bg-brand-50' : 'border-gray-200'}`}
                >
                   <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                      <Coffee size={24} />
                   </div>
                   <div>
                      <div className="font-bold text-gray-900 text-lg">After-Hours Triage</div>
                      <p className="text-sm text-gray-600 mt-1">Active 6pm-8am. Escalates urgent keywords (pain, bleeding) to on-call staff via SMS.</p>
                   </div>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CHANNELS & TONE */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-2xl font-semibold text-gray-800">Channels & Personality</h3>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                 <label className="block text-sm font-bold text-gray-900 mb-3">Communication Channels</label>
                 <div className="flex gap-4">
                    <label className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${config.channels.sms ? 'border-brand-500 bg-white shadow-sm' : 'border-gray-200'}`}>
                       <input type="checkbox" checked={config.channels.sms} onChange={e => setConfig({...config, channels: {...config.channels, sms: e.target.checked}})} className="w-5 h-5 text-brand-600" />
                       <Smartphone size={20} className="text-gray-500" />
                       <span className="font-medium text-gray-700">SMS / Text</span>
                    </label>
                    <label className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${config.channels.voice ? 'border-brand-500 bg-white shadow-sm' : 'border-gray-200'}`}>
                       <input type="checkbox" checked={config.channels.voice} onChange={e => setConfig({...config, channels: {...config.channels, voice: e.target.checked}})} className="w-5 h-5 text-brand-600" />
                       <Phone size={20} className="text-gray-500" />
                       <span className="font-medium text-gray-700">Voice / IVR</span>
                    </label>
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Agent Tone</label>
                <div className="grid grid-cols-1 gap-3">
                   {['Empathetic & Professional', 'Direct & Clinical', 'Warm & Casual'].map(tone => (
                     <label key={tone} className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${config.tone === tone ? 'border-brand-500 ring-1 ring-brand-500 bg-brand-50' : 'border-gray-200'}`}>
                        <input 
                          type="radio" 
                          name="tone" 
                          checked={config.tone === tone}
                          onChange={() => setConfig({...config, tone})}
                          className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm font-medium text-gray-800">{tone}</span>
                     </label>
                   ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: DEPLOY */}
          {step === 4 && (
             <div className="text-center space-y-6 py-8 animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                   <Check size={48} strokeWidth={4} />
                </div>
                <div>
                   <h3 className="text-3xl font-bold text-gray-900">Ready to Launch!</h3>
                   <p className="text-gray-500 mt-2">Your agent is configured and ready to handle patients.</p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 max-w-sm mx-auto text-left space-y-2 border border-gray-100">
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Template:</span>
                      <span className="font-medium text-gray-900">Full Front Desk</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Skills:</span>
                      <span className="font-medium text-gray-900">Refill, Schedule, Triage</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Integration:</span>
                      <span className="font-medium text-green-600 flex items-center gap-1"><Check size={12} /> Athenahealth</span>
                   </div>
                </div>
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
           {step > 1 && (
             <button 
               onClick={() => setStep(step - 1)}
               className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition"
             >
               Back
             </button>
           )}
           <button 
             onClick={handleNext}
             className="px-8 py-2 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg shadow-md transition-all active:scale-95 flex items-center gap-2"
           >
             {step === 4 ? 'Deploy Agent' : 'Next Step'}
             {step < 4 && <ArrowRight size={16} />}
           </button>
        </div>
      </div>
    </div>
  );
};
