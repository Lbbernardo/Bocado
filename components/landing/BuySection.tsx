'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/lib/types'

interface Props {
  products: Product[]
}

function ProductCard({ product, badge }: { product: Product; badge?: string }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const photo = product.images?.[0] ?? product.image_url
  const isOutOfStock = product.stock !== null && product.stock === 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (isOutOfStock) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '24px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,.07)',
      border: '1.5px solid #F0EDE8',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      transition: 'box-shadow .25s, transform .25s',
    }}
      className="landing-product-card"
    >
      {/* Badge */}
      {badge && (
        <div style={{
          position: 'absolute', top: '14px', left: '14px', zIndex: 2,
          backgroundColor: '#FF9E00', color: 'white',
          fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em',
          padding: '4px 12px', borderRadius: '999px',
          textTransform: 'uppercase',
        }}>
          {badge}
        </div>
      )}

      {/* Image */}
      <Link href={`/productos/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{
          position: 'relative', aspectRatio: '1',
          backgroundColor: '#FBF5E9', overflow: 'hidden',
        }}>
          {photo ? (
            <Image
              src={photo} alt={product.name} fill
              sizes="(max-width: 768px) 90vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform .4s ease' }}
              className="landing-card-img"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '64px' }}>
              🧀
            </div>
          )}
          {isOutOfStock && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0,0,0,.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>Agotado</span>
            </div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <Link href={`/productos/${product.id}`} style={{ textDecoration: 'none' }}>
            <p style={{
              fontWeight: 700, color: '#2E2A24', fontSize: '1rem',
              lineHeight: 1.3, marginBottom: '6px',
            }}>
              {product.name}
            </p>
          </Link>
          <p style={{ fontWeight: 900, color: '#FF9E00', fontSize: '1.4rem' }}>
            {formatCurrency(product.price)}
          </p>
        </div>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          style={{
            width: '100%',
            backgroundColor: added ? '#22C55E' : isOutOfStock ? '#E5E0D8' : '#FF9E00',
            color: 'white', fontWeight: 700, fontSize: '0.9rem',
            padding: '13px', borderRadius: '999px', border: 'none',
            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'background .25s, transform .2s',
            boxShadow: isOutOfStock ? 'none' : '0 8px 24px rgba(255,158,0,.35)',
            transform: added ? 'scale(1.03)' : 'scale(1)',
          }}
        >
          {added
            ? <><Check size={16} strokeWidth={3} /> ¡Agregado!</>
            : isOutOfStock
            ? 'Sin stock'
            : <><ShoppingCart size={15} /> Agregar al carrito</>}
        </button>
      </div>
    </div>
  )
}

export default function BuySection({ products }: Props) {
  const badges = ['⭐ Más vendido', undefined, undefined]

  return (
    <section id="comprar" style={{ backgroundColor: '#FBF5E9', padding: '80px 26px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{
            color: '#FF9E00', fontWeight: 700, fontSize: '11px',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            marginBottom: '10px',
          }}>
            NUESTROS FAVORITOS
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display), "Baloo 2", system-ui',
            fontWeight: 800, color: '#2E2A24',
            fontSize: 'clamp(1.8rem,4vw,2.6rem)',
            lineHeight: 1.1,
          }}>
            Los más pedidos
          </h2>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '40px',
        }} className="landing-grid">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} badge={badges[i]} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link href="/productos" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            backgroundColor: '#2E2A24', color: 'white',
            fontWeight: 700, fontSize: '1rem',
            padding: '16px 40px', borderRadius: '999px',
            textDecoration: 'none',
            boxShadow: '0 8px 30px rgba(46,42,36,.25)',
          }}>
            Ver todos los productos →
          </Link>
        </div>
      </div>

      <style>{`
        .landing-product-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,.13) !important; transform: translateY(-4px); }
        .landing-product-card:hover .landing-card-img { transform: scale(1.05); }
        @media (max-width: 768px) {
          .landing-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
          .landing-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </section>
  )
}
