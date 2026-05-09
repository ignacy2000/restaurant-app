import { type ReactNode } from 'react'
import { cn } from '../utils/cn'

type AlertVariant = 'error' | 'info' | 'success'

interface AlertProps {
  variant?: AlertVariant
  children: ReactNode
  className?: string
}

const variants: Record<AlertVariant, string> = {
  error:
    'bg-red-50 text-red-600 border-red-200 ' +
    'dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  info:
    'bg-blue-50 text-blue-600 border-blue-200 ' +
    'dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800',
  success:
    'bg-green-50 text-green-600 border-green-200 ' +
    'dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
}

export function Alert({ variant = 'error', children, className }: AlertProps) {
  return (
    <div className={cn('border rounded-lg px-3.5 py-2.5 text-sm', variants[variant], className)}>
      {children}
    </div>
  )
}
