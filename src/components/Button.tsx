import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  to?: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  className?: string
}

export default function Button({ children, to, variant = 'primary', onClick, className = '' }: ButtonProps) {
  const baseClasses = 'rounded-[25px] px-6 py-3 font-medium transition-colors'
  
  const variantClasses = {
    primary: 'bg-indigo-500 text-white hover:bg-indigo-600',
    secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`
  
  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }
  
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  )
}