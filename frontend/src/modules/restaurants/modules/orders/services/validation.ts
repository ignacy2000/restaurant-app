import { z } from 'zod'
import {
  LIMITS as SHARED_LIMITS,
  requiredName,
  optionalText,
  email,
  firstError,
} from '../../../../../shared/utils/validation'

export const LIMITS = {
  ...SHARED_LIMITS,
  orderNotesMax: 1000,
  itemNotesMax: 500,
  itemsMax: 100,
  quantityMax: 999,
} as const

const orderItemSchema = z.object({
  name: requiredName(),
  quantity: z.number()
    .int('Ilość musi być liczbą całkowitą')
    .min(1, 'Ilość musi być co najmniej 1')
    .max(LIMITS.quantityMax, `Ilość maks. ${LIMITS.quantityMax}`),
  notes: optionalText(LIMITS.itemNotesMax).optional(),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema)
    .min(1, 'Dodaj co najmniej jedną pozycję do koszyka')
    .max(LIMITS.itemsMax, `Maks. ${LIMITS.itemsMax} pozycji w zamówieniu`),
  notes: optionalText(LIMITS.orderNotesMax),
  guestEmail: email,
})

interface CreateOrderInput {
  items: { name: string; quantity: number; notes?: string }[]
  notes: string
  guestEmail: string
}

export function validateCreateOrder(input: CreateOrderInput): string | null {
  const result = createOrderSchema.safeParse(input)
  return result.success ? null : firstError(result.error)
}
