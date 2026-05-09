import { Route } from 'react-router-dom'
import { PanelPage } from './pages/PanelPage'
import { ProtectedRoute } from '../../../../shared/components/ProtectedRoute'

export const panelRoutes = (
  <Route
    path="panel"
    element={<ProtectedRoute><PanelPage /></ProtectedRoute>}
  />
)
