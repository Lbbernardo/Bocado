'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const NAV = [
  { label: 'Productos', href: '/productos' },
  { label: 'Cómo preparar', href: '#preparar' },
  { label: 'Comprar', href: '#comprar' },
]

export default function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: scrolled ? '64px' : '78px',
        display: 'flex', alignItems: 'center',
        backgroundColor: scrolled ? 'rgba(255,255,255,.96)' : 'rgba(253,249,240,.85)',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,.08)' : 'none',
        transition: 'background .3s ease, box-shadow .3s ease, height .3s ease',
      }}>
        <div style={{
          maxWidth: '1180px', margin: '0 auto', padding: '0 26px',
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/">
            <Image src="/bocado/logo-brand.png" alt="Bocado" width={112} height={56} style={{ height: '56px', width: 'auto' }} />
          </Link>

          {/* Desktop nav */}
          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {NAV.map(({ label, href }) => href.startsWith('/') ? (
              <Link key={href} href={href} style={{ color: '#2E2A24', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#FF9E00')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#2E2A24')}
              >
                {label}
              </Link>
            ) : (
              <a key={href} href={href} style={{ color: '#2E2A24', fontWeight: 500, fontSize: '0.9rem', textDecoration: 'none' }}
                onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#FF9E00')}
                onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#2E2A24')}
              >
                {label}
              </a>
            ))}
            <Link href="/pedido/buscar" style={{
              color: '#6B6358', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none',
              display: 'flex', alignItems: 'center', gap: '5px',
            }}
              onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#FF9E00')}
              onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = '#6B6358')}
            >
              📦 Seguir pedido
            </Link>
          </nav>

          {/* CTA */}
          <a href="#comprar" className="btn-pill primary desktop-cta" style={{
            fontSize: '0.9rem', padding: '11px 24px',
          }}>
            Pídelos ya →
          </a>

          {/* Mobile burger */}
          <button className="mobile-burger" onClick={() => setMenuOpen(true)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '24px', color: '#2E2A24', padding: '4px',
          }}>
            ☰
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          backgroundColor: '#FBF5E9',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', height: '78px' }}>
            <Image src="/bocado/logo-brand.png" alt="Bocado" width={112} height={56} style={{ height: '56px', width: 'auto' }} />
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: '#2E2A24' }}>✕</button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '28px' }}>
            {NAV.map(({ label, href }) => href.startsWith('/') ? (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 700, fontSize: '2rem',
                color: '#2E2A24', textDecoration: 'none',
              }}>
                {label}
              </Link>
            ) : (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 700, fontSize: '2rem',
                color: '#2E2A24', textDecoration: 'none',
              }}>
                {label}
              </a>
            ))}
            <a href="#comprar" onClick={() => setMenuOpen(false)} className="btn-pill primary" style={{
              padding: '14px 32px', fontSize: '1.1rem', marginTop: '4px',
            }}>
              Pídelos ya →
            </a>
            <Link href="/pedido/buscar" onClick={() => setMenuOpen(false)} style={{
              color: '#6B6358', fontWeight: 600, fontSize: '1rem',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              📦 Seguir mi pedido
            </Link>
          </nav>
        </div>
      )}

    </>
  )
}
