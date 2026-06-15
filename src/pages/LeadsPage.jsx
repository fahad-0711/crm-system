import React, { useState, useMemo } from 'react';
import { useCRM } from '../context/CRMContext';
import { LayoutGrid, List, Plus, Users, Sparkles } from 'lucide-react';
import FilterBar from '../components/Leads/FilterBar';
import LeadCard from '../components/Leads/LeadCard';
import LeadTable from '../components/Leads/LeadTable';
import AddLeadModal from '../components/Leads/AddLeadModal';
import LeadDetail from '../components/Leads/LeadDetail';
import Button from '../components/UI/Button';

export default function LeadsPage() {
  const { 
    leads, 
    filters, 
    setIsAddLeadModalOpen, 
    selectedLeadId 
  } = useCRM();

  // Grid vs List View toggle
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Tab switcher local state (independent of dropdown filter status)
  const [activeTabStatus, setActiveTabStatus] = useState('All'); // 'All' | 'Hot' | 'Warm' | 'Cold' | 'Closed'

  const statusTabs = [
    { value: 'All', label: 'All Leads' },
    { value: 'Hot', label: 'Hot 🔥' },
    { value: 'Warm', label: 'Warm ☀️' },
    { value: 'Cold', label: 'Cold ❄️' },
    { value: 'Closed', label: 'Closed ✅' }
  ];

  // Perform dynamic filtering based on filters + active Tab
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Tab Status Filter
      if (activeTabStatus !== 'All' && lead.status !== activeTabStatus) {
        return false;
      }

      // Search matching (Name, Phone, Locality, Property interest)
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(q);
        const matchesPhone = lead.phone.includes(q);
        const matchesLocality = lead.locality.toLowerCase().includes(q);
        const matchesType = lead.propertyType.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesLocality && !matchesType) return false;
      }

      // Status dropdown filter (if not 'All', check if matches)
      if (filters.status !== 'All' && lead.status !== filters.status) {
        return false;
      }

      // Source dropdown filter
      if (filters.source !== 'All' && lead.source !== filters.source) {
        return false;
      }

      // Agent dropdown filter
      if (filters.agentId !== 'All' && lead.agentId !== filters.agentId) {
        return false;
      }

      // Budget Range Filter
      if (filters.budgetRange !== 'All') {
        const val = lead.budget;
        if (filters.budgetRange === 'under50L' && val >= 5000000) return false;
        if (filters.budgetRange === '50L-1Cr' && (val < 5000000 || val > 10000000)) return false;
        if (filters.budgetRange === '1Cr-2Cr' && (val < 10000000 || val > 20000000)) return false;
        if (filters.budgetRange === 'over2Cr' && val <= 20000000) return false;
      }

      // Date Range Filter (Next Follow-up)
      if (filters.dateRange !== 'All') {
        const today = new Date().toISOString().split('T')[0];
        if (filters.dateRange === 'today' && lead.nextFollowUp !== today) {
          return false;
        }
        // Simplified week check
        if (filters.dateRange === 'week') {
          const date = new Date(lead.nextFollowUp);
          const limit = new Date();
          limit.setDate(limit.getDate() + 7);
          if (date > limit || lead.nextFollowUp < today) return false;
        }
      }

      return true;
    });
  }, [leads, filters, activeTabStatus]);

  return (
    <div className="space-y-6 pb-12 relative z-10">
      
      {/* Title & Actions Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-space font-bold text-2xl text-white uppercase tracking-wider flex items-center gap-2">
            <Users className="w-6 h-6 text-neon-cyan" />
            Lead Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse, filter, and quick-edit your agency prospects
          </p>
        </div>
        
        <Button 
          variant="cyan"
          className="gap-2 shrink-0"
          onClick={() => setIsAddLeadModalOpen(true)}
        >
          <Plus className="w-4 h-4 text-slate-900 stroke-[3]" />
          Add New Lead
        </Button>
      </div>

      {/* Filter Bar */}
      <FilterBar />

      {/* Tab Selector & Grid/List View Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {statusTabs.map((tab) => {
            const isActive = activeTabStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTabStatus(tab.value)}
                className={`px-4 py-2 font-space text-xs font-bold uppercase tracking-wider rounded-xl transition-all relative shrink-0
                  ${isActive 
                    ? 'text-white border border-neon-cyan/30 bg-neon-cyan/5 shadow-[0_0_12px_rgba(0,245,255,0.1)]' 
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02] border border-transparent'
                  }
                `}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-neon-cyan shadow-[0_0_8px_#00f5ff]" />
                )}
              </button>
            );
          })}
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-2 shrink-0 border border-white/[0.08] p-1.5 rounded-xl bg-white/[0.01]">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-neon-cyan/15 text-neon-cyan shadow-[inset_0_0_8px_rgba(0,245,255,0.1)]' : 'text-slate-400 hover:text-white'}`}
            title="Grid Card View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-neon-cyan/15 text-neon-cyan shadow-[inset_0_0_8px_rgba(0,245,255,0.1)]' : 'text-slate-400 hover:text-white'}`}
            title="List Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Empty States Check */}
      {filteredLeads.length === 0 ? (
        <div className="glass-card py-20 text-center flex flex-col items-center justify-center">
          <Sparkles className="w-10 h-10 text-neon-cyan/40 animate-pulse mb-3" />
          <h3 className="font-space font-bold text-sm text-slate-300 uppercase">No Matches Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            There are no leads matching your active status search filters. Try adjusting your parameters or reset the filters.
          </p>
        </div>
      ) : (
        /* Render View Mode content */
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        ) : (
          <LeadTable filteredLeads={filteredLeads} />
        )
      )}

      {/* Add Lead Popup Form Modal */}
      <AddLeadModal />

      {/* Sliding Lead Profile Detail Panel */}
      <LeadDetail />

    </div>
  );
}
