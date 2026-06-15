import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { X, CheckCircle, AlertCircle, Info, Flame } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useCRM();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  const { message, type } = toast;

  const typeConfig = {
    success: {
      borderColor: 'border-l-emerald-500 border-white/[0.08]',
      icon: CheckCircle,
      iconColor: 'text-emerald-400',
      glow: 'shadow-[0_0_15px_rgba(16,185,129,0.15)]'
    },
    info: {
      borderColor: 'border-l-neon-cyan border-white/[0.08]',
      icon: Info,
      iconColor: 'text-neon-cyan',
      glow: 'shadow-[0_0_15px_rgba(0,245,255,0.15)]'
    },
    warning: {
      borderColor: 'border-l-amber-500 border-white/[0.08]',
      icon: Flame,
      iconColor: 'text-amber-400',
      glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]'
    },
    danger: {
      borderColor: 'border-l-neon-magenta border-white/[0.08]',
      icon: AlertCircle,
      iconColor: 'text-neon-magenta',
      glow: 'shadow-[0_0_15px_rgba(255,0,110,0.15)]'
    }
  };

  const config = typeConfig[type] || typeConfig.success;
  const Icon = config.icon;

  return (
    <div 
      className={`pointer-events-auto flex gap-3.5 p-4 rounded-xl bg-[#08080d]/95 border-l-4 border ${config.borderColor} ${config.glow} backdrop-blur-xl transition-all duration-300 w-full animate-slide-in-right`}
      style={{
        animation: 'slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}
    >
      {/* Slide in Keyframe style (embedded or declared in CSS) */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>

      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${config.iconColor} mt-0.5`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 overflow-hidden">
        <p className="text-xs font-semibold text-white leading-relaxed pr-2">
          {message}
        </p>
      </div>

      <button 
        onClick={onClose}
        className="text-slate-500 hover:text-white transition-all shrink-0 mt-0.5 self-start"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
