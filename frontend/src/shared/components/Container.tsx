import { type HTMLAttributes, type ElementType, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '7xl' | 'full'
type Padding = 'none' | 'sm' | 'md' | 'lg'

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: Extract<ElementType, 'div' | 'section' | 'article' | 'main'>
  maxWidth?: MaxWidth
  padding?: Padding
  centered?: boolean
  children?: ReactNode
}

const maxWidths: Record<MaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
}

const paddings: Record<Padding, string> = {
  none: '',
  sm: 'px-3 py-2',
  md: 'px-4 py-4 sm:px-6',
  lg: 'px-6 py-8 sm:px-8',
}

export function Container({
  as: Tag = 'div',
  maxWidth = '7xl',
  padding = 'md',
  centered = true,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        maxWidths[maxWidth],
        paddings[padding],
        centered && 'mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}
