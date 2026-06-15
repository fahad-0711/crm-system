import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { ChevronDown, ChevronUp, Eye, Phone, Check, X, AlertTriangle } from 'lucide-react';
import Badge from '../UI/Badge';

export default function LeadTable({ filteredLeads }) {
  const { agents, updateLead, setSelectedLeadId, addToast } = useCRM();

  // Sorting State
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  // Selection State
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

  // Inline Editing State
  const [editingCell, setEditingCell] = useState(null); // { leadId, field } ('budget' | 'status' | 'stage')
  const [editValue, setEditValue] = useState('');

  // Handle Header Click for Sorting
  const handleSort = (field) => {
    const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  // Sort Leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === 'budget') {
      valA = Number(valA);
      valB = Number(valB);
    } else {
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Handle Bulk Selection
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeadIds(sortedLeads.map(l => l.id));
    } else {
      setSelectedLeadIds([]);
    }
  };

  const handleSelectOne = (leadId, checked) => {
    if (checked) {
      setSelectedLeadIds(prev => [...prev, leadId]);
    } else {
      setSelectedLeadIds(prev => prev.filter(id => id !== leadId));
    }
  };

  // Double Click triggers Inline Edit
  const handleDoubleClick = (leadId, field, currentValue) => {
    setEditingCell({ leadId, field });
    setEditValue(currentValue);
  };

  const saveInlineEdit = (leadId, field) => {
    let finalValue = editValue;
    if (field === 'budget') {
      finalValue = Number(editValue);
      if (isNaN(finalValue) || finalValue <= 0) {
        addToast('Please enter a valid budget number', 'danger');
        setEditingCell(null);
        return;
      }
    }
    
    updateLead(leadId, { [field]: finalValue });
    setEditingCell(null);
  };

  const cancelInlineEdit = () => {
    setEditingCell(null);
  };

  // Format currency helper
  const formatBudget = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)}L`;
    }
    return `₹${value}`;
  };

  const statusVariant = {
    'Hot': 'cyan',
    'Warm': 'yellow',
    'Cold': 'gray',
    'Closed': 'green'
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5 ml-1 inline" /> : <ChevronDown className="w-3.5 h-3.5 ml-1 inline" />;
  };

  return (
    <div className="glass-card p-6 overflow-hidden flex flex-col relative z-10">
      
      {/* Bulk Action Panel */}
      {selectedLeadIds.length > 0 && (
        <div className="flex items-center justify-between p-3.5 bg-neon-cyan/5 border border-neon-cyan/20 rounded-xl mb-4.5 animate-fade-up">
          <span className="text-xs font-semibold text-white">
            Selected <span className="text-neon-cyan font-bold font-mono">{selectedLeadIds.length}</span> lead{selectedLeadIds.length > 1 ? 's' : ''}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                selectedLeadIds.forEach(id => updateLead(id, { status: 'Hot' }));
                setSelectedLeadIds([]);
                addToast('Status set to Hot for selected items', 'success');
              }}
              className="px-3 py-1.5 rounded-lg border border-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/10 font-space text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              Set Hot 🔥
            </button>
            <button 
              onClick={() => {
                setSelectedLeadIds([]);
                addToast('Bulk action cleared', 'info');
              }}
              className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-slate-400 hover:text-white font-space text-[10px] font-bold uppercase tracking-wider transition-all"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Responsive Table Container */}
      <div className="overflow-x-auto -mx-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] text-[10px] font-space font-bold uppercase tracking-wider text-slate-500">
              <th className="py-4 px-6 w-12 text-center">
                <input 
                  type="checkbox" 
                  checked={selectedLeadIds.length === sortedLeads.length && sortedLeads.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-white/[0.08] text-neon-cyan focus:ring-neon-cyan/50 cursor-pointer accent-[#00f5ff]"
                />
              </th>
              <th className="py-4 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('name')}>
                Name <SortIcon field="name" />
              </th>
              <th className="py-4 px-4">Contact</th>
              <th className="py-4 px-4">Source</th>
              <th className="py-4 px-4">Interest</th>
              <th className="py-4 px-4 text-right cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('budget')}>
                Budget <SortIcon field="budget" />
              </th>
              <th className="py-4 px-4 text-center cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('status')}>
                Status <SortIcon field="status" />
              </th>
              <th className="py-4 px-4 cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('stage')}>
                Pipeline Stage <SortIcon field="stage" />
              </th>
              <th className="py-4 px-4">Agent</th>
              <th className="py-4 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {sortedLeads.map((lead) => {
              const agent = agents.find(a => a.id === lead.agentId) || { name: 'Unassigned', avatar: '' };
              const isSelected = selectedLeadIds.includes(lead.id);

              return (
                <tr 
                  key={lead.id}
                  className={`text-xs font-medium text-slate-300 transition-all border-l-2 border-l-transparent hover:bg-white/[0.01] hover:text-white group
                    ${isSelected ? 'bg-white/[0.02] border-l-neon-cyan' : ''}
                  `}
                >
                  {/* Select Checkbox */}
                  <td className="py-3 px-6 text-center">
                    <input 
                      type="checkbox" 
                      checked={isSelected}
                      onChange={(e) => handleSelectOne(lead.id, e.target.checked)}
                      className="w-4 h-4 rounded border-white/[0.08] text-neon-cyan focus:ring-neon-cyan/50 cursor-pointer accent-[#00f5ff]"
                    />
                  </td>

                  {/* Name */}
                  <td className="py-3 px-4 font-bold text-white">
                    <button 
                      onClick={() => setSelectedLeadId(lead.id)}
                      className="hover:text-neon-cyan text-left font-space"
                    >
                      {lead.name}
                    </button>
                  </td>

                  {/* Contact */}
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    <div>
                      <p>{lead.phone}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{lead.email || 'No email'}</p>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-bold text-slate-400 bg-white/[0.03] px-2 py-0.5 border border-white/[0.05] rounded uppercase tracking-wider">
                      {lead.source}
                    </span>
                  </td>

                  {/* Interest */}
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {lead.propertyType} · {lead.locality}
                  </td>

                  {/* Budget (Double Click to Edit) */}
                  <td 
                    className="py-3 px-4 text-right font-mono font-bold text-white select-all cursor-pointer"
                    onDoubleClick={() => handleDoubleClick(lead.id, 'budget', lead.budget)}
                  >
                    {editingCell?.leadId === lead.id && editingCell?.field === 'budget' ? (
                      <div className="flex items-center gap-1.5 justify-end">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveInlineEdit(lead.id, 'budget');
                            if (e.key === 'Escape') cancelInlineEdit();
                          }}
                          className="w-24 h-7 text-right text-xs bg-[#08080d] border border-neon-cyan focus:outline-none focus:ring-1 focus:ring-neon-cyan rounded px-2"
                          autoFocus
                        />
                        <button onClick={() => saveInlineEdit(lead.id, 'budget')} className="p-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded">
                          <Check className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <span title="Double click to edit budget">{formatBudget(lead.budget)}</span>
                    )}
                  </td>

                  {/* Status (Double Click to Edit) */}
                  <td 
                    className="py-3 px-4 text-center cursor-pointer"
                    onDoubleClick={() => handleDoubleClick(lead.id, 'status', lead.status)}
                  >
                    {editingCell?.leadId === lead.id && editingCell?.field === 'status' ? (
                      <select
                        value={editValue}
                        onChange={(e) => {
                          setEditValue(e.target.value);
                          updateLead(lead.id, { status: e.target.value });
                          setEditingCell(null);
                        }}
                        onBlur={cancelInlineEdit}
                        className="h-7 text-xs bg-[#08080d] border border-neon-cyan rounded px-1"
                        autoFocus
                      >
                        <option value="Hot">Hot</option>
                        <option value="Warm">Warm</option>
                        <option value="Cold">Cold</option>
                        <option value="Closed">Closed</option>
                      </select>
                    ) : (
                      <span title="Double click to edit status">
                        <Badge variant={statusVariant[lead.status] || 'cyan'}>{lead.status}</Badge>
                      </span>
                    )}
                  </td>

                  {/* Pipeline Stage (Double Click to Edit) */}
                  <td 
                    className="py-3 px-4 cursor-pointer"
                    onDoubleClick={() => handleDoubleClick(lead.id, 'stage', lead.stage)}
                  >
                    {editingCell?.leadId === lead.id && editingCell?.field === 'stage' ? (
                      <select
                        value={editValue}
                        onChange={(e) => {
                          setEditValue(e.target.value);
                          updateLead(lead.id, { stage: e.target.value });
                          setEditingCell(null);
                        }}
                        onBlur={cancelInlineEdit}
                        className="h-7 text-xs bg-[#08080d] border border-neon-cyan rounded px-1"
                        autoFocus
                      >
                        <option value="NEW INQUIRY">New Inquiry</option>
                        <option value="SITE VISIT SCHEDULED">Site Visit</option>
                        <option value="NEGOTIATION">Negotiation</option>
                        <option value="DOCUMENTATION">Documentation</option>
                        <option value="CLOSED WON">Closed Won</option>
                      </select>
                    ) : (
                      <div className="flex items-center gap-1.5" title="Double click to edit stage">
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_6px_#00f5ff]" />
                        <span className="font-space text-[11px] uppercase tracking-wide">
                          {lead.stage.replace(/_/g, ' ').toLowerCase()}
                        </span>
                        {lead.daysInStage >= 14 && (
                          <AlertTriangle className="w-3.5 h-3.5 text-neon-magenta animate-pulse" title={`${lead.daysInStage} days in stage!`} />
                        )}
                      </div>
                    )}
                  </td>

                  {/* Agent */}
                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      <img 
                        src={agent.avatar} 
                        alt={agent.name} 
                        className="w-5.5 h-5.5 rounded-full object-cover border border-white/[0.08]"
                      />
                      <span>{agent.name}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="p-1 rounded bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/50 text-slate-400 hover:text-neon-cyan transition-all"
                        title="Open Profile Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => addToast(`Initiating VoIP call with ${lead.name}...`, 'info')}
                        className="p-1 rounded bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/50 text-slate-400 hover:text-neon-cyan transition-all"
                        title="Voice Call"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
