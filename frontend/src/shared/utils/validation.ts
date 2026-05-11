import { z } from 'zod'

export const LIMITS = {
  nameMax: 255,
  descriptionMax: 2000,
  urlMax: 2048,
  emailMax: 320,
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

export function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? 'Niepoprawne dane'
}
