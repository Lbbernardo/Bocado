'use client'

import { useCart } from '@/store/cart'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function CartBar() {
  const { itemCount, subtotal } = useCart()
  const pathname = usePathname()

  // Hide on cart / checkout / pago pages (already have their own flow)
  const hidden = ['/carrito', '/checkout', '/pago', '/confirmacion'].some((p) =>
    pathname.startsWith(p)
  )

  if (itemCount === 0 || hidden) return null

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 150,
      width: 'min(480px, calc(100vw - 32px))',
    }}>
      <Link href="/carrito" style={{ textDecoration: 'none' }}>
        <div style={{
          backgroundColor: '#2E2A24',
          borderRadius: '999px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,.35)',
          cursor: 'pointer',
        }}>
          {/* Count bubble */}
          <div style={{
            backgroundColor: '#FF9E00',
            color: 'white',
            fontWeight: 800,
            fontSize: '13px',
            minWidth: '28px', height: '28px',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            {itemCount}
          </div>

          {/* Label */}
          <p style={{
            color: 'white',
            fontWeight: 600,
            fontSize: '0.95rem',
            flex: 1,
          }}>
            Ver carrito
          </p>

          {/* Total + arrow */}
          <div style={{
            backgroundColor: '#FF9E00',
            color: 'white',
            fontWeight: 800,
            fontSize: '0.95rem',
            padding: '8px 18px',
            borderRadius: '999px',
            display: 'flex', alignItems: 'center', gap: '6px',
            flexShrink: 0,
          }}>
            <ShoppingBag size={15} />
            {formatCurrency(subtotal)}
          </div>
        </div>
      </Link>
    </div>
  )
}
