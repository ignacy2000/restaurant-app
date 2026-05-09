import { Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { authStorage } from '../../shared/services/auth.storage'

function GuestRoute({ children }: { children: React.ReactNode }) {
  if (authStorage.isAuthenticated()) return <Navigate to="/" replace />
  return <>{children}</>
}

export const authRoutes = (
  <>
    <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
    <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
    <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
    <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
  </>
)
