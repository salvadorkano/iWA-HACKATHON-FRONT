import { useState } from 'react'
import { mockUsers } from '@/api/mock'
import { User } from '@/types/user.types'
import { useAuth } from '@/context/AuthContext'

const ROLE_COLORS: Record<string, { color: string; bg: string }> = {
  ADMIN:    { color:'#f59e0b', bg:'rgba(245,158,11,0.12)' },
  MANAGER:  { color:'#60a5fa', bg:'rgba(96,165,250,0.12)' },
  EMPLOYEE: { color:'#34d399', bg:'rgba(52,211,153,0.12)' },
}

const UsersPage = () => {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState(mockUsers.content)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState({ username: '', email: '', role: 'EMPLOYEE', password: '' })
  const [search, setSearch] = useState('')

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ username: '', email: '', role: 'EMPLOYEE', password: '' })
    setShowModal(true)
  }

  const openEdit = (u: User) => {
    setEditing(u)
    setForm({ username: u.username, email: u.email, role: u.role, password: '' })
    setShowModal(true)
  }

  const handleSave = () => {
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id
        ? { ...u, username: form.username, email: form.email, role: form.role } : u))
    } else {
      const newUser: User = {
        id: Date.now(),
        username: form.username,
        email: form.email,
        role: form.role,
        createdAt: new Date().toISOString(),
      }
      setUsers(prev => [...prev, newUser])
    }
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este usuario?')) {
      setUsers(prev => prev.filter(u => u.id !== id))
    }
  }

  const roleCounts = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div style={{ color:'#e5e5e5' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .search-input { background:#161616; border:1px solid #252525; color:#e5e5e5; border-radius:6px; padding:10px 14px; font-size:13px; font-family:'DM Mono',monospace; width:280px; box-sizing:border-box; outline:none; transition:border-color 0.2s; }
        .search-input:focus { border-color:#f59e0b; }
        .search-input::placeholder { color:#444; }
        .tbl-row { border-bottom:1px solid #1a1a1a; transition:background 0.1s; }
        .tbl-row:hover { background:rgba(245,158,11,0.03) !important; }
        .action-btn { background:transparent; border:1px solid #2a2a2a; color:#666; border-radius:4px; padding:4px 10px; font-size:10px; font-family:'Barlow Condensed',sans-serif; letter-spacing:1px; cursor:pointer; transition:all 0.15s; }
        .action-btn.edit:hover { border-color:#60a5fa; color:#60a5fa; }
        .action-btn.del:hover { border-color:#f87171; color:#f87171; }
        .modal-input { background:#1a1a1a; border:1px solid #2a2a2a; color:#e5e5e5; border-radius:6px; padding:10px 14px; font-size:13px; font-family:'DM Mono',monospace; width:100%; box-sizing:border-box; outline:none; transition:border-color 0.2s; }
        .modal-input:focus { border-color:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,0.1); }
        .modal-select { background:#1a1a1a; border:1px solid #2a2a2a; color:#e5e5e5; border-radius:6px; padding:10px 14px; font-size:13px; font-family:'DM Mono',monospace; width:100%; box-sizing:border-box; outline:none; }
        .primary-btn { background:#f59e0b; color:#0f0f0f; border:none; border-radius:6px; padding:11px; font-size:13px; font-weight:700; font-family:'Barlow Condensed',sans-serif; letter-spacing:2px; cursor:pointer; transition:background 0.15s; flex:1; }
        .primary-btn:hover { background:#fbbf24; }
        .cancel-btn { background:transparent; border:1px solid #2a2a2a; color:#666; border-radius:6px; padding:11px; font-size:13px; font-family:'Barlow Condensed',sans-serif; letter-spacing:1px; cursor:pointer; transition:all 0.15s; flex:1; }
        .cancel-btn:hover { border-color:#555; color:#ccc; }
      `}</style>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 }}>
        <div>
          <h1 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:800, color:'#f5f5f5', letterSpacing:1, margin:0, lineHeight:1 }}>
            USUARIOS
          </h1>
          <p style={{ color:'#444', fontSize:11, letterSpacing:2, marginTop:6 }}>
            {filtered.length} USUARIOS REGISTRADOS
          </p>
        </div>
        <button
          style={{ background:'#f59e0b', color:'#0f0f0f', border:'none', borderRadius:6, padding:'10px 18px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, cursor:'pointer' }}
          onClick={openCreate}
          onMouseEnter={e => (e.currentTarget.style.background='#fbbf24')}
          onMouseLeave={e => (e.currentTarget.style.background='#f59e0b')}
        >
          + NUEVO USUARIO
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:24 }}>
        {[
          { label:'TOTAL', value:users.length, color:'#f59e0b' },
          { label:'ADMIN', value:roleCounts['ADMIN'] || 0, color:'#f59e0b' },
          { label:'MANAGER', value:roleCounts['MANAGER'] || 0, color:'#60a5fa' },
          { label:'EMPLOYEE', value:roleCounts['EMPLOYEE'] || 0, color:'#34d399' },
        ].map(s => (
          <div key={s.label} style={{ background:'#161616', border:'1px solid #1e1e1e', borderRadius:8, padding:'14px 20px', flex:1 }}>
            <div style={{ color:'#444', fontSize:9, letterSpacing:3, marginBottom:6 }}>{s.label}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:24, fontWeight:800, color:s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom:20 }}>
        <input
          className="search-input"
          type="text"
          placeholder="⌕  BUSCAR POR USUARIO O EMAIL..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:10, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid #1e1e1e' }}>
              {['USUARIO', 'EMAIL', 'ROL', 'CREADO', 'ACCIONES'].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'12px 16px', color:'#444', fontSize:10, letterSpacing:3, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, background:'#0d0d0d' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign:'center', padding:40, color:'#333', fontSize:13 }}>SIN RESULTADOS</td>
              </tr>
            ) : filtered.map((u) => {
              const rc = ROLE_COLORS[u.role] ?? { color:'#888', bg:'#22222244' }
              const isSelf = currentUser?.sub === u.username
              return (
                <tr key={u.id} className="tbl-row" style={{ background:'transparent' }}>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{
                        width:32, height:32,
                        background: rc.bg,
                        borderRadius:6,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontFamily:"'Barlow Condensed',sans-serif",
                        fontWeight:800, fontSize:14, color:rc.color,
                        flexShrink:0,
                      }}>
                        {u.username[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, color:'#e5e5e5' }}>
                          {u.username}
                          {isSelf && <span style={{ marginLeft:6, fontSize:9, color:'#f59e0b', letterSpacing:1 }}>TÚ</span>}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'13px 16px', color:'#666', fontSize:12, fontFamily:"'DM Mono',monospace" }}>{u.email}</td>
                  <td style={{ padding:'13px 16px' }}>
                    <span style={{ background:rc.bg, color:rc.color, fontSize:10, padding:'3px 8px', borderRadius:4, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding:'13px 16px', color:'#444', fontSize:11, fontFamily:"'DM Mono',monospace" }}>
                    {new Date(u.createdAt).toLocaleDateString('es-MX')}
                  </td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="action-btn edit" onClick={() => openEdit(u)}>EDITAR</button>
                      {!isSelf && (
                        <button className="action-btn del" onClick={() => handleDelete(u.id)}>ELIMINAR</button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:50, backdropFilter:'blur(4px)' }}>
          <div style={{ background:'#161616', border:'1px solid #252525', borderRadius:12, padding:28, width:'100%', maxWidth:420, animation:'fadeUp 0.2s ease' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color:'#f5f5f5', letterSpacing:1, margin:0 }}>
                {editing ? 'EDITAR USUARIO' : 'NUEVO USUARIO'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:20, lineHeight:1 }}>✕</button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ display:'block', color:'#555', fontSize:10, letterSpacing:2, marginBottom:7 }}>USUARIO</label>
                <input type="text" className="modal-input" placeholder="nombre_usuario" value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))} />
              </div>
              <div>
                <label style={{ display:'block', color:'#555', fontSize:10, letterSpacing:2, marginBottom:7 }}>EMAIL</label>
                <input type="email" className="modal-input" placeholder="usuario@empresa.mx" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>
              {!editing && (
                <div>
                  <label style={{ display:'block', color:'#555', fontSize:10, letterSpacing:2, marginBottom:7 }}>CONTRASEÑA</label>
                  <input type="password" className="modal-input" placeholder="••••••" value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))} />
                </div>
              )}
              <div>
                <label style={{ display:'block', color:'#555', fontSize:10, letterSpacing:2, marginBottom:7 }}>ROL</label>
                <select className="modal-select" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="EMPLOYEE">EMPLOYEE</option>
                </select>
              </div>
            </div>

            <div style={{ display:'flex', gap:10, marginTop:22 }}>
              <button className="primary-btn" onClick={handleSave}>{editing ? 'GUARDAR' : 'CREAR'}</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>CANCELAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage