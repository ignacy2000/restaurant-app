import { type HTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type Orientation = 'horizontal' | 'vertical'
type Spacing = 'none' | 'sm' | 'md' | 'lg'

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: Orientation
  spacing?: Spacing
}

const spacings: Record<Orientation, Record<Spacing, string>> = {
  horizontal: { none: '', sm: 'my-2', md: 'my-4', lg: 'my-6' },
  vertical:   { none: '', sm: 'mx-2', md: 'mx-4', lg: 'mx-6' },
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
        'border-0 bg-[var(--ios-border-soft)]',
        // 0.5px iOS hairline — use min size & scale to avoid rounding to 0.
        isVertical ? 'h-full w-[0.5px] self-stretch' : 'h-[0.5px] w-full',
        spacings[orientation][spacing],
        className
      )}
      {...props}
    />
  )
}
