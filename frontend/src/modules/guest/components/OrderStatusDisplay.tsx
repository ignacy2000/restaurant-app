import { Card } from '../../../shared/components/Card'
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
      <Card className="p-5 flex flex-col items-center text-center gap-3">
        <span className="text-4xl">📧</span>
        <p className="font-bold text-gray-900 dark:text-white">Sprawdź swoją skrzynkę e-mail</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Wysłaliśmy Ci link potwierdzający. Kliknij przycisk w wiadomości, aby złożyć zamówienie.
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">Link wygasa po 1 godzinie.</p>
      </Card>
    )
  }

  if (order.status === 'cancelled') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-5">
        <p className="font-bold text-red-700 dark:text-red-400 mb-1">Zamówienie anulowane</p>
        <p className="text-sm text-red-500 dark:text-red-400">Skontaktuj się z obsługą.</p>
      </div>
    )
  }

  const currentIdx = STEPS.indexOf(order.status)

  return (
    <Card className="p-5">
      <p className="font-bold text-gray-900 dark:text-white mb-4">Status zamówienia</p>

      <div className="flex flex-col gap-2">
        {STEPS.map((step, idx) => {
          const done = idx < currentIdx
          const active = idx === currentIdx
          return (
            <div key={step} className="flex items-center gap-3">
              <div className={`size-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                done ? 'bg-green-500 text-white' :
                active ? 'bg-blue-600 text-white' :
                'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
              }`}>
                {done ? '✓' : idx + 1}
              </div>
              <span className={`text-sm ${
                active ? 'font-semibold text-gray-900 dark:text-white' :
                done ? 'text-gray-500 dark:text-gray-400' :
                'text-gray-300 dark:text-gray-600'
              }`}>
                {STEP_LABEL[step]}
              </span>
              {active && (
                <span className="ml-auto text-xs text-blue-600 dark:text-blue-400 font-medium animate-pulse">
                  teraz
                </span>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">Zamówione pozycje:</p>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          {order.items.map((item: { id: string; name: string; quantity: number }) => (
            <li key={item.id} className="flex gap-2">
              <span className="font-medium">×{item.quantity}</span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
