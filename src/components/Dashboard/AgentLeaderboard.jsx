import React, { useMemo } from 'react';
import { useCRM } from '../../context/CRMContext';
import { Crown } from 'lucide-react';
import Card from '../UI/Card';

export default function AgentLeaderboard({ animateDelayClass = '' }) {
  const { agents } = useCRM();

  // Sort agents by activeLeads descending
  const sortedAgents = useMemo(() => {
    return [...agents].sort((a, b) => b.activeLeads - a.activeLeads);
  }, [agents]);

  const maxLeads = useMemo(() => {
    return Math.max(...agents.map(a => a.activeLeads), 1);
  }, [agents]);

  return (
    <Card
      title="Agent Leaderboard"
      subtitle="Ranked by active deals"
      animateDelayClass={animateDelayClass}
      className="h-[380px]"
    >
      <div className="space-y-4 mt-2">
        {sortedAgents.map((agent, index) => {
          const isTop = index === 0;
          const pct = Math.round((agent.activeLeads / maxLeads) * 100);

          return (
            <div 
              key={agent.id}
              className={`flex items-center gap-3.5 p-2.5 rounded-xl border transition-all duration-300
                ${isTop 
                  ? 'bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                  : 'bg-white/[0.01] border-white/[0.03]'
                }
              `}
            >
              {/* Rank / Crown */}
              <div className="w-6 flex items-center justify-center shrink-0">
                {isTop ? (
                  <Crown className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                ) : (
                  <span className="font-space font-bold text-xs text-slate-500 font-mono">
                    #{index + 1}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="relative shrink-0">
                <img 
                  src={agent.avatar} 
                  alt={agent.name} 
                  className={`w-10 h-10 rounded-xl object-cover border
                    ${isTop ? 'border-amber-500/40' : 'border-white/[0.08]'}
                  `}
                />
                {agent.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0a0a0f] rounded-full shadow-[0_0_6px_#10b981]" />
                )}
              </div>

              {/* Detail & Bar */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="text-xs font-semibold text-white truncate font-space">
                    {agent.name}
                  </h4>
                  <span className="text-[10px] font-bold font-mono text-slate-400">
                    {agent.activeLeads} Deals
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 w-full rounded-full bg-white/[0.03] overflow-hidden p-[1px]">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000
                      ${isTop 
                        ? 'bg-gradient-to-r from-amber-500 to-amber-300 shadow-[0_0_8px_#f59e0b]' 
                        : 'bg-gradient-to-r from-neon-purple to-neon-cyan'
                      }
                    `}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
