export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
}

export interface RegisterResponse {
  id: string
  email: string
  created_at: string
}

export interface ForgotPasswordResponse {
  message: string
}

export interface ResetPasswordResponse {
  message: string
}
