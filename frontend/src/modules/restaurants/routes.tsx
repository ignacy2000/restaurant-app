import { Routes, Route, Outlet, Link, useParams, Navigate } from 'react-router-dom'
import { DashboardPage } from './pages/DashboardPage'
import { RestaurantDetailPage } from './pages/RestaurantDetailPage'
import { ProtectedRoute } from '../../shared/components/ProtectedRoute'
import { useRestaurant } from './hooks/useRestaurants'
import { tableRoutes } from './modules/tables'
import { menuRoutes } from './modules/menus'
import { panelRoutes } from './modules/panel'

function RestaurantModuleLayout() {
  const { id } = useParams<{ id: string }>()
  const { restaurant } = useRestaurant(id!)

  return (
    <div className="max-w-6xl mx-auto px-6 pb-12">
      <div className="py-4 mb-6 border-b border-gray-200 dark:border-gray-800">
        <Link
          to={`/restaurants/${id}`}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition"
        >
          ← {restaurant?.name ?? 'Restauracja'}
        </Link>
      </div>
      <Outlet />
    </div>
  )
}

export function RestaurantRouter() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="restaurants/:id">
        <Route index element={<ProtectedRoute><RestaurantDetailPage /></ProtectedRoute>} />
        <Route element={<ProtectedRoute><RestaurantModuleLayout /></ProtectedRoute>}>
          {tableRoutes}
          {menuRoutes}
          {panelRoutes}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
