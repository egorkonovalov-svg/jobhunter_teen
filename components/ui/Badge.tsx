import clsx from 'clsx'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'internship' | 'part-time' | 'gig' | 'active' | 'inactive' | 'default'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        {
          'bg-indigo-100 text-indigo-800': variant === 'internship',
          'bg-cyan-100 text-cyan-800': variant === 'part-time',
          'bg-green-100 text-green-800': variant === 'gig',
          'bg-emerald-100 text-emerald-700': variant === 'active',
          'bg-gray-100 text-gray-600': variant === 'inactive' || variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
