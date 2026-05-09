import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type Variant = 'primary' | 'secondary' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg transition cursor-pointer ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

const variants: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white font-semibold hover:bg-blue-700 ' +
    'dark:bg-blue-500 dark:hover:bg-blue-600',
  secondary:
    'border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 ' +
    'dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800',
  danger:
    'border border-red-200 text-red-600 font-medium hover:bg-red-50 ' +
    'dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20',
}

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-sm',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    >
      {children}
    </button>
  )
}
