import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../utils/cn'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'w-full px-3.5 py-2.5 rounded-lg text-sm outline-none transition',
        'border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400',
        'focus:border-blue-500 focus:ring-2 focus:ring-blue-100',
        'dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500',
        'dark:focus:border-blue-500 dark:focus:ring-blue-900/30',
        className
      )}
      {...props}
    />
  )
)

Input.displayName = 'Input'
