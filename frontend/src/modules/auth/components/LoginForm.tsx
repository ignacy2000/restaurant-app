import { useState, FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Alert } from '../../../shared/components/Alert'
import { Button } from '../../../shared/components/Button'
import { FormField } from '../../../shared/components/FormField'
import { Input } from '../../../shared/components/Input'

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      {error && <Alert>{error}</Alert>}

      <FormField label="Adres e-mail" htmlFor="email">
        <Input
          id="email"
          type="email"
          autoComplete="email"
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
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <div className="text-right mt-1">
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Zapomniałeś hasła?
          </Link>
        </div>
      </FormField>

      <Button type="submit" loading={loading} fullWidth size="lg">
        {loading ? 'Logowanie…' : 'Zaloguj się'}
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-1">
        Nie masz konta?{' '}
        <Link to="/register" className="text-blue-600 font-medium hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </form>
  )
}
