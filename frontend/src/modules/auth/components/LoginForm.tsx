import { useState, FormEvent } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateLogin, AUTH_LIMITS } from '../services/validation'
import { Alert, Button, FormField, Input, Link, Stack, Text } from '../../../shared/components'

export function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationError = validateLogin({ email, password })
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap={4}>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {error && <Alert>{error}</Alert>}

        <FormField label="Adres e-mail" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={AUTH_LIMITS.emailMax}
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="jan@example.com"
          />
        </FormField>

        <FormField label="Hasło" htmlFor="password">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            maxLength={AUTH_LIMITS.passwordMax}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Stack align="end" gap={0} className="mt-1">
            <Link to="/forgot-password" size="sm">
              Zapomniałeś hasła?
            </Link>
          </Stack>
        </FormField>

        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? 'Logowanie…' : 'Zaloguj się'}
        </Button>

        <Text size="sm" tone="muted" align="center" className="pt-1">
          Nie masz konta?{' '}
          <Link to="/register" size="sm">
            Zarejestruj się
          </Link>
        </Text>
      </Stack>
    </form>
  )
}
