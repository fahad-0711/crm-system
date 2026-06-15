import React, { useState, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useCRM } from '../context/CRMContext';
import { 
  GitBranch, Search, Filter, Calendar, Users, 
  AlertTriangle, ArrowRight, UserCheck, Plus, Sparkles 
} from 'lucide-react';
import Badge from '../components/UI/Badge';

export default function PipelinePage() {
  const { 
    leads, 
    agents, 
    moveLeadStage, 
    updateLead, 
    setIsAddLeadModalOpen, 
    setSelectedLeadId,
    valueFormatted,
    addToast 
  } = useCRM();

  // Kanban View Options State
  const [groupByAgent, setGroupByAgent] = useState(false); // false = Stage, true = Agent
  const [agentFilter, setAgentFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Stages definition
  const STAGES = [
    { key: 'NEW INQUIRY', label: 'New Inquiry', color: 'border-t-neon-cyan shadow-[inset_0_4px_10px_rgba(0,245,255,0.05)]' },
    { key: 'SITE VISIT SCHEDULED', label: 'Site Visit', color: 'border-t-cyan-500 shadow-[inset_0_4px_10px_rgba(6,182,212,0.05)]' },
    { key: 'NEGOTIATION', label: 'Negotiation', color: 'border-t-neon-purple shadow-[inset_0_4px_10px_rgba(191,0,255,0.05)]' },
    { key: 'DOCUMENTATION', label: 'Documentation', color: 'border-t-purple-600 shadow-[inset_0_4px_10px_rgba(147,51,234,0.05)]' },
    { key: 'CLOSED WON', label: 'Closed Won', color: 'border-t-emerald-500 shadow-[inset_0_4px_10px_rgba(16,185,129,0.05)]' }
  ];

  // Helper to format currency
  const formatBudget = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(0)}L`;
    }
    return `₹${value}`;
  };

  // Mask phone
  const maskPhone = (phone) => {
    if (!phone) return 'No Phone';
    return `${phone.substring(0, 2)}××× ×××××`;
  };

  // Filter leads before column mapping
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Agent filter (if grouping by stage)
      if (!groupByAgent && agentFilter !== 'All' && lead.agentId !== agentFilter) return false;
      // Priority filter
      if (priorityFilter !== 'All' && lead.priority !== priorityFilter) return false;
      return true;
    });
  }, [leads, agentFilter, priorityFilter, groupByAgent]);

  // Drag and Drop Handler
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    
    // Check if index unchanged in same column
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (groupByAgent) {
      // Reassign Lead to another agent
      const destinationAgentId = destination.droppableId;
      const targetAgent = agents.find(a => a.id === destinationAgentId);
      updateLead(draggableId, { agentId: destinationAgentId });
      addToast(`Lead reassigned to ${targetAgent?.name}`, 'success');
    } else {
      // Move pipeline stage
      moveLeadStage(draggableId, destination.droppableId);
    }
  };

  // Build Kanban columns dynamically
  const columns = useMemo(() => {
    if (groupByAgent) {
      // Columns represent agents
      return agents.map(agent => {
        const agentLeads = filteredLeads.filter(l => l.agentId === agent.id);
        const totalValue = agentLeads.reduce((sum, l) => sum + l.budget, 0);

        return {
          id: agent.id,
          title: agent.name,
          subtitle: agent.role,
          count: agentLeads.length,
          valueStr: formatBudget(totalValue),
          color: 'border-t-neon-purple',
          items: agentLeads
        };
      });
    } else {
      // Columns represent stages (Default)
      return STAGES.map(stage => {
        const stageLeads = filteredLeads.filter(l => l.stage === stage.key);
        const totalValue = stageLeads.reduce((sum, l) => sum + l.budget, 0);

        return {
          id: stage.key,
          title: stage.label,
          subtitle: null,
          count: stageLeads.length,
          valueStr: formatBudget(totalValue),
          color: stage.color,
          items: stageLeads
        };
      });
    }
  }, [groupByAgent, filteredLeads, agents]);

  return (
    <div className="space-y-6 pb-12 relative z-10">
      
      {/* Top Title & Pipeline Value */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-space font-bold text-2xl text-white uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-neon-cyan" />
            Deals Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Drag-and-drop deals to reorder or transition pipeline stages
          </p>
        </div>

        {/* Global Pipeline Value Display */}
        <div className="bg-white/[0.02] border border-neon-cyan/20 px-5 py-3 rounded-2xl flex flex-col items-end shrink-0 shadow-[0_0_15px_rgba(0,245,255,0.05)]">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Pipeline Value</span>
          <span className="font-space font-bold text-lg text-neon-cyan mt-0.5">{valueFormatted}</span>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Group Toggle */}
          <button
            onClick={() => setGroupByAgent(!groupByAgent)}
            className={`h-10 px-4 rounded-xl font-space text-xs font-bold uppercase tracking-wider border transition-all flex items-center gap-2
              ${groupByAgent 
                ? 'border-neon-purple bg-neon-purple/10 text-neon-purple shadow-[0_0_12px_rgba(191,0,255,0.15)]' 
                : 'border-white/[0.08] text-slate-400 hover:text-white'
              }
            `}
          >
            <Users className="w-3.5 h-3.5" />
            {groupByAgent ? 'Group by: Agent' : 'Group by: Stage'}
          </button>

          {/* Filter by Agent (only when grouped by stage) */}
          {!groupByAgent && (
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="h-10 px-3 text-xs font-semibold glass-input cursor-pointer border border-white/[0.08]"
            >
              <option value="All">All Agents</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          )}

          {/* Filter by Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 px-3 text-xs font-semibold glass-input cursor-pointer border border-white/[0.08]"
          >
            <option value="All">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <span className="text-[10px] font-bold text-slate-500 uppercase font-space shrink-0">
          Showing {filteredLeads.length} of {leads.length} Leads
        </span>
      </div>

      {/* Drag & Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4.5 overflow-x-auto pb-4 items-start select-none custom-scrollbar">
          
          {columns.map((column) => (
            <div 
              key={column.id} 
              className="w-72 shrink-0 flex flex-col max-h-[75vh]"
            >
              {/* Column Header */}
              <div 
                className={`p-4 rounded-t-2xl border-t-2 bg-[#08080d]/80 backdrop-blur-md border border-white/[0.04] border-b-0 flex flex-col gap-1 shrink-0 ${column.color}`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-space font-bold text-xs text-white uppercase tracking-wider truncate max-w-[170px]">
                    {column.title}
                  </h4>
                  <span className="text-[9px] font-mono font-bold text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded border border-neon-cyan/20 shrink-0">
                    {column.count}
                  </span>
                </div>
                {column.subtitle && (
                  <p className="text-[10px] text-slate-500 font-medium">{column.subtitle}</p>
                )}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold font-mono mt-1 pt-1.5 border-t border-white/[0.02]">
                  <span>Total Value</span>
                  <span className="text-white font-bold">{column.valueStr}</span>
                </div>
              </div>

              {/* Droppable Card List */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-3 bg-[#08080d]/40 border border-white/[0.04] rounded-b-2xl flex-1 overflow-y-auto space-y-3.5 custom-scrollbar min-h-[300px] transition-all duration-300
                      ${snapshot.isDraggingOver 
                        ? 'border-dashed border-neon-cyan/35 bg-neon-cyan/[0.02] shadow-[inset_0_0_15px_rgba(0,245,255,0.03)]' 
                        : ''
                      }
                    `}
                  >
                    {column.items.map((lead, index) => {
                      const leadAgent = agents.find(a => a.id === lead.agentId) || { name: 'Unassigned', avatar: '' };
                      
                      // Priority dot class
                      const priorityColor = {
                        high: 'bg-neon-magenta shadow-[0_0_6px_#ff006e]',
                        medium: 'bg-amber-400 shadow-[0_0_6px_#f59e0b]',
                        low: 'bg-emerald-400 shadow-[0_0_6px_#10b981]'
                      }[lead.priority] || 'bg-slate-400';

                      // Stalled lead validation (days >= 14)
                      const isStalled = lead.daysInStage >= 14 && lead.stage !== 'CLOSED WON';

                      return (
                        <Draggable 
                          key={lead.id} 
                          draggableId={lead.id} 
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => setSelectedLeadId(lead.id)}
                              className={`glass-card p-4 cursor-pointer flex flex-col justify-between gap-3 text-left transition-all duration-200
                                ${snapshot.isDragging 
                                  ? 'border-neon-cyan bg-[#0a0a0f] shadow-[0_0_20px_rgba(0,245,255,0.25)] scale-[1.03]' 
                                  : 'hover:border-neon-cyan/25 hover:shadow-[0_0_12px_rgba(0,245,255,0.06)]'
                                }
                              `}
                            >
                              <div>
                                {/* Card Title */}
                                <div className="flex items-start justify-between gap-2">
                                  <h5 className="font-space font-bold text-xs text-white truncate max-w-[80%] hover:text-neon-cyan">
                                    {lead.name}
                                  </h5>
                                  {/* Priority indicator */}
                                  <span className={`w-2 h-2 rounded-full shrink-0 ${priorityColor}`} title={`Priority: ${lead.priority}`} />
                                </div>

                                <p className="text-[10px] text-slate-500 font-mono mt-1">{maskPhone(lead.phone)}</p>

                                {/* Property specifications */}
                                <div className="mt-2.5 flex items-center justify-between gap-1.5 text-[9px] font-semibold text-slate-400">
                                  <span className="truncate">{lead.propertyType} · {lead.locality}</span>
                                  <span className="text-white bg-white/[0.04] px-1.5 py-0.5 rounded font-mono font-bold shrink-0">
                                    {formatBudget(lead.budget)}
                                  </span>
                                </div>
                              </div>

                              {/* Footer details */}
                              <div className="flex items-center justify-between border-t border-white/[0.03] pt-2.5 mt-1">
                                <div className="flex items-center gap-2">
                                  <img 
                                    src={leadAgent.avatar} 
                                    alt={leadAgent.name} 
                                    className="w-5 h-5 rounded-full object-cover border border-white/[0.08]"
                                    title={`Assigned: ${leadAgent.name}`}
                                  />
                                  <span className="text-[9px] text-slate-500 truncate max-w-[80px]">
                                    {leadAgent.name.split(' ')[0]}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {isStalled ? (
                                    <span 
                                      className="text-[9px] font-bold text-neon-magenta bg-neon-magenta/10 border border-neon-magenta/20 px-1.5 py-0.5 rounded flex items-center gap-1 animate-pulse"
                                      title={`Stalled! ${lead.daysInStage} days in stage.`}
                                    >
                                      <AlertTriangle className="w-3 h-3 shrink-0" />
                                      {lead.daysInStage}d
                                    </span>
                                  ) : (
                                    <span className="text-[9px] font-mono text-slate-500">
                                      {lead.daysInStage} days
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}

                    {/* Column footer placeholder btn */}
                    <button
                      onClick={() => setIsAddLeadModalOpen(true)}
                      className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.06] hover:border-neon-cyan/40 bg-white/[0.005] hover:bg-neon-cyan/[0.02] text-slate-500 hover:text-neon-cyan text-[10px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add Lead
                    </button>
                  </div>
                )}
              </Droppable>
            </div>
          ))}

        </div>
      </DragDropContext>

    </div>
  );
}
