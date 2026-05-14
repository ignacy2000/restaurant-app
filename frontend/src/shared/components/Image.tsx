import { type ImgHTMLAttributes } from 'react'
import { cn } from '../utils/cn'

type Radius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
type Fit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
type AspectRatio = 'square' | 'video' | 'portrait' | 'auto'

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  alt: string
  radius?: Radius
  fit?: Fit
  ratio?: AspectRatio
  loading?: 'eager' | 'lazy'
}

const radii: Record<Radius, string> = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
}

const fits: Record<Fit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

const ratios: Record<AspectRatio, string> = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  auto: '',
}

export function Image({
  alt,
  radius = 'none',
  fit = 'cover',
  ratio = 'auto',
  loading = 'lazy',
  className,
  ...props
}: ImageProps) {
  return (
    <img
      alt={alt}
      loading={loading}
      className={cn(radii[radius], fits[fit], ratios[ratio], className)}
      {...props}
    />
  )
}
