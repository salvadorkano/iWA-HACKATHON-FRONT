import { useState } from 'react'
import { mockInventory, mockProducts } from '@/api/mock'
import { InventoryRecord } from '@/types/inventory.types'
import { useAuth } from '@/context/AuthContext'

const getStockLevel = (qty: number) => {
  if (qty <= 5) return { label:'CRÍTICO', color:'#f87171', bg:'rgba(248,113,113,0.1)', bar:'#f87171' }
  if (qty <= 15) return { label:'BAJO', color:'#fbbf24', bg:'rgba(251,191,36,0.1)', bar:'#fbbf24' }
  return { label:'OK', color:'#34d399', bg:'rgba(52,211,153,0.1)', bar:'#34d399' }
}

const InventoryPage = () => {
  const { user } = useAuth()
  const [inventory, setInventory] = useState(mockInventory.content)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<InventoryRecord | null>(null)
  const [form, setForm] = useState({ productId: '', quantity: '', location: '' })
  const [search, setSearch] = useState('')

  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const isAdmin = user?.role === 'ADMIN'

  const filtered = inventory.filter(i =>
    i.productName.toLowerCase().includes(search.toLowerCase()) ||
    i.location.toLowerCase().includes(search.toLowerCase())
  )

  const critical = inventory.filter(i => i.quantity <= 5).length
  const low = inventory.filter(i => i.quantity > 5 && i.quantity <= 15).length
  const ok = inventory.filter(i => i.quantity > 15).length
  const maxQty = Math.max(...inventory.map(i => i.quantity), 1)

  const openCreate = () => {
    setEditing(null)
    setForm({ productId: '', quantity: '', location: '' })
    setShowModal(true)
  }

  const openEdit = (r: InventoryRecord) => {
    setEditing(r)
    setForm({ productId: String(r.productId), quantity: String(r.quantity), location: r.location })
    setShowModal(true)
  }

  const handleSave = () => {
    if (editing) {
      setInventory(prev => prev.map(r => r.id === editing.id
        ? { ...r, quantity: Number(form.quantity), location: form.location } : r))
    } else {
      const product = mockProducts.content.find(p => p.id === Number(form.productId))
      const newRecord: InventoryRecord = {
        id: Date.now(),
        productId: Number(form.productId),
        productName: product?.name ?? 'Producto',
        quantity: Number(form.quantity),
        location: form.location,
        createdAt: new Date().toISOString(),
      }
      setInventory(prev => [...prev, newRecord])
    }
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este registro?')) {
      setInventory(prev => prev.filter(r => r.id !== id))
    }
  }

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
            INVENTARIO
          </h1>
          <p style={{ color:'#444', fontSize:11, letterSpacing:2, marginTop:6 }}>
            {filtered.length} REGISTROS · {inventory.reduce((a, i) => a + i.quantity, 0)} UNIDADES TOTALES
          </p>
        </div>
        {canEdit && (
          <button
            style={{ background:'#f59e0b', color:'#0f0f0f', border:'none', borderRadius:6, padding:'10px 18px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, cursor:'pointer' }}
            onClick={openCreate}
            onMouseEnter={e => (e.currentTarget.style.background='#fbbf24')}
            onMouseLeave={e => (e.currentTarget.style.background='#f59e0b')}
          >
            + NUEVO REGISTRO
          </button>
        )}
      </div>

      {/* Stats */}
      <div style={{ display:'flex', gap:12, marginBottom:24 }}>
        {[
          { label:'CRÍTICO (≤5)', value:critical, color:'#f87171' },
          { label:'STOCK BAJO (≤15)', value:low, color:'#fbbf24' },
          { label:'STOCK OK', value:ok, color:'#34d399' },
          { label:'TOTAL UNIDADES', value:inventory.reduce((a,i)=>a+i.quantity,0), color:'#f59e0b' },
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
          placeholder="⌕  BUSCAR POR PRODUCTO O UBICACIÓN..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:10, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid #1e1e1e' }}>
              {['PRODUCTO', 'CANTIDAD', 'ESTADO', 'UBICACIÓN', ...(canEdit ? ['ACCIONES'] : [])].map(h => (
                <th key={h} style={{ textAlign:'left', padding:'12px 16px', color:'#444', fontSize:10, letterSpacing:3, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, background:'#0d0d0d' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 5 : 4} style={{ textAlign:'center', padding:40, color:'#333', fontSize:13 }}>
                  SIN RESULTADOS
                </td>
              </tr>
            ) : filtered.map((r) => {
              const level = getStockLevel(r.quantity)
              return (
                <tr key={r.id} className="tbl-row" style={{ background:'transparent' }}>
                  <td style={{ padding:'13px 16px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:15, color:'#e5e5e5' }}>
                    {r.productName}
                  </td>
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:18, color:level.color, minWidth:32 }}>
                        {r.quantity}
                      </span>
                      {/* Mini bar */}
                      <div style={{ flex:1, maxWidth:60, height:4, background:'#1e1e1e', borderRadius:2, overflow:'hidden' }}>
                        <div style={{ width:`${(r.quantity/maxQty)*100}%`, height:'100%', background:level.bar, borderRadius:2, transition:'width 0.3s' }} />
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'13px 16px' }}>
                    <span style={{ background:level.bg, color:level.color, fontSize:10, padding:'3px 8px', borderRadius:4, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>
                      {level.label}
                    </span>
                  </td>
                  <td style={{ padding:'13px 16px', color:'#666', fontSize:13 }}>
                    {r.location}
                  </td>
                  {canEdit && (
                    <td style={{ padding:'13px 16px' }}>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="action-btn edit" onClick={() => openEdit(r)}>EDITAR</button>
                        {isAdmin && (
                          <button className="action-btn del" onClick={() => handleDelete(r.id)}>ELIMINAR</button>
                        )}
                      </div>
                    </td>
                  )}
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
                {editing ? 'EDITAR REGISTRO' : 'NUEVO REGISTRO'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:20, lineHeight:1 }}>✕</button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {!editing && (
                <div>
                  <label style={{ display:'block', color:'#555', fontSize:10, letterSpacing:2, marginBottom:7 }}>PRODUCTO</label>
                  <select className="modal-select" value={form.productId} onChange={e => setForm(prev => ({ ...prev, productId: e.target.value }))}>
                    <option value="">Seleccionar producto</option>
                    {mockProducts.content.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label style={{ display:'block', color:'#555', fontSize:10, letterSpacing:2, marginBottom:7 }}>CANTIDAD</label>
                <input type="number" className="modal-input" placeholder="0" value={form.quantity}
                  onChange={e => setForm(prev => ({ ...prev, quantity: e.target.value }))} />
              </div>
              <div>
                <label style={{ display:'block', color:'#555', fontSize:10, letterSpacing:2, marginBottom:7 }}>UBICACIÓN</label>
                <input type="text" className="modal-input" placeholder="Almacén A" value={form.location}
                  onChange={e => setForm(prev => ({ ...prev, location: e.target.value }))} />
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

export default InventoryPage