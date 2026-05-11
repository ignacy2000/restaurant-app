import { z } from 'zod'
import {
  LIMITS as SHARED_LIMITS,
  requiredName,
  optionalText,
  httpUrl,
  firstError,
} from '../../../../../shared/utils/validation'

export const LIMITS = {
  ...SHARED_LIMITS,
  imageUrlMax: SHARED_LIMITS.urlMax,
  priceMax: 100000,
  positionMax: 9999,
} as const

const menuSchema = z.object({
  name: requiredName(),
  description: optionalText(LIMITS.descriptionMax),
})

const priceField = z.string().superRefine((v, ctx) => {
  const t = v.trim()
  if (!t) return
  const n = parseFloat(t)
  if (Number.isNaN(n)) {
    ctx.addIssue({ code: 'custom', message: 'Cena musi być liczbą' })
    return
  }
  if (n < 0) ctx.addIssue({ code: 'custom', message: 'Cena nie może być ujemna' })
  if (n > LIMITS.priceMax) ctx.addIssue({ code: 'custom', message: `Cena maks. ${LIMITS.priceMax} zł` })
})

const itemSchema = z.object({
  name: requiredName(),
  description: optionalText(LIMITS.descriptionMax),
  price: priceField,
  imageMode: z.enum(['none', 'url', 'upload']),
  imageUrl: z.string(),
  file: z.instanceof(File).nullable(),
}).superRefine((data, ctx) => {
  if (data.imageMode === 'url') {
    const url = data.imageUrl.trim()
    if (!url) {
      ctx.addIssue({ code: 'custom', message: 'Podaj URL zdjęcia lub wybierz „Bez zdjęcia"', path: ['imageUrl'] })
      return
    }
    const parsed = httpUrl.safeParse(url)
    if (!parsed.success) {
      ctx.addIssue({ code: 'custom', message: firstError(parsed.error), path: ['imageUrl'] })
    }
  }
})

export function validateMenuFields(name: string, description: string): string | null {
  const result = menuSchema.safeParse({ name, description })
  return result.success ? null : firstError(result.error)
}

interface ItemFields {
  name: string
  description: string
  price: string
  imageMode: 'none' | 'url' | 'upload'
  imageUrl: string
  file: File | null
}

export function validateItemFields(input: ItemFields): string | null {
  const result = itemSchema.safeParse(input)
  return result.success ? null : firstError(result.error)
}
