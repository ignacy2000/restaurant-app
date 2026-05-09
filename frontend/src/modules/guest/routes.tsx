import { Route } from 'react-router-dom'
import { TablePage } from './pages/TablePage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'

export const guestRoutes = (
  <>
    <Route path="/table/:restaurantId/:tableId" element={<TablePage />} />
    <Route path="/order-confirmed" element={<OrderConfirmationPage />} />
  </>
)
