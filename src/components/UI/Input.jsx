import React from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder = '',
  name,
  value,
  onChange,
  required = false,
  error = '',
  options = [], // Used for 'select' type
  rows = 4, // Used for 'textarea' type
  className = '',
  ...props
}) {
  const baseInputStyles = 'w-full h-11 px-4 text-sm font-medium glass-input transition-all duration-200';
  const errorStyles = error ? 'border-neon-magenta/60 hover:border-neon-magenta focus:border-neon-magenta focus:shadow-[0_0_12px_rgba(255,0,110,0.3)]' : '';

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="font-space text-xs font-semibold text-slate-300 uppercase tracking-wider">
          {label} {required && <span className="text-neon-magenta">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseInputStyles} ${errorStyles} cursor-pointer appearance-none bg-no-repeat bg-[right_1rem_center]`}
          style={{
            backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundSize: '16px'
          }}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0a0f] text-white">
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className={`w-full p-3 text-sm font-medium glass-input min-h-[100px] resize-y ${errorStyles}`}
          {...props}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${baseInputStyles} ${errorStyles}`}
          {...props}
        />
      )}

      {error && (
        <span className="text-[11px] font-medium text-neon-magenta uppercase tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}
