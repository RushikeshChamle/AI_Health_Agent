
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Builder } from './components/Builder';
import { KnowledgeBase } from './components/KnowledgeBase';
import { Settings } from './components/Settings';
import { SetupWizard } from './components/Wizard';
import { Simulator } from './components/Simulator';
import { ActivityLog } from './components/ActivityLog'; // Import new component
import { AppState, View, AgentConfiguration } from './types';
import { INITIAL_APP_STATE } from './constants';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [appState, setAppState] = useState<AppState>(INITIAL_APP_STATE);
  const [showWizard, setShowWizard] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  const handleUpdateKB = (newKB: any[]) => {
    setAppState(prev => ({ ...prev, kb: newKB }));
  };

  const handleUpdateDocuments = (newDocs: any[]) => {
    setAppState(prev => ({ ...prev, documents: newDocs }));
  };

  const handleUpdateFlow = (newFlow: any[]) => {
    setAppState(prev => ({ ...prev, flow: newFlow }));
  };

  const handleUpdateConfig = (newConfig: AgentConfiguration) => {
    setAppState(prev => ({ ...prev, agentConfig: newConfig }));
  };

  const handleUpdateSettings = (newSettings: any) => {
    setAppState(prev => ({ ...prev, settings: { ...prev.settings, ...newSettings } }));
  };

  const handleWizardComplete = (config: any) => {
    setAppState(prev => ({
      ...prev,
      name: config.name,
      settings: { ...prev.settings, tone: config.tone },
    }));
    setShowWizard(false);
    setCurrentView('builder');
  };

  const handleQuickAction = (action: string) => {
    if (action === 'wizard') setShowWizard(true);
    if (action === 'simulator') setShowSimulator(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          stats={appState.stats} 
          onQuickAction={handleQuickAction} 
        />;
      case 'activity': // New View Case
        return <ActivityLog logs={appState.logs} />;
      case 'builder':
        return <Builder 
          flow={appState.flow} 
          config={appState.agentConfig}
          onUpdateFlow={handleUpdateFlow} 
          onUpdateConfig={handleUpdateConfig}
        />;
      case 'kb':
        return <KnowledgeBase 
          kb={appState.kb} 
          documents={appState.documents}
          onUpdateKB={handleUpdateKB} 
          onUpdateDocuments={handleUpdateDocuments}
        />;
      case 'settings':
        return <Settings settings={appState.settings} onUpdate={handleUpdateSettings} />;
      default:
        return <Dashboard stats={appState.stats} onQuickAction={handleQuickAction} />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Simulator Overlay */}
      {showSimulator && (
        <Simulator 
          onClose={() => setShowSimulator(false)} 
          appState={appState}
        />
      )}

      {/* Wizard Overlay */}
      {showWizard && (
        <SetupWizard 
          onClose={() => setShowWizard(false)} 
          onComplete={handleUpdateSettings}
        />
      )}

      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {renderContent()}
      </Layout>
    </div>
  );
}
