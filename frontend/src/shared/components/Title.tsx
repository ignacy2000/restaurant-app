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

// SF Pro Display sizing — iOS Large Title scale with tight tracking.
const sizes: Record<Size, string> = {
  xs:    'text-[15px] font-semibold tracking-[-0.02em]',
  sm:    'text-[17px] font-semibold tracking-[-0.022em]',
  md:    'text-[19px] font-semibold tracking-[-0.025em]',
  lg:    'text-[22px] font-bold     tracking-[-0.028em]',
  xl:    'text-[26px] font-bold     tracking-[-0.03em]',
  '2xl': 'text-[32px] font-bold     tracking-[-0.035em] leading-[1.08]',
  '3xl': 'text-[40px] font-bold     tracking-[-0.04em]  leading-[1.05]',
}

const tones: Record<Tone, string> = {
  default: 'text-[var(--ios-ink)]',
  muted:   'text-[var(--ios-ink-2)]',
  inverse: 'text-white dark:text-black',
  primary: 'text-[var(--ios-blue)]',
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
