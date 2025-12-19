
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import { 
  Play, Wand2, DollarSign, Clock, TrendingUp, AlertTriangle, 
  ArrowUpRight, ArrowDownRight, Activity, Users, PhoneMissed, 
  CheckCircle2, Zap, MessageSquare, Calendar
} from 'lucide-react';
import { AppState } from '../types';

interface DashboardProps {
  stats: AppState['stats'];
  onQuickAction: (action: string) => void;
}

// --- Mock Data for Elite Metrics ---

const HOURLY_TRAFFIC = [
  { time: '8 AM', inbound: 12, resolved: 10, escalated: 2 },
  { time: '10 AM', inbound: 45, resolved: 38, escalated: 7 },
  { time: '12 PM', inbound: 32, resolved: 28, escalated: 4 },
  { time: '2 PM', inbound: 55, resolved: 48, escalated: 7 },
  { time: '4 PM', inbound: 28, resolved: 25, escalated: 3 },
  { time: '6 PM', inbound: 15, resolved: 14, escalated: 1 }, // After hours start
  { time: '8 PM', inbound: 8, resolved: 8, escalated: 0 },
];

const INTENT_DATA = [
  { name: 'Scheduling', value: 45, color: '#FCD34D' }, // Primary
  { name: 'Rx Refills', value: 30, color: '#F59E0B' }, // Primary-600
  { name: 'Triage/Symptoms', value: 10, color: '#EF4444' }, // Red
  { name: 'General FAQ', value: 15, color: '#9CA3AF' }, // Gray
];

