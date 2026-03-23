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
          'bg-teal-light text-teal': variant === 'internship',
          'bg-[#FFF8ED] text-[#96722B]': variant === 'part-time',
          'bg-[#F0F0E8] text-[#5C5C2A]': variant === 'gig',
          'bg-[#E8F0E8] text-[#2A5C2A]': variant === 'active',
          'bg-warm-gray text-text-secondary': variant === 'inactive' || variant === 'default',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
