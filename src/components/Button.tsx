import { Link } from 'react-router-dom'
import { ReactNode } from 'react'
import React from 'react'

interface ButtonProps {
  children: ReactNode
  to?: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export default function Button({ children, to, variant = 'primary', onClick, className = '', disabled = false }: ButtonProps) {
  const baseClasses = 'inline-block text-center relative px-8 py-3 font-medium min-w-[150px] border-1 transition-colors overflow-hidden skew-x-[-12deg] rounded-[25px]';

  const variantClasses = {
    primary: 'bg-[rgba(152,122,31,0.50)] text-white hover:bg-[rgba(152,122,31,0.55)]',
    secondary: 'bg-[rgba(255,255,255,0.5)] border border-gray-300 text-gray-700 hover:bg-[rgba(152,122,31,0.18)]'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`;

  const content = (
    <span className="relative z-20 inline-block transform transform-skew-x-[12deg]">{children}</span>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes} disabled={disabled}>
      {content}
    </button>
  );
}