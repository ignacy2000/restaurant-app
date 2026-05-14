import { type HTMLAttributes, type ElementType, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type Cols = 1 | 2 | 3 | 4 | 5 | 6 | 12
type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12
type Responsive = { sm?: Cols; md?: Cols; lg?: Cols; xl?: Cols }

interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: Extract<ElementType, 'div' | 'section' | 'ul' | 'ol'>
  cols?: Cols
  responsive?: Responsive
  gap?: Gap
  children?: ReactNode
}

const colsMap: Record<Cols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
}

const responsivePrefixes: Record<keyof Responsive, Record<Cols, string>> = {
  sm: { 1: 'sm:grid-cols-1', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-4', 5: 'sm:grid-cols-5', 6: 'sm:grid-cols-6', 12: 'sm:grid-cols-12' },
  md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6', 12: 'md:grid-cols-12' },
  lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 5: 'lg:grid-cols-5', 6: 'lg:grid-cols-6', 12: 'lg:grid-cols-12' },
  xl: { 1: 'xl:grid-cols-1', 2: 'xl:grid-cols-2', 3: 'xl:grid-cols-3', 4: 'xl:grid-cols-4', 5: 'xl:grid-cols-5', 6: 'xl:grid-cols-6', 12: 'xl:grid-cols-12' },
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

export function Grid({
  as: Tag = 'div',
  cols = 1,
  responsive,
  gap = 4,
  className,
  children,
  ...props
}: GridProps) {
  const responsiveClasses = responsive
    ? (Object.entries(responsive) as Array<[keyof Responsive, Cols]>)
        .map(([bp, c]) => responsivePrefixes[bp][c])
        .join(' ')
    : ''

  return (
    <Tag
      className={cn('grid', colsMap[cols], responsiveClasses, gaps[gap], className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
