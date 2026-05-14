import { type ReactNode } from 'react'
import { cn } from '../utils/cn'

type AlertVariant = 'error' | 'info' | 'success' | 'warning'

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
  className?: string
}

const variants: Record<AlertVariant, string> = {
  error:   'bg-[var(--ios-red-soft)]    text-[var(--ios-red-ink)]',
  info:    'bg-[var(--ios-blue-soft)]   text-[var(--ios-blue-ink)]',
  success: 'bg-[var(--ios-green-soft)]  text-[var(--ios-green-ink)]',
  warning: 'bg-[var(--ios-orange-soft)] text-[var(--ios-orange-ink)]',
}

export function Alert({ variant = 'error', children, className }: AlertProps) {
  return (
    <div
      className={cn(
        'rounded-[12px] px-3.5 py-2.5 text-[14px] font-medium tracking-[-0.01em]',
        variants[variant],
        className
      )}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  )
}
