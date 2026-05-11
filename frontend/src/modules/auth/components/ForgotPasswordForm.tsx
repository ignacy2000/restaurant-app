import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../services/auth.api'
import { validateForgotPassword, AUTH_LIMITS } from '../services/validation'
import { Alert } from '../../../shared/components/Alert'
import { Button } from '../../../shared/components/Button'
import { FormField } from '../../../shared/components/FormField'
import { Input } from '../../../shared/components/Input'

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const validationError = validateForgotPassword({ email })
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
    } finally {
      setLoading(false)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <div className="space-y-4">
        <Alert variant="success">
          Jeśli podany adres e-mail istnieje w systemie, wysłaliśmy na niego link do resetowania hasła. Sprawdź skrzynkę pocztową.
        </Alert>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-1">
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Wróć do logowania
          </Link>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <Button type="submit" loading={loading} fullWidth size="lg">
        {loading ? 'Wysyłanie…' : 'Wyślij link resetujący'}
      </Button>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-1">
        <Link to="/login" className="text-blue-600 font-medium hover:underline">
          Wróć do logowania
        </Link>
      </p>
    </form>
  )
}
