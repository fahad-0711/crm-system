import React from 'react';

export default function Card({ 
  children, 
  title, 
  subtitle,
  headerAction,
  className = '', 
  hoverEffect = true,
  animateDelayClass = '', // e.g. 'delay-1', 'delay-2'
  ...props 
}) {
  return (
    <div 
      className={`glass-card p-6 flex flex-col justify-between opacity-0 animate-fade-up
        ${hoverEffect ? 'hover:border-neon-cyan/35 hover:-translate-y-1' : ''} 
        ${animateDelayClass}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between mb-5 shrink-0">
          <div>
            {title && (
              <h3 className="font-space font-bold text-sm tracking-wide text-white uppercase">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          {headerAction && (
            <div className="flex items-center">{headerAction}</div>
          )}
        </div>
      )}
      <div className="flex-1 w-full">{children}</div>
    </div>
  );
}
