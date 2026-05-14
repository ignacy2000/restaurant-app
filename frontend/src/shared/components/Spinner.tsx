import { cn } from '../utils/cn'

type Size = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: Size
  /** Render inline (no padding). Otherwise wraps in centered py-16 block. */
  inline?: boolean
  className?: string
  label?: string
}

const dims: Record<Size, { box: number; bar: { w: number; h: number; r: number } }> = {
  sm: { box: 16, bar: { w: 1.5, h: 4, r: 1 } },
  md: { box: 24, bar: { w: 2,   h: 6, r: 1 } },
  lg: { box: 32, bar: { w: 2.5, h: 8, r: 1.25 } },
}

/** iOS-style segmented activity indicator (8 ticks fading sequentially). */
export function Spinner({ size = 'md', inline = false, className, label = 'Ładowanie' }: SpinnerProps) {
  const { box, bar } = dims[size]
  const ticks = Array.from({ length: 8 })

  const spinner = (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-block relative', className)}
      style={{ width: box, height: box }}
    >
      {ticks.map((_, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 bg-[var(--ios-ink-2)] block"
          style={{
            width: bar.w,
            height: bar.h,
            borderRadius: bar.r,
            transform: `translate(-50%, -100%) rotate(${i * 45}deg) translateY(-${box / 2 - bar.h - 1}px)`,
            transformOrigin: '50% 100%',
            animation: 'ios-spinner-fade 1s linear infinite',
            animationDelay: `${-((8 - i) / 8)}s`,
          }}
        />
      ))}
    </span>
  )

  if (inline) return spinner
  return <div className="flex items-center justify-center py-16">{spinner}</div>
}
