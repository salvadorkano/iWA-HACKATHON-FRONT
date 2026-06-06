import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '@/pages/auth/LoginPage'
import ProductsPage from '@/pages/products/ProductsPage'
import UsersPage from '@/pages/users/UsersPage'
import InventoryPage from '@/pages/inventory/InventoryPage'
import Layout from '@/components/layout/Layout'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/productos" replace />} />

          <Route path="productos" element={<ProductsPage />} />

          <Route path="inventario" element={<InventoryPage />} />

          <Route path="usuarios" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsersPage />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter