import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { validateRegister, AUTH_LIMITS } from '../services/validation'
import { Alert, Button, FormField, Input, Link, Stack, Text } from '../../../shared/components'

export function RegisterForm() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationError = validateRegister({ email, password, confirm })
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      await register(email, password)
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
            autoComplete="new-password"
            minLength={AUTH_LIMITS.passwordMin}
            maxLength={AUTH_LIMITS.passwordMax}
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={`Minimum ${AUTH_LIMITS.passwordMin} znaków`}
          />
        </FormField>

        <FormField label="Potwierdź hasło" htmlFor="confirm">
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
          {loading ? 'Rejestracja…' : 'Zarejestruj się'}
        </Button>

        <Text size="sm" tone="muted" align="center" className="pt-1">
          Masz już konto?{' '}
          <Link to="/login" size="sm">
            Zaloguj się
          </Link>
        </Text>
      </Stack>
    </form>
  )
}
