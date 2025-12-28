import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading,
  icon,
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed text-sm tracking-wide";
  
  const variants = {
    primary: "bg-gradient-brand text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:brightness-110",
    secondary: "bg-white text-slate-800 border border-slate-100 shadow-sm hover:bg-slate-50 hover:shadow-md",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-brand-primary hover:text-brand-primary bg-transparent",
    ghost: "text-slate-500 hover:bg-slate-100 hover:text-slate-900",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full group">
    {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-brand-primary transition-colors">{label}</label>}
    <input 
      className={`bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary focus:outline-none transition-all placeholder:text-slate-400 ${className}`}
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full group">
    {label && <label className="text-xs font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-brand-primary transition-colors">{label}</label>}
    <div className="relative">
      <select 
        className={`appearance-none bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-3 w-full focus:ring-2 focus:ring-brand-secondary/50 focus:border-brand-secondary focus:outline-none transition-all cursor-pointer ${className}`}
        {...props}
      >
        <option value="" disabled>Select an option</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; hover?: boolean }> = ({ children, className = '', hover = false }) => (
  <div className={`bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden ${hover ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl' : ''} ${className}`}>
    {children}
  </div>
);

export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
  <div 
    className={`animate-slide-up ${className}`}
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'backwards' }}
  >
    {children}
  </div>
);