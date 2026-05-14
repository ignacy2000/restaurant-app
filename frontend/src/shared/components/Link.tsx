import { type AnchorHTMLAttributes, type ReactNode } from 'react'
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom'
import { cn } from '../utils/cn'

type Variant = 'default' | 'subtle' | 'inherit'
type Size = 'sm' | 'md' | 'lg'

interface CommonProps {
  variant?: Variant
  size?: Size
  underline?: boolean
  children: ReactNode
  className?: string
}

type InternalProps = CommonProps & Omit<RouterLinkProps, 'children' | 'className'> & { to: RouterLinkProps['to']; href?: never }
type ExternalProps = CommonProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'className' | 'href'> & { href: string; to?: never; external?: boolean }

type LinkProps = InternalProps | ExternalProps

const variants: Record<Variant, string> = {
  default: 'text-[var(--ios-blue)] hover:opacity-80',
  subtle:  'text-[var(--ios-ink-2)] hover:text-[var(--ios-ink)]',
  inherit: 'text-inherit hover:opacity-80',
}

const sizes: Record<Size, string> = {
  sm: 'text-[12px]',
  md: 'text-[14px]',
  lg: 'text-[16px]',
}

export function Link(props: LinkProps) {
  const { variant = 'default', size = 'md', underline = false, children, className } = props
  const classes = cn(
    'transition-opacity cursor-pointer tracking-[-0.01em] font-medium',
    variants[variant],
    sizes[size],
    underline && 'underline',
    className
  )

  if ('to' in props && props.to !== undefined) {
    const { variant: _v, size: _s, underline: _u, children: _c, className: _cn, to, ...rest } = props
    return (
      <RouterLink to={to} className={classes} {...rest}>
        {children}
      </RouterLink>
    )
  }

  const { variant: _v, size: _s, underline: _u, children: _c, className: _cn, href, external, target, rel, ...rest } = props as ExternalProps
  const isExternal = external ?? /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      target={target ?? (isExternal ? '_blank' : undefined)}
      rel={rel ?? (isExternal ? 'noopener noreferrer' : undefined)}
      className={classes}
      {...rest}
    >
      {children}
    </a>
  )
}
