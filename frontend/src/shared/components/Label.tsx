import { type LabelHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type Size = 'sm' | 'md' | 'lg'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  size?: Size
  required?: boolean
  /** SF caption style — uppercase, wide tracking, ink-3 color. */
  caption?: boolean
  children: ReactNode
}

const sizes: Record<Size, string> = {
  sm: 'text-[11px]',
  md: 'text-[12px]',
  lg: 'text-[14px]',
}

export function Label({
  size = 'md',
  required = false,
  caption = false,
  className,
  children,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn(
        'font-semibold tracking-[-0.01em]',
        caption
          ? 'uppercase tracking-[0.02em] text-[var(--ios-ink-3)]'
          : 'text-[var(--ios-ink-2)]',
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-[var(--ios-red)]">*</span>}
    </label>
  )
}
