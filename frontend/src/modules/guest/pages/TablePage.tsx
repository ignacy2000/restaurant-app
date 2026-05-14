import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { useWebSocket, type WsEvent } from '../../../shared/hooks/useWebSocket'
import { getWsUrl } from '../../../shared/utils/ws'
import { restaurantsApi } from '../../restaurants/services/restaurants.api'
import { tablesApi } from '../../restaurants/modules/tables/services/tables.api'
import { ordersApi } from '../../restaurants/modules/orders/services/orders.api'
import { CallWaiterButton } from '../components/CallWaiterButton'
import { OrderBuilder } from '../components/OrderBuilder'
import { OrderStatusDisplay } from '../components/OrderStatusDisplay'
import {
  Box,
  Button,
  Container,
  Spinner,
  Stack,
  Text,
  Title,
} from '../../../shared/components'
import type { Restaurant } from '../../restaurants/types/restaurant.types'
import type { Table } from '../../restaurants/modules/tables/types/table.types'
import type { Order, CreateOrderItemReq } from '../../restaurants/modules/orders/types/order.types'

export function TablePage() {
  const { restaurantId, tableId } = useParams<{ restaurantId: string; tableId: string }>()

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [table, setTable] = useState<Table | null>(null)
  const [infoLoading, setInfoLoading] = useState(true)
  const [infoError, setInfoError] = useState<string | null>(null)

  const [order, setOrder] = useState<Order | null>(null)
  const [orderDone, setOrderDone] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function fetchInfo() {
      try {
        const [rest, tables, orders] = await Promise.all([
          restaurantsApi.getRestaurant(restaurantId!),
          tablesApi.getByRestaurant(restaurantId!),
          ordersApi.getByTable(restaurantId!, tableId!),
        ])
        if (cancelled) return
        setRestaurant(rest)
        setTable(tables.find(t => t.id === tableId) ?? null)
        const active = orders.find(o => o.status !== 'delivered' && o.status !== 'cancelled')
        if (active) {
          setOrder(active)
          setOrderDone(true)
        }
      } catch {
        if (!cancelled) setInfoError('Nie znaleziono stolika')
      } finally {
        if (!cancelled) setInfoLoading(false)
      }
    }

    fetchInfo()
    return () => { cancelled = true }
  }, [restaurantId, tableId])

  const wsUrl = getWsUrl(`/ws/restaurants/${restaurantId}/tables/${tableId}`)

  useWebSocket(wsUrl, (event: WsEvent) => {
    if (event.type === 'order.status_changed') {
      const updated = event.payload as Order
      setOrder(prev => prev?.id === updated.id ? updated : prev)
    }
  })

  const handleOrderSubmit = useCallback(async (items: CreateOrderItemReq[], notes: string, email: string) => {
    const created = await ordersApi.create(restaurantId!, tableId!, {
      items,
      notes,
      guest_email: email || undefined,
    })
    setOrder(created)
    setOrderDone(true)
  }, [restaurantId, tableId])

  if (infoLoading) {
    return (
      <Stack align="center" justify="center" className="min-h-screen bg-[var(--ios-bg)]">
        <Spinner inline />
      </Stack>
    )
  }

  if (infoError || !restaurant || !table) {
    return (
      <Stack align="center" justify="center" className="min-h-screen bg-[var(--ios-bg)] p-6">
        <Stack align="center" gap={2}>
          <Text as="span" size="xl">🔍</Text>
          <Text weight="bold">Nie znaleziono stolika</Text>
          <Text size="sm" tone="muted">Sprawdź kod QR i spróbuj ponownie</Text>
        </Stack>
      </Stack>
    )
  }

  return (
    <Box className="min-h-screen bg-[var(--ios-bg)]">
      <Box
        as="header"
        className="bg-[var(--ios-surface)] border-b border-[var(--ios-border)] px-6 py-5"
      >
        <Text size="xs" tone="muted" weight="medium" className="uppercase tracking-wide">
          {restaurant.name}
        </Text>
        <Title level={1} size="2xl">Stolik #{table.number}</Title>
        {restaurant.address && (
          <Text size="xs" tone="subtle" className="mt-0.5">📍 {restaurant.address}</Text>
        )}
      </Box>

      <Container maxWidth="lg" padding="none" className="px-6 py-6">
        <Stack gap={6}>
          <Box as="section">
            <Title level={2} size="xs" tone="muted" className="uppercase tracking-wide mb-3">
              Obsługa
            </Title>
            <CallWaiterButton restaurantId={restaurantId!} tableId={tableId!} />
          </Box>

          <Box as="section">
            <Title level={2} size="xs" tone="muted" className="uppercase tracking-wide mb-3">
              Zamówienie
            </Title>

            {orderDone && order ? (
              <Stack gap={4}>
                <OrderStatusDisplay order={order} />
                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <Text size="xs" tone="subtle" align="center">
                    Status aktualizuje się automatycznie
                  </Text>
                )}
                {(order.status === 'delivered' || order.status === 'cancelled') && (
                  <Button
                    variant="secondary"
                    fullWidth
                    size="lg"
                    onClick={() => { setOrder(null); setOrderDone(false) }}
                  >
                    Złóż nowe zamówienie
                  </Button>
                )}
              </Stack>
            ) : (
              <OrderBuilder restaurantId={restaurantId!} onSubmit={handleOrderSubmit} />
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}
