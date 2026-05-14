import { useState } from 'react'
import type { WaiterCall, CallStatus } from '../../calls/types/call.types'
import { Badge, Button, Card, Stack, Text } from '../../../../../shared/components'
import { cn } from '../../../../../shared/utils/cn'

const STATUS_LABEL: Record<CallStatus, string> = {
  pending: 'Oczekuje',
  acknowledged: 'Przyjęte',
  done: 'Zakończone',
}

const STATUS_COLOR: Record<CallStatus, 'yellow' | 'blue' | 'gray'> = {
  pending: 'yellow',
  acknowledged: 'blue',
  done: 'gray',
}

const NEXT_STATUS: Partial<Record<CallStatus, CallStatus>> = {
  pending: 'acknowledged',
  acknowledged: 'done',
}

const NEXT_LABEL: Partial<Record<CallStatus, string>> = {
  pending: 'Przyjmij',
  acknowledged: 'Zakończ',
}

interface Props {
  call: WaiterCall
  tableNumber?: number
  onUpdateStatus: (callId: string, status: CallStatus) => Promise<void>
}

export function CallCard({ call, tableNumber, onUpdateStatus }: Props) {
  const [loading, setLoading] = useState(false)

  const nextStatus = NEXT_STATUS[call.status]
  const isDone = call.status === 'done'

  async function handleAction(status: CallStatus) {
    setLoading(true)
    try { await onUpdateStatus(call.id, status) } finally { setLoading(false) }
  }

  const time = new Date(call.created_at).toLocaleTimeString('pl-PL', {
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
          <Badge color={STATUS_COLOR[call.status]}>{STATUS_LABEL[call.status]}</Badge>
        </Stack>

        <Stack direction="row" align="center" gap={2}>
          <Text as="span">🔔</Text>
          <Text as="span" size="sm" tone="muted">Prośba o obsługę</Text>
        </Stack>

        {!isDone && nextStatus && (
          <Button size="sm" fullWidth loading={loading} onClick={() => handleAction(nextStatus)}>
            {loading ? '…' : NEXT_LABEL[call.status]}
          </Button>
        )}
      </Stack>
    </Card>
  )
}
