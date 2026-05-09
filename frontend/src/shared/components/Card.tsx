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
        'bg-white border border-gray-200 rounded-xl shadow-sm',
        'dark:bg-gray-800 dark:border-gray-700',
        className
      )}
    >
      {children}
    </div>
  )
}
