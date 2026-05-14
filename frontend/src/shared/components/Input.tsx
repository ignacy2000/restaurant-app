import { type InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '../utils/cn'

const inputBase =
  'w-full px-3 py-2 text-[14px] outline-none rounded-[10px] ' +
  'bg-[var(--ios-surface)] text-[var(--ios-ink)] ' +
  'border-[0.5px] border-[var(--ios-border)] ' +
  'placeholder:text-[var(--ios-ink-3)] ' +
  'tracking-[-0.01em] transition-[border-color,box-shadow] duration-100 ' +
  'focus:border-[var(--ios-blue)] focus:[box-shadow:var(--ios-ring-focus)] ' +
  'disabled:opacity-60 disabled:cursor-not-allowed'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(inputBase, className)} {...props} />
  )
)

Input.displayName = 'Input'
