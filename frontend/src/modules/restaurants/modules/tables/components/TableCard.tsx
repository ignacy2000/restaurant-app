import { useState, useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import type { Table } from '../types/table.types'
import { Button } from '../../../../../shared/components/Button'
import { Card } from '../../../../../shared/components/Card'

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
    if (capacity < 1) return
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
    <Card className="flex flex-col transition hover:shadow-md overflow-hidden">
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide">Stolik</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">#{table.number}</p>
          </div>

          {!editing && (
            <div className="flex gap-1.5 mt-1">
              <Button size="sm" variant="secondary" onClick={() => setShowQr(v => !v)}>QR</Button>
              <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>Edytuj</Button>
              <Button size="sm" variant="danger" loading={deleting} onClick={handleDelete}>
                {deleting ? '…' : 'Usuń'}
              </Button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">Pojemność</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={capacity}
                onChange={e => setCapacity(Number(e.target.value))}
                className="w-24 px-2.5 py-1.5 border border-gray-200 rounded-lg text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:ring-blue-900/30"
              />
              <Button size="sm" loading={saving} onClick={handleSave}>
                {saving ? '…' : 'Zapisz'}
              </Button>
              <Button size="sm" variant="secondary" onClick={handleCancel}>Anuluj</Button>
            </div>
            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">{seats(table.capacity)}</p>
        )}
      </div>

      {showQr && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4 flex flex-col items-center gap-3">
          <QRCodeSVG ref={qrRef} value={guestUrl} size={160} level="M" className="rounded-lg" />
          <p className="text-xs text-gray-400 dark:text-gray-500 break-all text-center leading-relaxed">{guestUrl}</p>
          <div className="flex gap-2 w-full">
            <Button size="sm" variant="secondary" fullWidth onClick={handleCopy}>
              {copied ? '✓ Skopiowano' : 'Kopiuj link'}
            </Button>
            <Button size="sm" variant="secondary" fullWidth onClick={handleDownload}>
              Pobierz SVG
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}
