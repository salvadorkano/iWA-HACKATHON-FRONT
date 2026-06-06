import { NavLink } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { label: 'Productos', path: '/productos', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { label: 'Inventario', path: '/inventario', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
  { label: 'Usuarios', path: '/usuarios', roles: ['ADMIN'] },
] as const

const Sidebar = () => {
  const { user } = useAuth()

  const filtered = navItems.filter(item =>
    user ? item.roles.includes(user.role) : false
  )

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col py-6 px-4 gap-2">
      <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Menú</p>
      {filtered.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-3 py-2 rounded-lg text-sm font-medium transition ${
              isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </aside>
  )
}

export default Sidebar