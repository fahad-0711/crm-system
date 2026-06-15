import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { 
  X, Phone, MessageSquare, Mail, User, Clock, 
  MapPin, CheckSquare, Plus, FileText, Upload, Trash2, MapIcon
} from 'lucide-react';
import Button from '../UI/Button';
import Input from '../UI/Input';
import Badge from '../UI/Badge';

export default function LeadDetail() {
  const { 
    selectedLead, 
    setSelectedLeadId, 
    agents, 
    updateLead, 
    deleteLead,
    addToast 
  } = useCRM();

  // Return empty if no lead selected
  if (!selectedLead) return null;

  const agent = agents.find(a => a.id === selectedLead.agentId) || { name: 'Unassigned', avatar: '' };

  // Edit Mode state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...selectedLead });
  const [errors, setErrors] = useState({});

  // Reset form data when selectedLead changes
  useEffect(() => {
    setFormData({ ...selectedLead });
    setIsEditing(false);
    setErrors({});
  }, [selectedLead]);

  // Log Activity Local State
  const [logText, setLogText] = useState('');
  const [logType, setLogType] = useState('Call');

  // Document list local state
  const [documents, setDocuments] = useState([
    { id: 'doc-1', name: 'Layout_Blueprints.pdf', size: '2.4 MB', date: '2026-06-12' },
    { id: 'doc-2', name: 'Sale_Deed_Draft.docx', size: '480 KB', date: '2026-06-13' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.locality.trim()) newErrors.locality = 'Locality is required';
    if (!formData.budget) newErrors.budget = 'Budget is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveInfo = () => {
    if (!validate()) return;
    updateLead(selectedLead.id, {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      locality: formData.locality,
      budget: Number(formData.budget),
      notes: formData.notes
    });
    setIsEditing(false);
  };

  // Log a new activity onto the timeline
  const handleLogActivity = (e) => {
    e.preventDefault();
    if (!logText.trim()) return;

    const newActivity = {
      id: `act-loc-${Date.now()}`,
      type: logType,
      content: `${logType} log: ${logText}`,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · Today',
      completed: true
    };

    // Append activity to lead
    const updatedActivities = [newActivity, ...(selectedLead.activities || [])];
    updateLead(selectedLead.id, { activities: updatedActivities });
    setLogText('');
    addToast('Interaction logged successfully!', 'success');
  };

  // Mock Upload Document
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newDoc = {
      id: `doc-${Date.now()}`,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: new Date().toISOString().split('T')[0]
    };

    setDocuments(prev => [newDoc, ...prev]);
    addToast(`Document "${file.name}" uploaded successfully.`, 'success');
  };

  const handleDeleteDoc = (docId, name) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
    addToast(`Document "${name}" deleted`, 'warning');
  };

  // Stage move helper
  const handleStageMove = (newStage) => {
    updateLead(selectedLead.id, { stage: newStage });
  };

  // Related Properties generator based on locality and property interest
  const relatedProperties = [
    { id: 'prop-1', name: `Premium ${selectedLead.propertyType} Residencies`, loc: selectedLead.locality, price: `₹${(selectedLead.budget / 10000000 * 0.95).toFixed(1)}Cr - ₹${(selectedLead.budget / 10000000 * 1.1).toFixed(1)}Cr` },
    { id: 'prop-2', name: `${selectedLead.locality} Heights Modern Luxury`, loc: selectedLead.locality, price: `₹${(selectedLead.budget / 10000000 * 1.05).toFixed(1)}Cr` }
  ];

  const stages = [
    { key: 'NEW INQUIRY', label: 'New Inquiry' },
    { key: 'SITE VISIT SCHEDULED', label: 'Site Visit' },
    { key: 'NEGOTIATION', label: 'Negotiation' },
    { key: 'DOCUMENTATION', label: 'Documentation' },
    { key: 'CLOSED WON', label: 'Closed Won' }
  ];

  return (
    <div className="fixed inset-0 w-full h-full z-40 flex justify-end">
      
      {/* Drawer Backdrop */}
      <div 
        onClick={() => setSelectedLeadId(null)}
        className="absolute inset-0 bg-[#06060a]/75 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Body Container */}
      <div 
        className="relative w-full max-w-6xl h-full bg-[#0a0a0f]/95 border-l border-white/[0.08] shadow-2xl flex flex-col z-10 animate-slide-in-right"
        style={{
          boxShadow: '-10px 0 40px rgba(0, 245, 255, 0.08)',
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        {/* Header bar */}
        <div className="h-18 px-6 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="font-space font-bold text-base text-white uppercase tracking-wider truncate max-w-[280px]">
              {selectedLead.name}
            </h2>
            <Badge variant={selectedLead.status === 'Hot' ? 'cyan' : selectedLead.status === 'Warm' ? 'yellow' : selectedLead.status === 'Closed' ? 'green' : 'gray'}>
              {selectedLead.status}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                if (confirm(`Are you sure you want to delete lead: ${selectedLead.name}?`)) {
                  deleteLead(selectedLead.id);
                }
              }}
              className="px-3.5 py-1.5 rounded-lg border border-neon-magenta/20 text-neon-magenta hover:bg-neon-magenta/10 hover:shadow-[0_0_12px_rgba(255,0,110,0.15)] text-xs font-bold font-space uppercase transition-all duration-300"
            >
              Delete Lead
            </button>
            <button 
              onClick={() => setSelectedLeadId(null)}
              className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-neon-cyan/50 text-slate-400 hover:text-white flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Layout (Three Panels) */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.04] h-full">
          
          {/* PANEL 1: Left (Editable Info) (4 cols) */}
          <div className="lg:col-span-4 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.04] pb-2.5">
                <h3 className="font-space font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-neon-cyan" />
                  Lead Information
                </h3>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-[10px] font-bold uppercase tracking-wider text-neon-cyan hover:underline"
                >
                  {isEditing ? 'Cancel' : 'Edit Info'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4 animate-fade-up">
                  <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />
                  <Input
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    error={errors.phone}
                  />
                  <Input
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                  />
                  <Input
                    label="Preferred Locality"
                    name="locality"
                    value={formData.locality}
                    onChange={handleInputChange}
                    error={errors.locality}
                  />
                  <Input
                    label="Budget (Rupees)"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    error={errors.budget}
                  />
                  <Input
                    label="Internal Notes"
                    type="textarea"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                  <Button variant="cyan" className="w-full" onClick={handleSaveInfo}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Locality Preference</span>
                    <p className="text-white font-medium mt-0.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {selectedLead.locality}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Budget Details</span>
                    <p className="text-neon-cyan font-bold font-mono mt-0.5 text-sm">
                      ₹{(selectedLead.budget / 100000).toFixed(0)}L ({selectedLead.budget.toLocaleString('en-IN')} Rupees)
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Contact Email</span>
                    <p className="text-slate-300 font-medium mt-0.5 flex items-center gap-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {selectedLead.email || 'No email registered'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Contact Phone</span>
                    <p className="text-slate-300 font-mono font-medium mt-0.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {selectedLead.phone}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Timeline Requirement</span>
                    <p className="text-white font-medium mt-0.5">
                      {selectedLead.timeline || 'Immediate'}
                    </p>
                  </div>
                  <div className="bg-white/[0.01] p-3 rounded-xl border border-white/[0.04] mt-2">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">Lead Requirements</span>
                    <p className="text-slate-300 mt-1 leading-relaxed italic">
                      "{selectedLead.notes || 'No notes added yet. Double-click or click Edit to add client description details.'}"
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-white/[0.04] flex gap-2">
              <button 
                onClick={() => addToast(`Simulating outbound VoIP call to ${selectedLead.phone}...`, 'info')}
                className="flex-1 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/50 hover:bg-neon-cyan/5 text-slate-300 hover:text-neon-cyan flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
              >
                <Phone className="w-4 h-4" />
                Call Agent
              </button>
              <button 
                onClick={() => addToast(`Opening WhatsApp chat for ${selectedLead.name}...`, 'success')}
                className="flex-1 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/50 hover:bg-emerald-500/5 text-slate-300 hover:text-emerald-400 flex items-center justify-center gap-1.5 text-xs font-bold transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                WhatsApp
              </button>
            </div>
          </div>

          {/* PANEL 2: Center (Activity Timeline) (4 cols) */}
          <div className="lg:col-span-4 p-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-4 flex-1 flex flex-col min-h-0">
              <h3 className="font-space font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/[0.04] pb-2.5 shrink-0">
                <Clock className="w-4 h-4 text-neon-purple" />
                Activity Timeline
              </h3>

              {/* Log Activity Form */}
              <form onSubmit={handleLogActivity} className="space-y-3 shrink-0">
                <div className="flex gap-2">
                  <select 
                    value={logType}
                    onChange={(e) => setLogType(e.target.value)}
                    className="h-9 px-2 text-xs font-semibold glass-input cursor-pointer rounded-lg shrink-0 w-24 border border-white/[0.08]"
                  >
                    <option value="Call">📞 Call</option>
                    <option value="Visit">📍 Visit</option>
                    <option value="Email">📧 Email</option>
                    <option value="Task">📌 Task</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Log client notes/call details..."
                    value={logText}
                    onChange={(e) => setLogText(e.target.value)}
                    className="flex-1 h-9 px-3 text-xs glass-input rounded-lg border border-white/[0.08]"
                  />
                  <button 
                    type="submit"
                    className="px-3 rounded-lg bg-neon-purple text-white hover:bg-purple-600 transition-all text-xs font-bold"
                  >
                    Log
                  </button>
                </div>
              </form>

              {/* Historical logs list */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-2 relative pl-4 custom-scrollbar">
                <span className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-white/[0.08]" />
                
                {selectedLead.activities && selectedLead.activities.length > 0 ? (
                  selectedLead.activities.map((act) => (
                    <div key={act.id} className="relative text-xs">
                      {/* Bullet dot */}
                      <span className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full border border-[#0a0a0f] bg-neon-purple shadow-[0_0_6px_#bf00ff]" />
                      
                      <div className="bg-white/[0.01] p-2.5 rounded-xl border border-white/[0.02]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-[10px] uppercase text-neon-purple font-space tracking-wider">{act.type}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{act.date}</span>
                        </div>
                        <p className="text-slate-300 mt-1.5 font-medium leading-relaxed">{act.content}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-xs">No client interactions logged yet.</p>
                    <p className="text-[10px] mt-1">Use the field above to log calls or visits.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* PANEL 3: Right (Pipeline Stage, Agents, Documents) (4 cols) */}
          <div className="lg:col-span-4 p-6 space-y-6 overflow-y-auto custom-scrollbar">
            
            {/* Pipeline stages selector */}
            <div className="space-y-3">
              <h3 className="font-space font-bold text-xs text-white uppercase tracking-wider">
                Move Pipeline Stage
              </h3>
              <div className="flex flex-col gap-1.5">
                {stages.map((st) => {
                  const isActive = selectedLead.stage === st.key;
                  let colorClass = 'border-white/[0.06] text-slate-400 hover:border-white/20 hover:bg-white/[0.02]';
                  if (isActive) {
                    if (st.key === 'CLOSED WON') colorClass = 'border-emerald-500 bg-emerald-500/10 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)]';
                    else if (st.key === 'DOCUMENTATION' || st.key === 'NEGOTIATION') colorClass = 'border-neon-purple bg-neon-purple/10 text-neon-purple shadow-[0_0_12px_rgba(191,0,255,0.15)]';
                    else colorClass = 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_12px_rgba(0,245,255,0.15)]';
                  }

                  return (
                    <button
                      key={st.key}
                      onClick={() => handleStageMove(st.key)}
                      className={`w-full py-2 px-3 rounded-lg border text-left font-space text-[10px] font-bold uppercase tracking-wider transition-all duration-200
                        ${colorClass}
                      `}
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Agent Assignee */}
            <div className="space-y-3">
              <h3 className="font-space font-bold text-xs text-white uppercase tracking-wider">
                Assign to Agent
              </h3>
              <select
                value={selectedLead.agentId}
                onChange={(e) => {
                  updateLead(selectedLead.id, { agentId: e.target.value });
                  addToast(`Lead reassigned successfully!`, 'success');
                }}
                className="w-full h-10 px-3 text-xs font-semibold glass-input cursor-pointer border border-white/[0.08]"
              >
                {agents.map(a => (
                  <option key={a.id} value={a.id} className="bg-[#0a0a0f] text-white">
                    {a.name} ({a.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Related Properties */}
            <div className="space-y-3">
              <h3 className="font-space font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapIcon className="w-3.5 h-3.5 text-neon-cyan" />
                Related Properties
              </h3>
              <div className="space-y-2">
                {relatedProperties.map(prop => (
                  <div 
                    key={prop.id}
                    className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl hover:border-neon-cyan/30 transition-all cursor-pointer group"
                    onClick={() => addToast(`Opening brochure details for ${prop.name}...`, 'info')}
                  >
                    <h5 className="font-space text-xs font-bold text-slate-300 group-hover:text-neon-cyan truncate">{prop.name}</h5>
                    <div className="flex items-center justify-between mt-2 text-[10px] text-slate-500 font-semibold font-mono">
                      <span>{prop.loc}</span>
                      <span className="text-white font-bold">{prop.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document upload area */}
            <div className="space-y-3">
              <h3 className="font-space font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neon-purple" />
                Documents
              </h3>

              {/* Upload Dropzone */}
              <div className="relative border border-dashed border-white/[0.08] hover:border-neon-purple/50 rounded-xl p-4 bg-white/[0.01] flex flex-col items-center justify-center cursor-pointer transition-all duration-200 group">
                <input 
                  type="file" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                />
                <Upload className="w-5 h-5 text-slate-500 group-hover:text-neon-purple transition-colors shrink-0 mb-1.5" />
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors">Drag or Browse Files</span>
                <span className="text-[8px] text-slate-600 font-medium mt-0.5">PDF, DOCX, ZIP up to 10MB</span>
              </div>

              {/* Document List */}
              <div className="space-y-2 mt-2">
                {documents.map((doc) => (
                  <div 
                    key={doc.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/[0.03] text-[11px] font-medium"
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="w-3.5 h-3.5 text-neon-purple shrink-0" />
                      <span className="text-slate-300 truncate max-w-[120px]" title={doc.name}>
                        {doc.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5 shrink-0 text-[10px] font-mono text-slate-500 font-semibold">
                      <span>{doc.size}</span>
                      <button 
                        onClick={() => handleDeleteDoc(doc.id, doc.name)}
                        className="text-slate-600 hover:text-neon-magenta transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
