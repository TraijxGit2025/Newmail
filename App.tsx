import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import { Rule, SortedItem, Assignment } from './types';
import { INITIAL_RULES, MOCK_EMAILS } from './constants';
import { Layout, Inbox, Settings as SettingsIcon, PlusCircle, RefreshCw, Mail } from 'lucide-react';
import { analyzeEmail } from './services/geminiService';

const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');

  // Data State
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [emails, setEmails] = useState<SortedItem[]>(MOCK_EMAILS);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulation State for "New Email"
  const [simulatedInput, setSimulatedInput] = useState('');
  const [showSimulator, setShowSimulator] = useState(false);

  // --- Handlers ---

  const handleAddRule = (newRule: Omit<Rule, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setRules([...rules, { ...newRule, id }]);
  };

  const handleRemoveRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  const handleMarkComplete = (id: string) => {
    setEmails(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'Completed', isRead: true } : e
    ));
  };

  const handleDeleteEmail = (id: string) => {
    setEmails(prev => prev.filter(e => e.id !== id));
  };

  // Simulate receiving a new email from Outlook
  const processNewEmail = async (subject: string, body: string, sender: string) => {
    setIsProcessing(true);
    
    // Determine if it's a reply based on mock logic (if subject starts with Re:)
    const isReply = subject.toLowerCase().startsWith('re:');
    // Mock threading: Find if there's an existing email with similar subject
    const existingThread = emails.find(e => subject.includes(e.subject.replace('Re: ', '')));
    const threadId = existingThread ? existingThread.threadId : Math.random().toString(36).substr(2, 9);

    try {
      const classification = await analyzeEmail({ subject, body, sender, isReply }, rules);
      
      const newEmail: SortedItem = {
        id: Math.random().toString(36).substr(2, 9),
        sender,
        subject,
        body,
        timestamp: new Date().toISOString(),
        threadId,
        isReply,
        assignedTo: classification.assignedTo,
        status: classification.isCompleted ? 'Completed' : (isReply ? 'New Reply' : 'New Issue'),
        isRead: false,
        classificationReason: classification.reason
      };

      setEmails(prev => [newEmail, ...prev]);
    } catch (error) {
      console.error("Failed to process email", error);
    } finally {
      setIsProcessing(false);
      setSimulatedInput('');
      setShowSimulator(false);
    }
  };

  const handleRunSimulation = () => {
      // Pick a random scenario
      const scenarios = [
          { s: 'Legal Contract Review', b: 'Kevin, please look at the indemnity clause in the attached contract.', f: 'client@law.com' },
          { s: 'Nexus Platform Bug', b: 'I cannot log into the Stonehaven Nexus platform. Can Vy help?', f: 'user@fund.com' },
          { s: 'Re: Marketing Materials', b: 'The materials look great. Approved.', f: 'client@corp.com' },
          { s: 'Project Status', b: 'Done.', f: 'Vy@stonehaven.com' }
      ];
      const random = scenarios[Math.floor(Math.random() * scenarios.length)];
      processNewEmail(random.s, random.b, random.f);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 text-slate-800 font-sans">
      
      {/* Sidebar / Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Layout className="w-6 h-6 text-indigo-400" />
            NexusMail
          </h1>
          <p className="text-xs text-slate-500 mt-1">Smart Inbox Manager</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800'}`}
          >
            <Inbox className="w-5 h-5" />
            <span className="font-medium">Inbox Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50' : 'hover:bg-slate-800'}`}
          >
            <SettingsIcon className="w-5 h-5" />
            <span className="font-medium">Sorting Rules</span>
          </button>
        </nav>

        {/* Action Area (Simulation) */}
        <div className="p-4 border-t border-slate-800 bg-slate-900">
             <button
                onClick={() => setShowSimulator(!showSimulator)}
                className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm border border-slate-700 transition-colors"
             >
                <PlusCircle className="w-4 h-4" />
                {showSimulator ? 'Close Simulator' : 'Simulate New Email'}
             </button>
             <button 
                onClick={handleRunSimulation}
                disabled={isProcessing}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-transparent hover:bg-slate-800 text-indigo-400 text-xs py-2 rounded border border-dashed border-slate-700"
             >
                {isProcessing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                Quick Random Email
             </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
            <h2 className="text-lg font-semibold text-slate-800">
                {activeTab === 'dashboard' ? 'Current Outstanding Issues' : 'Configuration'}
            </h2>
            <div className="flex items-center gap-4">
               {activeTab === 'dashboard' && (
                   <div className="flex gap-4 text-sm text-slate-500">
                       <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Kevin</span>
                       <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Vy</span>
                   </div>
               )}
            </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-hidden p-6 relative">
            {activeTab === 'dashboard' ? (
                <Dashboard 
                    emails={emails} 
                    onMarkComplete={handleMarkComplete} 
                    onDelete={handleDeleteEmail} 
                />
            ) : (
                <Settings 
                    rules={rules} 
                    onAddRule={handleAddRule} 
                    onRemoveRule={handleRemoveRule} 
                />
            )}

            {/* Simulation Modal/Overlay */}
            {showSimulator && (
                 <div className="absolute top-6 right-6 w-96 bg-white rounded-lg shadow-2xl border border-slate-200 flex flex-col animate-in fade-in slide-in-from-right-10 duration-200 z-50">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center rounded-t-lg">
                        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                            <Mail className="w-4 h-4" /> New Email Simulator
                        </h3>
                        <button onClick={() => setShowSimulator(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                    </div>
                    <div className="p-4 space-y-3">
                        <input id="sim-sender" placeholder="Sender (e.g. client@corp.com)" className="w-full text-sm p-2 border rounded" defaultValue="client@test.com" />
                        <input id="sim-subject" placeholder="Subject" className="w-full text-sm p-2 border rounded" />
                        <textarea id="sim-body" placeholder="Email Body Content..." className="w-full text-sm p-2 border rounded h-32" />
                        
                        <button 
                            disabled={isProcessing}
                            onClick={() => {
                                const sender = (document.getElementById('sim-sender') as HTMLInputElement).value;
                                const subject = (document.getElementById('sim-subject') as HTMLInputElement).value;
                                const body = (document.getElementById('sim-body') as HTMLTextAreaElement).value;
                                if(subject && body) processNewEmail(subject, body, sender);
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded font-medium flex justify-center items-center gap-2"
                        >
                            {isProcessing ? 'Analyzing...' : 'Process Email'}
                        </button>
                    </div>
                 </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;
