'use client'

import { useEffect, useState } from 'react'
import { useCart } from '@/store/cart'
import { ShoppingCart, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/lib/utils'

export default function CartToast() {
  const { lastAdded, clearLastAdded, itemCount } = useCart()
  const [visible, setVisible] = useState(false)
  const [product, setProduct] = useState(lastAdded)

  useEffect(() => {
    if (!lastAdded) return
    setProduct(lastAdded)
    setVisible(true)
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(clearLastAdded, 350)
    }, 2800)
    return () => clearTimeout(t)
  }, [lastAdded])

  if (!product) return null

  const photo = product.images?.[0] ?? product.image_url

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%',
      transform: `translateX(-50%) translateY(${visible ? '0' : '100px'})`,
      opacity: visible ? 1 : 0,
      transition: 'transform .35s cubic-bezier(.34,1.56,.64,1), opacity .3s ease',
      zIndex: 200,
      display: 'flex', alignItems: 'center', gap: '12px',
      backgroundColor: '#2E2A24',
      borderRadius: '999px',
      padding: '10px 16px 10px 10px',
      boxShadow: '0 12px 40px rgba(0,0,0,.35)',
      minWidth: '280px', maxWidth: '360px',
    }}>
      {/* Product thumb */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '50%',
        overflow: 'hidden', flexShrink: 0,
        backgroundColor: '#FBF5E9',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {photo ? (
          <Image src={photo} alt={product.name} width={44} height={44} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ fontSize: '22px' }}>🧀</span>
        )}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px', fontWeight: 600, lineHeight: 1 }}>
          ¡Añadido al carrito!
        </p>
        <p style={{ color: 'white', fontWeight: 700, fontSize: '0.88rem', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.name}
        </p>
      </div>

      {/* Cart link */}
      <Link href="/carrito" onClick={() => setVisible(false)} style={{
        backgroundColor: '#FF9E00', color: 'white',
        fontWeight: 700, fontSize: '0.8rem',
        padding: '8px 16px', borderRadius: '999px',
        textDecoration: 'none', whiteSpace: 'nowrap',
        display: 'flex', alignItems: 'center', gap: '6px',
        flexShrink: 0,
      }}>
        <ShoppingCart size={13} />
        Ver carrito ({itemCount})
      </Link>

      {/* Close */}
      <button onClick={() => setVisible(false)} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,.3)', padding: '4px', flexShrink: 0,
      }}>
        <X size={14} />
      </button>
    </div>
  )
}
