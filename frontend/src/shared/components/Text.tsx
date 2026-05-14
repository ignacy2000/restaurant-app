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
  /** Use SF Mono for tabular figures / IDs / prices. */
  mono?: boolean
  children: ReactNode
}

const sizes: Record<Size, string> = {
  xs:   'text-[11px] leading-[1.4] tracking-[0.01em]',
  sm:   'text-[13px] leading-[1.4] tracking-[-0.005em]',
  base: 'text-[15px] leading-[1.45] tracking-[-0.01em]',
  lg:   'text-[17px] leading-[1.4] tracking-[-0.015em]',
  xl:   'text-[20px] leading-[1.35] tracking-[-0.02em]',
}

const weights: Record<Weight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
}

const tones: Record<Tone, string> = {
  default: 'text-[var(--ios-ink)]',
  muted:   'text-[var(--ios-ink-2)]',
  subtle:  'text-[var(--ios-ink-3)]',
  primary: 'text-[var(--ios-blue)]',
  success: 'text-[var(--ios-green-ink)]',
  warning: 'text-[var(--ios-orange-ink)]',
  danger:  'text-[var(--ios-red-ink)]',
  inverse: 'text-white dark:text-black',
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
  mono = false,
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
        mono && 'font-mono',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
