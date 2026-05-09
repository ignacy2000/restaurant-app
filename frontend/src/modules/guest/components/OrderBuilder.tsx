import { useState, useEffect } from 'react'
import { menusApi } from '../../restaurants/modules/menus'
import type { MenuItem } from '../../restaurants/modules/menus'
import type { CreateOrderItemReq } from '../../restaurants/modules/orders/types/order.types'
import { Spinner } from '../../../shared/components/Spinner'
import { Input } from '../../../shared/components/Input'
import { Button } from '../../../shared/components/Button'
import { Alert } from '../../../shared/components/Alert'

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
    if (cart.length === 0 || !guestEmail) return
    setSubmitError('')
    setSubmitting(true)
    try {
      await onSubmit(
        cart.map(({ item, quantity }) => ({ name: item.name, quantity })),
        orderNotes,
        guestEmail
      )
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Błąd składania zamówienia')
      setSubmitting(false)
    }
  }

  const totalPrice = cart.reduce((sum, e) => sum + e.item.price * e.quantity, 0)

  if (itemsLoading) return <div className="flex justify-center py-8"><Spinner /></div>

  if (menuItems.length === 0) {
    return (
      <div className="flex flex-col items-center text-center py-12">
        <span className="text-4xl mb-3 opacity-40">🍽️</span>
        <p className="font-semibold text-gray-700 dark:text-gray-300">Menu nie jest jeszcze skonfigurowane</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Zapytaj obsługę o dostępne dania</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-3">
        {menuItems.map(item => {
          const inCart = cart.find(e => e.item.id === item.id)
          return (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className={
                'relative text-left bg-white dark:bg-gray-800 border rounded-xl p-4 flex flex-col gap-1 transition cursor-pointer ' +
                (inCart
                  ? 'border-blue-400 dark:border-blue-500 shadow-sm shadow-blue-100 dark:shadow-blue-900/30'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-sm')
              }
            >
              {inCart && (
                <span className="absolute top-2 right-2 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {inCart.quantity}
                </span>
              )}
              <p className="font-semibold text-gray-900 dark:text-white text-sm pr-6 leading-tight">{item.name}</p>
              {item.description && (
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight line-clamp-2">{item.description}</p>
              )}
              <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-auto pt-2">{formatPrice(item.price)}</p>
            </button>
          )
        })}
      </div>

      {cart.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Koszyk</p>
            {cart.map(({ item, quantity }) => (
              <div key={item.id} className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{formatPrice(item.price * quantity)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold text-base flex items-center justify-center transition cursor-pointer"
                  >−</button>
                  <span className="w-6 text-center text-sm font-bold text-gray-900 dark:text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-bold text-base flex items-center justify-center transition cursor-pointer"
                  >+</button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 transition text-xl leading-none ml-1 cursor-pointer"
                  aria-label="Usuń"
                >×</button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-sm text-gray-500 dark:text-gray-400">Łącznie</span>
            <span className="text-base font-bold text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
          </div>

          <Input
            type="email"
            placeholder="Adres e-mail (wymagany do potwierdzenia)"
            value={guestEmail}
            onChange={e => setGuestEmail(e.target.value)}
            required
          />
          <Input
            type="text"
            placeholder="Uwagi do zamówienia (opcjonalnie)"
            value={orderNotes}
            onChange={e => setOrderNotes(e.target.value)}
          />

          {submitError && <Alert>{submitError}</Alert>}

          <Button
            onClick={handleSubmit}
            loading={submitting}
            fullWidth
            className="py-3.5 rounded-xl text-base font-bold"
          >
            {submitting
              ? 'Wysyłanie…'
              : `Zamów (${cart.length} ${cart.length === 1 ? 'pozycja' : cart.length < 5 ? 'pozycje' : 'pozycji'} · ${formatPrice(totalPrice)})`
            }
          </Button>
        </div>
      )}
    </div>
  )
}
