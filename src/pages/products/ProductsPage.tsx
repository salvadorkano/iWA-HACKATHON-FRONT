import { useState } from 'react'
import { mockProducts } from '@/api/mock'
import { Product } from '@/types/product.types'
import { useAuth } from '@/context/AuthContext'

const S = {
  page: { color: '#e5e5e5' } as React.CSSProperties,
  header: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:28 } as React.CSSProperties,
  title: { fontFamily:"'Barlow Condensed',sans-serif", fontSize:32, fontWeight:800, color:'#f5f5f5', letterSpacing:1, margin:0, lineHeight:1 } as React.CSSProperties,
  subtitle: { color:'#444', fontSize:11, letterSpacing:2, marginTop:6 } as React.CSSProperties,
  btn: { background:'#f59e0b', color:'#0f0f0f', border:'none', borderRadius:6, padding:'10px 18px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:2, cursor:'pointer', transition:'background 0.15s' } as React.CSSProperties,
  searchWrap: { marginBottom:20 } as React.CSSProperties,
  table: { width:'100%', borderCollapse:'collapse' as const } as React.CSSProperties,
}

const ProductsPage = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState(mockProducts.content)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', sku: '' })
  const [search, setSearch] = useState('')

  const canEdit = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const isAdmin = user?.role === 'ADMIN'

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', price: '', sku: '' })
    setShowModal(true)
  }

  const openEdit = (p: Product) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description, price: String(p.price), sku: p.sku })
    setShowModal(true)
  }

  const handleSave = () => {
    if (editing) {
      setProducts(prev => prev.map(p => p.id === editing.id
        ? { ...p, ...form, price: Number(form.price) } : p))
    } else {
      const newProduct: Product = {
        id: Date.now(), ...form, price: Number(form.price), createdAt: new Date().toISOString(),
      }
      setProducts(prev => [...prev, newProduct])
    }
    setShowModal(false)
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Eliminar este producto?')) {
      setProducts(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <div style={S.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
        .search-input { background:#161616; border:1px solid #252525; color:#e5e5e5; border-radius:6px; padding:10px 14px; font-size:13px; font-family:'DM Mono',monospace; width:280px; box-sizing:border-box; outline:none; transition:border-color 0.2s; }
        .search-input:focus { border-color:#f59e0b; }
        .search-input::placeholder { color:#444; }
        .tbl-row { border-bottom:1px solid #1a1a1a; transition:background 0.1s; }
        .tbl-row:hover { background:rgba(245,158,11,0.04) !important; }
        .action-btn { background:transparent; border:1px solid #2a2a2a; color:#666; border-radius:4px; padding:4px 10px; font-size:10px; font-family:'Barlow Condensed',sans-serif; letter-spacing:1px; cursor:pointer; transition:all 0.15s; }
        .action-btn.edit:hover { border-color:#60a5fa; color:#60a5fa; }
        .action-btn.del:hover { border-color:#f87171; color:#f87171; }
        .modal-input { background:#1a1a1a; border:1px solid #2a2a2a; color:#e5e5e5; border-radius:6px; padding:10px 14px; font-size:13px; font-family:'DM Mono',monospace; width:100%; box-sizing:border-box; outline:none; transition:border-color 0.2s; }
        .modal-input:focus { border-color:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,0.1); }
        .primary-btn { background:#f59e0b; color:#0f0f0f; border:none; border-radius:6px; padding:11px; font-size:13px; font-weight:700; font-family:'Barlow Condensed',sans-serif; letter-spacing:2px; cursor:pointer; transition:background 0.15s; flex:1; }
        .primary-btn:hover { background:#fbbf24; }
        .cancel-btn { background:transparent; border:1px solid #2a2a2a; color:#666; border-radius:6px; padding:11px; font-size:13px; font-family:'Barlow Condensed',sans-serif; letter-spacing:1px; cursor:pointer; transition:all 0.15s; flex:1; }
        .cancel-btn:hover { border-color:#555; color:#ccc; }
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div>
          <h1 style={S.title}>PRODUCTOS</h1>
          <p style={S.subtitle}>{filtered.length} REGISTROS ENCONTRADOS</p>
        </div>
        {canEdit && (
          <button style={S.btn} onClick={openCreate}
            onMouseEnter={e => (e.currentTarget.style.background='#fbbf24')}
            onMouseLeave={e => (e.currentTarget.style.background='#f59e0b')}>
            + NUEVO PRODUCTO
          </button>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display:'flex', gap:12, marginBottom:24 }}>
        {[
          { label:'TOTAL', value:products.length, color:'#f59e0b' },
          { label:'PRECIO MÁXIMO', value:`$${Math.max(...products.map(p=>p.price)).toLocaleString('es-MX')}`, color:'#34d399' },
          { label:'PRECIO MÍNIMO', value:`$${Math.min(...products.map(p=>p.price)).toLocaleString('es-MX')}`, color:'#60a5fa' },
        ].map(stat => (
          <div key={stat.label} style={{
            background:'#161616', border:'1px solid #1e1e1e', borderRadius:8,
            padding:'14px 20px', flex:1,
          }}>
            <div style={{ color:'#444', fontSize:9, letterSpacing:3, marginBottom:6 }}>{stat.label}</div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={S.searchWrap}>
        <input
          className="search-input"
          type="text"
          placeholder="⌕  BUSCAR POR NOMBRE O SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div style={{ background:'#111', border:'1px solid #1e1e1e', borderRadius:10, overflow:'hidden' }}>
        <table style={S.table}>
          <thead>
            <tr style={{ borderBottom:'1px solid #1e1e1e' }}>
              {['NOMBRE', 'SKU', 'DESCRIPCIÓN', 'PRECIO', ...(canEdit ? ['ACCIONES'] : [])].map(h => (
                <th key={h} style={{
                  textAlign:'left', padding:'12px 16px',
                  color:'#444', fontSize:10, letterSpacing:3,
                  fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600,
                  background:'#0d0d0d',
                }}>
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
            ) : filtered.map((p) => (
              <tr key={p.id} className="tbl-row" style={{ background:'transparent' }}>
                <td style={{ padding:'13px 16px', color:'#e5e5e5', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:15 }}>
                  {p.name}
                </td>
                <td style={{ padding:'13px 16px' }}>
                  <span style={{ background:'rgba(245,158,11,0.1)', color:'#f59e0b', fontSize:11, padding:'3px 8px', borderRadius:4, fontFamily:"'DM Mono',monospace", letterSpacing:1 }}>
                    {p.sku}
                  </span>
                </td>
                <td style={{ padding:'13px 16px', color:'#666', fontSize:13 }}>{p.description}</td>
                <td style={{ padding:'13px 16px', fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:16, color:'#34d399' }}>
                  ${p.price.toLocaleString('es-MX')}
                </td>
                {canEdit && (
                  <td style={{ padding:'13px 16px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button className="action-btn edit" onClick={() => openEdit(p)}>EDITAR</button>
                      {isAdmin && (
                        <button className="action-btn del" onClick={() => handleDelete(p.id)}>ELIMINAR</button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position:'fixed', inset:0, background:'rgba(0,0,0,0.8)',
          display:'flex', alignItems:'center', justifyContent:'center', zIndex:50,
          backdropFilter:'blur(4px)',
        }}>
          <div style={{
            background:'#161616', border:'1px solid #252525',
            borderRadius:12, padding:28, width:'100%', maxWidth:420,
            animation:'fadeUp 0.2s ease',
          }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
              <h2 style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:20, fontWeight:800, color:'#f5f5f5', letterSpacing:1, margin:0 }}>
                {editing ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
              </h2>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', color:'#555', cursor:'pointer', fontSize:20, lineHeight:1 }}>✕</button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              {[
                { label:'NOMBRE', key:'name', type:'text', placeholder:'Nombre del producto' },
                { label:'SKU', key:'sku', type:'text', placeholder:'LAP-001' },
                { label:'DESCRIPCIÓN', key:'description', type:'text', placeholder:'Descripción breve' },
                { label:'PRECIO (MXN)', key:'price', type:'number', placeholder:'0.00' },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display:'block', color:'#555', fontSize:10, letterSpacing:2, marginBottom:7 }}>{label}</label>
                  <input
                    type={type}
                    className="modal-input"
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>

            <div style={{ display:'flex', gap:10, marginTop:22 }}>
              <button className="primary-btn" onClick={handleSave}>
                {editing ? 'GUARDAR' : 'CREAR'}
              </button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductsPage