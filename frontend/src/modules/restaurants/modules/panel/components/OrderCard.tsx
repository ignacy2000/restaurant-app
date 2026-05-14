import { useState } from 'react'
import type { Order, OrderStatus } from '../../orders/types/order.types'
import {
  Badge,
  Box,
  Button,
  Card,
  List,
  ListItem,
  Stack,
  Text,
} from '../../../../../shared/components'
import { cn } from '../../../../../shared/utils/cn'

const STATUS_LABEL: Record<OrderStatus, string> = {
  awaiting_confirmation: 'Czeka na potwierdzenie',
  pending: 'Oczekuje',
  confirmed: 'Przyjęte',
  preparing: 'W przygotowaniu',
  ready: 'Gotowe',
  delivered: 'Dostarczone',
  cancelled: 'Anulowane',
}

const STATUS_COLOR: Record<OrderStatus, 'yellow' | 'blue' | 'indigo' | 'green' | 'gray' | 'red'> = {
  awaiting_confirmation: 'gray',
  pending: 'yellow',
  confirmed: 'blue',
  preparing: 'indigo',
  ready: 'green',
  delivered: 'gray',
  cancelled: 'red',
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
}

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  pending: 'Potwierdź',
  confirmed: 'Zacznij przygotowanie',
  preparing: 'Oznacz jako gotowe',
  ready: 'Oznacz jako dostarczone',
}

interface Props {
  order: Order
  tableNumber?: number
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<void>
}

export function OrderCard({ order, tableNumber, onUpdateStatus }: Props) {
  const [loading, setLoading] = useState(false)

  const nextStatus = NEXT_STATUS[order.status]
  const isDone = order.status === 'delivered' || order.status === 'cancelled'

  async function handleAction(status: OrderStatus) {
    setLoading(true)
    try { await onUpdateStatus(order.id, status) } finally { setLoading(false) }
  }

  const time = new Date(order.created_at).toLocaleTimeString('pl-PL', {
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <Card className={cn('p-4 transition', isDone && 'opacity-60')}>
      <Stack gap={3}>
        <Stack direction="row" align="start" justify="between" gap={2}>
          <Stack gap={0}>
            <Text weight="bold">
              {tableNumber != null ? `Stolik #${tableNumber}` : 'Stolik'}
            </Text>
            <Text size="xs" tone="subtle">{time}</Text>
          </Stack>
          <Badge color={STATUS_COLOR[order.status]}>{STATUS_LABEL[order.status]}</Badge>
        </Stack>

        <List variant="none" spacing="sm">
          {order.items.map(item => (
            <ListItem key={item.id}>
              <Stack direction="row" gap={1} className="items-baseline gap-x-1.5">
                <Text as="span" weight="medium">×{item.quantity}</Text>
                <Text as="span" size="sm">{item.name}</Text>
                {item.notes && (
                  <Text as="span" size="xs" tone="subtle">({item.notes})</Text>
                )}
              </Stack>
            </ListItem>
          ))}
        </List>

        {order.notes && (
          <Box className="bg-[var(--ios-surface-2)] rounded-lg px-3 py-2">
            <Text size="xs" tone="muted">Uwagi: {order.notes}</Text>
          </Box>
        )}

        {!isDone && (
          <Stack direction="row" gap={2} className="pt-1">
            {nextStatus && (
              <Button size="sm" fullWidth loading={loading} onClick={() => handleAction(nextStatus)}>
                {loading ? '…' : NEXT_LABEL[order.status]}
              </Button>
            )}
            {order.status !== 'ready' && (
              <Button size="sm" variant="danger" loading={loading} onClick={() => handleAction('cancelled')}>
                Anuluj
              </Button>
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}
