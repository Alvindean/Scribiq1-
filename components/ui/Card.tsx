import { cn } from '@/lib/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-surface border border-white/5 rounded-xl p-6',
        hover &&
          'transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/10',
        className
      )}
    >
      {children}
    </div>
  )
}
