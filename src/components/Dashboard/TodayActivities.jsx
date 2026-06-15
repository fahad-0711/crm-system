import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Plus, Check, Calendar, Phone, MapPin, Mail, MessageSquare } from 'lucide-react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import Modal from '../UI/Modal';
import Input from '../UI/Input';

export default function TodayActivities({ animateDelayClass = '' }) {
  const { 
    activities, 
    toggleActivityStatus, 
    addActivity, 
    isAddActivityOpen, 
    setIsAddActivityOpen,
    leads
  } = useCRM();

  // Modal Form State
  const [form, setForm] = useState({
    content: '',
    leadId: '',
    time: '10:00 AM',
    type: 'Call',
    status: 'upcoming'
  });

  const [errors, setErrors] = useState({});

  const handleToggle = (id) => {
    toggleActivityStatus(id);
  };

  const handleOpenModal = () => {
    setForm({
      content: '',
      leadId: '',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Call',
      status: 'upcoming'
    });
    setErrors({});
    setIsAddActivityOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.content.trim()) newErrors.content = 'Activity description is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const selectedLead = leads.find(l => l.id === form.leadId);
    
    addActivity({
      content: form.content,
      leadId: form.leadId || null,
      leadName: selectedLead ? selectedLead.name : 'General Agency',
      time: form.time,
      type: form.type,
      status: form.status
    });

    setIsAddActivityOpen(false);
  };

  // Activity Type Icon selector
  const getActivityIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'call':
      case 'follow-up call':
        return Phone;
      case 'site visit':
        return MapPin;
      case 'email':
        return Mail;
      case 'meeting':
        return Calendar;
      default:
        return MessageSquare;
    }
  };

  return (
    <Card
      title="Today's Activities"
      subtitle="Agenda & Client Schedules"
      animateDelayClass={animateDelayClass}
      className="h-[460px] flex flex-col justify-between"
    >
      {/* Scrollable Timeline */}
      <div className="relative pl-6 space-y-5 h-[320px] overflow-y-auto pr-1">
        {/* Timeline Line */}
        <span 
          className="absolute left-[9px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-neon-cyan via-neon-purple to-neon-magenta" 
          style={{
            boxShadow: '0 0 8px rgba(0, 245, 255, 0.4)'
          }}
        />

        {activities.map((act) => {
          const IconComponent = getActivityIcon(act.type);
          const isCompleted = act.status === 'completed';
          
          // Color based on status/type
          let statusGlowClass = 'border-neon-cyan bg-[#0a0a0f] text-neon-cyan shadow-[0_0_8px_rgba(0,245,255,0.4)]';
          if (isCompleted) {
            statusGlowClass = 'border-emerald-500 bg-emerald-500 text-[#0a0a0f] shadow-[0_0_8px_rgba(16,185,129,0.5)]';
          } else if (act.type.toLowerCase() === 'follow-up call') {
            statusGlowClass = 'border-neon-magenta bg-[#0a0a0f] text-neon-magenta shadow-[0_0_8px_rgba(255,0,110,0.4)]';
          } else if (act.type.toLowerCase() === 'meeting') {
            statusGlowClass = 'border-neon-purple bg-[#0a0a0f] text-neon-purple shadow-[0_0_8px_rgba(191,0,255,0.4)]';
          }

          return (
            <div 
              key={act.id} 
              className="relative flex items-start justify-between gap-3 group transition-all duration-300"
            >
              {/* Timeline Dot / Action Checkbox */}
              <button
                onClick={() => handleToggle(act.id)}
                className={`absolute -left-[23px] top-1.5 w-[20px] h-[20px] rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 z-10 hover:scale-115 ${statusGlowClass}`}
              >
                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3.5]" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h4 className={`text-xs font-semibold truncate ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {act.content}
                  </h4>
                  <span className="text-[10px] font-bold text-slate-500 shrink-0 font-mono">
                    {act.time}
                  </span>
                </div>
                
                {/* Associated Lead Tag */}
                {act.leadName && (
                  <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-1 font-space">
                    <IconComponent className="w-3 h-3 text-slate-500" />
                    Client: <span className="text-neon-cyan font-bold">{act.leadName}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Button Action */}
      <div className="pt-4 shrink-0">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full justify-center gap-2 border-neon-cyan/20 text-neon-cyan"
          onClick={handleOpenModal}
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </Button>
      </div>

      {/* Add Activity Modal */}
      <Modal
        isOpen={isAddActivityOpen}
        onClose={() => setIsAddActivityOpen(false)}
        title="Schedule CRM Activity"
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Activity Description"
            placeholder="e.g. Site Visit at Prestige Falcon City, Call Arjun Mehta"
            name="content"
            value={form.content}
            onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
            required
            error={errors.content}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Activity Type"
              type="select"
              name="type"
              value={form.type}
              onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
              options={[
                { value: 'Call', label: '📞 Phone Call' },
                { value: 'Site visit', label: '📍 Site Visit' },
                { value: 'Email', label: '📧 Email Sent' },
                { value: 'Meeting', label: '🤝 Client Meeting' }
              ]}
            />

            <Input
              label="Time"
              placeholder="e.g. 11:30 AM"
              name="time"
              value={form.time}
              onChange={(e) => setForm(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>

          <Input
            label="Link to Lead (Optional)"
            type="select"
            name="leadId"
            value={form.leadId}
            onChange={(e) => setForm(prev => ({ ...prev, leadId: e.target.value }))}
            options={[
              { value: '', label: 'General / No Specific Lead' },
              ...leads.map(l => ({ value: l.id, label: `${l.name} (${l.propertyType})` }))
            ]}
          />

          <div className="flex gap-3 justify-end pt-3">
            <Button variant="ghost" onClick={() => setIsAddActivityOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="cyan">
              Save Activity
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
