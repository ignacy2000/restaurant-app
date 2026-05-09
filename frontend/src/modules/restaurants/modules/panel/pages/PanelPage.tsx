import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useOrders } from '../../orders/hooks/useOrders'
import { useCalls } from '../../calls/hooks/useCalls'
import { useWebSocket, type WsEvent } from '../../../../../shared/hooks/useWebSocket'
import { authStorage } from '../../../../../shared/services/auth.storage'
import { getWsUrl } from '../../../../../shared/utils/ws'
import { OrderCard } from '../components/OrderCard'
import { CallCard } from '../components/CallCard'
import { Spinner } from '../../../../../shared/components/Spinner'
import type { Order } from '../../orders/types/order.types'
import type { WaiterCall } from '../../calls/types/call.types'
import { useTables } from '../../tables/hooks/useTables'

export function PanelPage() {
  const { id } = useParams<{ id: string }>()
  const { tables } = useTables(id!)
  const { orders, loading: ordersLoading, updateStatus: updateOrderStatus, upsert: upsertOrder } = useOrders(id!)
  const { calls, loading: callsLoading, updateStatus: updateCallStatus, upsert: upsertCall } = useCalls(id!)

  const token = authStorage.getAccessToken()
  const wsUrl = getWsUrl(`/ws/restaurants/${id}?token=${token}`)

  useWebSocket(wsUrl, (event: WsEvent) => {
    switch (event.type) {
      case 'order.created':
      case 'order.status_changed':
        upsertOrder(event.payload as Order)
        break
      case 'call.created':
      case 'call.status_changed':
        upsertCall(event.payload as WaiterCall)
        break
    }
  })

  const tableMap = useMemo(
    () => Object.fromEntries(tables.map(t => [t.id, t.number])),
    [tables]
  )

  const loading = ordersLoading || callsLoading

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold dark:text-white">Panel obsługi</h1>
        <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-full px-3 py-1">
          <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
          Na żywo
        </span>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <section>
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              Zamówienia
              {orders.length > 0 && (
                <span className="text-xs font-bold bg-blue-600 text-white rounded-full px-2 py-0.5">
                  {orders.length}
                </span>
              )}
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-600 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                Brak zamówień
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {orders.map((order: Order) => (
                  <OrderCard key={order.id} order={order} tableNumber={tableMap[order.table_id]} onUpdateStatus={updateOrderStatus} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              Wezwania kelnera
              {calls.length > 0 && (
                <span className="text-xs font-bold bg-yellow-500 text-white rounded-full px-2 py-0.5">
                  {calls.length}
                </span>
              )}
            </h2>

            {calls.length === 0 ? (
              <div className="text-center py-12 text-gray-400 dark:text-gray-600 text-sm border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                Brak wezwań
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {calls.map((call: WaiterCall) => (
                  <CallCard key={call.id} call={call} tableNumber={tableMap[call.table_id]} onUpdateStatus={updateCallStatus} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </>
  )
}
