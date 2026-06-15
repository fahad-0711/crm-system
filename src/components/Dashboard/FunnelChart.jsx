import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from '../UI/Card';

export default function FunnelChart({ animateDelayClass = '' }) {
  const data = [
    { stage: 'Inquiry', rate: 100, color: '#00f5ff' },
    { stage: 'Visit', rate: 72, color: '#06b6d4' },
    { stage: 'Negotiation', rate: 45, color: '#bf00ff' },
    { stage: 'Doc Draft', rate: 28, color: '#9333ea' },
    { stage: 'Closed Won', rate: 18, color: '#ff006e' }
  ];

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#08080d]/95 border border-neon-cyan/20 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md">
          <p className="font-space font-bold text-xs text-white uppercase tracking-wider">{payload[0].payload.stage}</p>
          <p className="text-[11px] text-neon-cyan font-bold font-mono mt-0.5">
            Conversion: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card
      title="Conversion Funnel Rate"
      subtitle="Stage-to-stage conversion efficiency"
      animateDelayClass={animateDelayClass}
      className="h-[380px]"
    >
      <div className="w-full h-64 -mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="funnelGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bf00ff" stopOpacity={0.85} />
                <stop offset="100%" stopColor="#00f5ff" stopOpacity={0.15} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="stage" 
              stroke="#475569" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
              fontFamily="var(--font-space)"
              tick={{ fill: '#94a3b8', fontWeight: 600 }}
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dx={-5}
              fontFamily="var(--font-space)"
              tick={{ fill: '#94a3b8' }}
              unit="%"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.01)' }} />
            <Bar 
              dataKey="rate" 
              radius={[6, 6, 0, 0]}
              isAnimationActive={true}
              animationDuration={1500}
              fill="url(#funnelGrad)"
              barSize={28}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  stroke={entry.color}
                  strokeWidth={1.5}
                  style={{
                    filter: `drop-shadow(0px 0px 6px ${entry.color}40)`
                  }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
