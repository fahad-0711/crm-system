import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Search, Bell, Sparkles, MessageSquare, AlertTriangle, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

export default function Topbar() {
  const { filters, setFilters, agents } = useCRM();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock Notifications
  const mockNotifications = [
    { id: 1, type: 'alert', text: 'Lead "Vikram Nair" has spent 12 days in NEGOTIATION.', time: '10m ago', icon: AlertTriangle, color: 'text-neon-magenta bg-neon-magenta/10 border-neon-magenta/20' },
    { id: 2, type: 'chat', text: 'Priya Reddy assigned you a new inquiry "Ravi Kumar".', time: '1h ago', icon: UserCheck, color: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20' },
    { id: 3, type: 'system', text: 'Site Visit scheduled with Ananya Sharma at 11:00 AM.', time: '2h ago', icon: MessageSquare, color: 'text-neon-purple bg-neon-purple/10 border-neon-purple/20' }
  ];

  const handleSearchChange = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value
    }));
  };

  const todayStr = format(new Date(), 'EEEE, MMM d');

  const teamLead = agents.find(a => a.role === 'Team Lead') || agents[0];

  return (
    <header className="h-20 border-b border-white/[0.04] bg-[#0a0a0f]/40 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
      {/* Left Greeting */}
      <div>
        <h1 className="font-space font-bold text-lg text-white flex items-center gap-2">
          Good Morning, Pintu 
          <span className="animate-bounce inline-block">👋</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Welcome back to your agency dashboard</p>
      </div>

      {/* Center Date & City */}
      <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.05]">
        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
        <span className="font-space text-xs font-semibold text-slate-300 tracking-wider">
          {todayStr} · Bengaluru
        </span>
      </div>

      {/* Right Search, Notification & Profile */}
      <div className="flex items-center gap-4">
        {/* Glassmorphism Search */}
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads, local areas..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-64 h-10 pl-10 pr-4 text-xs font-medium glass-input"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-neon-cyan/50 flex items-center justify-center text-slate-400 hover:text-white transition-all relative
              ${showNotifications ? 'border-neon-cyan text-white shadow-[0_0_12px_rgba(0,245,255,0.25)]' : ''}
            `}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neon-magenta flex items-center justify-center text-[9px] font-bold text-white shadow-[0_0_8px_#ff006e] animate-pulse">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#08080d]/95 border border-neon-cyan/20 backdrop-blur-2xl shadow-2xl p-4 z-50 animate-fade-up">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <h4 className="font-space font-semibold text-xs text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neon-cyan" />
                  Agent Activities
                </h4>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-[10px] font-semibold text-neon-cyan hover:underline"
                >
                  Mark all read
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {mockNotifications.map((notif) => {
                  const IconComponent = notif.icon;
                  return (
                    <div 
                      key={notif.id}
                      className="flex gap-3 p-2.5 rounded-xl border border-white/[0.02] bg-white/[0.01] hover:bg-white/[0.03] transition-all duration-200 cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${notif.color}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed break-words">{notif.text}</p>
                        <span className="text-[9px] text-slate-500 font-semibold mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold font-sans select-none shrink-0"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #bf00ff)',
              fontSize: '14px',
              boxShadow: '0 0 12px rgba(0, 245, 255, 0.4)'
            }}
          >
            PS
          </div>
        </div>
      </div>
    </header>
  );
}
