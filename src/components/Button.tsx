import { Link } from 'react-router-dom'
import { ReactNode } from 'react'
import React from 'react'

interface ButtonProps {
  children: ReactNode
  to?: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
}

export default function Button({ children, to, variant = 'primary', onClick, className = '' }: ButtonProps) {
  const baseClasses = 'relative px-8 py-3 font-medium min-w-[150px] border-1 transition-colors overflow-hidden skew-x-[-12deg] rounded-[25px]';

  const variantClasses = {
    primary: 'bg-[rgba(152,122,31,0.50)] text-white hover:bg-[rgba(152,122,31,0.55)]',
    secondary: 'bg-[rgba(255,255,255,0.5)] border border-gray-300 text-gray-700 hover:bg-[rgba(152,122,31,0.18)]'
  };

  const blobStyle = {
    position: 'absolute',
    top: '-30%',
    left: '-20%',
    width: '140%',
    height: '160%',
    zIndex: 0,
    pointerEvents: 'none',
    filter: 'blur(2px) opacity(0.7)',
  };

  const blobSvg = (
    <svg viewBox="0 0 200 200" style={blobStyle}>
      <path fill="#fffbe6" d="M44.8,-67.2C56.2,-59.2,62.7,-44.2,68.2,-29.2C73.7,-14.2,78.2,0.8,74.2,13.7C70.2,26.6,57.7,37.4,44.2,47.2C30.7,57,15.3,65.8,0.2,65.6C-14.9,65.4,-29.8,56.2,-41.2,45.2C-52.6,34.2,-60.6,21.4,-65.2,6.7C-69.8,-8,-71,-24.6,-63.7,-36.2C-56.4,-47.8,-40.7,-54.4,-25.7,-60.7C-10.7,-67,3.7,-73,18.2,-74.2C32.7,-75.4,48.2,-71.2,44.8,-67.2Z" transform="translate(100 100)" />
    </svg>
  );

  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

  const content = (
    <span style={{ position: 'relative', zIndex: 2, display: 'inline-block', transform: 'skewX(12deg)' }}>{children}</span>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
}