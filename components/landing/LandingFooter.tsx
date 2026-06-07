'use client'

import Image from 'next/image'
import Link from 'next/link'

const LINKS = [
  {
    title: 'Producto',
    items: ['Nuestros tequeños', 'Cómo preparar', 'Por qué Bocado', 'Comprar'],
    hrefs: ['/productos', '#preparar', '#beneficios', '#comprar'],
  },
  {
    title: 'Ayuda',
    items: ['Preguntas frecuentes', 'Envíos y entregas', 'Contacto', 'Mayoristas'],
    hrefs: ['#', '#', '#', '#'],
  },
  {
    title: 'Bocado',
    items: ['Nuestra historia', 'Trabaja con nosotros', 'Términos', 'Privacidad'],
    hrefs: ['#', '#', '#', '#'],
  },
]

export default function LandingFooter() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ backgroundColor: '#2E2A24', padding: '64px 26px 0' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

        {/* Top grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: '48px', paddingBottom: '56px' }} className="footer-grid">

          {/* Brand */}
          <div>
            <Image src="/bocado/logo-w.png" alt="Bocado" width={130} height={44} style={{ height: '44px', width: 'auto', marginBottom: '16px' }} />
            <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '0.875rem', lineHeight: 1.65, marginBottom: '24px', maxWidth: '260px' }}>
              Tequeños venezolanos hechos con queso de verdad y mucho amor. Crunchy outside, cheesy inside.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { label: 'IG', icon: '📷' },
                { label: 'TK', icon: '🎵' },
                { label: 'WA', icon: '💬' },
              ].map(({ label, icon }) => (
                <a key={label} href="#" style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', textDecoration: 'none',
                  transition: 'border-color .2s',
                }}
                  title={label}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {LINKS.map(({ title, items, hrefs }) => (
            <div key={title}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem', marginBottom: '20px' }}>{title}</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map((item, i) => (
                  <li key={item}>
                    <Link href={hrefs[i]} style={{ color: 'rgba(255,255,255,.5)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color .2s' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'white')}
                      onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,.5)')}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,.08)',
          padding: '20px 0',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px',
        }}>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '0.8rem' }}>
            © {year} Bocado · Tequeños Venezolanos. Hecho con queso y mucho amor.
          </p>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '0.8rem' }}>
            Mantener congelado a –18 °C · Listos para preparar
          </p>
        </div>
      </div>
    </footer>
  )
}
