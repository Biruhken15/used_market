import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) => {
    const baseStyles = "px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-center inline-flex items-center justify-center gap-2";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-200 hover:shadow-md",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 border border-slate-200",
        outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 font-bold",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    };

    const widthStyle = fullWidth ? "w-full" : "";

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
