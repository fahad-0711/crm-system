import React from 'react';

export default function Badge({ 
  children, 
  variant = 'cyan', // 'cyan' (Hot) | 'yellow' (Warm) | 'gray' (Cold) | 'green' (Closed) | 'purple' (New/Negotiation)
  glow = true,
  className = '',
  ...props 
}) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border';
  
  const variantStyles = {
    cyan: glow 
      ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan shadow-[0_0_10px_rgba(0,245,255,0.2)]'
      : 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan',
    yellow: glow
      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
      : 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    gray: 'bg-slate-500/10 border-slate-500/20 text-slate-400',
    green: glow
      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
      : 'bg-emerald-500/10 border-emerald-500/20 text-[#10b981]',
    purple: glow
      ? 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple shadow-[0_0_10px_rgba(191,0,255,0.2)]'
      : 'bg-neon-purple/10 border-neon-purple/20 text-neon-purple',
    magenta: glow
      ? 'bg-neon-magenta/10 border-neon-magenta/30 text-neon-magenta shadow-[0_0_10px_rgba(255,0,110,0.2)]'
      : 'bg-neon-magenta/10 border-neon-magenta/20 text-neon-magenta'
  };

  return (
    <span 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
