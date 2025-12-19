
import React, { useState } from 'react';
import { View } from '../types';
import { 
  LayoutDashboard, Workflow, Book, Settings, Zap, PhoneIncoming, 
  ChevronDown, ExternalLink, Grid, Phone, Voicemail, Users, 
  FileText, Bot, ChevronRight, PenLine, PhoneCall, PieChart
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onViewChange: (view: View) => void;
}

// Shadcn-like Button Component
const Button = ({ className, children, variant = 'default', ...props }: any) => {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
  };
  return (
    <button className={`${base} ${variants[variant as keyof typeof variants]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const [isAiAgentExpanded, setIsAiAgentExpanded] = useState(true);

  const handleNavClick = (view: View) => {
    onViewChange(view);
  };

  return (
    <div className="flex w-full h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* --- SIDEBAR --- */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20">
        
        {/* Branding & Profile */}
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
             {/* Logo Placeholder */}
             <div className="w-8 h-8 grid grid-cols-2 gap-0.5 shrink-0">
               <div className="bg-gray-900 rounded-sm"></div>
               <div className="bg-primary rounded-sm"></div>
               <div className="bg-primary rounded-sm"></div>
               <div className="bg-gray-900 rounded-sm"></div>
             </div>
             <div>
                <h2 className="font-bold text-gray-900 leading-tight">Painsure Clinics</h2>
                <p className="text-xs text-gray-500">support@painsure.com</p>
                <div className="flex items-center gap-1 mt-1 text-xs font-medium text-gray-600 cursor-pointer hover:text-gray-900">
                   Profile Setting <ExternalLink size={10} />
                </div>
             </div>
          </div>

          {/* Status Dropdown */}
          <div className="relative">
             <button className="w-28 flex items-center justify-between px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm shadow-sm hover:bg-gray-50">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 <span>Online</span>
               </div>
               <ChevronDown size={14} className="text-gray-400" />
             </button>
          </div>

          {/* Location Dropdown */}
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">Location</label>
            <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm hover:bg-gray-50">
               <span>All Location</span>
               <ChevronDown size={14} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
           
           {/* Static Items (Mock) */}
           <NavItem icon={Grid} label="Scheduled Messages" />
           <NavItem icon={Phone} label="Calls" />
           <NavItem icon={Voicemail} label="Voice Mails" />
           <NavItem icon={Users} label="Contacts" />
           <NavItem icon={FileText} label="Forms" />

           {/* AI Agent Section (Expanded) */}
           <div className="pt-2">
              <button 
                onClick={() => setIsAiAgentExpanded(!isAiAgentExpanded)}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                 <div className="flex items-center gap-3">
                    <Bot size={20} />
                    <span className="text-sm font-medium">AI Agent</span>
                    <span className="bg-primary text-[10px] font-bold px-1.5 py-0.5 rounded text-black uppercase tracking-wide">New</span>
                 </div>
                 <ChevronRight size={16} className={`text-gray-400 transition-transform ${isAiAgentExpanded ? 'rotate-90' : ''}`} />
              </button>

              {isAiAgentExpanded && (
                 <div className="mt-1 space-y-1 relative">
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-gray-100"></div>
                    
                    {/* Overview */}
                    <button
                      onClick={() => handleNavClick('dashboard')}
                      className={`w-full flex items-center gap-3 px-3 pl-11 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === 'dashboard'
                          ? 'bg-yellow-50 text-gray-900 border-r-2 border-primary' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                       Overview
                    </button>

                    {/* Builder / Studio */}
                    <button
                      onClick={() => handleNavClick('builder')}
                      className={`w-full flex items-center gap-3 px-3 pl-11 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === 'builder' 
                          ? 'bg-yellow-50 text-gray-900 border-r-2 border-primary' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                       Agent Studio
                    </button>

                    {/* Activity */}
                    <button
                      onClick={() => handleNavClick('activity')}
                      className={`w-full flex items-center gap-3 px-3 pl-11 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === 'activity' 
                          ? 'bg-yellow-50 text-gray-900 border-r-2 border-primary' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                       Activity & Logs
                    </button>

                    {/* Knowledge Base */}
                    <button
                      onClick={() => handleNavClick('kb')}
                      className={`w-full flex items-center gap-3 px-3 pl-11 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === 'kb' 
                          ? 'bg-yellow-50 text-gray-900 border-r-2 border-primary' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                       Knowledge Base
                    </button>
                    
                    {/* Settings */}
                    <button
                      onClick={() => handleNavClick('settings')}
                      className={`w-full flex items-center gap-3 px-3 pl-11 py-2 text-sm font-medium rounded-md transition-colors ${
                        currentView === 'settings' 
                          ? 'bg-yellow-50 text-gray-900 border-r-2 border-primary' 
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                       Settings
                    </button>
                 </div>
              )}
           </div>

        </nav>
      </div>

      {/* --- MAIN AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-primary flex items-center justify-between px-6 shadow-sm z-10 border-b border-primary-500">
           {/* Left side of header (Breadcrumb or Title) */}
           <div className="flex items-center gap-4">
              <h1 className="text-lg font-bold text-gray-900/80">
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'builder' && 'Agent Studio'}
                {currentView === 'activity' && 'Activity Logs'}
                {currentView === 'kb' && 'Knowledge Base'}
                {currentView === 'settings' && 'Global Settings'}
              </h1>
           </div>

           {/* Right Actions */}
           <div className="flex items-center gap-3">
              <Button className="h-9 px-4 gap-2 border-transparent bg-white/90 hover:bg-white text-gray-900 font-bold rounded-full shadow-sm hover:shadow">
                 <PhoneCall size={14} /> CALL
              </Button>
              <Button className="h-9 px-4 gap-2 border-transparent bg-white/90 hover:bg-white text-gray-900 font-bold rounded-full shadow-sm hover:shadow">
                 <PenLine size={14} /> SEND
              </Button>
              
              <div className="ml-2 flex items-center gap-1 text-sm font-medium text-gray-800 cursor-pointer hover:opacity-80">
                 Account <ChevronDown size={14} />
              </div>
           </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-white p-8">
           {children}
        </main>
      </div>
    </div>
  );
};

// Helper for static nav items
const NavItem = ({ icon: Icon, label, isActive, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors group ${
      isActive ? 'bg-yellow-50 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={20} className={isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-900'} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);
