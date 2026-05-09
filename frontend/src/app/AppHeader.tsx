import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../modules/auth'
import { Button } from '../shared/components/Button'
import { ThemeToggle } from '../shared/components/ThemeToggle'

export function AppHeader() {
  const { email, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        <span className="text-blue-600 font-bold text-lg tracking-tight">RST Panel</span>
        <div className="flex items-center gap-2">
          {email ? (
            <>
              <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1 bg-gray-50 dark:bg-gray-800">
                {email}
              </span>
              <ThemeToggle />
              <Button variant="secondary" size="sm" onClick={handleLogout}>Wyloguj</Button>
            </>
          ) : (
            <>
              <ThemeToggle />
              <Link
                to="/login"
                className="px-4 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Zaloguj
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
