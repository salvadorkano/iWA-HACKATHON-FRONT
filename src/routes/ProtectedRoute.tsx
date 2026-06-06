import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Role } from '@/types/auth.types'

interface Props {
  children: React.ReactNode
  allowedRoles?: Role[]
}

const ProtectedRoute = ({ children, allowedRoles }: Props) => {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading) return <div className="flex items-center justify-center h-screen">Cargando...</div>
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/productos" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute