import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const NAV_ITEMS = [
  {
    to: '/productos',
    label: 'PRODUCTOS',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      </svg>
    ),
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  },
  {
    to: '/inventario',
    label: 'INVENTARIO',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 3h18v18H3z"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>
      </svg>
    ),
    roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
  },
  {
    to: '/usuarios',
    label: 'USUARIOS',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    roles: ['ADMIN'],
  },
]

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#f59e0b',
  MANAGER: '#60a5fa',
  EMPLOYEE: '#34d399',
}

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const visibleItems = NAV_ITEMS.filter(
    item => !user?.role || item.roles.includes(user.role)
  )

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#0f0f0f',
      fontFamily: "'DM Mono', 'Courier New', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
        .nav-link { display:flex; align-items:center; gap:10px; padding:10px 16px; color:#555; font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:600; letter-spacing:2px; text-decoration:none; border-radius:6px; transition:all 0.15s; border-left:2px solid transparent; }
        .nav-link:hover { color:#ccc; background:rgba(255,255,255,0.04); border-left-color:#333; }
        .nav-link.active { color:#f59e0b; background:rgba(245,158,11,0.08); border-left-color:#f59e0b; }
        .main-content { flex:1; display:flex; flex-direction:column; overflow:hidden; }
        .page-area { flex:1; overflow-y:auto; padding:32px; }
        .page-area::-webkit-scrollbar { width:4px; }
        .page-area::-webkit-scrollbar-track { background:#111; }
        .page-area::-webkit-scrollbar-thumb { background:#333; border-radius:2px; }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: '#111',
        borderRight: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 12px',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding:'0 4px', marginBottom:32 }}>
          <div style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{
              width:30, height:30, background:'#f59e0b', borderRadius:5,
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2.5">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:800, color:'#f5f5f5', letterSpacing:1 }}>
              STOCK<span style={{color:'#f59e0b'}}>CTRL</span>
            </span>
          </div>
        </div>

        {/* Section label */}
        <div style={{ color:'#333', fontSize:10, letterSpacing:3, padding:'0 4px', marginBottom:8 }}>
          NAVEGACIÓN
        </div>

        {/* Nav items */}
        <nav style={{ display:'flex', flexDirection:'column', gap:2 }}>
          {visibleItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* User info */}
        <div style={{
          background: '#161616',
          border: '1px solid #222',
          borderRadius: 8,
          padding: '12px 14px',
        }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
            <div>
              <div style={{ color:'#e5e5e5', fontSize:13, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>
                {user?.sub?.toUpperCase()}
              </div>
              <span style={{
                display:'inline-block', marginTop:3,
                background: ROLE_COLORS[user?.role ?? ''] ? `${ROLE_COLORS[user?.role ?? '']}20` : '#22222288',
                color: ROLE_COLORS[user?.role ?? ''] ?? '#888',
                fontSize:9, letterSpacing:2, padding:'2px 6px', borderRadius:3,
                fontWeight:600,
              }}>
                {user?.role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width:'100%', background:'transparent', border:'1px solid #2a2a2a',
              color:'#666', borderRadius:5, padding:'6px', fontSize:11,
              fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:2,
              cursor:'pointer', transition:'all 0.15s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.borderColor='#f87171'; (e.target as HTMLButtonElement).style.color='#f87171'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.borderColor='#2a2a2a'; (e.target as HTMLButtonElement).style.color='#666'; }}
          >
            CERRAR SESIÓN
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <div style={{
          height: 52, borderBottom:'1px solid #1a1a1a',
          background:'#111', display:'flex', alignItems:'center',
          padding:'0 32px', gap:8, flexShrink:0,
        }}>
          <div style={{ width:6, height:6, background:'#22c55e', borderRadius:'50%' }} />
          <span style={{ color:'#333', fontSize:11, letterSpacing:2 }}>SISTEMA ACTIVO</span>
          <div style={{ flex:1 }} />
          <span style={{ color:'#2a2a2a', fontSize:11 }}>
            {new Date().toLocaleDateString('es-MX', { weekday:'short', year:'numeric', month:'short', day:'numeric' }).toUpperCase()}
          </span>
        </div>

        {/* Page content */}
        <div className="page-area">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Layout