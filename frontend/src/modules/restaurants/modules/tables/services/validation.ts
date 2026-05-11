import { z } from 'zod'
import { firstError } from '../../../../../shared/utils/validation'

export const TABLE_LIMITS = {
  numberMin: 1,
  numberMax: 9999,
  capacityMin: 1,
  capacityMax: 100,
} as const

const tableNumberSchema = z.number()
  .int('Numer stolika musi być liczbą całkowitą')
  .min(TABLE_LIMITS.numberMin, `Numer stolika musi być co najmniej ${TABLE_LIMITS.numberMin}`)
  .max(TABLE_LIMITS.numberMax, `Numer stolika maks. ${TABLE_LIMITS.numberMax}`)

const tableCapacitySchema = z.number()
  .int('Pojemność musi być liczbą całkowitą')
  .min(TABLE_LIMITS.capacityMin, `Pojemność musi być co najmniej ${TABLE_LIMITS.capacityMin}`)
  .max(TABLE_LIMITS.capacityMax, `Pojemność maks. ${TABLE_LIMITS.capacityMax} miejsc`)

const createTableSchema = z.object({
  number: tableNumberSchema,
  capacity: tableCapacitySchema,
})

const updateTableSchema = z.object({
  capacity: tableCapacitySchema,
})

export function validateCreateTable(input: { number: number; capacity: number }): string | null {
  const result = createTableSchema.safeParse(input)
  return result.success ? null : firstError(result.error)
}

export function validateUpdateTable(input: { capacity: number }): string | null {
  const result = updateTableSchema.safeParse(input)
  return result.success ? null : firstError(result.error)
}
