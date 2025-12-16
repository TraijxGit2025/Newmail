import React, { useMemo, useState } from 'react';
import { SortedItem, Assignment } from '../types';
import { CheckCircle, AlertCircle, MessageCircle, Clock, Search, ChevronRight } from 'lucide-react';

interface DashboardProps {
  emails: SortedItem[];
  onMarkComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ emails, onMarkComplete, onDelete }) => {
  const [filterOwner, setFilterOwner] = useState<Assignment | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Outstanding' | 'Completed'>('Outstanding');

  // Filter Logic
  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      // 1. Status Filter
      if (filterStatus === 'Outstanding') {
        if (email.status === 'Completed') return false;
      } else if (filterStatus === 'Completed') {
        if (email.status !== 'Completed') return false;
      }

      // 2. Owner Filter
      if (filterOwner === 'All') return true;
      if (filterOwner === 'Both') return email.assignedTo === 'Both' || email.assignedTo === 'Kevin' || email.assignedTo === 'Vy'; // Show all relevant if filtering for "Both" specifically? No, usually "Both" means shared. Let's stick to strict match or inclusion.
      // Better logic: If I select Kevin, I want Kevin + Both.
      if (filterOwner === 'Kevin') return email.assignedTo === 'Kevin' || email.assignedTo === 'Both';
      if (filterOwner === 'Vy') return email.assignedTo === 'Vy' || email.assignedTo === 'Both';
      
      return email.assignedTo === filterOwner;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [emails, filterOwner, filterStatus]);

  // Helper to get status badge styles
  const getStatusBadge = (status: string, assignedTo: string) => {
    switch (status) {
      case 'New Issue':
        return (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700 border border-red-200">
                <AlertCircle className="w-3 h-3" /> New Issue
            </span>
        );
      case 'New Reply':
        return (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                <MessageCircle className="w-3 h-3" /> New Reply
            </span>
        );
      case 'Completed':
        return (
            <span className="flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 border border-green-200">
                <CheckCircle className="w-3 h-3" /> Completed
            </span>
        );
      default:
        return null;
    }
  };

  const getOwnerBadge = (owner: string) => {
      if (owner === 'Kevin') return <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Kevin</span>
      if (owner === 'Vy') return <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">Vy</span>
      if (owner === 'Both') return <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">Both</span>
      return <span className="text-xs text-slate-500">Unassigned</span>
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Filters Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Show for:</span>
            <div className="flex bg-white rounded-md border border-slate-200 p-1">
                {['All', 'Kevin', 'Vy'].map((o) => (
                    <button
                        key={o}
                        onClick={() => setFilterOwner(o as any)}
                        className={`px-3 py-1 text-sm rounded-sm transition-colors ${filterOwner === o ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        {o}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Status:</span>
             <div className="flex bg-white rounded-md border border-slate-200 p-1">
                {['Outstanding', 'Completed', 'All'].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s as any)}
                        className={`px-3 py-1 text-sm rounded-sm transition-colors ${filterStatus === s ? 'bg-indigo-100 text-indigo-700 font-medium' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-0">
        {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <Search className="w-12 h-12 mb-2 opacity-20" />
                <p>No emails found matching criteria.</p>
            </div>
        ) : (
            <div className="divide-y divide-slate-100">
                {filteredEmails.map((email) => (
                    <div key={email.id} className="p-4 hover:bg-slate-50 transition-colors group flex gap-4 items-start">
                        {/* Left Status Bar */}
                        <div className={`w-1 h-full min-h-[4rem] rounded-full mt-1 shrink-0 
                            ${email.status === 'Completed' ? 'bg-green-400' : (email.assignedTo === 'Kevin' ? 'bg-blue-400' : (email.assignedTo === 'Vy' ? 'bg-purple-400' : 'bg-indigo-400'))}
                        `}></div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    {getStatusBadge(email.status, email.assignedTo)}
                                    {getOwnerBadge(email.assignedTo)}
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {new Date(email.timestamp).toLocaleDateString()}
                                    </span>
                                </div>
                                {email.status !== 'Completed' && (
                                    <button
                                        onClick={() => onMarkComplete(email.id)}
                                        className="text-xs bg-white border border-slate-200 text-slate-600 hover:text-green-600 hover:border-green-200 px-2 py-1 rounded shadow-sm transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        Mark Done
                                    </button>
                                )}
                            </div>
                            
                            <h4 className="font-semibold text-slate-800 truncate mb-1">{email.subject}</h4>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-2">{email.body}</p>
                            
                            {email.classificationReason && (
                                <p className="text-xs text-slate-400 italic bg-slate-50 inline-block px-2 py-1 rounded">
                                    AI Logic: {email.classificationReason}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
