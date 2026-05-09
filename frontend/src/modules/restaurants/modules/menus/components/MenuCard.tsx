import { useState, FormEvent } from 'react'
import { menusApi } from '../services/menus.api'
import type { Menu, MenuItem, CreateMenuItemReq } from '../types/menu.types'
import { Badge } from '../../../../../shared/components/Badge'
import { Button } from '../../../../../shared/components/Button'
import { Card } from '../../../../../shared/components/Card'
import { Input } from '../../../../../shared/components/Input'

interface Props {
  menu: Menu
  items: MenuItem[]
  onItemCreated: (item: MenuItem) => void
  onItemDeleted: (itemId: string) => void
}

function formatPrice(price: number) {
  return price.toFixed(2).replace('.', ',') + ' zł'
}

export function MenuCard({ menu, items, onItemCreated, onItemDeleted }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const date = new Date(menu.created_at).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  async function handleAddItem(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      const req: CreateMenuItemReq = {
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price) || 0,
      }
      const created = await menusApi.createItem(menu.id, req)
      onItemCreated(created)
      setName('')
      setDescription('')
      setPrice('')
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(itemId: string) {
    setDeletingId(itemId)
    try {
      await menusApi.deleteItem(itemId)
      onItemDeleted(itemId)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-5 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-base">{menu.name}</p>
            {menu.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mt-0.5">{menu.description}</p>
            )}
          </div>
          <button
            onClick={() => setExpanded(v => !v)}
            className="text-xs text-blue-600 font-medium shrink-0 hover:underline cursor-pointer"
          >
            {expanded ? 'Zwiń' : `Pozycje (${items.length})`}
          </button>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">{date}</p>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 dark:border-gray-700 px-5 py-4 flex flex-col gap-3">
          {items.length === 0 && !showForm && (
            <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">Brak pozycji w tym menu</p>
          )}

          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.name}</p>
                {item.description && (
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{item.description}</p>
                )}
              </div>
              <Badge color="blue" className="shrink-0">{formatPrice(item.price)}</Badge>
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition text-lg leading-none disabled:opacity-40 cursor-pointer"
                aria-label="Usuń pozycję"
              >×</button>
            </div>
          ))}

          {showForm ? (
            <form onSubmit={handleAddItem} className="flex flex-col gap-2 pt-1">
              <Input type="text" placeholder="Nazwa dania *" value={name} onChange={e => setName(e.target.value)} required className="px-3 py-2" />
              <Input type="text" placeholder="Opis (opcjonalnie)" value={description} onChange={e => setDescription(e.target.value)} className="px-3 py-2" />
              <Input type="number" placeholder="Cena (zł)" value={price} onChange={e => setPrice(e.target.value)} min={0} step="0.01" className="px-3 py-2" />
              <div className="flex gap-2">
                <Button type="submit" loading={saving} fullWidth size="sm">
                  {saving ? 'Dodawanie…' : 'Dodaj'}
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>Anuluj</Button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowForm(true)}
              className="text-sm text-blue-600 font-medium hover:underline text-left cursor-pointer"
            >
              + Dodaj pozycję
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
