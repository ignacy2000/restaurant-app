import { useTheme } from '../contexts/ThemeContext'
import { cn } from '../utils/cn'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className={cn(
        'w-8 h-8 rounded-[9px] inline-flex items-center justify-center cursor-pointer',
        'text-[var(--ios-ink-2)] transition-[background-color,transform] duration-100',
        'hover:bg-[var(--ios-surface-2)] active:scale-[0.95]',
        className
      )}
      aria-label={theme === 'dark' ? 'Przełącz na jasny' : 'Przełącz na ciemny'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
