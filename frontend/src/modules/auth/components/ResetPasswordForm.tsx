import { useState, FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authApi } from '../services/auth.api'
import { validateResetPassword, AUTH_LIMITS } from '../services/validation'
import { token as tokenSchema } from '../../../shared/utils/validation'
import { Alert } from '../../../shared/components/Alert'
import { Button } from '../../../shared/components/Button'
import { FormField } from '../../../shared/components/FormField'
import { Input } from '../../../shared/components/Input'

export function ResetPasswordForm() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const rawToken = searchParams.get('token') ?? ''
  const parsedToken = tokenSchema.safeParse(rawToken)
  const token = parsedToken.success ? parsedToken.data : ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationError = validateResetPassword({ password, confirm })
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      await authApi.resetPassword(token, password)
      navigate('/login', { state: { successMessage: 'Hasło zostało zmienione. Możesz się teraz zalogować.' } })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Link wygasł lub jest nieprawidłowy')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="space-y-4">
        <Alert>Brak tokenu resetowania. Upewnij się, że użyłeś linku z e-maila.</Alert>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-1">
          <Link to="/forgot-password" className="text-blue-600 font-medium hover:underline">
            Wyślij link ponownie
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert>
          {error}{' '}
          {error.toLowerCase().includes('wygasł') || error.toLowerCase().includes('nieprawidłowy') ? (
            <Link to="/forgot-password" className="font-medium underline">
              Wyślij link ponownie
            </Link>
          ) : null}
        </Alert>
      )}

      <FormField label="Nowe hasło" htmlFor="password">
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          minLength={AUTH_LIMITS.passwordMin}
          maxLength={AUTH_LIMITS.passwordMax}
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder={`Minimum ${AUTH_LIMITS.passwordMin} znaków`}
        />
      </FormField>

      <FormField label="Potwierdź nowe hasło" htmlFor="confirm">
        <Input
          id="confirm"
          type="password"
          autoComplete="new-password"
          maxLength={AUTH_LIMITS.passwordMax}
          required
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
        />
      </FormField>

      <Button type="submit" loading={loading} fullWidth size="lg">
        {loading ? 'Zapisywanie…' : 'Ustaw nowe hasło'}
      </Button>
    </form>
  )
}
