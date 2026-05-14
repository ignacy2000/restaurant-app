import { type ReactNode } from 'react'
import { cn } from '../utils/cn'

type BadgeColor = 'yellow' | 'blue' | 'indigo' | 'green' | 'gray' | 'red' | 'orange'

interface BadgeProps {
  color: BadgeColor
  children: ReactNode
  className?: string
  /** Show the leading dot in the pill (iOS-style status capsule). */
  dot?: boolean
}

const colors: Record<BadgeColor, string> = {
  yellow: 'bg-[var(--ios-yellow-soft)] text-[var(--ios-yellow-ink)]',
  blue:   'bg-[var(--ios-blue-soft)] text-[var(--ios-blue-ink)]',
  indigo: 'bg-[var(--ios-indigo-soft)] text-[var(--ios-indigo-ink)]',
  green:  'bg-[var(--ios-green-soft)] text-[var(--ios-green-ink)]',
  gray:   'bg-[var(--ios-surface-2)] text-[var(--ios-ink-2)]',
  red:    'bg-[var(--ios-red-soft)] text-[var(--ios-red-ink)]',
  orange: 'bg-[var(--ios-orange-soft)] text-[var(--ios-orange-ink)]',
}

export function Badge({ color, children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-[12px] font-semibold rounded-full whitespace-nowrap tracking-[-0.01em]',
        dot ? 'pl-2 pr-2.5 py-1' : 'px-2.5 py-1',
        colors[color],
        className
      )}
    >
      {dot && <span className="w-[6px] h-[6px] rounded-full bg-current opacity-85" />}
      {children}
    </span>
  )
}
