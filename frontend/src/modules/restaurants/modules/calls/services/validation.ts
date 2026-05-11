import { z } from 'zod'
import { firstError } from '../../../../../shared/utils/validation'

export const CALL_STATUSES = ['pending', 'acknowledged', 'done'] as const

export const callStatusSchema = z.enum(CALL_STATUSES, {
  message: 'Nieprawidłowy status wezwania',
})

const updateCallStatusSchema = z.object({
  status: callStatusSchema,
})

export function validateUpdateCallStatus(input: { status: string }): string | null {
  const result = updateCallStatusSchema.safeParse(input)
  return result.success ? null : firstError(result.error)
}
