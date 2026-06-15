import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { UserPlus, Phone, Calendar, Send } from 'lucide-react';
import Card from '../UI/Card';

export default function QuickActions({ animateDelayClass = '' }) {
  const { setIsAddLeadModalOpen, setIsAddActivityOpen } = useCRM();

  const actions = [
    {
      label: 'Add Lead',
      description: 'Log inquiry',
      icon: UserPlus,
      color: 'cyan',
      glowClass: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20 shadow-[0_0_15px_rgba(0,245,255,0.25)]',
      onClick: () => setIsAddLeadModalOpen(true)
    },
    {
      label: 'Log Call',
      description: 'Log client call',
      icon: Phone,
      color: 'purple',
      glowClass: 'text-neon-purple bg-neon-purple/10 border-neon-purple/20 shadow-[0_0_15px_rgba(191,0,255,0.25)]',
      onClick: () => setIsAddActivityOpen(true)
    },
    {
      label: 'Schedule Visit',
      description: 'Arrange site tour',
      icon: Calendar,
      color: 'magenta',
      glowClass: 'text-neon-magenta bg-neon-magenta/10 border-neon-magenta/20 shadow-[0_0_15px_rgba(255,0,110,0.25)]',
      onClick: () => setIsAddActivityOpen(true)
    },
    {
      label: 'Send Proposal',
      description: 'Mail details',
      icon: Send,
      color: 'cyan',
      glowClass: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20 shadow-[0_0_15px_rgba(0,245,255,0.25)]',
      onClick: () => setIsAddActivityOpen(true)
    }
  ];

  return (
    <Card
      title="Quick Actions"
      subtitle="Immediate dashboard tasks"
      animateDelayClass={animateDelayClass}
      className="h-[380px]"
    >
      <div className="grid grid-cols-2 gap-4 mt-2">
        {actions.map((act, index) => {
          const Icon = act.icon;
          return (
            <button
              key={index}
              onClick={act.onClick}
              className="p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:border-neon-cyan/30 text-left transition-all duration-300 group hover:shadow-[0_0_20px_rgba(0,245,255,0.08)] hover:-translate-y-1"
            >
              {/* Glowing Icon Container */}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mb-3 group-hover:scale-105 transition-transform duration-300 ${act.glowClass}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-space font-bold text-xs text-white uppercase tracking-wider group-hover:text-neon-cyan transition-colors">
                {act.label}
              </h4>
              <p className="text-[10px] text-slate-500 mt-1 font-medium font-sans">
                {act.description}
              </p>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
