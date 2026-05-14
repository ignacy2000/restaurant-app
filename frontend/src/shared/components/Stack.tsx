import { type HTMLAttributes, type ElementType, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
type Align = 'start' | 'center' | 'end' | 'stretch'
type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
type Direction = 'row' | 'column' | 'row-reverse' | 'column-reverse'

interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: Extract<ElementType, 'div' | 'section' | 'article' | 'header' | 'footer' | 'nav' | 'aside' | 'main' | 'ul' | 'ol'>
  direction?: Direction
  gap?: Gap
  align?: Align
  justify?: Justify
  wrap?: boolean
  inline?: boolean
  fullWidth?: boolean
  children?: ReactNode
}

const directions: Record<Direction, string> = {
  row: 'flex-row',
  column: 'flex-col',
  'row-reverse': 'flex-row-reverse',
  'column-reverse': 'flex-col-reverse',
}

const gaps: Record<Gap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
}

const aligns: Record<Align, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
}

const justifies: Record<Justify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
}

export function Stack({
  as: Tag = 'div',
  direction = 'column',
  gap = 4,
  align,
  justify,
  wrap = false,
  inline = false,
  fullWidth = false,
  className,
  children,
  ...props
}: StackProps) {
  return (
    <Tag
      className={cn(
        inline ? 'inline-flex' : 'flex',
        directions[direction],
        gaps[gap],
        align && aligns[align],
        justify && justifies[justify],
        wrap && 'flex-wrap',
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