const INSIGHTS = [
  { 
    id: 1, 
    type: 'opportunity', 
    text: 'Monday mornings see a 40% spike in Refill requests. Consider enabling "Auto-Approve" for non-controlled substances to reduce queue times.',
    icon: Zap
  },
  { 
    id: 2, 
    type: 'success', 
    text: 'After-hours capture rate is 98%. You saved roughly 14 bookings (~$2,800) last night alone.',
    icon: CheckCircle2
  },
  { 
    id: 3, 
    type: 'alert', 
    text: 'Triage escalation is slightly high (12%) for "Back Pain". Review your escalation thresholds in the Builder.',
    icon: AlertTriangle
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ stats, onQuickAction }) => {
  // Safe extraction of last value
  const currentRevenue = stats.missedRevenue[stats.missedRevenue.length - 1] || 0;
  const previousRevenue = stats.missedRevenue[stats.missedRevenue.length - 2] || 0;
  const revenueGrowth = ((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Practice Overview</h2>
          <p className="text-gray-500 text-sm">Real-time insights for {new Date().toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm text-sm text-gray-600">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              System Operational
           </div>
           <button 
             onClick={() => onQuickAction('simulator')}
             className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition shadow-lg shadow-gray-200/50"
           >
             <Play size={16} fill="currentColor" /> Test Agent
           </button>
        </div>
      </div>

      {/* Alert Banner (Conditional) */}
      {!stats.setupComplete && (
        <div className="bg-gradient-to-r from-yellow-50 to-white border border-yellow-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-700">
               <Wand2 size={24} />
            </div>
            <div>
              <p className="font-bold text-gray-900">Setup Incomplete: Revenue Risk Detected</p>
              <p className="text-sm text-gray-600">Complete the wizard to activate automated scheduling and stop losing ~$200/day.</p>
            </div>
          </div>
          <button 
             onClick={() => onQuickAction('wizard')}
             className="px-5 py-2 bg-yellow-400 text-black rounded-lg text-sm font-bold hover:bg-yellow-500 transition shadow-sm"
          >
             Finish Setup
          </button>
        </div>
      )}

      {/* KPI Grid - The "Elite" Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Revenue Impact */}
        <MetricCard 
          title="Revenue Captured" 
          value={`$${(18400).toLocaleString()}`} 
          trend="+15% vs last mo" 
          trendUp={true}
          icon={DollarSign}
          color="green"
        />
        
        {/* 2. Operational Volume */}
        <MetricCard 
          title="Inquiries Handled" 
          value="1,248" 
          subtext="88% Resolved by AI"
          trend="+8% volume" 
          trendUp={true}
          icon={MessageSquare}
          color="blue"
        />

        {/* 3. Cost Savings */}
        <MetricCard 
          title="Staff Time Saved" 
          value="32 hrs" 
          subtext="~0.8 FTE this week"
          trend="Trending Up" 
          trendUp={true}
          icon={Clock}
          color="purple"
        />

        {/* 4. Escalation Health (Inverse Metric) */}
        <MetricCard 
          title="Escalation Rate" 
          value="12%" 
          subtext="Target: <15%"
          trend="-2% vs last wk" 
          trendUp={true} // Good because it went down
          icon={PhoneMissed}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Traffic Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Inquiry Volume & Resolution</h3>
                <p className="text-sm text-gray-400">Hourly traffic breakdown (Today)</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                 <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary-400"></span> Resolved
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gray-200"></span> Escalated
                 </div>
              </div>
           </div>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={HOURLY_TRAFFIC} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#FCD34D" stopOpacity={0.8}/>
                     <stop offset="95%" stopColor="#FCD34D" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                 <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#9ca3af'}} />
                 <YAxis fontSize={12} tickLine={false} axisLine={false} tick={{fill: '#9ca3af'}} />
                 <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    labelStyle={{color: '#374151', fontWeight: 'bold'}}
                 />
                 <Area type="monotone" dataKey="inbound" stroke="none" fill="transparent" /> {/* Invisible max line for scaling if needed */}
                 <Area type="monotone" dataKey="resolved" stackId="1" stroke="#F59E0B" fill="url(#colorResolved)" name="AI Resolved" />
                 <Area type="monotone" dataKey="escalated" stackId="1" stroke="#E5E7EB" fill="#F3F4F6" name="Escalated to Human" />
               </AreaChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Intent Breakdown (1/3 width) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
           <div className="mb-4">
              <h3 className="font-bold text-gray-900 text-lg">Patient Intent</h3>
              <p className="text-sm text-gray-400">Why are people calling?</p>
           </div>
           <div className="flex-1 min-h-[200px] relative">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={INTENT_DATA}
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {INTENT_DATA.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip />
               </PieChart>
             </ResponsiveContainer>
             {/* Center Text */}
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-gray-900">1.2k</span>
                <span className="text-xs text-gray-400 font-medium uppercase">Total</span>
             </div>
           </div>
           <div className="mt-4 space-y-3">
              {INTENT_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-600">{item.name}</span>
                   </div>
                   <span className="font-bold text-gray-900">{item.value}%</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Operational Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Text Insights */}
         <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <div className="flex items-center gap-2">
                  <Zap size={18} className="text-yellow-600" />
                  <h3 className="font-bold text-gray-900">Operational Insights</h3>
               </div>
               <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">AI Generated</span>
            </div>
            <div className="p-0">
               {INSIGHTS.map((insight, idx) => (
                  <div key={insight.id} className={`p-5 flex gap-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition ${
                     idx === 0 ? 'bg-yellow-50/30' : ''
                  }`}>
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                        insight.type === 'opportunity' ? 'bg-blue-100 text-blue-600' :
                        insight.type === 'success' ? 'bg-green-100 text-green-600' :
                        'bg-red-100 text-red-600'
                     }`}>
                        <insight.icon size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">
                           {insight.type === 'opportunity' ? 'Optimization Opportunity' :
                            insight.type === 'success' ? 'Performance Highlight' : 'Attention Required'}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                           {insight.text}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
         
         {/* Quick Actions / Recents */}
         <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 text-white p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 opacity-5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            
            <div>
               <h3 className="text-xl font-bold mb-1">Ready to optimize?</h3>
               <p className="text-gray-400 text-sm mb-6">Your agent is handling 88% of calls. Improve the remaining 12% by tuning the Knowledge Base.</p>
               
               <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer">
                     <div className="w-8 h-8 rounded bg-primary-500 text-black flex items-center justify-center font-bold">KB</div>
                     <div>
                        <div className="font-bold text-sm">Update Knowledge Base</div>
                        <div className="text-xs text-gray-400">Add seasonal flu shot info</div>
                     </div>
                     <ArrowUpRight size={16} className="ml-auto text-gray-500" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition cursor-pointer">
                     <div className="w-8 h-8 rounded bg-blue-500 text-white flex items-center justify-center font-bold">
                        <Activity size={16} />
                     </div>
                     <div>
                        <div className="font-bold text-sm">Review Escalations</div>
                        <div className="text-xs text-gray-400">3 calls flagged for review</div>
                     </div>
                     <ArrowUpRight size={16} className="ml-auto text-gray-500" />
                  </div>
               </div>
            </div>

            <button 
               onClick={() => onQuickAction('builder')}
               className="mt-6 w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition"
            >
               Go to Agent Studio
            </button>
         </div>
      </div>

    </div>
  );
};

// --- Sub-components for Cleaner Code ---

const MetricCard = ({ title, value, subtext, trend, trendUp, icon: Icon, color }: any) => {
   const colors = {
      green: 'text-green-600 bg-green-50',
      blue: 'text-blue-600 bg-blue-50',
      purple: 'text-purple-600 bg-purple-50',
      orange: 'text-orange-600 bg-orange-50',
   };

   return (
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
         <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${(colors as any)[color]}`}>
               <Icon size={20} />
            </div>
            <div className={`flex items-center gap-1 text-xs font-bold ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
               {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
               {trend}
            </div>
         </div>
         <div>
            <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
            <div className="flex items-baseline gap-2 mt-1">
               <span className="text-2xl font-bold text-gray-900">{value}</span>
            </div>
            {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
         </div>
      </div>
   );
}
