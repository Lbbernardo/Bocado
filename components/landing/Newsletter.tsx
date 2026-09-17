'use client'

import { useState } from 'react'
import Image from 'next/image'
import Reveal from './Reveal'

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
    <section style={{ backgroundColor: '#FBF5E9', padding: '80px 20px' }}>
      <Reveal style={{
        maxWidth: '840px', margin: '0 auto',
        backgroundColor: '#FF9E00',
        borderRadius: 'var(--radius)',
        padding: '56px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Pattern background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/bocado/pattern.svg)',
          backgroundRepeat: 'repeat',
          backgroundSize: '100px',
          opacity: 0.12,
        }} />
        {/* Decorative floating icon */}
        <div className="chip-float" style={{
          position: 'absolute', top: '-40px', left: 'calc(50% - 40px)',
          width: '80px', height: '80px', borderRadius: '50%',
          backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '34px', boxShadow: '0 10px 30px rgba(0,0,0,.15)',
        }}>
          ✉️
        </div>

        <div style={{ maxWidth: '520px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1, paddingTop: '20px' }}>
        <Image
          src="/bocado/logo-w.png"
          alt="Bocado"
          width={140}
          height={46}
          style={{ height: '46px', width: 'auto', margin: '0 auto 28px' }}
        />

        <h2 style={{
          fontFamily: 'var(--font-fraunces), Georgia, serif',
          fontWeight: 800, color: 'white',
          fontSize: 'clamp(2rem,4vw,2.8rem)',
          marginBottom: '14px',
        }}>
          Únete a la familia Bocado
        </h2>

        <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '1rem', lineHeight: 1.6, marginBottom: '32px' }}>
          Recetas, antojos y un 10% de descuento en tu primer pedido. Sin spam, solo queso.
        </p>

        <form onSubmit={handleSubmit} className="newsletter-form" style={{ display: 'flex', gap: '10px', maxWidth: '520px', margin: '0 auto 16px' }}>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            required
            style={{
              flex: 1,
              padding: '16px 22px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.95rem',
              outline: 'none',
              color: '#2E2A24',
            }}
          />
          <button type="submit" className="btn-pill dark" style={{ padding: '16px 26px' }}>
            {sent ? '¡Listo! 🎉' : 'Quiero mi 10%'}
          </button>
        </form>

        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: '0.8rem' }}>
          Al suscribirte aceptas recibir correos de Bocado. Cancela cuando quieras.
        </p>
        </div>
      </Reveal>
    </section>
  )
}
