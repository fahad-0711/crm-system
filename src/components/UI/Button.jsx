import React from 'react';

export default function Button({ 
  children, 
  variant = 'cyan', // 'cyan' | 'purple' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  ...props 
}) {
  const baseStyles = 'inline-flex items-center justify-center font-space font-semibold tracking-wide rounded-lg transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base'
  };

  const variantStyles = {
    cyan: 'bg-neon-cyan text-[#0a0a0f] hover:bg-[#00e1eb] hover:shadow-[0_0_20px_rgba(0,245,255,0.6)] hover:-translate-y-0.5',
    purple: 'bg-neon-purple text-white hover:bg-[#b000eb] hover:shadow-[0_0_20px_rgba(191,0,255,0.6)] hover:-translate-y-0.5',
    outline: 'border border-neon-cyan/40 text-neon-cyan bg-neon-cyan/5 hover:border-neon-cyan hover:bg-neon-cyan/15 hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] hover:-translate-y-0.5',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/[0.04]',
    danger: 'bg-neon-magenta text-white hover:bg-[#e60062] hover:shadow-[0_0_20px_rgba(255,0,110,0.5)] hover:-translate-y-0.5'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
