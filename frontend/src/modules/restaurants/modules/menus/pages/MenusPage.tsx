import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useMenus } from '../hooks/useMenus'
import { menusApi } from '../services/menus.api'
import { AddMenuForm } from '../components/AddMenuForm'
import { Alert } from '../../../../../shared/components/Alert'
import { Button } from '../../../../../shared/components/Button'
import { Card } from '../../../../../shared/components/Card'
import { EmptyState } from '../../../../../shared/components/EmptyState'
import { Input } from '../../../../../shared/components/Input'
import { Spinner } from '../../../../../shared/components/Spinner'
import type { CreateMenuReq, CreateMenuItemReq, MenuItem } from '../types/menu.types'

function formatPrice(price: number) {
  return price.toFixed(2).replace('.', ',') + ' zł'
}

interface ItemTileProps {
  item: MenuItem
  onUploaded: (item: MenuItem) => void
  onDeleted: (itemId: string) => void
}

function ItemTile({ item, onUploaded, onDeleted }: ItemTileProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const updated = await menusApi.uploadItemImage(item.id, file)
      onUploaded(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd uploadu')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleDelete() {
    if (!confirm(`Usunąć "${item.name}"?`)) return
    setDeleting(true)
    try {
      await menusApi.deleteItem(item.id)
      onDeleted(item.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd usuwania')
      setDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-300 dark:text-gray-600 text-5xl">
            🍽️
          </div>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Usuń pozycję"
          className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-red-500 transition disabled:opacity-40 cursor-pointer text-sm leading-none"
        >×</button>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-bold text-gray-900 dark:text-white text-base flex-1">{item.name}</p>
          <span className="text-sm font-semibold text-blue-600 shrink-0">{formatPrice(item.price)}</span>
        </div>
        {item.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
        )}
        <div className="pt-2 mt-auto">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFile}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            fullWidth
            loading={uploading}
            onClick={() => inputRef.current?.click()}
          >
            {item.image_url ? 'Zmień zdjęcie' : '📷 Dodaj zdjęcie'}
          </Button>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
      </div>
    </Card>
  )
}

interface AddItemFormProps {
  onSubmit: (data: CreateMenuItemReq, file: File | null) => Promise<void>
  onCancel: () => void
}

type ImageMode = 'none' | 'url' | 'upload'

function AddItemForm({ onSubmit, onCancel }: AddItemFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [imageMode, setImageMode] = useState<ImageMode>('none')
  const [imageUrl, setImageUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const previewUrl = imageMode === 'upload' && file
    ? URL.createObjectURL(file)
    : imageMode === 'url' && imageUrl.trim()
      ? imageUrl.trim()
      : null

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    try {
      await onSubmit(
        {
          name: name.trim(),
          description: description.trim() || undefined,
          price: parseFloat(price) || 0,
          image_url: imageMode === 'url' ? imageUrl.trim() || undefined : undefined,
        },
        imageMode === 'upload' ? file : null,
      )
      setName('')
      setDescription('')
      setPrice('')
      setImageMode('none')
      setImageUrl('')
      setFile(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd dodawania pozycji')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <Input type="text" placeholder="Nazwa dania *" value={name} onChange={e => setName(e.target.value)} required className="px-3 py-2" />
        <Input type="text" placeholder="Opis (opcjonalnie)" value={description} onChange={e => setDescription(e.target.value)} className="px-3 py-2" />
        <Input type="number" placeholder="Cena (zł)" value={price} onChange={e => setPrice(e.target.value)} min={0} step="0.01" className="px-3 py-2" />

        <div className="flex gap-1 pt-1">
          <button
            type="button"
            onClick={() => setImageMode('none')}
            className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition cursor-pointer ${
              imageMode === 'none'
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >Bez zdjęcia</button>
          <button
            type="button"
            onClick={() => setImageMode('url')}
            className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition cursor-pointer ${
              imageMode === 'url'
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >🔗 URL</button>
          <button
            type="button"
            onClick={() => setImageMode('upload')}
            className={`flex-1 px-2 py-1.5 text-xs rounded-md border transition cursor-pointer ${
              imageMode === 'upload'
                ? 'bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-200'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >📷 Plik</button>
        </div>

        {imageMode === 'url' && (
          <Input
            type="url"
            placeholder="https://… (URL zdjęcia)"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            className="px-3 py-2"
          />
        )}
        {imageMode === 'upload' && (
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            className="px-3 py-2 text-xs file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-gray-100 file:text-gray-700 dark:file:bg-gray-700 dark:file:text-gray-200"
          />
        )}
        {previewUrl && (
          <div className="aspect-[4/3] rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img src={previewUrl} alt="podgląd" className="w-full h-full object-cover" />
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex gap-2 pt-1">
          <Button type="submit" loading={saving} fullWidth size="sm">
            {saving ? 'Dodawanie…' : 'Dodaj'}
          </Button>
          <Button type="button" variant="secondary" size="sm" onClick={onCancel}>Anuluj</Button>
        </div>
      </form>
    </Card>
  )
}

export function MenusPage() {
  const { id } = useParams<{ id: string }>()
  const { menus, loading: menusLoading, error: menusError, create } = useMenus(id!)

  const [items, setItems] = useState<MenuItem[]>([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [itemsError, setItemsError] = useState<string | null>(null)
  const [showMenuForm, setShowMenuForm] = useState(false)
  const [showItemFormFor, setShowItemFormFor] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setItemsLoading(true)
    menusApi.getItemsByRestaurant(id)
      .then(data => { setItems(data); setItemsError(null) })
      .catch(err => setItemsError(err instanceof Error ? err.message : 'Błąd pobierania pozycji'))
      .finally(() => setItemsLoading(false))
  }, [id])

  async function handleCreateMenu(data: CreateMenuReq) {
    await create(data)
    setShowMenuForm(false)
  }

  async function handleCreateItem(menuId: string, data: CreateMenuItemReq, file: File | null) {
    const created = await menusApi.createItem(menuId, data)
    const final = file ? await menusApi.uploadItemImage(created.id, file) : created
    setItems(prev => [...prev, final])
    setShowItemFormFor(null)
  }

  function handleItemUpdated(updated: MenuItem) {
    setItems(prev => prev.map(it => it.id === updated.id ? updated : it))
  }

  function handleItemDeleted(itemId: string) {
    setItems(prev => prev.filter(it => it.id !== itemId))
  }

  const loading = menusLoading || itemsLoading
  const error = menusError || itemsError

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold dark:text-white">Menu</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Zarządzaj kartami, pozycjami i zdjęciami dań.</p>
        </div>
        {!showMenuForm && (
          <Button onClick={() => setShowMenuForm(true)}>+ Dodaj sekcje</Button>
        )}
      </div>

      {showMenuForm && (
        <AddMenuForm onSubmit={handleCreateMenu} onCancel={() => setShowMenuForm(false)} />
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : menus.length === 0 && !showMenuForm ? (
        <EmptyState
          icon="🍽️"
          title="Brak menu"
          description="Dodaj pierwsze menu — możesz mieć kilka kart (np. obiad, kolacja, sezonowe)."
          action={<Button size="lg" onClick={() => setShowMenuForm(true)}>+ Dodaj pierwszą sekcje</Button>}
        />
      ) : (
        <div className="flex flex-col gap-10">
          {menus.map(menu => {
            const menuItems = items.filter(it => it.menu_id === menu.id)
            const isAdding = showItemFormFor === menu.id
            return (
              <section key={menu.id}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{menu.name}</h2>
                    {menu.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{menu.description}</p>
                    )}
                  </div>
                  {!isAdding && (
                    <Button size="sm" variant="secondary" onClick={() => setShowItemFormFor(menu.id)}>
                      + Dodaj pozycję
                    </Button>
                  )}
                </div>

                {menuItems.length === 0 && !isAdding && (
                  <p className="text-sm text-gray-400 dark:text-gray-500 py-4">Brak pozycji w tej sekcji</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {menuItems.map(item => (
                    <ItemTile
                      key={item.id}
                      item={item}
                      onUploaded={handleItemUpdated}
                      onDeleted={handleItemDeleted}
                    />
                  ))}
                  {isAdding && (
                    <AddItemForm
                      onSubmit={(data, file) => handleCreateItem(menu.id, data, file)}
                      onCancel={() => setShowItemFormFor(null)}
                    />
                  )}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </>
  )
}
