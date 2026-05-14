import { useState, useEffect } from 'react'
import { menusApi } from '../../restaurants/modules/menus'
import type { MenuItem } from '../../restaurants/modules/menus'
import type { CreateOrderItemReq } from '../../restaurants/modules/orders/types/order.types'
import { validateCreateOrder, ORDER_LIMITS } from '../../restaurants/modules/orders'
import { cn } from '../../../shared/utils/cn'
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Grid,
  Input,
  Spinner,
  Stack,
  Text,
} from '../../../shared/components'

interface CartEntry {
  item: MenuItem
  quantity: number
}

interface Props {
  restaurantId: string
  onSubmit: (items: CreateOrderItemReq[], notes: string, email: string) => Promise<void>
}

function formatPrice(price: number) {
  return price.toFixed(2).replace('.', ',') + ' zł'
}

export function OrderBuilder({ restaurantId, onSubmit }: Props) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [itemsLoading, setItemsLoading] = useState(true)

  const [cart, setCart] = useState<CartEntry[]>([])
  const [orderNotes, setOrderNotes] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    menusApi.getItemsByRestaurant(restaurantId)
      .then(setMenuItems)
      .catch(() => setMenuItems([]))
      .finally(() => setItemsLoading(false))
  }, [restaurantId])

  function addToCart(item: MenuItem) {
    setCart(prev => {
      const existing = prev.find(e => e.item.id === item.id)
      if (existing) {
        return prev.map(e => e.item.id === item.id ? { ...e, quantity: e.quantity + 1 } : e)
      }
      return [...prev, { item, quantity: 1 }]
    })
  }

  function setQuantity(itemId: string, delta: number) {
    setCart(prev =>
      prev
        .map(e => e.item.id === itemId ? { ...e, quantity: e.quantity + delta } : e)
        .filter(e => e.quantity > 0)
    )
  }

  function removeFromCart(itemId: string) {
    setCart(prev => prev.filter(e => e.item.id !== itemId))
  }

  async function handleSubmit() {
    const items = cart.map(({ item, quantity }) => ({ name: item.name, quantity }))
    const validationError = validateCreateOrder({
      items,
      notes: orderNotes,
      guestEmail: guestEmail.trim(),
    })
    if (validationError) {
      setSubmitError(validationError)
      return
    }
    setSubmitError('')
    setSubmitting(true)
    try {
      await onSubmit(items, orderNotes, guestEmail.trim())
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Błąd składania zamówienia')
      setSubmitting(false)
    }
  }

  const totalPrice = cart.reduce((sum, e) => sum + e.item.price * e.quantity, 0)

  if (itemsLoading) return <Spinner />

  if (menuItems.length === 0) {
    return (
      <EmptyState
        icon="🍽️"
        title="Menu nie jest jeszcze skonfigurowane"
        description="Zapytaj obsługę o dostępne dania"
      />
    )
  }

  return (
    <Stack gap={6}>
      <Grid cols={2} gap={3}>
        {menuItems.map(item => {
          const inCart = cart.find(e => e.item.id === item.id)
          return (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => addToCart(item)}
              className={cn(
                'relative flex flex-col items-stretch justify-start gap-1 p-4 rounded-[14px] border whitespace-normal text-left font-normal',
                'bg-[var(--ios-surface)] hover:bg-[var(--ios-surface)]',
                inCart
                  ? 'border-[var(--ios-blue)]'
                  : 'border-[var(--ios-border)] hover:border-[var(--ios-blue)]'
              )}
            >
              {inCart && (
                <Badge
                  color="blue"
                  className="absolute top-2 right-2 w-5 h-5 px-0 justify-center bg-[var(--ios-blue)] text-white"
                >
                  {inCart.quantity}
                </Badge>
              )}
              <Text size="sm" weight="semibold" className="pr-6 leading-tight">
                {item.name}
              </Text>
              {item.description && (
                <Text size="xs" tone="subtle" className="leading-tight line-clamp-2">
                  {item.description}
                </Text>
              )}
              <Text size="sm" weight="bold" tone="primary" className="mt-auto pt-2">
                {formatPrice(item.price)}
              </Text>
            </Button>
          )
        })}
      </Grid>

      {cart.length > 0 && (
        <Stack gap={4}>
          <Stack gap={2}>
            <Text size="sm" weight="semibold" tone="muted">Koszyk</Text>
            {cart.map(({ item, quantity }) => (
              <Card key={item.id} className="px-4 py-3">
                <Stack direction="row" align="center" gap={3}>
                  <Stack gap={0} className="flex-1 min-w-0">
                    <Text size="sm" weight="medium" truncate>{item.name}</Text>
                    <Text size="xs" tone="subtle">{formatPrice(item.price * quantity)}</Text>
                  </Stack>
                  <Stack direction="row" align="center" gap={1}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setQuantity(item.id, -1)}
                      className="w-7 h-7 p-0 rounded-[9px]"
                    >−</Button>
                    <Text as="span" size="sm" weight="bold" align="center" className="w-6">
                      {quantity}
                    </Text>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setQuantity(item.id, 1)}
                      className="w-7 h-7 p-0 rounded-[9px]"
                    >+</Button>
                  </Stack>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Usuń"
                    className="p-0 ml-1 text-[var(--ios-ink-3)] hover:text-[var(--ios-red)] text-xl leading-none font-normal"
                  >×</Button>
                </Stack>
              </Card>
            ))}
          </Stack>

          <Stack direction="row" align="center" justify="between" className="px-1">
            <Text as="span" size="sm" tone="muted">Łącznie</Text>
            <Text as="span" size="base" weight="bold">{formatPrice(totalPrice)}</Text>
          </Stack>

          <Input
            type="email"
            placeholder="Adres e-mail (wymagany do potwierdzenia)"
            maxLength={ORDER_LIMITS.emailMax}
            value={guestEmail}
            onChange={e => setGuestEmail(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Uwagi do zamówienia (opcjonalnie)"
            maxLength={ORDER_LIMITS.orderNotesMax}
            value={orderNotes}
            onChange={e => setOrderNotes(e.target.value)}
          />

          {submitError && <Alert>{submitError}</Alert>}

          <Button
            onClick={handleSubmit}
            loading={submitting}
            fullWidth
            size="lg"
          >
            {submitting
              ? 'Wysyłanie…'
              : `Zamów (${cart.length} ${cart.length === 1 ? 'pozycja' : cart.length < 5 ? 'pozycje' : 'pozycji'} · ${formatPrice(totalPrice)})`
            }
          </Button>
        </Stack>
      )}
    </Stack>
  )
}
