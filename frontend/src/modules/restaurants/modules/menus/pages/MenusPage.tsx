import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useMenus } from '../hooks/useMenus'
import { menusApi } from '../services/menus.api'
import { MenuCard } from '../components/MenuCard'
import { AddMenuForm } from '../components/AddMenuForm'
import { Alert } from '../../../../../shared/components/Alert'
import { Button } from '../../../../../shared/components/Button'
import { EmptyState } from '../../../../../shared/components/EmptyState'
import { Spinner } from '../../../../../shared/components/Spinner'
import type { CreateMenuReq, MenuItem } from '../types/menu.types'

export function MenusPage() {
  const { id } = useParams<{ id: string }>()
  const { menus, loading, error, create } = useMenus(id!)

  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!id) return
    menusApi.getItemsByRestaurant(id).then(setMenuItems).catch(() => {})
  }, [id])

  async function handleCreate(data: CreateMenuReq) {
    await create(data)
    setShowForm(false)
  }

  function handleItemCreated(item: MenuItem) {
    setMenuItems(prev => [...prev, item])
  }

  function handleItemDeleted(itemId: string) {
    setMenuItems(prev => prev.filter(i => i.id !== itemId))
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold dark:text-white">Menu</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>+ Dodaj menu</Button>
        )}
      </div>

      {showForm && (
        <AddMenuForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
      )}

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : menus.length === 0 && !showForm ? (
        <EmptyState
          icon="🍽️"
          title="Brak menu"
          description="Dodaj pierwsze menu — możesz mieć kilka kart (np. obiad, kolacja, sezonowe)."
          action={<Button size="lg" onClick={() => setShowForm(true)}>+ Dodaj pierwsze menu</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menus.map(menu => (
            <MenuCard
              key={menu.id}
              menu={menu}
              items={menuItems.filter(i => i.menu_id === menu.id)}
              onItemCreated={handleItemCreated}
              onItemDeleted={handleItemDeleted}
            />
          ))}
        </div>
      )}
    </>
  )
}
