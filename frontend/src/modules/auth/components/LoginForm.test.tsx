import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { LoginForm } from './LoginForm'

const mockNavigate = vi.fn()
const mockLogin = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => ({ login: mockLogin }),
}))

function renderForm() {
  return render(
    <MemoryRouter>
      <LoginForm />
    </MemoryRouter>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('LoginForm', () => {
  it('renders email, password inputs and submit button', () => {
    renderForm()
    expect(screen.getByLabelText('Adres e-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Hasło')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Zaloguj się' })).toBeInTheDocument()
  })

  it('renders link to register page', () => {
    renderForm()
    expect(screen.getByRole('link', { name: 'Zarejestruj się' })).toHaveAttribute('href', '/register')
  })

  it('shows loading state while logging in', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {}))
    renderForm()

    await userEvent.type(screen.getByLabelText('Adres e-mail'), 'user@test.pl')
    await userEvent.type(screen.getByLabelText('Hasło'), 'haslo123')
    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    expect(await screen.findByRole('button', { name: 'Logowanie…' })).toBeDisabled()
  })

  it('navigates to "/" on successful login', async () => {
    mockLogin.mockResolvedValue(undefined)
    renderForm()

    await userEvent.type(screen.getByLabelText('Adres e-mail'), 'user@test.pl')
    await userEvent.type(screen.getByLabelText('Hasło'), 'haslo123')
    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@test.pl', 'haslo123')
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  it('displays error message when login fails', async () => {
    mockLogin.mockRejectedValue(new Error('Nieprawidłowy email lub hasło'))
    renderForm()

    await userEvent.type(screen.getByLabelText('Adres e-mail'), 'user@test.pl')
    await userEvent.type(screen.getByLabelText('Hasło'), 'zle')
    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    expect(await screen.findByText('Nieprawidłowy email lub hasło')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('shows generic error for non-Error rejection', async () => {
    mockLogin.mockRejectedValue('coś poszło nie tak')
    renderForm()

    await userEvent.type(screen.getByLabelText('Adres e-mail'), 'user@test.pl')
    await userEvent.type(screen.getByLabelText('Hasło'), 'haslo')
    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    expect(await screen.findByText('Nieznany błąd')).toBeInTheDocument()
  })

  it('re-enables submit button after failed login', async () => {
    mockLogin.mockRejectedValue(new Error('błąd'))
    renderForm()

    await userEvent.type(screen.getByLabelText('Adres e-mail'), 'user@test.pl')
    await userEvent.type(screen.getByLabelText('Hasło'), 'haslo')
    await userEvent.click(screen.getByRole('button', { name: 'Zaloguj się' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Zaloguj się' })).not.toBeDisabled()
    })
  })
})
