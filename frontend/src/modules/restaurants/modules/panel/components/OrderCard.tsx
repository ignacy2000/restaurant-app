import { useState } from 'react'
import type { Order, OrderStatus } from '../../orders/types/order.types'
import { Badge } from '../../../../../shared/components/Badge'
import { Button } from '../../../../../shared/components/Button'
import { Card } from '../../../../../shared/components/Card'

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
    <Card className={`p-4 flex flex-col gap-3 transition ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-900 dark:text-white">
            {tableNumber != null ? `Stolik #${tableNumber}` : 'Stolik'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{time}</p>
        </div>
        <Badge color={STATUS_COLOR[order.status]}>{STATUS_LABEL[order.status]}</Badge>
      </div>

      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
        {order.items.map(item => (
          <li key={item.id} className="flex items-baseline gap-1.5">
            <span className="font-medium text-gray-900 dark:text-white">×{item.quantity}</span>
            <span>{item.name}</span>
            {item.notes && <span className="text-gray-400 dark:text-gray-500 text-xs">({item.notes})</span>}
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3 py-2">
          Uwagi: {order.notes}
        </p>
      )}

      {!isDone && (
        <div className="flex gap-2 pt-1">
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
        </div>
      )}
    </Card>
  )
}
