import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-1.5 font-semibold cursor-pointer ' +
  'transition-[background-color,transform,opacity,box-shadow] duration-100 ' +
  'active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ' +
  'disabled:active:scale-100 whitespace-nowrap tracking-[-0.01em] ' +
  'focus-visible:outline-none focus-visible:[box-shadow:var(--ios-ring-focus)]'

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--ios-blue)] text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)] ' +
    'hover:bg-[var(--ios-blue-hover)]',
  secondary:
    'bg-[var(--ios-surface-2)] text-[var(--ios-ink)] ' +
    'hover:bg-[var(--ios-surface-3)]',
  danger:
    'bg-[var(--ios-red-soft)] text-[var(--ios-red)] ' +
    'hover:bg-[color-mix(in_srgb,var(--ios-red)_22%,transparent)]',
  ghost:
    'bg-transparent text-[var(--ios-ink)] ' +
    'hover:bg-[var(--ios-surface-2)]',
}

const sizes: Record<Size, string> = {
  sm: 'px-2.5 py-1.5 text-[13px] rounded-[9px]',
  md: 'px-3.5 py-2 text-[14px] rounded-[10px]',
  lg: 'px-4 py-2.5 text-[15px] rounded-[12px]',
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
