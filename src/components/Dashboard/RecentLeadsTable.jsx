import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Eye, Edit2, Phone, ArrowRight } from 'lucide-react';
import Card from '../UI/Card';
import Badge from '../UI/Badge';

export default function RecentLeadsTable({ animateDelayClass = '' }) {
  const { leads, agents, setSelectedLeadId, setActiveTab, addToast } = useCRM();

  // Get first 6 leads
  const recentLeads = leads.slice(0, 6);

  // Helper to format currency
  const formatBudget = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)}L`;
    }
    return `₹${value}`;
  };

  const handleCall = (leadName, phone) => {
    addToast(`Dialing ${leadName} (${phone})... Connecting line...`, 'info');
  };

  return (
    <Card
      title="Recent Leads"
      subtitle="Latest incoming opportunities"
      animateDelayClass={animateDelayClass}
      headerAction={
        <button 
          onClick={() => setActiveTab('leads')}
          className="text-xs font-semibold text-neon-cyan hover:underline flex items-center gap-1.5"
        >
          View All Leads
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      }
      className="h-[460px] flex flex-col justify-between"
    >
      <div className="overflow-x-auto -mx-6 h-[340px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.04] text-[10px] font-space font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Interest</th>
              <th className="py-3 px-4 text-right">Budget</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4">Agent</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.02]">
            {recentLeads.map((lead) => {
              const agent = agents.find(a => a.id === lead.agentId) || { name: 'Unassigned', avatar: '' };
              
              // Status badge config
              const statusVariant = {
                'Hot': 'cyan',
                'Warm': 'yellow',
                'Cold': 'gray',
                'Closed': 'green'
              }[lead.status] || 'cyan';

              return (
                <tr 
                  key={lead.id}
                  className="text-xs font-medium text-slate-300 transition-all hover:bg-white/[0.01] hover:text-white group border-l-2 border-l-transparent hover:border-l-neon-cyan"
                >
                  <td className="py-3.5 px-6 font-semibold text-white">
                    <div>
                      <p>{lead.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] font-semibold text-slate-400 bg-white/[0.03] px-2 py-1 border border-white/[0.05] rounded-md">
                      {lead.source}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {lead.propertyType} · {lead.locality}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                    {formatBudget(lead.budget)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <Badge variant={statusVariant}>{lead.status}</Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      {agent.avatar ? (
                        <img 
                          src={agent.avatar} 
                          alt={agent.name} 
                          className="w-5.5 h-5.5 rounded-full object-cover border border-white/[0.08]"
                        />
                      ) : (
                        <span className="w-5.5 h-5.5 rounded-full bg-white/[0.05] border border-white/[0.08]" />
                      )}
                      <span className="truncate max-w-[80px]">{agent.name.split(' ')[0]}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setSelectedLeadId(lead.id)}
                        className="p-1 rounded bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/50 text-slate-400 hover:text-neon-cyan transition-all"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedLeadId(lead.id);
                          // Trigger edit mode if needed, but selecting shows detailed editing panels
                        }}
                        className="p-1 rounded bg-white/[0.02] border border-white/[0.06] hover:border-neon-purple/50 text-slate-400 hover:text-neon-purple transition-all"
                        title="Quick Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleCall(lead.name, lead.phone)}
                        className="p-1 rounded bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/50 text-slate-400 hover:text-neon-cyan transition-all"
                        title="Call Lead"
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
    </Card>
  );
}
