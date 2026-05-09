import { type ReactNode } from 'react'
import { cn } from '../utils/cn'

type BadgeColor = 'yellow' | 'blue' | 'indigo' | 'green' | 'gray' | 'red'

interface BadgeProps {
  color: BadgeColor
  children: ReactNode
  className?: string
}

const colors: Record<BadgeColor, string> = {
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  blue:   'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  green:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  gray:   'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
  red:    'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
}

export function Badge({ color, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap',
        colors[color],
        className
      )}
    >
      {children}
    </span>
  )
}
