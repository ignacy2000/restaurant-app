import { Alert, Card, Divider, List, ListItem, Stack, Text } from '../../../shared/components'
import { cn } from '../../../shared/utils/cn'
import type { Order, OrderStatus } from '../../restaurants/modules/orders/types/order.types'

const STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']

const STEP_LABEL: Record<OrderStatus, string> = {
  awaiting_confirmation: 'Oczekuje potwierdzenia',
  pending: 'Złożone',
  confirmed: 'Przyjęte',
  preparing: 'W przygotowaniu',
  ready: 'Gotowe do odbioru',
  delivered: 'Dostarczone',
  cancelled: 'Anulowane',
}

interface Props {
  order: Order
}

export function OrderStatusDisplay({ order }: Props) {
  if (order.status === 'awaiting_confirmation') {
    return (
      <Card className="p-5">
        <Stack align="center" gap={3}>
          <Text as="span" size="xl">📧</Text>
          <Text weight="bold" align="center">Sprawdź swoją skrzynkę e-mail</Text>
          <Text size="sm" tone="muted" align="center">
            Wysłaliśmy Ci link potwierdzający. Kliknij przycisk w wiadomości, aby złożyć zamówienie.
          </Text>
          <Text size="xs" tone="subtle" align="center">Link wygasa po 1 godzinie.</Text>
        </Stack>
      </Card>
    )
  }

  if (order.status === 'cancelled') {
    return (
      <Alert variant="error">
        <Stack gap={1}>
          <Text as="span" weight="bold">Zamówienie anulowane</Text>
          <Text as="span" size="sm">Skontaktuj się z obsługą.</Text>
        </Stack>
      </Alert>
    )
  }

  const currentIdx = STEPS.indexOf(order.status)

  return (
    <Card className="p-5">
      <Stack gap={4}>
        <Text weight="bold">Status zamówienia</Text>

        <Stack gap={2}>
          {STEPS.map((step, idx) => {
            const done = idx < currentIdx
            const active = idx === currentIdx
            return (
              <Stack key={step} direction="row" align="center" gap={3}>
                <Text
                  as="span"
                  size="xs"
                  weight="bold"
                  align="center"
                  className={cn(
                    'size-5 rounded-full flex items-center justify-center shrink-0',
                    done && 'bg-[var(--ios-green)] text-white',
                    active && 'bg-[var(--ios-blue)] text-white',
                    !done && !active && 'bg-[var(--ios-surface-2)] text-[var(--ios-ink-3)]'
                  )}
                >
                  {done ? '✓' : idx + 1}
                </Text>
                <Text
                  as="span"
                  size="sm"
                  weight={active ? 'semibold' : 'normal'}
                  tone={active ? 'default' : done ? 'muted' : 'subtle'}
                >
                  {STEP_LABEL[step]}
                </Text>
                {active && (
                  <Text
                    as="span"
                    size="xs"
                    weight="medium"
                    tone="primary"
                    className="ml-auto animate-pulse"
                  >
                    teraz
                  </Text>
                )}
              </Stack>
            )
          })}
        </Stack>

        <Stack gap={2}>
          <Divider spacing="none" />
          <Text size="xs" tone="muted" weight="medium">Zamówione pozycje:</Text>
          <List variant="none" spacing="sm">
            {order.items.map((item: { id: string; name: string; quantity: number }) => (
              <ListItem key={item.id}>
                <Stack direction="row" gap={2}>
                  <Text as="span" size="sm" weight="medium">×{item.quantity}</Text>
                  <Text as="span" size="sm">{item.name}</Text>
                </Stack>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Stack>
    </Card>
  )
}
