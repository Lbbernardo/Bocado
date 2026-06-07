'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '@/store/cart'

export default function Navbar() {
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartBump, setCartBump] = useState(false)
  const prevCount = useRef(itemCount)

  useEffect(() => {
    if (itemCount > 0 && itemCount !== prevCount.current) {
      setCartBump(true)
      setTimeout(() => setCartBump(false), 600)
    }
    prevCount.current = itemCount
  }, [itemCount])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '68px',
        display: 'flex', alignItems: 'center',
        backgroundColor: scrolled ? 'rgba(255,255,255,.97)' : 'rgba(251,245,233,.92)',
        backdropFilter: 'blur(12px)',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,.08)' : 'none',
        transition: 'background .3s, box-shadow .3s',
        borderBottom: '1px solid rgba(0,0,0,.05)',
      }}>
        <div style={{
          maxWidth: '1180px', margin: '0 auto', padding: '0 26px',
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link href="/">
            <Image src="/bocado/logo.png" alt="Bocado" width={110} height={36} style={{ height: '36px', width: 'auto' }} />
          </Link>

          {/* Desktop links */}
          <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <Link href="/productos" style={{ color: '#2E2A24', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
              Productos
            </Link>
            <Link href="/pedido/buscar" style={{ color: '#2E2A24', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none' }}>
              Seguir pedido
            </Link>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link href="/carrito" style={{
              position: 'relative', padding: '8px', color: '#2E2A24', display: 'flex', alignItems: 'center',
              transform: cartBump ? 'scale(1.3)' : 'scale(1)',
              transition: 'transform .3s cubic-bezier(.34,1.56,.64,1)',
            }}>
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px',
                  backgroundColor: '#FF9E00', color: 'white',
                  fontSize: '10px', fontWeight: 800,
                  width: '18px', height: '18px',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {itemCount}
                </span>
              )}
            </Link>

            <Link href="/productos" className="desktop-cta" style={{
              backgroundColor: '#FF9E00', color: 'white',
              fontWeight: 700, fontSize: '0.88rem',
              padding: '10px 22px', borderRadius: '999px',
              textDecoration: 'none',
            }}>
              Pedir ahora
            </Link>

            <button className="mobile-burger" onClick={() => setMenuOpen(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer', color: '#2E2A24', padding: '4px',
            }}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 60,
          backgroundColor: '#FBF5E9',
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', height: '68px' }}>
            <Image src="/bocado/logo.png" alt="Bocado" width={110} height={36} style={{ height: '36px', width: 'auto' }} />
            <button onClick={() => setMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '26px', cursor: 'pointer', color: '#2E2A24' }}>
              <X size={26} />
            </button>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '28px' }}>
            {[
              { label: 'Productos', href: '/productos' },
              { label: 'Seguir pedido', href: '/pedido/buscar' },
              { label: 'Carrito', href: '/carrito' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem',
                color: '#2E2A24', textDecoration: 'none',
              }}>
                {label}
              </Link>
            ))}
            <Link href="/productos" onClick={() => setMenuOpen(false)} style={{
              backgroundColor: '#FF9E00', color: 'white', fontWeight: 700,
              padding: '14px 32px', borderRadius: '999px', textDecoration: 'none', fontSize: '1rem', marginTop: '8px',
            }}>
              Pedir ahora →
            </Link>
          </nav>
        </div>
      )}
    </>
  )
}
