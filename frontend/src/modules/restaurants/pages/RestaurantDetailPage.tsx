import { useParams, Link } from 'react-router-dom'
import { useRestaurant } from '../hooks/useRestaurants'
import { Alert } from '../../../shared/components/Alert'
import { Card } from '../../../shared/components/Card'
import { Spinner } from '../../../shared/components/Spinner'

const modules = [
  {
    key: 'tables',
    icon: '🪑',
    label: 'Stoliki',
    description: 'Zarządzaj stolikami i pojemnością sali',
    path: (id: string) => `/restaurants/${id}/tables`,
  },
  {
    key: 'menus',
    icon: '🍽️',
    label: 'Menu',
    description: 'Zarządzaj kartami menu restauracji',
    path: (id: string) => `/restaurants/${id}/menus`,
  },
  {
    key: 'panel',
    icon: '📋',
    label: 'Panel obsługi',
    description: 'Zamówienia i wezwania kelnera na żywo',
    path: (id: string) => `/restaurants/${id}/panel`,
  },
]

export function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { restaurant, loading, error } = useRestaurant(id!)

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 pb-12">
      <Link
        to="/"
        className="inline-block text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition mb-6"
      >
        ← Moje restauracje
      </Link>

      {loading ? (
        <Spinner />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : restaurant ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{restaurant.name}</h1>
            {restaurant.address && (
              <p className="text-gray-500 dark:text-gray-400 mt-1.5">📍 {restaurant.address}</p>
            )}
          </div>

          {restaurant.description && (
            <Card className="p-6 mb-6">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Opis</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{restaurant.description}</p>
            </Card>
          )}

          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Moduły</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(mod => (
              <Link
                key={mod.key}
                to={mod.path(id!)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm flex flex-col gap-2 transition hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 group"
              >
                <span className="text-2xl">{mod.icon}</span>
                <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition">{mod.label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{mod.description}</p>
              </Link>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
