import { type HTMLAttributes, type ElementType, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type Size = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
type Weight = 'normal' | 'medium' | 'semibold' | 'bold'
type Tone = 'default' | 'muted' | 'subtle' | 'primary' | 'success' | 'warning' | 'danger' | 'inverse'
type Align = 'left' | 'center' | 'right'

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: Extract<ElementType, 'p' | 'span' | 'div' | 'small' | 'strong' | 'em'>
  size?: Size
  weight?: Weight
  tone?: Tone
  align?: Align
  truncate?: boolean
  italic?: boolean
  children: ReactNode
}

const sizes: Record<Size, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}

const weights: Record<Weight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const tones: Record<Tone, string> = {
  default: 'text-gray-900 dark:text-gray-100',
  muted: 'text-gray-600 dark:text-gray-400',
  subtle: 'text-gray-500 dark:text-gray-500',
  primary: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
  inverse: 'text-white dark:text-gray-900',
}

const alignments: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function Text({
  as: Tag = 'p',
  size = 'base',
  weight = 'normal',
  tone = 'default',
  align,
  truncate = false,
  italic = false,
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        sizes[size],
        weights[weight],
        tones[tone],
        align && alignments[align],
        truncate && 'truncate',
        italic && 'italic',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
