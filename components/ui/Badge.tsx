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
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider',
        {
          'bg-teal-light text-teal border border-teal/20': variant === 'internship',
          'bg-amber-50 text-amber-800 border border-amber-200/50': variant === 'part-time',
          'bg-stone-100 text-stone-700 border border-stone-200/50': variant === 'gig',
          'bg-emerald-50 text-emerald-700 border border-emerald-200/50': variant === 'active',
          'bg-warm-gray text-text-secondary border border-border': variant === 'inactive' || variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
