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
      <span className="text-5xl mb-4 opacity-40">{icon}</span>
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm">{description}</p>
      )}
      {action}
    </div>
  )
}
