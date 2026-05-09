import { Routes, Route } from 'react-router-dom'
import { authRoutes } from '../modules/auth'
import { RestaurantRouter } from '../modules/restaurants'
import { guestRoutes } from '../modules/guest'

export function AppRouter() {
  return (
    <Routes>
      {authRoutes}
      {guestRoutes}
      <Route path="/*" element={<RestaurantRouter />} />
    </Routes>
  )
}
