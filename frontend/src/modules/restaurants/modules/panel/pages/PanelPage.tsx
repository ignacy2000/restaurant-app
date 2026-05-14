import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useOrders } from '../../orders/hooks/useOrders'
import { useCalls } from '../../calls/hooks/useCalls'
import { useWebSocket, type WsEvent } from '../../../../../shared/hooks/useWebSocket'
import { authStorage } from '../../../../../shared/services/auth.storage'
import { getWsUrl } from '../../../../../shared/utils/ws'
import { OrderCard } from '../components/OrderCard'
import { CallCard } from '../components/CallCard'
import {
  Badge,
  Box,
  Grid,
  Spinner,
  Stack,
  Text,
  Title,
} from '../../../../../shared/components'
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
      <Stack direction="row" align="center" justify="between" className="mb-8">
        <Title level={1} size="lg">Panel obsługi</Title>
        <Badge color="green" dot>Na żywo</Badge>
      </Stack>

      {loading ? (
        <Spinner />
      ) : (
        <Grid cols={1} responsive={{ lg: 2 }} gap={8}>
          <Box as="section">
            <Stack direction="row" align="center" gap={2} className="mb-4">
              <Title level={2} size="sm">Zamówienia</Title>
              {orders.length > 0 && (
                <Badge color="blue">{orders.length}</Badge>
              )}
            </Stack>

            {orders.length === 0 ? (
              <Box className="text-center py-12 border-2 border-dashed border-[var(--ios-border)] rounded-xl">
                <Text size="sm" tone="subtle">Brak zamówień</Text>
              </Box>
            ) : (
              <Stack gap={3}>
                {orders.map((order: Order) => (
                  <OrderCard key={order.id} order={order} tableNumber={tableMap[order.table_id]} onUpdateStatus={updateOrderStatus} />
                ))}
              </Stack>
            )}
          </Box>

          <Box as="section">
            <Stack direction="row" align="center" gap={2} className="mb-4">
              <Title level={2} size="sm">Wezwania kelnera</Title>
              {calls.length > 0 && (
                <Badge color="yellow">{calls.length}</Badge>
              )}
            </Stack>

            {calls.length === 0 ? (
              <Box className="text-center py-12 border-2 border-dashed border-[var(--ios-border)] rounded-xl">
                <Text size="sm" tone="subtle">Brak wezwań</Text>
              </Box>
            ) : (
              <Stack gap={3}>
                {calls.map((call: WaiterCall) => (
                  <CallCard key={call.id} call={call} tableNumber={tableMap[call.table_id]} onUpdateStatus={updateCallStatus} />
                ))}
              </Stack>
            )}
          </Box>
        </Grid>
      )}
    </>
  )
}
