import { type HTMLAttributes, type ReactNode, createElement } from 'react'
import { cn } from '../utils/cn'

type Level = 1 | 2 | 3 | 4 | 5 | 6
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
type Tone = 'default' | 'muted' | 'inverse' | 'primary'
type Align = 'left' | 'center' | 'right'

interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: Level
  size?: Size
  tone?: Tone
  align?: Align
  truncate?: boolean
  children: ReactNode
}

const defaultSizeByLevel: Record<Level, Size> = {
  1: '3xl',
  2: '2xl',
  3: 'xl',
  4: 'lg',
  5: 'md',
  6: 'sm',
}

const sizes: Record<Size, string> = {
  xs: 'text-sm font-semibold',
  sm: 'text-base font-semibold',
  md: 'text-lg font-semibold',
  lg: 'text-xl font-semibold',
  xl: 'text-2xl font-bold',
  '2xl': 'text-3xl font-bold',
  '3xl': 'text-4xl font-bold tracking-tight',
}

const tones: Record<Tone, string> = {
  default: 'text-gray-900 dark:text-gray-100',
  muted: 'text-gray-600 dark:text-gray-400',
  inverse: 'text-white dark:text-gray-900',
  primary: 'text-blue-600 dark:text-blue-400',
}

const alignments: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function Title({
  level = 1,
  size,
  tone = 'default',
  align,
  truncate = false,
  className,
  children,
  ...props
}: TitleProps) {
  const resolvedSize = size ?? defaultSizeByLevel[level]
  return createElement(
    `h${level}`,
    {
      className: cn(
        sizes[resolvedSize],
        tones[tone],
        align && alignments[align],
        truncate && 'truncate',
        className
      ),
      ...props,
    },
    children
  )
}
