import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center font-medium rounded-lg tracking-wide transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]',
        {
          'bg-midnight text-white hover:bg-navy focus:ring-midnight': variant === 'primary',
          'bg-gold text-midnight hover:bg-gold-hover focus:ring-gold': variant === 'accent',
          'bg-warm-gray text-midnight border border-border hover:bg-border focus:ring-border': variant === 'secondary',
          'border border-midnight text-midnight hover:bg-midnight hover:text-white focus:ring-midnight': variant === 'outline',
          'bg-red-700 text-white hover:bg-red-800 focus:ring-red-700': variant === 'danger',
          'text-xs px-3 py-1.5': size === 'sm',
          'text-sm px-4 py-2': size === 'md',
          'text-base px-6 py-3': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
