import { type HTMLAttributes, type ElementType, type ReactNode } from 'react'
import { cn } from '../utils/cn'

type BoxElement = 'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'aside' | 'nav'

interface BoxProps extends HTMLAttributes<HTMLElement> {
  as?: BoxElement
  children?: ReactNode
}

export function Box({ as: Tag = 'div', className, children, ...props }: BoxProps) {
  return (
    <Tag className={cn(className)} {...props}>
      {children}
    </Tag>
  )
}
