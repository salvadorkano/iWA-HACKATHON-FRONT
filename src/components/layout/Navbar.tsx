import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-red-100 text-red-700',
    MANAGER: 'bg-yellow-100 text-yellow-700',
    EMPLOYEE: 'bg-green-100 text-green-700',
  }

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="font-bold text-gray-800 text-lg">IWA Hackathon</h1>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">{user?.username}</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${roleColors[user?.role ?? '']}`}>
          {user?.role}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  )
}

export default Navbar