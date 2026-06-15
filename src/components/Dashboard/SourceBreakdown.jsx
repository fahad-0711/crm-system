import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useCRM } from '../../context/CRMContext';
import Card from '../UI/Card';

export default function SourceBreakdown({ animateDelayClass = '' }) {
  const { leads } = useCRM();

  // Color mapping for each source type
  const COLORS = {
    'MagicBricks': '#00f5ff', // Neon Cyan
    '99acres': '#bf00ff',     // Neon Purple
    'Walk-in': '#ff006e',     // Hot Magenta
    'Instagram': '#f59e0b',    // Amber/Yellow
    'Referral': '#10b981'     // Emerald
  };

  const chartData = useMemo(() => {
    const counts = {};
    const sources = ['MagicBricks', '99acres', 'Walk-in', 'Instagram', 'Referral'];
    
    // Initialize
    sources.forEach(s => { counts[s] = 0; });
    
    // Count
    leads.forEach(lead => {
      if (counts[lead.source] !== undefined) {
        counts[lead.source] += 1;
      } else {
        // Handle custom sources if any
        counts[lead.source] = 1;
      }
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(counts).map(([name, count]) => ({
      name,
      value: count,
      percentage: Math.round((count / total) * 100),
      color: COLORS[name] || '#94a3b8'
    }));
  }, [leads]);

  // Custom Glassmorphic Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#08080d]/95 border border-neon-cyan/20 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="font-space font-bold text-xs text-white uppercase tracking-wider">{data.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="text-[11px] text-slate-300 font-semibold">{data.value} leads ({data.percentage}%)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card 
      title="Lead Source Breakdown" 
      subtitle="Top channels distribution"
      animateDelayClass={animateDelayClass}
      className="h-[340px]"
    >
      <div className="flex flex-col justify-between h-full -mt-2">
        {/* Pie Chart container */}
        <div className="w-full h-44 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                isAnimationActive={true}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="rgba(10, 10, 15, 0.8)"
                    strokeWidth={2}
                    className="focus:outline-none cursor-pointer hover:opacity-85 transition-opacity"
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Inner circle text overlay */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
            <span className="font-space font-bold text-xl text-white">{leads.length}</span>
          </div>
        </div>

        {/* Custom Legend */}
        <div className="grid grid-cols-3 gap-y-2.5 gap-x-2 border-t border-white/[0.04] pt-4 mt-auto">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center gap-2 overflow-hidden">
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-[0_0_8px_currentColor]" 
                style={{ 
                  backgroundColor: item.color,
                  color: item.color 
                }} 
              />
              <div className="overflow-hidden">
                <p className="text-[10px] font-semibold text-slate-300 truncate">{item.name}</p>
                <p className="text-[9px] font-bold text-slate-500 font-mono mt-0.5">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
