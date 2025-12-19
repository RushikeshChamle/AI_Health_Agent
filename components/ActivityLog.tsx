
import React, { useState } from 'react';
import { CallLog } from '../types';
import { 
  Phone, MessageSquare, AlertTriangle, CheckCircle2, Clock, 
  Calendar, Pill, User, ArrowRight, Play, Download, Search, Filter, Zap,
  DollarSign, Shield
} from 'lucide-react';

interface ActivityLogProps {
  logs: CallLog[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  const [selectedLog, setSelectedLog] = useState<CallLog | null>(null);
  const [filter, setFilter] = useState<'all' | 'escalated' | 'voice' | 'sms'>('all');

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    if (filter === 'escalated') return log.status === 'escalated';
    return log.type === filter;
  });

  const getStatusColor = (status: CallLog['status']) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'escalated': return 'bg-red-100 text-red-700';
      case 'action_required': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getIntentIcon = (intent: CallLog['intent']) => {
    switch (intent) {
      case 'refill': return <Pill size={16} />;
      case 'scheduling': return <Calendar size={16} />;
      case 'triage': return <AlertTriangle size={16} />;
      case 'billing': return <DollarSign size={16} />;
      case 'insurance': return <Shield size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6">
      {/* Left List Panel */}
      <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
           <div className="relative mb-3">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input 
               type="text" 
               placeholder="Search by name or number..."
               className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-500"
             />
           </div>
           <div className="flex gap-2">
             {['all', 'escalated', 'voice', 'sms'].map((f) => (
               <button 
                 key={f}
                 onClick={() => setFilter(f as any)}
                 className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-colors ${
                   filter === f 
                     ? 'bg-brand-100 text-brand-700 border border-brand-200' 
                     : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                 }`}
               >
                 {f}
               </button>
             ))}
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredLogs.map(log => (
            <div 
              key={log.id}
              onClick={() => setSelectedLog(log)}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedLog?.id === log.id ? 'bg-brand-50 border-l-4 border-l-brand-500' : 'border-l-4 border-l-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                 <h4 className={`font-semibold text-sm ${log.status === 'escalated' ? 'text-red-600' : 'text-gray-900'}`}>
                   {log.patientName}
                 </h4>
                 <span className="text-xs text-gray-400">{log.timestamp.split(',')[1]}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                 {log.type === 'voice' ? <Phone size={12} className="text-gray-400"/> : <MessageSquare size={12} className="text-gray-400"/>}
                 <span className="text-xs text-gray-500">{log.phoneNumber}</span>
              </div>
              <div className="flex gap-2">
                 <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border ${getStatusColor(log.status)} bg-opacity-50 border-opacity-20`}>
                   {log.status.replace('_', ' ')}
                 </span>
                 <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wide">
                   {getIntentIcon(log.intent)} {log.intent}
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Detail Panel */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        {selectedLog ? (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50">
               <div>
                  <div className="flex items-center gap-3 mb-1">
                     <h2 className="text-xl font-bold text-gray-900">{selectedLog.patientName}</h2>
                     {selectedLog.status === 'escalated' && (
                       <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border border-red-200">
                         <AlertTriangle size={12} /> ESCALATED
                       </span>
                     )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                     <span className="flex items-center gap-1"><Phone size={14} /> {selectedLog.phoneNumber}</span>
                     <span className="flex items-center gap-1"><Clock size={14} /> {selectedLog.timestamp}</span>
                     {selectedLog.duration && <span className="text-gray-400">Duration: {selectedLog.duration}</span>}
                  </div>
               </div>
               <div className="flex gap-2">
                  <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                     <Download size={16} /> Export
                  </button>
                  <button className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
                     Open in Athena <ExternalLinkIcon size={16} />
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex gap-6">
               {/* Transcript Column */}
               <div className="flex-1 space-y-6">
                  {/* Extracted Data Card */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                     <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Zap size={14} /> AI Extracted Data
                     </h3>
                     <div className="grid grid-cols-2 gap-4">
                        {Object.entries(selectedLog.extractedData).map(([key, value]) => (
                           <div key={key}>
                              <p className="text-xs text-blue-500 uppercase">{key.replace(/([A-Z])/g, ' $1')}</p>
                              <p className="text-sm font-medium text-gray-900">{value}</p>
                           </div>
                        ))}
                     </div>
                  </div>

                  {/* Audio Player if voice */}
                  {selectedLog.type === 'voice' && (
                     <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-3">
                        <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-700 hover:text-brand-600">
                           <Play size={14} fill="currentColor" />
                        </button>
                        <div className="h-1 flex-1 bg-gray-300 rounded-full overflow-hidden">
                           <div className="w-1/3 h-full bg-brand-500"></div>
                        </div>
                        <span className="text-xs text-gray-500 font-mono">00:24 / {selectedLog.duration}</span>
                     </div>
                  )}

                  {/* Transcript */}
                  <div className="space-y-4">
                     <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">Transcript</h3>
                     {selectedLog.transcript.map((turn, idx) => (
                        <div key={idx} className={`flex gap-3 ${turn.role === 'user' ? '' : 'flex-row-reverse'}`}>
                           <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                             turn.role === 'user' ? 'bg-gray-200 text-gray-600' : 
                             turn.role === 'system' ? 'bg-orange-100 text-orange-600' : 'bg-brand-100 text-brand-600'
                           }`}>
                              {turn.role === 'user' ? <User size={14} /> : turn.role === 'system' ? <AlertTriangle size={14} /> : <Zap size={14} />}
                           </div>
                           <div className={`flex-1 space-y-1 ${turn.role !== 'user' ? 'text-right' : ''}`}>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                 <span className="font-medium text-gray-700 capitalize">{turn.role}</span>
                                 <span>{turn.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-800 leading-relaxed bg-gray-50 p-3 rounded-lg inline-block text-left">
                                 {turn.text}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare size={32} />
             </div>
             <p className="font-medium text-gray-600">Select a conversation to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ExternalLinkIcon = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);
