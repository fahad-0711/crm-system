import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showClose = true,
  className = '',
  ...props
}) {
  // ESC key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeWidths = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
    full: 'max-w-[95%] h-[90vh]'
  };

  return (
    <div className="fixed inset-0 w-full h-full z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#06060a]/80 backdrop-blur-md transition-opacity duration-300"
      />

      {/* Modal Container */}
      <div 
        className={`w-full bg-[#0a0a0f]/95 border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative z-10 transition-all duration-300 scale-95 opacity-0 animate-fade-up
          ${sizeWidths[size]}
          ${className}
        `}
        style={{
          boxShadow: '0 0 40px rgba(0, 245, 255, 0.1), 0 25px 50px -12px rgba(0, 0, 0, 0.8)',
          animation: 'fadeUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        }}
        {...props}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] shrink-0">
            {title ? (
              <h2 className="font-space font-bold text-base text-white uppercase tracking-wider">
                {title}
              </h2>
            ) : <div />}
            
            {showClose && (
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/[0.06] text-slate-400 hover:text-white hover:border-neon-cyan/50 flex items-center justify-center transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
