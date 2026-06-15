import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import Card from '../UI/Card';

// Hook to animate number count up
function useCountUp(target, duration = 1200, isFloat = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const end = parseFloat(target);
    if (isNaN(end)) {
      setCount(target);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * end;
      
      setCount(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [target, duration, isFloat]);

  return count;
}

export default function StatCard({
  title,
  targetValue,
  isFloat = false,
  prefix = '',
  suffix = '',
  trendText,
  trendDirection = 'up', // 'up' | 'down'
  icon: Icon,
  color = 'cyan', // 'cyan' | 'purple' | 'magenta' | 'green'
  sparklineData = [],
  animateDelayClass = ''
}) {
  const animatedValue = useCountUp(targetValue, 1200, isFloat);

  const colorsConfig = {
    cyan: {
      glow: 'shadow-[0_0_15px_rgba(0,245,255,0.3)] bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan',
      sparkColor: '#00f5ff',
      gradientId: 'sparkGradCyan'
    },
    purple: {
      glow: 'shadow-[0_0_15px_rgba(191,0,255,0.3)] bg-neon-purple/10 border-neon-purple/20 text-neon-purple',
      sparkColor: '#bf00ff',
      gradientId: 'sparkGradPurple'
    },
    magenta: {
      glow: 'shadow-[0_0_15px_rgba(255,0,110,0.3)] bg-neon-magenta/10 border-neon-magenta/20 text-neon-magenta',
      sparkColor: '#ff006e',
      gradientId: 'sparkGradMagenta'
    },
    green: {
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-emerald-500/10 border-emerald-500/20 text-[#10b981]',
      sparkColor: '#10b981',
      gradientId: 'sparkGradGreen'
    }
  };

  const config = colorsConfig[color] || colorsConfig.cyan;

  return (
    <Card 
      animateDelayClass={animateDelayClass} 
      className="relative overflow-hidden h-36 flex flex-col justify-between"
      hoverEffect={true}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-space font-bold tracking-wider text-slate-500 uppercase">
            {title}
          </span>
          <h2 className="font-space font-bold text-2xl text-white mt-1 flex items-baseline">
            {prefix}{animatedValue}{suffix}
          </h2>
        </div>

        {/* Glowing Icon */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 ${config.glow}`}>
          <Icon className="w-4.5 h-4.5" />
        </div>
      </div>

      <div className="flex items-center justify-between mt-auto">
        {/* Trend Indicator */}
        <span className={`inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase
          ${trendDirection === 'up' ? 'text-emerald-400' : 'text-neon-magenta'}
        `}>
          {trendDirection === 'up' ? '▲' : '▼'} {trendText}
        </span>

        {/* Sparkline */}
        <div className="w-24 h-10 -mr-4 -mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData}>
              <defs>
                <linearGradient id={config.gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={config.sparkColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={config.sparkColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="val"
                stroke={config.sparkColor}
                strokeWidth={1.5}
                fill={`url(#${config.gradientId})`}
                dot={false}
                isAnimationActive={true}
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
