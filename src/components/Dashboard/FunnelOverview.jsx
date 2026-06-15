import React, { useEffect, useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import Card from '../UI/Card';

export default function FunnelOverview({ animateDelayClass = '' }) {
  const { leads } = useCRM();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute counts for each stage
  const stages = [
    { key: 'NEW INQUIRY', label: 'New Inquiry', colorClass: 'bg-neon-cyan shadow-[0_0_12px_#00f5ff]', barColor: '#00f5ff' },
    { key: 'SITE VISIT SCHEDULED', label: 'Site Visit', colorClass: 'bg-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]', barColor: '#06b6d4' },
    { key: 'NEGOTIATION', label: 'Negotiation', colorClass: 'bg-neon-purple shadow-[0_0_12px_#bf00ff]', barColor: '#bf00ff' },
    { key: 'DOCUMENTATION', label: 'Documentation', colorClass: 'bg-purple-600 shadow-[0_0_12px_rgba(147,51,234,0.8)]', barColor: '#9333ea' },
    { key: 'CLOSED WON', label: 'Closed Won', colorClass: 'bg-neon-magenta shadow-[0_0_12px_#ff006e]', barColor: '#ff006e' }
  ];

  const stageCounts = stages.map(stage => {
    const count = leads.filter(l => l.stage === stage.key).length;
    return {
      ...stage,
      count
    };
  });

  const maxCount = Math.max(...stageCounts.map(s => s.count), 1);

  return (
    <Card 
      title="Lead Pipeline Overview" 
      subtitle="Horizontal conversion stages"
      animateDelayClass={animateDelayClass}
      className="h-[340px]"
    >
      <div className="space-y-4.5 mt-2">
        {stageCounts.map((stage, idx) => {
          // Calculate percentage width of the bar relative to max stage count
          const pct = Math.round((stage.count / maxCount) * 100);
          
          return (
            <div key={stage.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-300 font-space tracking-wide flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">0{idx + 1}</span>
                  {stage.label}
                </span>
                <span className="font-mono text-white bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.05]">
                  {stage.count} {stage.count === 1 ? 'Lead' : 'Leads'}
                </span>
              </div>
              
              {/* Outer Bar Track */}
              <div className="h-6 w-full rounded-lg bg-white/[0.02] border border-white/[0.04] overflow-hidden p-[2px]">
                {/* Glowing Fill Bar */}
                <div
                  className={`h-full rounded-md transition-all duration-[1200ms] cubic-bezier(0.25, 0.8, 0.25, 1) ${stage.colorClass}`}
                  style={{
                    width: mounted ? `${Math.max(pct, 8)}%` : '0%',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
