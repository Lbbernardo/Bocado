'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Reveal from '@/components/landing/Reveal'
import { Search, Package } from 'lucide-react'

export default function BuscarPedidoPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [mode, setMode] = useState<'number' | 'phone'>('number')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'number' && orderNumber.trim()) {
      router.push(`/pedido/${orderNumber.trim().toUpperCase()}`)
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', backgroundColor: '#FBF5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', paddingTop: '68px' }}>
        <Reveal style={{ maxWidth: '440px', width: '100%', padding: '40px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '64px', height: '64px', backgroundColor: 'rgba(255,158,0,.12)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
              <Package size={30} color="#FF9E00" />
            </div>
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Estado del pedido</span>
            <h1 style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 900, fontSize: '2rem', color: '#2E2A24', marginBottom: '8px' }}>
              Seguir mi pedido
            </h1>
            <p style={{ color: '#6B6358', fontSize: '0.9rem' }}>
              Ingresa tu número de pedido para ver el estado
            </p>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,.06)' }}>
            {/* Mode tabs */}
            <div style={{ display: 'flex', backgroundColor: '#FBF5E9', borderRadius: '12px', padding: '4px', marginBottom: '24px' }}>
              <button
                onClick={() => setMode('number')}
                style={{
                  flex: 1, padding: '10px', borderRadius: '9px', fontSize: '0.85rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all .2s',
                  backgroundColor: mode === 'number' ? 'white' : 'transparent',
                  color: mode === 'number' ? '#2E2A24' : '#6B6358',
                  boxShadow: mode === 'number' ? '0 2px 8px rgba(0,0,0,.06)' : 'none',
                }}
              >
                # Número de pedido
              </button>
              <button
                onClick={() => setMode('phone')}
                style={{
                  flex: 1, padding: '10px', borderRadius: '9px', fontSize: '0.85rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer', transition: 'all .2s',
                  backgroundColor: mode === 'phone' ? 'white' : 'transparent',
                  color: mode === 'phone' ? '#2E2A24' : '#6B6358',
                  boxShadow: mode === 'phone' ? '0 2px 8px rgba(0,0,0,.06)' : 'none',
                }}
              >
                📱 Teléfono
              </button>
            </div>

            <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {mode === 'number' ? (
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6B6358', display: 'block', marginBottom: '8px' }}>
                    Número de pedido
                  </label>
                  <input
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="BOC-2026-XXXX"
                    style={{
                      width: '100%', border: '1.5px solid #E5E0D8', borderRadius: '12px', padding: '15px 16px',
                      color: '#2E2A24', fontWeight: 700, fontSize: '1.05rem', textAlign: 'center',
                      outline: 'none', textTransform: 'uppercase', letterSpacing: '0.06em', boxSizing: 'border-box',
                    }}
                  />
                  <p style={{ color: '#A39C8F', fontSize: '0.75rem', textAlign: 'center', marginTop: '8px' }}>
                    Lo encontrarás en tu email o pantalla de confirmación
                  </p>
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#6B6358', display: 'block', marginBottom: '8px' }}>
                    Número de teléfono
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    style={{
                      width: '100%', border: '1.5px solid #E5E0D8', borderRadius: '12px', padding: '15px 16px',
                      color: '#2E2A24', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                  <p style={{ color: '#A39C8F', fontSize: '0.75rem', textAlign: 'center', marginTop: '8px' }}>
                    El mismo número que usaste al hacer el pedido
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={mode === 'number' ? !orderNumber.trim() : !phone.trim()}
                className="btn-pill primary"
                style={{ width: '100%', padding: '16px', fontSize: '1rem', opacity: (mode === 'number' ? !orderNumber.trim() : !phone.trim()) ? 0.5 : 1 }}
              >
                <Search size={18} />
                Buscar pedido
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', color: '#A39C8F', fontSize: '0.85rem', marginTop: '24px' }}>
            ¿No encuentras tu pedido?{' '}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              style={{ color: '#FF9E00', fontWeight: 600, textDecoration: 'underline' }}
            >
              Escríbenos por WhatsApp
            </a>
          </p>
        </Reveal>
      </div>
    </>
  )
}
