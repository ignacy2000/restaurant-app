import { useState } from 'react'
import type { WaiterCall, CallStatus } from '../../calls/types/call.types'
import { Badge } from '../../../../../shared/components/Badge'
import { Button } from '../../../../../shared/components/Button'
import { Card } from '../../../../../shared/components/Card'

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
    <Card className={`p-4 flex flex-col gap-3 transition ${isDone ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-gray-900 dark:text-white">
            {tableNumber != null ? `Stolik #${tableNumber}` : 'Stolik'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">{time}</p>
        </div>
        <Badge color={STATUS_COLOR[call.status]}>{STATUS_LABEL[call.status]}</Badge>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
        <span>🔔</span> Prośba o obsługę
      </p>

      {!isDone && nextStatus && (
        <Button size="sm" fullWidth loading={loading} onClick={() => handleAction(nextStatus)}>
          {loading ? '…' : NEXT_LABEL[call.status]}
        </Button>
      )}
    </Card>
  )
}
