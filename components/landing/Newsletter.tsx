'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setSent(true)
    setEmail('')
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <section style={{
      backgroundColor: '#FF9E00',
      position: 'relative',
      overflow: 'hidden',
    }} className="section-pad">
      {/* Pattern background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/bocado/pattern.svg)',
        backgroundRepeat: 'repeat',
        backgroundSize: '100px',
        opacity: 0.12,
      }} />

      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <Image
          src="/bocado/logo-w.png"
          alt="Bocado"
          width={140}
          height={46}
          style={{ height: '46px', width: 'auto', margin: '0 auto 28px' }}
        />

        <h2 style={{
          fontFamily: 'var(--font-display), "Baloo 2", system-ui',
          fontWeight: 800, color: 'white',
          fontSize: 'clamp(2rem,4vw,2.8rem)',
          marginBottom: '14px',
        }}>
          Únete a la familia Bocado
        </h2>

        <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Recetas, antojos y un 10% de descuento en tu primer pedido. Sin spam, solo queso.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0', maxWidth: '520px', margin: '0 auto 16px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
            style={{
              flex: 1,
              padding: '16px 24px',
              borderRadius: '999px 0 0 999px',
              border: 'none',
              fontSize: '0.95rem',
              outline: 'none',
              color: '#2E2A24',
            }}
          />
          <button type="submit" style={{
            backgroundColor: '#2E2A24',
            color: 'white',
            fontWeight: 700,
            padding: '16px 28px',
            borderRadius: '0 999px 999px 0',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.95rem',
            whiteSpace: 'nowrap',
          }}>
            {sent ? '¡Listo! 🎉' : 'Quiero mi 10%'}
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '0.8rem' }}>
          Al suscribirte aceptas recibir correos de Bocado. Cancela cuando quieras.
        </p>
      </div>
    </section>
  )
}
