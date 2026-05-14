import { type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type Orientation = 'horizontal' | 'vertical'
type Spacing = 'none' | 'sm' | 'md' | 'lg'

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: Orientation
  spacing?: Spacing
}

const spacings: Record<Orientation, Record<Spacing, string>> = {
  horizontal: {
    none: '',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
  },
  vertical: {
    none: '',
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-6',
  },
}

export function Divider({
  orientation = 'horizontal',
  spacing = 'md',
  className,
  ...props
}: DividerProps) {
  const isVertical = orientation === 'vertical'
  return (
    <hr
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'border-0 bg-gray-200 dark:bg-gray-700',
        isVertical ? 'h-full w-px self-stretch' : 'h-px w-full',
        spacings[orientation][spacing],
        className
      )}
      {...props}
    />
  )
}
