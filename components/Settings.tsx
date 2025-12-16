import React, { useState } from 'react';
import { Rule } from '../types';
import { Trash2, Plus, Zap } from 'lucide-react';

interface SettingsProps {
  rules: Rule[];
  onAddRule: (rule: Omit<Rule, 'id'>) => void;
  onRemoveRule: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ rules, onAddRule, onRemoveRule }) => {
  const [newKeyword, setNewKeyword] = useState('');
  const [newOwner, setNewOwner] = useState<'Kevin' | 'Vy'>('Kevin');
  const [newType, setNewType] = useState<'Keyword' | 'Concept'>('Concept');

  const handleAdd = () => {
    if (!newKeyword.trim()) return;
    onAddRule({
      owner: newOwner,
      keyword: newKeyword,
      type: newType,
    });
    setNewKeyword('');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          Sorting Logic Configuration
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Define the words and concepts the AI scans for to route emails to Kevin or Vy.
        </p>
      </div>

      {/* Add New Rule */}
      <div className="bg-slate-50 p-4 rounded-md border border-slate-200 mb-8">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Add New Scanning Rule</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="e.g., 'Due Diligence' or 'NDA'"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <select
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value as 'Kevin' | 'Vy')}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
          >
            <option value="Kevin">For Kevin</option>
            <option value="Vy">For Vy</option>
          </select>
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value as 'Keyword' | 'Concept')}
            className="px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
          >
            <option value="Concept">Concept (Broad)</option>
            <option value="Keyword">Exact Word</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Rule
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Kevin's Rules */}
        <div>
          <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
            Kevin's Criteria
          </h3>
          <ul className="space-y-2">
            {rules.filter(r => r.owner === 'Kevin').map(rule => (
              <li key={rule.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-md shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{rule.keyword}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rule.type === 'Concept' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    {rule.type}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveRule(rule.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {rules.filter(r => r.owner === 'Kevin').length === 0 && (
                <li className="text-sm text-slate-400 italic">No rules defined.</li>
            )}
          </ul>
        </div>

        {/* Vy's Rules */}
        <div>
          <h3 className="font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-4">
            Vy's Criteria
          </h3>
          <ul className="space-y-2">
            {rules.filter(r => r.owner === 'Vy').map(rule => (
              <li key={rule.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-md shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700">{rule.keyword}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${rule.type === 'Concept' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                    {rule.type}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveRule(rule.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove rule"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {rules.filter(r => r.owner === 'Vy').length === 0 && (
                <li className="text-sm text-slate-400 italic">No rules defined.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
