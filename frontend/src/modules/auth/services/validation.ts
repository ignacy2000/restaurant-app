import { z } from 'zod'
import {
  LIMITS as SHARED_LIMITS,
  email,
  password,
  requiredPassword,
  firstError,
} from '../../../shared/utils/validation'

export const AUTH_LIMITS = { ...SHARED_LIMITS } as const

const loginSchema = z.object({
  email,
  password: requiredPassword,
})

const registerSchema = z.object({
  email,
  password,
  confirm: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm) {
    ctx.addIssue({ code: 'custom', message: 'Hasła nie są zgodne', path: ['confirm'] })
  }
})

const forgotPasswordSchema = z.object({
  email,
})

const resetPasswordSchema = z.object({
  password,
  confirm: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirm) {
    ctx.addIssue({ code: 'custom', message: 'Hasła nie są zgodne', path: ['confirm'] })
  }
})

export function validateLogin(input: { email: string; password: string }): string | null {
  const result = loginSchema.safeParse(input)
  return result.success ? null : firstError(result.error)
}

export function validateRegister(input: { email: string; password: string; confirm: string }): string | null {
  const result = registerSchema.safeParse(input)
  return result.success ? null : firstError(result.error)
}

export function validateForgotPassword(input: { email: string }): string | null {
  const result = forgotPasswordSchema.safeParse(input)
  return result.success ? null : firstError(result.error)
}

export function validateResetPassword(input: { password: string; confirm: string }): string | null {
  const result = resetPasswordSchema.safeParse(input)
  return result.success ? null : firstError(result.error)
}
