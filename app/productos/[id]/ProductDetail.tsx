'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/store/cart'
import type { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import Reveal from '@/components/landing/Reveal'

interface Props {
  product: Product
}

export default function ProductDetail({ product }: Props) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  const photos = product.images?.length
    ? product.images
    : product.image_url
    ? [product.image_url]
    : []

  const isOutOfStock = product.stock !== null && product.stock === 0

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 26px 96px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px', alignItems: 'start' }} className="product-detail-grid">
        {/* Left: Images */}
        <Reveal style={{ display: 'flex', gap: '12px' }} className="product-detail-media">
          {/* Thumbnails */}
          {photos.length > 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '520px', overflowY: 'auto' }}>
              {photos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  style={{
                    flexShrink: 0, width: '72px', height: '72px', borderRadius: '14px', overflow: 'hidden',
                    border: `2px solid ${activePhoto === i ? '#FF9E00' : '#F0EDE8'}`,
                    padding: 0, cursor: 'pointer', transition: 'border-color .2s',
                  }}
                >
                  <Image src={src} alt={`${product.name} ${i + 1}`} width={72} height={72} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div style={{ flex: 1, position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius)', overflow: 'hidden', backgroundColor: '#FBF5E9' }}>
            {photos.length > 0 ? (
              <Image src={photos[activePhoto]} alt={product.name} fill style={{ objectFit: 'cover' }} priority />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span style={{ fontSize: '96px' }}>🧀</span>
              </div>
            )}
            {isOutOfStock && (
              <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(46,42,36,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{
                  backgroundColor: 'white', color: '#2E2A24',
                  fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 700, fontStyle: 'italic',
                  fontSize: '1.1rem', padding: '12px 28px', borderRadius: '6px 18px 6px 18px',
                }}>
                  Agotado
                </span>
              </div>
            )}
          </div>
        </Reveal>

        {/* Right: Info */}
        <Reveal delay={100} style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="eyebrow">{product.category}</span>

          <h1 style={{
            fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 900,
            fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', color: '#2E2A24', lineHeight: 1.05, marginBottom: '12px',
          }}>
            {product.name}
          </h1>

          <p style={{ fontWeight: 800, color: '#FF9E00', fontSize: '1.7rem', marginBottom: '24px' }}>
            {formatCurrency(product.price)}
          </p>

          <div style={{ borderTop: '1px solid #F0EDE8', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {product.description && (
              <p style={{ color: '#6B6358', lineHeight: 1.7, fontSize: '0.92rem' }}>
                {product.description}
              </p>
            )}

            {!isOutOfStock && (
              <>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B6358', display: 'block', marginBottom: '10px' }}>
                    Cantidad
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #F0EDE8', borderRadius: '999px', width: 'fit-content', overflow: 'hidden' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      style={{ width: '44px', height: '44px', border: 'none', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E2A24', cursor: 'pointer', opacity: quantity <= 1 ? 0.3 : 1 }}
                    >
                      <Minus size={16} />
                    </button>
                    <span style={{ width: '48px', textAlign: 'center', fontWeight: 800, color: '#2E2A24', fontSize: '1.05rem' }}>
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      style={{ width: '44px', height: '44px', border: 'none', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E2A24', cursor: 'pointer' }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAdd}
                  className="btn-pill"
                  style={{
                    width: '100%', padding: '17px', fontSize: '1.05rem', gap: '10px',
                    backgroundColor: added ? '#22C55E' : '#FF9E00',
                    borderColor: added ? '#22C55E' : '#FF9E00',
                    color: 'white',
                  }}
                >
                  {added ? (
                    <>
                      <Check size={20} />
                      ¡Agregado al carrito!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Agregar al carrito
                    </>
                  )}
                </button>
              </>
            )}

            {isOutOfStock && (
              <div style={{ backgroundColor: '#FBF5E9', border: '1px solid #F0EDE8', borderRadius: '16px', padding: '18px', textAlign: 'center' }}>
                <p style={{ color: '#2E2A24', fontWeight: 700 }}>Este producto está agotado</p>
                <p style={{ color: '#6B6358', fontSize: '0.85rem', marginTop: '4px' }}>Vuelve pronto para más tequeños 🧡</p>
              </div>
            )}

            {!isOutOfStock && product.stock !== null && product.stock > 0 && product.stock <= 10 && (
              <p style={{ color: '#F59E0B', fontWeight: 700, fontSize: '0.88rem' }}>
                ¡Solo quedan {product.stock} disponibles!
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </div>
  )
}
