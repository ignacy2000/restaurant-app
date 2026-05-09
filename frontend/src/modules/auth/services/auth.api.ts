import { http } from '../../../shared/services/http'
import type { LoginResponse, RegisterResponse, ForgotPasswordResponse, ResetPasswordResponse } from '../types/auth.types'

export const authApi = {
  login: (email: string, password: string) =>
    http<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string) =>
    http<RegisterResponse>('/users', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: (refreshToken: string) =>
    http<void>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  forgotPassword: (email: string) =>
    http<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, password: string) =>
    http<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    }),
}
