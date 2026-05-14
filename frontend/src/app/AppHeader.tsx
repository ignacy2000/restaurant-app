import { useNavigate } from 'react-router-dom'
import { useAuth } from '../modules/auth'
import { Button } from '../shared/components/Button'
import { Link } from '../shared/components/Link'
import { ThemeToggle } from '../shared/components/ThemeToggle'

export function AppHeader() {
  const { email, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header
      className="sticky top-0 z-50 border-b-[0.5px] border-[var(--ios-border)]"
      style={{
        background: 'color-mix(in srgb, var(--ios-surface) 78%, transparent)',
        backdropFilter: 'saturate(1.6) blur(22px)',
        WebkitBackdropFilter: 'saturate(1.6) blur(22px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-5 flex items-center gap-3 h-14">
        <div className="flex items-center gap-2.5">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-[8px] text-white text-[13px] font-bold tracking-[-0.02em] leading-none"
            style={{
              background: 'linear-gradient(180deg, var(--ios-blue), color-mix(in srgb, var(--ios-blue) 70%, #003a80))',
              boxShadow: '0 1px 2px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)',
            }}
          >
            rst
          </span>
          <span className="text-[14px] font-semibold tracking-[-0.01em] text-[var(--ios-ink)]">Panel</span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {email ? (
            <>
              <span
                className="hidden sm:inline-flex items-center text-[12px] font-medium text-[var(--ios-ink-2)] rounded-full px-3 py-1 bg-[var(--ios-surface-2)] tracking-[-0.01em]"
              >
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
                variant="inherit"
                className="px-3 py-1.5 rounded-[9px] bg-[var(--ios-surface-2)] hover:bg-[var(--ios-surface-3)] text-[var(--ios-ink)] text-[13px] font-semibold tracking-[-0.01em] transition-[background-color]"
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
