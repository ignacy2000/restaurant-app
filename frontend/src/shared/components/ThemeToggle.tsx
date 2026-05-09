import { useTheme } from '../contexts/ThemeContext'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className={`p-1.5 rounded-lg transition text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 ${className ?? ''}`}
      aria-label={theme === 'dark' ? 'Przełącz na jasny' : 'Przełącz na ciemny'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
