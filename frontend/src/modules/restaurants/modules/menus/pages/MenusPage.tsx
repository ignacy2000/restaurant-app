import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { useMenus } from '../hooks/useMenus'
import { menusApi } from '../services/menus.api'
import { AddMenuForm } from '../components/AddMenuForm'
import { LIMITS, validateItemFields } from '../services/validation'
import { cn } from '../../../../../shared/utils/cn'
import {
  Alert,
  Box,
  Button,
  Card,
  EmptyState,
  Grid,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
  Title,
} from '../../../../../shared/components'
import type { CreateMenuReq, CreateMenuItemReq, MenuItem } from '../types/menu.types'

function formatPrice(price: number) {
  return price.toFixed(2).replace('.', ',') + ' zł'
}

type ImageMode = 'none' | 'url' | 'upload'

interface ImageModeTabsProps {
  value: ImageMode
  onChange: (mode: ImageMode) => void
}

function ImageModeTabs({ value, onChange }: ImageModeTabsProps) {
  const tabs: Array<{ mode: ImageMode; label: string }> = [
    { mode: 'none', label: 'Bez zdjęcia' },
    { mode: 'url', label: '🔗 URL' },
    { mode: 'upload', label: '📷 Plik' },
  ]
  return (
    <Stack direction="row" gap={1} className="pt-1">
      {tabs.map(({ mode, label }) => (
        <Button
          key={mode}
          type="button"
          variant={value === mode ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onChange(mode)}
          className={cn(
            'flex-1 px-2 py-1.5 text-xs font-normal rounded-md border',
            value === mode
              ? 'bg-[var(--ios-blue-soft)] border-[var(--ios-blue)] text-[var(--ios-blue-ink)] hover:bg-[var(--ios-blue-soft)]'
              : 'border-[var(--ios-border)] text-[var(--ios-ink-2)]'
          )}
        >
          {label}
        </Button>
      ))}
    </Stack>
  )
}

interface ItemTileProps {
  item: MenuItem
  onUpdated: (item: MenuItem) => void
  onDeleted: (itemId: string) => void
}

function ItemTile({ item, onUpdated, onDeleted }: ItemTileProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const editFileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(item.name)
  const [description, setDescription] = useState(item.description)
  const [price, setPrice] = useState(item.price.toString())
  const [imageMode, setImageMode] = useState<ImageMode>('none')
  const [imageUrl, setImageUrl] = useState('')
  const [editFile, setEditFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const previewUrl = imageMode === 'upload' && editFile
    ? URL.createObjectURL(editFile)
    : imageMode === 'url' && imageUrl.trim()
      ? imageUrl.trim()
      : null

  function startEdit() {
    setName(item.name)
    setDescription(item.description)
    setPrice(item.price.toString())
    setImageMode(item.image_url ? 'url' : 'none')
    setImageUrl(item.image_url || '')
    setEditFile(null)
    setError(null)
    setEditing(true)
  }

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const updated = await menusApi.uploadItemImage(item.id, file)
      onUpdated(updated)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd uploadu')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    const validationError = validateItemFields({ name, description, price, imageMode, imageUrl, file: editFile })
    if (validationError) {
      setError(validationError)
      return
    }
    if (imageMode === 'upload' && !editFile && !item.image_url) {
      setError('Wybierz plik zdjęcia lub zmień tryb')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const nextImageUrl =
        imageMode === 'url' ? imageUrl.trim() :
        imageMode === 'none' ? '' :
        item.image_url
      let updated = await menusApi.updateItem(item.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price) || 0,
        position: item.position,
        image_url: nextImageUrl,
      })
      if (imageMode === 'upload' && editFile) {
        updated = await menusApi.uploadItemImage(item.id, editFile)
      }
      onUpdated(updated)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd zapisu')
    } finally {
      setSaving(false)
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
      <Box className="relative aspect-[4/3] bg-[var(--ios-surface-2)]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fit="cover"
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <Stack
            align="center"
            justify="center"
            className="absolute inset-0 text-[var(--ios-ink-3)]"
          >
            <Text as="span" size="xl">🍽️</Text>
          </Stack>
        )}
        {!editing && (
          <>
            <Button
              type="button"
              variant="ghost"
              onClick={startEdit}
              aria-label="Edytuj pozycję"
              className="absolute top-2 right-10 w-7 h-7 p-0 rounded-full bg-black/40 text-white hover:bg-[var(--ios-blue)] text-xs leading-none font-normal"
            >✎</Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleDelete}
              disabled={deleting}
              aria-label="Usuń pozycję"
              className="absolute top-2 right-2 w-7 h-7 p-0 rounded-full bg-black/40 text-white hover:bg-[var(--ios-red)] text-sm leading-none font-normal"
            >×</Button>
          </>
        )}
      </Box>
      {editing ? (
        <form onSubmit={handleSave} className="flex-1">
          <Stack gap={2} className="p-4 h-full">
            <Input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nazwa *" maxLength={LIMITS.nameMax} required />
            <Input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Opis (opcjonalnie)" maxLength={LIMITS.descriptionMax} />
            <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Cena (zł)" min={0} max={LIMITS.priceMax} step="0.01" />

            <ImageModeTabs value={imageMode} onChange={setImageMode} />

            {imageMode === 'url' && (
              <Input
                type="url"
                placeholder="https://… (URL zdjęcia)"
                maxLength={LIMITS.imageUrlMax}
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
              />
            )}
            {imageMode === 'upload' && (
              <Input
                ref={editFileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={e => setEditFile(e.target.files?.[0] ?? null)}
                className="text-xs file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-[var(--ios-surface-2)] file:text-[var(--ios-ink)]"
              />
            )}
            {previewUrl && (
              <Box className="aspect-[4/3] rounded-md overflow-hidden bg-[var(--ios-surface-2)]">
                <Image src={previewUrl} alt="podgląd" fit="cover" className="w-full h-full" />
              </Box>
            )}

            {error && <Text size="xs" tone="danger">{error}</Text>}
            <Stack direction="row" gap={2} className="pt-1 mt-auto">
              <Button type="submit" loading={saving} fullWidth size="sm">
                {saving ? 'Zapisywanie…' : 'Zapisz'}
              </Button>
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditing(false)}>Anuluj</Button>
            </Stack>
          </Stack>
        </form>
      ) : (
        <Stack gap={2} className="p-4 flex-1">
          <Stack direction="row" align="start" justify="between" gap={2}>
            <Text weight="bold" className="flex-1">{item.name}</Text>
            <Text as="span" size="sm" weight="semibold" tone="primary" className="shrink-0">
              {formatPrice(item.price)}
            </Text>
          </Stack>
          {item.description && (
            <Text size="sm" tone="muted">{item.description}</Text>
          )}
          <Box className="pt-2 mt-auto">
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
            {error && <Text size="xs" tone="danger" className="mt-1">{error}</Text>}
          </Box>
        </Stack>
      )}
    </Card>
  )
}

