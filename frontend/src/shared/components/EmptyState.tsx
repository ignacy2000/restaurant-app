import { type ReactNode } from 'react'

interface EmptyStateProps {
  icon: string
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16">
      <span className="text-5xl mb-4 opacity-40 select-none" aria-hidden>{icon}</span>
      <h3 className="text-[19px] font-semibold mb-1.5 tracking-[-0.025em] text-[var(--ios-ink)]">{title}</h3>
      {description && (
        <p className="text-[14px] tracking-[-0.01em] text-[var(--ios-ink-2)] mb-6 max-w-sm leading-snug">{description}</p>
      )}
      {action}
    </div>
  )
}
