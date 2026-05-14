import { type SVGAttributes, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type Tone = 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger' | 'inverse' | 'inherit'

interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  size?: Size
  tone?: Tone
  label?: string
  children: ReactNode
}

const sizes: Record<Size, string> = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
}

const tones: Record<Tone, string> = {
  default: 'text-gray-700 dark:text-gray-200',
  muted: 'text-gray-500 dark:text-gray-400',
  primary: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
  inverse: 'text-white dark:text-gray-900',
  inherit: 'text-inherit',
}

export function Icon({
  size = 'md',
  tone = 'inherit',
  label,
  className,
  children,
  ...props
}: IconProps) {
  const a11y = label
    ? { role: 'img' as const, 'aria-label': label }
    : { 'aria-hidden': true as const }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0', sizes[size], tones[tone], className)}
      {...a11y}
      {...props}
    >
      {children}
    </svg>
  )
}
