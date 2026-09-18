'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/lib/types'
import Reveal from './Reveal'

interface Props {
  products: Product[]
  storeIsOpen?: boolean
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
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 'var(--radius)',
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
      {badge && (
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 2,
          backgroundColor: '#FF9E00', color: 'white',
          fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em',
          padding: '4px 10px', borderRadius: '4px 10px 4px 10px',
          textTransform: 'uppercase',
        }}>
          {badge}
        </div>
      )}

      <Link href={`/productos/${product.id}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{
          position: 'relative', aspectRatio: '1',
          backgroundColor: '#FBF5E9', overflow: 'hidden',
        }}>
          {photo ? (
            <Image
              src={photo} alt={product.name} fill
              sizes="(max-width: 640px) 50vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform .4s ease' }}
              className="landing-card-img"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '48px' }}>
              🧀
            </div>
          )}
          {isOutOfStock && (
            <div style={{
              position: 'absolute', inset: 0,
              backgroundColor: 'rgba(0,0,0,.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '0.9rem' }}>Agotado</span>
            </div>
          )}
        </div>
      </Link>

      <div className="landing-card-info">
        <div>
          <Link href={`/productos/${product.id}`} style={{ textDecoration: 'none' }}>
            <p className="landing-card-name">
              {product.name}
            </p>
          </Link>
          <p className="landing-card-price">
            {formatCurrency(product.price)}
          </p>
        </div>

        <button
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="landing-buy-btn"
          style={{
            backgroundColor: added ? '#22C55E' : isOutOfStock ? '#E5E0D8' : '#FF9E00',
            boxShadow: isOutOfStock ? 'none' : '0 8px 24px rgba(255,158,0,.35)',
            transform: added ? 'scale(1.03)' : 'scale(1)',
          }}
        >
          {added ? (
            <><Check size={15} strokeWidth={3} /> <span>¡Listo!</span></>
          ) : isOutOfStock ? (
            'Sin stock'
          ) : (
            <><ShoppingCart size={15} /> <span>Agregar<span className="buy-text-full"> al carrito</span></span></>
          )}
        </button>
      </div>
    </div>
  )
}

export default function BuySection({ products, storeIsOpen = true }: Props) {
  const badges = ['⭐ Más vendido', undefined, undefined]

  return (
    <section id="comprar" style={{ backgroundColor: '#FBF5E9' }} className="section-pad-sm">
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px' }}>

        <Reveal style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p className="eyebrow" style={{ justifyContent: 'center' }}>NUESTROS FAVORITOS</p>
          <h2 style={{
            fontFamily: 'var(--font-fraunces), Georgia, serif',
            fontWeight: 800, color: '#2E2A24',
            fontSize: 'clamp(1.5rem,4vw,2.6rem)',
            lineHeight: 1.15,
          }}>
            Escoge y agrega<br /> al carrito
          </h2>
        </Reveal>

        {storeIsOpen ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: '20px',
                marginBottom: '36px',
              }}
              className="landing-grid"
            >
              {products.map((p, i) => (
                <Reveal key={p.id} delay={i * 100}>
                  <ProductCard product={p} badge={badges[i]} />
                </Reveal>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link href="/productos" className="btn-pill dark" style={{
                fontSize: '1rem', padding: '15px 36px',
                boxShadow: '0 8px 30px rgba(46,42,36,.25)',
              }}>
                Ver todos los productos <span className="arrow">→</span>
              </Link>
            </div>
          </>
        ) : (
          <Reveal style={{ textAlign: 'center', padding: '24px 20px' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🧀</span>
            <h3 style={{
              fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 800,
              fontSize: '1.3rem', color: '#2E2A24', marginBottom: '8px',
            }}>
              En estos momentos estamos cerrados
            </h3>
            <p style={{ color: '#6B6358', fontSize: '0.9rem' }}>
              No estamos recibiendo pedidos en este momento. Vuelve a pasar más tarde.
            </p>
          </Reveal>
        )}
      </div>

      <style>{`
        .landing-card-info {
          padding: 18px 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .landing-card-name {
          font-weight: 700; color: #2E2A24; font-size: 1rem;
          line-height: 1.3; margin-bottom: 5px;
        }
        .landing-card-price {
          font-weight: 900; color: #FF9E00; font-size: 1.35rem;
        }
        .landing-buy-btn {
          width: 100%;
          font-family: var(--font-fraunces), Georgia, serif;
          color: white; font-weight: 600; font-style: italic; font-size: 0.9rem;
          padding: 13px; border-radius: 6px; border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          transition: background .25s, transform .2s;
        }
        .landing-buy-btn:disabled { cursor: not-allowed; }
        .landing-product-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,.13) !important; transform: translateY(-4px); }
        .landing-product-card:hover .landing-card-img { transform: scale(1.05); }
        @media (max-width: 640px) {
          .landing-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; gap: 12px !important; }
          .landing-card-info { padding: 12px 14px; gap: 10px; }
          .landing-card-name { font-size: 0.82rem; }
          .landing-card-price { font-size: 1.1rem; }
          .landing-buy-btn { font-size: 0.82rem; padding: 10px 8px; gap: 5px; }
          .buy-text-full { display: none; }
        }
        @media (max-width: 1024px) and (min-width: 641px) {
          .landing-grid { grid-template-columns: repeat(3, minmax(0, 1fr)) !important; }
        }
      `}</style>
    </section>
  )
}