interface AddItemFormProps {
  onSubmit: (data: CreateMenuItemReq, file: File | null) => Promise<void>
  onCancel: () => void
}

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
    const validationError = validateItemFields({ name, description, price, imageMode, imageUrl, file })
    if (validationError) {
      setError(validationError)
      return
    }
    if (imageMode === 'upload' && !file) {
      setError('Wybierz plik zdjęcia lub zmień tryb')
      return
    }
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
      <form onSubmit={handleSubmit}>
        <Stack gap={2}>
          <Input type="text" placeholder="Nazwa dania *" maxLength={LIMITS.nameMax} value={name} onChange={e => setName(e.target.value)} required />
          <Input type="text" placeholder="Opis (opcjonalnie)" maxLength={LIMITS.descriptionMax} value={description} onChange={e => setDescription(e.target.value)} />
          <Input type="number" placeholder="Cena (zł)" value={price} onChange={e => setPrice(e.target.value)} min={0} max={LIMITS.priceMax} step="0.01" />

          <ImageModeTabs value={imageMode} onChange={setImageMode} />

          {imageMode === 'url' && (
            <Input
              type="url"
              placeholder="https://… (URL zdjęcia)"
              maxLength={LIMITS.imageUrlMax}
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          )}
          {imageMode === 'upload' && (
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleFile}
              className="text-xs file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-[var(--ios-surface-2)] file:text-[var(--ios-ink)]"
            />
          )}
          {previewUrl && (
            <Box className="aspect-[4/3] rounded-md overflow-hidden bg-[var(--ios-surface-2)]">
              <Image src={previewUrl} alt="podgląd" fit="cover" className="w-full h-full" />
            </Box>
          )}

          {error && <Text size="xs" tone="danger">{error}</Text>}

          <Stack direction="row" gap={2} className="pt-1">
            <Button type="submit" loading={saving} fullWidth size="sm">
              {saving ? 'Dodawanie…' : 'Dodaj'}
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={onCancel}>Anuluj</Button>
          </Stack>
        </Stack>
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
      <Stack direction="row" align="center" justify="between" className="mb-8">
        <Stack gap={0}>
          <Title level={1} size="lg">Menu</Title>
          <Text size="sm" tone="muted" className="mt-0.5">
            Zarządzaj kartami, pozycjami i zdjęciami dań.
          </Text>
        </Stack>
        {!showMenuForm && (
          <Button onClick={() => setShowMenuForm(true)}>+ Dodaj sekcje</Button>
        )}
      </Stack>

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
        <Stack gap={10}>
          {menus.map(menu => {
            const menuItems = items.filter(it => it.menu_id === menu.id)
            const isAdding = showItemFormFor === menu.id
            return (
              <Box as="section" key={menu.id}>
                <Stack direction="row" align="center" justify="between" className="mb-3">
                  <Stack gap={0}>
                    <Title level={2} size="md">{menu.name}</Title>
                    {menu.description && (
                      <Text size="sm" tone="muted" className="mt-0.5">{menu.description}</Text>
                    )}
                  </Stack>
                  {!isAdding && (
                    <Button size="sm" variant="secondary" onClick={() => setShowItemFormFor(menu.id)}>
                      + Dodaj pozycję
                    </Button>
                  )}
                </Stack>

                {menuItems.length === 0 && !isAdding && (
                  <Text size="sm" tone="subtle" className="py-4">Brak pozycji w tej sekcji</Text>
                )}

                <Grid cols={1} responsive={{ sm: 2, lg: 3 }} gap={4}>
                  {menuItems.map(item => (
                    <ItemTile
                      key={item.id}
                      item={item}
                      onUpdated={handleItemUpdated}
                      onDeleted={handleItemDeleted}
                    />
                  ))}
                  {isAdding && (
                    <AddItemForm
                      onSubmit={(data, file) => handleCreateItem(menu.id, data, file)}
                      onCancel={() => setShowItemFormFor(null)}
                    />
                  )}
                </Grid>
              </Box>
            )
          })}
        </Stack>
      )}
    </>
  )
}
