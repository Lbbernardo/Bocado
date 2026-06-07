'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Email o contraseña incorrectos')
      setLoading(false)
      return
    }

    router.push('/admin/pedidos')
    router.refresh()
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1A1614', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/bocado/logo-w.png" alt="Bocado" style={{ height: '48px', width: 'auto', margin: '0 auto 12px' }} />
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Panel Administrativo
          </p>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: '#2E2A24', borderRadius: '24px', padding: '32px', border: '1px solid rgba(255,255,255,.06)' }}>
          <h1 style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', marginBottom: '24px' }}>Iniciar sesión</h1>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="admin@bocado.com" required
                style={{ width: '100%', backgroundColor: '#1A1614', border: '1px solid rgba(255,255,255,.1)', borderRadius: '12px', padding: '12px 16px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,.4)', fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: '8px' }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ width: '100%', backgroundColor: '#1A1614', border: '1px solid rgba(255,255,255,.1)', borderRadius: '12px', padding: '12px 48px 12px 16px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.3)' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ backgroundColor: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.2)', borderRadius: '12px', padding: '12px', color: '#f87171', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              backgroundColor: '#FF9E00', color: 'white', fontWeight: 700,
              padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
              fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              opacity: loading ? 0.6 : 1,
            }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Entrando...</> : 'Entrar al dashboard'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,.2)', fontSize: '12px', marginTop: '24px' }}>
          BOCADO Admin · Acceso restringido
        </p>
      </div>
    </div>
  )
}
