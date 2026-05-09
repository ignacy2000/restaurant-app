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
import { Spinner } from '../../../shared/components/Spinner'
import { Button } from '../../../shared/components/Button'
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (infoError || !restaurant || !table) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-4xl mb-4">🔍</p>
          <p className="font-bold text-gray-900 dark:text-white mb-1">Nie znaleziono stolika</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Sprawdź kod QR i spróbuj ponownie</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-5">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{restaurant.name}</p>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Stolik #{table.number}</h1>
        {restaurant.address && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">📍 {restaurant.address}</p>
        )}
      </div>

      <div className="max-w-lg mx-auto px-6 py-6 flex flex-col gap-6">

        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Obsługa</h2>
          <CallWaiterButton restaurantId={restaurantId!} tableId={tableId!} />
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Zamówienie</h2>

          {orderDone && order ? (
            <div className="flex flex-col gap-4">
              <OrderStatusDisplay order={order} />
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <p className="text-xs text-center text-gray-400 dark:text-gray-500">
                  Status aktualizuje się automatycznie
                </p>
              )}
              {(order.status === 'delivered' || order.status === 'cancelled') && (
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => { setOrder(null); setOrderDone(false) }}
                  className="py-3"
                >
                  Złóż nowe zamówienie
                </Button>
              )}
            </div>
          ) : (
            <OrderBuilder restaurantId={restaurantId!} onSubmit={handleOrderSubmit} />
          )}
        </section>

      </div>
    </div>
  )
}
