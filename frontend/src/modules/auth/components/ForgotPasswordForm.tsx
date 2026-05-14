import { useState, FormEvent } from 'react'
import { authApi } from '../services/auth.api'
import { validateForgotPassword, AUTH_LIMITS } from '../services/validation'
import { Alert, Button, FormField, Input, Link, Stack, Text } from '../../../shared/components'

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
      <Stack gap={4}>
        <Alert variant="success">
          Jeśli podany adres e-mail istnieje w systemie, wysłaliśmy na niego link do resetowania hasła. Sprawdź skrzynkę pocztową.
        </Alert>
        <Text size="sm" tone="muted" align="center" className="pt-1">
          <Link to="/login" size="sm">
            Wróć do logowania
          </Link>
        </Text>
      </Stack>
    )
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

        <Button type="submit" loading={loading} fullWidth size="lg">
          {loading ? 'Wysyłanie…' : 'Wyślij link resetujący'}
        </Button>

        <Text size="sm" tone="muted" align="center" className="pt-1">
          <Link to="/login" size="sm">
            Wróć do logowania
          </Link>
        </Text>
      </Stack>
    </form>
  )
}
