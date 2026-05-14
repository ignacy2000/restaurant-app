import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ordersApi } from '../../restaurants/modules/orders/services/orders.api'
import type { ConfirmOrderResponse } from '../../restaurants/modules/orders/services/orders.api'
import { token as tokenSchema } from '../../../shared/utils/validation'
import {
  Box,
  Card,
  Link,
  Spinner,
  Stack,
  Text,
  Title,
} from '../../../shared/components'

export function OrderConfirmationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [state, setState] = useState<'loading' | 'success' | 'error'>('loading')
  const [data, setData] = useState<ConfirmOrderResponse | null>(null)
  const calledRef = useRef(false)

  useEffect(() => {
    const parsed = tokenSchema.safeParse(token)
    if (!parsed.success) { setState('error'); return }
    if (calledRef.current) return
    calledRef.current = true

    ordersApi.confirmOrder(parsed.data)
      .then(res => { setData(res); setState('success') })
      .catch(() => setState('error'))
  }, [token])

  if (state === 'loading') {
    return (
      <Stack align="center" justify="center" className="min-h-screen bg-[var(--ios-bg)]">
        <Spinner inline />
      </Stack>
    )
  }

  if (state === 'error') {
    return (
      <Stack align="center" justify="center" className="min-h-screen bg-[var(--ios-bg)] p-6">
        <Box className="text-center max-w-sm">
          <Stack align="center" gap={2}>
            <Text as="span" size="xl">⚠️</Text>
            <Title level={1} size="lg">Link nieprawidłowy lub wygasł</Title>
            <Text size="sm" tone="muted" align="center">
              Link do potwierdzenia jest jednorazowy i ważny przez 1 godzinę.
              Wróć do stolika i złóż zamówienie ponownie.
            </Text>
          </Stack>
        </Box>
      </Stack>
    )
  }

  return (
    <Stack align="center" justify="center" className="min-h-screen bg-[var(--ios-bg)] p-6">
      <Card className="max-w-sm w-full p-8">
        <Stack align="center" gap={4}>
          <Text as="span" size="xl">✅</Text>
          <Stack align="center" gap={1}>
            <Title level={1} size="lg" align="center">Zamówienie potwierdzone!</Title>
            <Text size="sm" tone="muted" align="center">
              Twoje zamówienie trafiło do kuchni. Możesz śledzić jego status na stronie stolika.
            </Text>
          </Stack>
          {data && (
            <Link
              to={`/table/${data.restaurant_id}/${data.table_id}`}
              className="w-full py-3 bg-[var(--ios-blue)] hover:bg-[var(--ios-blue-hover)] text-white text-center font-bold rounded-[12px] hover:opacity-100"
            >
              Śledź status zamówienia →
            </Link>
          )}
        </Stack>
      </Card>
    </Stack>
  )
}
