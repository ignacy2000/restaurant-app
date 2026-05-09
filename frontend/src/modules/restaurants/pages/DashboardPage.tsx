import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRestaurants } from '../hooks/useRestaurants'
import { RestaurantCard } from '../components/RestaurantCard'
import { CreateRestaurantForm } from '../components/CreateRestaurantForm'
import { Alert } from '../../../shared/components/Alert'
import { Button } from '../../../shared/components/Button'
import { EmptyState } from '../../../shared/components/EmptyState'
import { Spinner } from '../../../shared/components/Spinner'
import type { CreateRestaurantReq } from '../types/restaurant.types'

export function DashboardPage() {
  const navigate = useNavigate()
  const { restaurants, loading, error, create } = useRestaurants()
  const [showForm, setShowForm] = useState(false)

  async function handleCreate(data: CreateRestaurantReq) {
    const created = await create(data)
    setShowForm(false)
    navigate(`/restaurants/${created.id}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-12">
      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : (
        <>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold dark:text-white">Moje restauracje</h2>
            {restaurants.length > 0 && !showForm && (
              <Button onClick={() => setShowForm(true)}>+ Dodaj nową</Button>
            )}
          </div>

          {showForm && (
            <CreateRestaurantForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
          )}

          {restaurants.length === 0 && !showForm ? (
            <EmptyState
              icon="🍽️"
              title="Nie masz jeszcze żadnej restauracji"
              description="Dodaj swoją pierwszą restaurację, aby zacząć zarządzać menu, stolikami i zamówieniami."
              action={<Button size="lg" onClick={() => setShowForm(true)}>+ Utwórz pierwszą restaurację</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restaurants.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          )}
        </>
      )}
    </div>
  )
}
