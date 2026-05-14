import { type HTMLAttributes, type LiHTMLAttributes, type ReactNode, createElement } from 'react'
import { cn } from '../utils/cn'

type Variant = 'unordered' | 'ordered' | 'none'
type Spacing = 'none' | 'sm' | 'md' | 'lg'

interface ListProps extends HTMLAttributes<HTMLUListElement | HTMLOListElement> {
  variant?: Variant
  spacing?: Spacing
  children?: ReactNode
}

interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  children?: ReactNode
}

const markers: Record<Variant, string> = {
  unordered: 'list-disc list-inside',
  ordered: 'list-decimal list-inside',
  none: 'list-none',
}

const spacings: Record<Spacing, string> = {
  none: 'space-y-0',
  sm: 'space-y-1',
  md: 'space-y-2',
  lg: 'space-y-4',
}

export function List({
  variant = 'unordered',
  spacing = 'md',
  className,
  children,
  ...props
}: ListProps) {
  const tag = variant === 'ordered' ? 'ol' : 'ul'
  return createElement(
    tag,
    {
      className: cn(markers[variant], spacings[spacing], 'text-gray-700 dark:text-gray-300', className),
      ...props,
    },
    children
  )
}

export function ListItem({ className, children, ...props }: ListItemProps) {
  return (
    <li className={cn(className)} {...props}>
      {children}
    </li>
  )
}
