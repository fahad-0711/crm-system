import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { Calendar, Phone, MessageCircle, Mail, MoreHorizontal, User } from 'lucide-react';
import Badge from '../UI/Badge';

export default function LeadCard({ lead }) {
  const { agents, setSelectedLeadId, addToast } = useCRM();

  const agent = agents.find(a => a.id === lead.agentId) || { name: 'Unassigned', avatar: '' };

  const stages = [
    'NEW INQUIRY',
    'SITE VISIT SCHEDULED',
    'NEGOTIATION',
    'DOCUMENTATION',
    'CLOSED WON'
  ];

  const currentStageIndex = stages.indexOf(lead.stage);

  // Formatting budget Indian-style
  const formatBudget = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)}L`;
    }
    return `₹${value}`;
  };

  const handleAction = (type, e) => {
    e.stopPropagation(); // Avoid opening drawer
    if (type === 'call') {
      addToast(`Initiating call with ${lead.name} (${lead.phone})...`, 'info');
    } else if (type === 'whatsapp') {
      addToast(`Redirecting to WhatsApp chat for ${lead.name}...`, 'success');
    } else if (type === 'email') {
      if (lead.email) {
        addToast(`Opening draft mail to ${lead.email}...`, 'info');
      } else {
        addToast(`No email address provided for ${lead.name}`, 'danger');
      }
    }
  };

  const statusVariant = {
    'Hot': 'cyan',
    'Warm': 'yellow',
    'Cold': 'gray',
    'Closed': 'green'
  }[lead.status] || 'cyan';

  return (
    <div 
      onClick={() => setSelectedLeadId(lead.id)}
      className="glass-card p-5 cursor-pointer flex flex-col justify-between h-[280px] group opacity-0 animate-fade-up relative"
      style={{ animationPlayState: 'running' }}
    >
      <div>
        {/* Top: Name, Status & Source */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-space font-bold text-base text-white group-hover:text-neon-cyan transition-colors truncate max-w-[65%]">
            {lead.name}
          </h3>
          <div className="flex gap-1.5 shrink-0">
            <Badge variant={statusVariant} glow={true}>{lead.status}</Badge>
            <span className="text-[9px] font-bold tracking-wider text-slate-400 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.05]">
              {lead.source}
            </span>
          </div>
        </div>

        {/* Property Specs */}
        <div className="mt-3">
          <span className="inline-block text-[11px] font-bold text-neon-cyan font-mono bg-neon-cyan/5 px-2 py-0.5 rounded-md border border-neon-cyan/15">
            {lead.propertyType} · {lead.locality} · {formatBudget(lead.budget)}
          </span>
        </div>

        {/* Agent Assigned */}
        <div className="flex items-center gap-2.5 mt-4">
          <div className="relative">
            {agent.avatar ? (
              <img 
                src={agent.avatar} 
                alt={agent.name} 
                className="w-7 h-7 rounded-full object-cover border border-white/[0.08]"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-white/[0.04] flex items-center justify-center border border-white/[0.08]">
                <User className="w-3.5 h-3.5 text-slate-500" />
              </div>
            )}
            {agent.online && (
              <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 border border-[#0a0a0f] rounded-full shadow-[0_0_4px_#10b981]" />
            )}
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Agent Assigned</p>
            <p className="text-xs font-semibold text-white mt-0.5">{agent.name}</p>
          </div>
        </div>
      </div>

      <div className="mt-auto space-y-4">
        {/* Middle details: Date & Contact */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-3 border-t border-white/[0.03]">
          <span className="flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {lead.nextFollowUp || 'No date'}
          </span>
          <span className="text-slate-500 font-semibold">
            Contacted: {lead.lastContacted}
          </span>
        </div>

        {/* Pipeline Stage Progress (5 Dots) */}
        <div className="flex items-center justify-between gap-1.5">
          <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase">Pipeline</span>
          <div className="flex items-center gap-1">
            {stages.map((st, i) => {
              const active = i <= currentStageIndex;
              let dotColor = 'bg-white/[0.06]';
              if (active) {
                if (lead.stage === 'CLOSED WON') dotColor = 'bg-emerald-500 shadow-[0_0_8px_#10b981]';
                else if (currentStageIndex >= 3) dotColor = 'bg-neon-magenta shadow-[0_0_8px_#ff006e]';
                else if (currentStageIndex >= 2) dotColor = 'bg-neon-purple shadow-[0_0_8px_#bf00ff]';
                else dotColor = 'bg-neon-cyan shadow-[0_0_8px_#00f5ff]';
              }
              return (
                <span 
                  key={i} 
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${dotColor}`}
                  title={st.replace(/_/g, ' ')}
                />
              );
            })}
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={(e) => handleAction('call', e)}
            className="flex-1 py-1.5 rounded bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/40 hover:bg-neon-cyan/5 text-slate-300 hover:text-neon-cyan flex items-center justify-center gap-1 text-[11px] font-bold transition-all duration-200"
          >
            <Phone className="w-3.5 h-3.5" />
            Call
          </button>
          <button
            onClick={(e) => handleAction('whatsapp', e)}
            className="flex-1 py-1.5 rounded bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/40 hover:bg-emerald-500/5 text-slate-300 hover:text-emerald-400 flex items-center justify-center gap-1 text-[11px] font-bold transition-all duration-200"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </button>
          <button
            onClick={(e) => handleAction('email', e)}
            className="flex-1 py-1.5 rounded bg-white/[0.02] border border-white/[0.06] hover:border-neon-purple/40 hover:bg-neon-purple/5 text-slate-300 hover:text-neon-purple flex items-center justify-center gap-1 text-[11px] font-bold transition-all duration-200"
          >
            <Mail className="w-3.5 h-3.5" />
            Email
          </button>
          <button
            onClick={() => setSelectedLeadId(lead.id)}
            className="px-2 py-1.5 rounded bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/50 text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
