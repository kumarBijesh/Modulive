import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary: 'bg-foreground text-background hover:bg-accent-warm hover:text-white shadow-sm hover:shadow-md active:scale-[0.99]',
      secondary: 'bg-muted text-foreground hover:bg-border active:scale-[0.99]',
      outline: 'border border-border text-foreground hover:border-foreground hover:bg-foreground hover:text-background',
      ghost: 'text-foreground hover:bg-muted',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.99]',
    }

    const sizes = {
      sm: 'px-4 py-2 text-xs tracking-wider uppercase',
      md: 'px-6 py-3 text-sm tracking-wide',
      lg: 'px-8 py-4 text-base tracking-wide',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4 text-current fill-none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading...
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
