'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { SlidersHorizontal, X, Plus, Check } from 'lucide-react'
import type { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import { useCart } from '@/store/cart'

interface Props {
  products: Product[]
  categories: string[]
}

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const photos = product.images?.length ? product.images : product.image_url ? [product.image_url] : []
  const isOutOfStock = product.stock !== null && product.stock === 0

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock) return
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link href={`/productos/${product.id}`} style={{ textDecoration: 'none', display: 'block' }} className="product-card-link">
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1.5px solid #F0EDE8',
        transition: 'box-shadow .25s, border-color .25s',
        cursor: 'pointer',
      }}
        className="product-card"
      >
        {/* Image */}
        <div style={{ position: 'relative', aspectRatio: '1', backgroundColor: '#FBF5E9', overflow: 'hidden' }}>
          {photos.length > 0 ? (
            <Image
              src={photos[0]} alt={product.name} fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              style={{ objectFit: 'cover', transition: 'transform .4s ease' }}
              className="product-card-img"
            />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '56px' }}>🧀</div>
          )}

          {isOutOfStock && (
            <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: '#2E2A24', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px' }}>
              Agotado
            </div>
          )}

          {/* Quick add button */}
          {!isOutOfStock && (
            <button
              onClick={handleQuickAdd}
              style={{
                position: 'absolute', bottom: '10px', right: '10px',
                width: '36px', height: '36px',
                backgroundColor: added ? '#22C55E' : '#FF9E00',
                color: 'white', border: 'none', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transform: added ? 'scale(1.15)' : 'scale(1)',
                transition: 'all .25s cubic-bezier(.34,1.56,.64,1)',
                boxShadow: '0 4px 12px rgba(0,0,0,.2)',
                opacity: 0,
              }}
              className="quick-add-btn"
            >
              {added ? <Check size={16} strokeWidth={3} /> : <Plus size={16} strokeWidth={3} />}
            </button>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '14px 16px' }}>
          <p style={{ fontWeight: 700, color: '#2E2A24', fontSize: '0.9rem', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {product.name}
          </p>
          <p style={{ fontWeight: 800, color: '#FF9E00', fontSize: '1rem' }}>
            {formatCurrency(product.price)}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function ProductsClient({ products, categories }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [availability, setAvailability] = useState<'all' | 'in_stock' | 'sold_out'>('all')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const filtered = useMemo(() => products.filter((p) => {
    const catMatch = selectedCategory === 'all' || p.category === selectedCategory
    const isOut = p.stock !== null && p.stock === 0
    const availMatch = availability === 'all' || (availability === 'in_stock' && !isOut) || (availability === 'sold_out' && isOut)
    return catMatch && availMatch
  }), [products, selectedCategory, availability])

  const Sidebar = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2E2A24', marginBottom: '12px' }}>Categoría</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {['all', ...categories].map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left', padding: '0',
              fontSize: '0.9rem', fontWeight: selectedCategory === cat ? 700 : 400,
              color: selectedCategory === cat ? '#FF9E00' : '#6B6358',
            }}>
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#2E2A24', marginBottom: '12px' }}>Disponibilidad</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {([['all', 'Todos'], ['in_stock', 'En stock'], ['sold_out', 'Agotados']] as const).map(([val, label]) => (
            <button key={val} onClick={() => setAvailability(val)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left', padding: '0',
              fontSize: '0.9rem', fontWeight: availability === val ? 700 : 400,
              color: availability === val ? '#FF9E00' : '#6B6358',
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '32px 26px 80px' }}>
      {/* Mobile filter button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }} className="mobile-filter-bar">
        <p style={{ fontSize: '0.85rem', color: '#6B6358' }}>{filtered.length} productos</p>
        <button onClick={() => setMobileFiltersOpen(true)} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          border: '1.5px solid #F0EDE8', borderRadius: '12px',
          padding: '8px 14px', fontSize: '0.85rem', fontWeight: 600,
          color: '#2E2A24', background: 'white', cursor: 'pointer',
        }}>
          <SlidersHorizontal size={14} />
          Filtros
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileFiltersOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,.4)' }} onClick={() => setMobileFiltersOpen(false)} />
          <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '260px', backgroundColor: 'white', padding: '24px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <p style={{ fontWeight: 800, color: '#2E2A24' }}>Filtros</p>
              <button onClick={() => setMobileFiltersOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#2E2A24" />
              </button>
            </div>
            <Sidebar />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* Desktop sidebar */}
        <aside style={{ width: '160px', flexShrink: 0 }} className="desktop-sidebar">
          <Sidebar />
        </aside>

        {/* Grid */}
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '0.85rem', color: '#6B6358', marginBottom: '20px' }} className="desktop-count">{filtered.length} productos</p>

          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="products-grid">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>🧀</p>
              <p style={{ color: '#6B6358' }}>No hay productos con estos filtros</p>
              <button onClick={() => { setSelectedCategory('all'); setAvailability('all') }} style={{
                marginTop: '12px', background: 'none', border: 'none', cursor: 'pointer',
                color: '#FF9E00', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'underline',
              }}>
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .product-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,.1); border-color: rgba(255,158,0,.3); }
        .product-card:hover .product-card-img { transform: scale(1.05); }
        .product-card:hover .quick-add-btn { opacity: 1 !important; }
        .desktop-sidebar { display: block; }
        .desktop-count { display: block; }
        .mobile-filter-bar { display: none; }
        .products-grid { grid-template-columns: repeat(3, 1fr) !important; }
        @media (max-width: 1024px) { .products-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none; }
          .desktop-count { display: none; }
          .mobile-filter-bar { display: flex; }
          .quick-add-btn { opacity: 1 !important; }
        }
        @media (max-width: 480px) { .products-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </div>
  )
}
