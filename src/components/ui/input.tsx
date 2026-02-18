import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = ({ label, className = '', ...props }: InputProps) => {
    return (
        <div className="space-y-1.5 w-full text-left">
            {label && <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>}
            <input
                className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 ${className}`}
                {...props}
            />
        </div>
    );
};
