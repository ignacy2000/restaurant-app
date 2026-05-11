import { z } from 'zod'

export const LIMITS = {
  nameMax: 255,
  descriptionMax: 2000,
  urlMax: 2048,
  emailMax: 320,
  passwordMin: 8,
  passwordMax: 128,
  tokenMax: 2048,
} as const

export const requiredName = (max: number = LIMITS.nameMax) =>
  z.string()
    .trim()
    .min(1, 'To pole jest wymagane')
    .max(max, `Maks. ${max} znaków`)

export const optionalText = (max: number) =>
  z.string().max(max, `Maks. ${max} znaków`)

export const httpUrl = z.string()
  .max(LIMITS.urlMax, `URL maks. ${LIMITS.urlMax} znaków`)
  .refine(v => {
    try {
      const u = new URL(v)
      return u.protocol === 'http:' || u.protocol === 'https:'
    } catch {
      return false
    }
  }, 'URL musi zaczynać się od http:// lub https://')

export const email = z.email('Niepoprawny adres email')
  .max(LIMITS.emailMax, `Email maks. ${LIMITS.emailMax} znaków`)

export const password = z.string()
  .min(LIMITS.passwordMin, `Hasło musi mieć co najmniej ${LIMITS.passwordMin} znaków`)
  .max(LIMITS.passwordMax, `Hasło maks. ${LIMITS.passwordMax} znaków`)

export const requiredPassword = z.string()
  .min(1, 'Hasło jest wymagane')
  .max(LIMITS.passwordMax, `Hasło maks. ${LIMITS.passwordMax} znaków`)

export const token = z.string()
  .min(1, 'Brak tokenu')
  .max(LIMITS.tokenMax, `Token maks. ${LIMITS.tokenMax} znaków`)
  .regex(/^[A-Za-z0-9_=-]+$/, 'Token ma nieprawidłowy format')

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Niepoprawne dane'
}
