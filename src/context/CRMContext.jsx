import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const CRMContext = createContext();

// Mock Agents
const INITIAL_AGENTS = [
  { id: 'agent-1', name: 'Priya Reddy', role: 'Team Lead', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces', activeLeads: 12, online: true },
  { id: 'agent-2', name: 'Rahul Sharma', role: 'Agent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces', activeLeads: 8, online: true },
  { id: 'agent-3', name: 'Meera Krishnan', role: 'Agent', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces', activeLeads: 6, online: false },
  { id: 'agent-4', name: 'Arjun Tiwari', role: 'Agent', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces', activeLeads: 9, online: true }
];

// Mock Leads
const INITIAL_LEADS = [
  {
    id: 'lead-1',
    name: 'Ravi Kumar',
    phone: '9876543210',
    email: 'ravi.kumar@gmail.com',
    source: 'MagicBricks',
    propertyType: '3BHK',
    locality: 'Whitefield',
    budget: 8500000, // ₹85L
    status: 'Hot',
    agentId: 'agent-1',
    stage: 'NEW INQUIRY',
    lastContacted: '2 days ago',
    nextFollowUp: '2026-06-16',
    notes: 'Looking for a high-rise apartment with east-facing balcony. Ready to visit this week.',
    daysInStage: 3,
    priority: 'high',
    activities: [
      { id: 'act-1-1', type: 'Call', content: 'Initial introduction call, scheduled site visit', date: '2026-06-12 10:30 AM', completed: true }
    ]
  },
  {
    id: 'lead-2',
    name: 'Ananya Sharma',
    phone: '9845012345',
    email: 'ananya.sharma@hotmail.com',
    source: 'Instagram',
    propertyType: 'Villa',
    locality: 'Sarjapur',
    budget: 18000000, // ₹1.8Cr
    status: 'Warm',
    agentId: 'agent-2',
    stage: 'SITE VISIT SCHEDULED',
    lastContacted: '1 day ago',
    nextFollowUp: '2026-06-15',
    notes: 'Prefers gated community villas. Wants modern design with private garden area.',
    daysInStage: 5,
    priority: 'medium',
    activities: [
      { id: 'act-2-1', type: 'Email', content: 'Sent brochure for Prestige Villa project', date: '2026-06-13 12:30 PM', completed: true }
    ]
  },
  {
    id: 'lead-3',
    name: 'Arjun Mehta',
    phone: '9900112233',
    email: 'arjun.mehta@yahoo.com',
    source: 'Walk-in',
    propertyType: '2BHK',
    locality: 'Electronic City',
    budget: 5500000, // ₹55L
    status: 'Cold',
    agentId: 'agent-3',
    stage: 'NEW INQUIRY',
    lastContacted: '5 days ago',
    nextFollowUp: '2026-06-18',
    notes: 'Budget strictly under 60L. Needs close proximity to tech parks.',
    daysInStage: 15, // Red warning since > 14 days
    priority: 'low',
    activities: []
  },
  {
    id: 'lead-4',
    name: 'Sunita Rao',
    phone: '9811223344',
    email: 'sunita.rao@outlook.com',
    source: '99acres',
    propertyType: 'Plot',
    locality: 'Devanahalli',
    budget: 4500000, // ₹45L
    status: 'Hot',
    agentId: 'agent-1',
    stage: 'NEGOTIATION',
    lastContacted: '3 hours ago',
    nextFollowUp: '2026-06-15',
    notes: 'Negotiating plot price near airport. Looking for a 10% discount on down payment.',
    daysInStage: 8,
    priority: 'high',
    activities: []
  },
  {
    id: 'lead-5',
    name: 'Vikram Nair',
    phone: '9922334455',
    email: 'vikram.nair@gmail.com',
    source: 'Referral',
    propertyType: '4BHK',
    locality: 'Indiranagar',
    budget: 24000000, // ₹2.4Cr
    status: 'Hot',
    agentId: 'agent-4',
    stage: 'NEGOTIATION',
    lastContacted: '4 days ago',
    nextFollowUp: '2026-06-16',
    notes: 'High-end buyer. Requesting luxury specifications, home automation. Negotiation in final stage.',
    daysInStage: 12,
    priority: 'high',
    activities: []
  },
  {
    id: 'lead-6',
    name: 'Divya Patel',
    phone: '9833445566',
    email: 'divya.patel@rediffmail.com',
    source: 'MagicBricks',
    propertyType: '3BHK',
    locality: 'Hennur',
    budget: 7200000, // ₹72L
    status: 'Warm',
    agentId: 'agent-2',
    stage: 'NEW INQUIRY',
    lastContacted: '2 days ago',
    nextFollowUp: '2026-06-17',
    notes: 'Interested in properties close to Outer Ring Road. Family friendly amenities required.',
    daysInStage: 2,
    priority: 'medium',
    activities: []
  },
  {
    id: 'lead-7',
    name: 'Suresh Iyer',
    phone: '9744556677',
    email: 'suresh.iyer@iyerassociates.in',
    source: 'Walk-in',
    propertyType: 'Commercial',
    locality: 'HSR Layout',
    budget: 32000000, // ₹3.2Cr
    status: 'Closed',
    agentId: 'agent-1',
    stage: 'DOCUMENTATION',
    lastContacted: '1 day ago',
    nextFollowUp: '2026-06-15',
    notes: 'Buying commercial office space for dental clinic. Draft agreement in review.',
    daysInStage: 6,
    priority: 'high',
    activities: []
  },
  {
    id: 'lead-8',
    name: 'Kavya Reddy',
    phone: '9655667788',
    email: 'kavya.reddy@gmail.com',
    source: 'Instagram',
    propertyType: '2BHK',
    locality: 'Yelahanka',
    budget: 4800000, // ₹48L
    status: 'Warm',
    agentId: 'agent-3',
    stage: 'NEW INQUIRY',
    lastContacted: '3 days ago',
    nextFollowUp: '2026-06-19',
    notes: 'First-time homebuyer. Prefers ready-to-move-in. Requires home loan assistance.',
    daysInStage: 4,
    priority: 'low',
    activities: []
  },
  {
    id: 'lead-9',
    name: 'Rajesh Patel',
    phone: '9822114455',
    email: 'rajesh.patel@patelbuilders.com',
    source: 'MagicBricks',
    propertyType: 'Villa',
    locality: 'Whitefield',
    budget: 28000000, // ₹2.8Cr
    status: 'Hot',
    agentId: 'agent-4',
    stage: 'NEGOTIATION',
    lastContacted: '2 days ago',
    nextFollowUp: '2026-06-16',
    notes: 'Ultra luxury villa requirement. Has visited twice, price negotiations active.',
    daysInStage: 9,
    priority: 'high',
    activities: []
  },
  {
    id: 'lead-10',
    name: 'Amit Mishra',
    phone: '9555667788',
    email: 'amit.mishra@yahoo.com',
    source: '99acres',
    propertyType: '3BHK',
    locality: 'Bellandur',
    budget: 9500000, // ₹95L
    status: 'Cold',
    agentId: 'agent-2',
    stage: 'SITE VISIT SCHEDULED',
    lastContacted: '6 days ago',
    nextFollowUp: '2026-06-20',
    notes: 'Visited site but did not like construction quality. Looking for other layouts.',
    daysInStage: 11,
    priority: 'medium',
    activities: []
  },
  {
    id: 'lead-11',
    name: 'Rohan Gupta',
    phone: '9888776655',
    email: 'rohan.gupta@guptacorp.com',
    source: 'Walk-in',
    propertyType: 'Commercial',
    locality: 'Indiranagar',
    budget: 15000000, // ₹1.5Cr
    status: 'Closed',
    agentId: 'agent-1',
    stage: 'CLOSED WON',
    lastContacted: 'Yesterday',
    nextFollowUp: null,
    notes: 'Retail showroom lease contract signed. First payment processed successfully.',
    daysInStage: 14,
    priority: 'medium',
    activities: []
  },
  {
    id: 'lead-12',
    name: 'Sneha Reddy',
    phone: '9123456789',
    email: 'sneha.reddy@gmail.com',
    source: 'Referral',
    propertyType: '3BHK',
    locality: 'Sarjapur',
    budget: 11000000, // ₹1.1Cr
    status: 'Warm',
    agentId: 'agent-3',
    stage: 'DOCUMENTATION',
    lastContacted: '3 days ago',
    nextFollowUp: '2026-06-16',
    notes: 'Draft sale deed sent. Waiting for bank NOC clearance to complete registration.',
    daysInStage: 4,
    priority: 'high',
    activities: []
  }
];

// Mock Activities
const INITIAL_ACTIVITIES = [
  { id: 'act-1', leadId: 'lead-1', leadName: 'Ravi Kumar', type: 'Call', time: '9:30 AM', status: 'completed', content: 'Called Ravi Kumar' },
  { id: 'act-2', leadId: 'lead-2', leadName: 'Ananya Sharma', type: 'Site visit', time: '11:00 AM', status: 'pending', content: 'Site visit — Prestige Falcon City' },
  { id: 'act-3', leadId: 'lead-2', leadName: 'Ananya Sharma', type: 'Email', time: '12:30 PM', status: 'completed', content: 'Sent proposal' },
  { id: 'act-4', leadId: 'lead-3', leadName: 'Arjun Mehta', type: 'Follow-up call', time: '3:00 PM', status: 'upcoming', content: 'Follow-up call' },
  { id: 'act-5', leadId: null, leadName: 'Builder XYZ', type: 'Meeting', time: '5:00 PM', status: 'upcoming', content: 'Meeting — Builder XYZ' }
];

export const CRMProvider = ({ children }) => {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [toasts, setToasts] = useState([]);
  
  // Navigation: 'dashboard' | 'leads' | 'pipeline' | other placeholders
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modals & Panels
  const [selectedLeadId, setSelectedLeadId] = useState(null); // ID for LeadDetail view
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'All', // 'All', 'Hot', 'Warm', 'Cold', 'Closed'
    source: 'All', // 'All', 'MagicBricks', '99acres', 'Walk-in', 'Instagram', 'Referral'
    agentId: 'All', // 'All', 'agent-1', etc
    budgetRange: 'All', // 'All', 'under50L', '50L-1Cr', '1Cr-2Cr', 'over2Cr'
    dateRange: 'All'
  });

  // Toast System
  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // CRUD Leads
  const addLead = useCallback((newLeadData) => {
    const newLead = {
      id: `lead-${Date.now()}`,
      daysInStage: 0,
      priority: 'medium',
      activities: [],
      lastContacted: 'Just now',
      nextFollowUp: newLeadData.nextFollowUp || new Date().toISOString().split('T')[0],
      ...newLeadData,
      budget: Number(newLeadData.budget) || 0
    };
    
    setLeads(prev => [newLead, ...prev]);
    
    // Add activity log
    const newAct = {
      id: `act-${Date.now()}`,
      leadId: newLead.id,
      leadName: newLead.name,
      type: 'New Inquiry',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      content: `Lead created: ${newLead.name}`
    };
    setActivities(prev => [newAct, ...prev]);
    
    addToast(`Lead "${newLead.name}" added successfully!`, 'success');
  }, [addToast]);

  const updateLead = useCallback((leadId, updatedFields) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const result = { ...lead, ...updatedFields };
        if (updatedFields.budget) {
          result.budget = Number(updatedFields.budget);
        }
        return result;
      }
      return lead;
    }));
    
    // If the stage changed, add an activity log
    if (updatedFields.stage) {
      const lead = leads.find(l => l.id === leadId);
      const newAct = {
        id: `act-${Date.now()}`,
        leadId: leadId,
        leadName: lead?.name || 'Unknown',
        type: 'Pipeline Move',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        content: `Lead moved to ${updatedFields.stage}`
      };
      setActivities(prev => [newAct, ...prev]);
      addToast(`Lead moved to ${updatedFields.stage}`, 'info');
    } else {
      addToast('Lead details updated', 'success');
    }
  }, [leads, addToast]);

  const deleteLead = useCallback((leadId) => {
    const lead = leads.find(l => l.id === leadId);
    setLeads(prev => prev.filter(l => l.id !== leadId));
    addToast(`Lead "${lead?.name || ''}" removed`, 'warning');
    if (selectedLeadId === leadId) {
      setSelectedLeadId(null);
    }
  }, [leads, selectedLeadId, addToast]);

  // Kanban Reorder/Move Drag and Drop
  const moveLeadStage = useCallback((leadId, destinationStage) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        return {
          ...lead,
          stage: destinationStage,
          daysInStage: 0, // Reset counter on stage entry
          lastContacted: 'Just now'
        };
      }
      return lead;
    }));

    const lead = leads.find(l => l.id === leadId);
    
    const newAct = {
      id: `act-${Date.now()}`,
      leadId: leadId,
      leadName: lead?.name || 'Unknown',
      type: 'Pipeline Move',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      content: `Moved to ${destinationStage}`
    };
    setActivities(prev => [newAct, ...prev]);
    addToast(`"${lead?.name}" moved to ${destinationStage.toLowerCase().replace(/_/g, ' ')}`, 'success');
  }, [leads, addToast]);

  // Activities Manager
  const addActivity = useCallback((activityData) => {
    const newAct = {
      id: `act-${Date.now()}`,
      status: 'upcoming',
      time: activityData.time || '10:00 AM',
      leadName: activityData.leadName || 'General',
      ...activityData
    };
    setActivities(prev => [newAct, ...prev]);
    addToast(`Activity scheduled: ${newAct.content}`, 'success');
  }, [addToast]);

  const toggleActivityStatus = useCallback((actId) => {
    setActivities(prev => prev.map(act => {
      if (act.id === actId) {
        const nextStatus = act.status === 'completed' ? 'pending' : 'completed';
        addToast(`Activity marked as ${nextStatus}`, 'info');
        return { ...act, status: nextStatus };
      }
      return act;
    }));
  }, [addToast]);

  // Get active selected lead details
  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find(l => l.id === selectedLeadId) || null;
  }, [leads, selectedLeadId]);

  // Computed Stats for Pipeline Value, etc.
  const pipelineStats = useMemo(() => {
    const totalCount = leads.length;
    const hotCount = leads.filter(l => l.status === 'Hot').length;
    
    // total value (in Rupees)
    const totalValue = leads.reduce((sum, lead) => sum + lead.budget, 0);
    const closedCount = leads.filter(l => l.stage === 'CLOSED WON').length;
    
    return {
      totalLeads: totalCount,
      hotLeads: hotCount,
      pipelineValue: totalValue, // e.g. 184000000 for ₹18.4Cr
      closedDeals: closedCount
    };
  }, [leads]);

  const valueFormatted = useMemo(() => {
    // Convert Rupee value to Cr (Crore) or L (Lakh)
    const val = pipelineStats.pipelineValue;
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(1)}Cr`;
    } else {
      return `₹${(val / 100000).toFixed(0)}L`;
    }
  }, [pipelineStats.pipelineValue]);

  return (
    <CRMContext.Provider value={{
      leads,
      agents,
      activities,
      toasts,
      activeTab,
      setActiveTab,
      selectedLeadId,
      setSelectedLeadId,
      selectedLead,
      isAddLeadModalOpen,
      setIsAddLeadModalOpen,
      isAddActivityOpen,
      setIsAddActivityOpen,
      filters,
      setFilters,
      pipelineStats,
      valueFormatted,
      addToast,
      removeToast,
      addLead,
      updateLead,
      deleteLead,
      moveLeadStage,
      addActivity,
      toggleActivityStatus
    }}>
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
