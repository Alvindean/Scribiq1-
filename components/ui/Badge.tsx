import { cn } from '@/lib/cn'

type BadgeVariant = 'amber' | 'indigo' | 'green' | 'red' | 'muted'
type BadgeSize = 'sm' | 'md'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  amber:
    'bg-brand/15 text-brand border border-brand/30',
  indigo:
    'bg-accent/15 text-accent border border-accent/30',
  green:
    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  red:
    'bg-red-500/15 text-red-400 border border-red-500/30',
  muted:
    'bg-white/5 text-[#8888A8] border border-white/10',
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
}

export function Badge({
  children,
  variant = 'muted',
  size = 'sm',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full font-sans',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  )
}
