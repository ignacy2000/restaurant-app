import { type ReactNode } from 'react'
import { cn } from '../utils/cn'

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[var(--ios-surface)] rounded-[14px] shadow-[var(--ios-shadow-1)]',
        className
      )}
    >
      {children}
    </div>
  )
}
