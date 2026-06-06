import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/productos')
    } catch {
      setError('Usuario o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f0f0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Mono', 'Courier New', monospace",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }} />

      {/* Corner decorations */}
      <div style={{ position:'absolute', top:32, left:32, color:'rgba(245,158,11,0.3)', fontSize:11, letterSpacing:4 }}>
        SYS://AUTH
      </div>
      <div style={{ position:'absolute', bottom:32, right:32, color:'rgba(245,158,11,0.2)', fontSize:11, letterSpacing:2 }}>
        IWA-HACKATHON v1.0
      </div>

      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 400,
        padding: '0 24px',
        animation: 'fadeUp 0.5s ease forwards',
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Barlow+Condensed:wght@400;600;700;800&display=swap');
          @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          .login-input { background:#1a1a1a; border:1px solid #2a2a2a; color:#f5f5f5; border-radius:6px; padding:11px 14px; font-size:14px; font-family:inherit; width:100%; box-sizing:border-box; transition:border-color 0.2s, box-shadow 0.2s; outline:none; }
          .login-input:focus { border-color:#f59e0b; box-shadow:0 0 0 3px rgba(245,158,11,0.12); }
          .login-input::placeholder { color:#444; }
          .login-btn { width:100%; background:#f59e0b; color:#0f0f0f; border:none; border-radius:6px; padding:13px; font-size:15px; font-weight:700; font-family:'Barlow Condensed',sans-serif; letter-spacing:2px; cursor:pointer; transition:background 0.2s, transform 0.1s; }
          .login-btn:hover:not(:disabled) { background:#fbbf24; transform:translateY(-1px); }
          .login-btn:active:not(:disabled) { transform:translateY(0); }
          .login-btn:disabled { opacity:0.5; cursor:not-allowed; }
        `}</style>

        {/* Logo area */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{
              width: 36, height: 36,
              background: '#f59e0b',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0f0f0f" strokeWidth="2.5">
                <path d="M20 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:800, color:'#f5f5f5', letterSpacing:1 }}>
              STOCK<span style={{color:'#f59e0b'}}>CTRL</span>
            </span>
          </div>
          <p style={{ color:'#555', fontSize:12, letterSpacing:1 }}>
            SISTEMA DE GESTIÓN DE INVENTARIO
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#161616',
          border: '1px solid #252525',
          borderRadius: 12,
          padding: 32,
        }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ color:'#f5f5f5', fontFamily:"'Barlow Condensed',sans-serif", fontSize:26, fontWeight:700, margin:0, letterSpacing:1 }}>
              INICIAR SESIÓN
            </h2>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
              <div style={{ width:6, height:6, background:'#22c55e', borderRadius:'50%', animation:'blink 2s infinite' }} />
              <span style={{ color:'#555', fontSize:11, letterSpacing:2 }}>SISTEMA EN LÍNEA</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            <div>
              <label style={{ display:'block', color:'#888', fontSize:11, letterSpacing:2, marginBottom:8 }}>
                USUARIO
              </label>
              <input
                type="text"
                className="login-input"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
              />
            </div>
            <div>
              <label style={{ display:'block', color:'#888', fontSize:11, letterSpacing:2, marginBottom:8 }}>
                CONTRASEÑA
              </label>
              <input
                type="password"
                className="login-input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 6,
                padding: '10px 14px',
                color: '#f87171',
                fontSize: 13,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span>⚠</span> {error}
              </div>
            )}

            <button type="submit" className="login-btn" disabled={loading} style={{ marginTop: 4 }}>
              {loading ? 'VERIFICANDO...' : 'ACCEDER →'}
            </button>
          </form>

          <div style={{ marginTop:24, paddingTop:20, borderTop:'1px solid #222' }}>
            <p style={{ color:'#444', fontSize:11, letterSpacing:1, margin:0, textAlign:'center' }}>
              USUARIOS: admin / gerente / empleado · PASS: 1234
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage