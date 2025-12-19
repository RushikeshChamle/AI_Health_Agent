
import React, { useState, useEffect, useRef } from 'react';
import { AppState } from '../types';
import { initializeChat, sendMessage } from '../services/geminiService';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';

interface SimulatorProps {
  onClose: () => void;
  appState: AppState;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const Simulator: React.FC<SimulatorProps> = ({ onClose, appState }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Hi, I'm ${appState.name}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeChat(appState);
  }, [appState]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    const response = await sendMessage(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-40 flex flex-col border-l border-gray-200 transform transition-transform duration-300">
      {/* Header */}
      <div className="h-16 border-b border-primary-200 flex items-center justify-between px-6 bg-primary-50">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-gray-800">Live Simulator</h3>
         </div>
         <button onClick={onClose} className="p-2 hover:bg-primary-100 rounded-full text-gray-500 transition">
            <X size={20} />
         </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50" ref={scrollRef}>
         {messages.map((msg, idx) => (
           <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-gray-200' : 'bg-primary-100 text-black'}`}>
                 {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm max-w-[80%] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-black text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                 {msg.text}
              </div>
           </div>
         ))}
         {isLoading && (
            <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-primary-100 text-black flex items-center justify-center shrink-0">
                  <Bot size={16} />
               </div>
               <div className="px-4 py-3 bg-white rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-gray-400" />
                  <span className="text-xs text-gray-400 font-medium">Thinking...</span>
               </div>
            </div>
         )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white">
         <div className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message as a patient..."
              className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 p-2 bg-primary hover:bg-primary-400 text-black rounded-lg disabled:opacity-50 transition"
            >
               <Send size={16} />
            </button>
         </div>
         <div className="text-center mt-2">
            <p className="text-xs text-gray-400">Preview Mode • {appState.settings.tone}</p>
         </div>
      </div>
    </div>
  );
};
