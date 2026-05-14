import { type LabelHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type Size = 'sm' | 'md' | 'lg'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: Size
  required?: boolean
  children: ReactNode
}

const sizes: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

export function Label({
  size = 'md',
  required = false,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        'font-medium text-gray-700 dark:text-gray-300',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-red-500">*</span>}
    </label>
  )
}
