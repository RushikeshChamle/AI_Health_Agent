
import React, { useState } from 'react';
import { KBItem, KBDocument } from '../types';
import { Search, Plus, Trash2, Edit2, FileText, UploadCloud, File, FileSpreadsheet, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';

interface KBProps {
  kb: KBItem[];
  documents: KBDocument[];
  onUpdateKB: (kb: KBItem[]) => void;
  onUpdateDocuments: (docs: KBDocument[]) => void;
}

export const KnowledgeBase: React.FC<KBProps> = ({ kb, documents, onUpdateKB, onUpdateDocuments }) => {
  const [activeTab, setActiveTab] = useState<'qa' | 'docs'>('qa');
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // --- Q&A Logic ---
  const filteredKB = kb.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteKB = (id: string) => {
    onUpdateKB(kb.filter(item => item.id !== id));
  };

  // --- Document Logic ---
  const handleFileUpload = () => {
    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      const newDoc: KBDocument = {
        id: `doc-${Date.now()}`,
        name: `Uploaded_Policy_${new Date().toLocaleDateString().replace(/\//g,'-')}.pdf`,
        type: 'pdf',
        size: '1.2 MB',
        uploadDate: new Date().toLocaleDateString(),
        status: 'indexed'
      };
      onUpdateDocuments([...documents, newDoc]);
      setIsUploading(false);
    }, 1500);
  };

  const handleDeleteDoc = (id: string) => {
     onUpdateDocuments(documents.filter(d => d.id !== id));
  };

  const getFileIcon = (type: KBDocument['type']) => {
    switch (type) {
      case 'pdf': return <FileText className="text-red-500" size={20} />;
      case 'docx': return <FileText className="text-blue-500" size={20} />;
      case 'csv': return <FileSpreadsheet className="text-green-500" size={20} />;
      case 'url': return <LinkIcon className="text-gray-500" size={20} />;
      default: return <File className="text-gray-400" size={20} />;
    }
  };

  const getStatusBadge = (status: KBDocument['status']) => {
    if (status === 'indexed') return <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200"><CheckCircle2 size={10} /> Ready</span>;
    if (status === 'processing') return <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 animate-pulse">Processing...</span>;
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200"><AlertCircle size={10} /> Error</span>;
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
       <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-2xl font-bold text-gray-900">Knowledge Base</h2>
            <p className="text-gray-500 text-sm mt-1">Manage standard responses and source documents for your AI.</p>
         </div>
         <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button 
               onClick={() => setActiveTab('qa')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'qa' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
               Q&A Pairs
            </button>
            <button 
               onClick={() => setActiveTab('docs')}
               className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'docs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
               Documents
            </button>
         </div>
       </div>

       {activeTab === 'qa' ? (
         <>
            {/* Search */}
            <div className="relative mb-6 flex gap-4">
              <div className="relative flex-1">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                   type="text" 
                   placeholder="Search questions..."
                   value={searchTerm}
                   onChange={e => setSearchTerm(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition shadow-sm"
                 />
              </div>
              <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-xl flex items-center gap-2 transition font-medium shadow-sm">
                <Plus size={18} /> Add Entry
              </button>
            </div>

            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1">
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Question</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Response</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tags</th>
                        <th className="px-6 py-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredKB.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 w-1/3">
                            <p className="text-sm font-medium text-gray-900">{item.question}</p>
                          </td>
                          <td className="px-6 py-4 max-w-md">
                            <p className="text-sm text-gray-600 line-clamp-2">{item.answer}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {item.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex justify-end gap-2">
                              <button className="p-2 text-gray-400 hover:text-brand-600 transition">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => handleDeleteKB(item.id)} className="p-2 text-gray-400 hover:text-red-600 transition">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            </div>
         </>
       ) : (
         <div className="flex-1 flex flex-col gap-6">
            {/* Upload Area */}
            <div 
               onClick={handleFileUpload}
               className={`border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all hover:border-brand-500 hover:bg-brand-50 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
            >
               <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                  <UploadCloud size={28} />
               </div>
               <h3 className="font-bold text-gray-900 text-lg">
                  {isUploading ? 'Uploading & Indexing...' : 'Click to upload files'}
               </h3>
               <p className="text-gray-500 text-sm mt-1">Support for PDF, DOCX, CSV, and TXT (Max 10MB)</p>
            </div>

            {/* Document List */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1">
               <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">Indexed Documents</h3>
               </div>
               <div className="divide-y divide-gray-100">
                  {documents.map(doc => (
                     <div key={doc.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                        <div className="flex items-center gap-4">
                           <div className="p-3 bg-gray-100 rounded-lg">
                              {getFileIcon(doc.type)}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-gray-900">{doc.name}</p>
                              <p className="text-xs text-gray-500">{doc.size} • Uploaded {doc.uploadDate}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           {getStatusBadge(doc.status)}
                           <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-gray-400 hover:text-red-600 transition">
                              <Trash2 size={16} />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
       )}
    </div>
  );
};
