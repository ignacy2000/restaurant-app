import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import type { Table } from '../types/table.types'
import { validateUpdateTable, TABLE_LIMITS } from '../services/validation'
import {
  Box,
  Button,
  Card,
  FormField,
  Input,
  Stack,
  Text,
  Title,
} from '../../../../../shared/components'

function seats(n: number): string {
  const r10 = n % 10
  const r100 = n % 100
  if (r10 === 1 && r100 !== 11) return `${n} miejsce`
  if (r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14)) return `${n} miejsca`
  return `${n} miejsc`
}

interface Props {
  table: Table
  restaurantId: string
  onUpdateCapacity: (tableId: string, capacity: number) => Promise<void>
  onDelete: (tableId: string) => Promise<void>
}

export function TableCard({ table, restaurantId, onUpdateCapacity, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [capacity, setCapacity] = useState(table.capacity)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<SVGSVGElement>(null)

  const guestUrl = `${window.location.origin}/table/${restaurantId}/${table.id}`

  async function handleSave() {
    const validationError = validateUpdateTable({ capacity })
    if (validationError) {
      setError(validationError)
      return
    }
    setSaving(true)
    setError('')
    try {
      await onUpdateCapacity(table.id, capacity)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd zapisu')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Usunąć stolik #${table.number}?`)) return
    setDeleting(true)
    try {
      await onDelete(table.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd usuwania')
      setDeleting(false)
    }
  }

  function handleCancel() {
    setCapacity(table.capacity)
    setEditing(false)
    setError('')
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(guestUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const svg = qrRef.current
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const blob = new Blob([svgStr], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `stolik-${table.number}.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="flex flex-col transition hover:shadow-[var(--ios-shadow-2)] overflow-hidden">
      <Stack gap={3} className="p-5">
        <Stack direction="row" align="start" justify="between" gap={2}>
          <Stack gap={0}>
            <Text size="xs" weight="medium" tone="subtle" className="uppercase tracking-wide">
              Stolik
            </Text>
            <Title level={2} size="2xl">#{table.number}</Title>
          </Stack>

          {!editing && (
            <Stack direction="row" gap={1} className="mt-1">
              <Button size="sm" variant="secondary" onClick={() => setShowQr(v => !v)}>QR</Button>
              <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edytuj</Button>
              <Button size="sm" variant="danger" loading={deleting} onClick={handleDelete}>
                {deleting ? '…' : 'Usuń'}
              </Button>
            </Stack>
          )}
        </Stack>

        {editing ? (
          <Stack gap={2}>
            <FormField label="Pojemność" htmlFor={`t-cap-${table.id}`}>
              <Stack direction="row" align="center" gap={2}>
                <Input
                  id={`t-cap-${table.id}`}
                  type="number"
                  min={TABLE_LIMITS.capacityMin}
                  max={TABLE_LIMITS.capacityMax}
                  value={capacity}
                  onChange={e => setCapacity(Number(e.target.value))}
                  className="w-24"
                />
                <Button size="sm" loading={saving} onClick={handleSave}>
                  {saving ? '…' : 'Zapisz'}
                </Button>
                <Button size="sm" variant="secondary" onClick={handleCancel}>Anuluj</Button>
              </Stack>
            </FormField>
            {error && <Text size="xs" tone="danger">{error}</Text>}
          </Stack>
        ) : (
          <Text size="sm" tone="muted">{seats(table.capacity)}</Text>
        )}
      </Stack>

      {showQr && (
        <Box className="border-t border-[var(--ios-border)] px-5 py-4">
          <Stack align="center" gap={3}>
            <QRCodeSVG ref={qrRef} value={guestUrl} size={160} level="M" className="rounded-lg" />
            <Text size="xs" tone="subtle" align="center" className="break-all leading-relaxed">
              {guestUrl}
            </Text>
            <Stack direction="row" gap={2} className="w-full">
              <Button size="sm" variant="secondary" fullWidth onClick={handleCopy}>
                {copied ? '✓ Skopiowano' : 'Kopiuj link'}
              </Button>
              <Button size="sm" variant="secondary" fullWidth onClick={handleDownload}>
                Pobierz SVG
              </Button>
            </Stack>
          </Stack>
        </Box>
      )}
    </Card>
  )
}
