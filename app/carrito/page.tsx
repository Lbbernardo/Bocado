'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Image from 'next/image'
import Link from 'next/link'
import {
  Trash2, Plus, Minus, ShoppingBag, ArrowLeft,
  User, Phone, MapPin, CreditCard, Smartphone,
  CheckCircle2, Copy, Loader2, Clock,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import { useCart } from '@/store/cart'
import { formatCurrency } from '@/lib/utils'
import type { StoreConfig } from '@/lib/types'

const schema = z.object({
  customer_name: z.string().min(2, 'Nombre requerido'),
  customer_phone: z.string().min(7, 'Teléfono requerido').regex(/^[\d\s+\-()+]+$/, 'Teléfono inválido'),
  delivery_method: z.enum(['pickup', 'delivery']),
  delivery_address: z.string().optional(),
  customer_note: z.string().optional(),
}).refine((d) => {
  if (d.delivery_method === 'delivery') return d.delivery_address && d.delivery_address.length > 5
  return true
}, { message: 'Dirección requerida para delivery', path: ['delivery_address'] })

type Form = z.infer<typeof schema>

// ─── Sub-components ──────────────────────────────────────────────────────────

function Field({ label, error, icon, children }: { label: string; error?: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 600, color: '#6B6358', marginBottom: '6px' }}>
        {icon}{label}
      </label>
      {children}
      {error && <p style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '4px' }}>{error}</p>}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CarritoPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, subtotal, itemCount, clearCart } = useCart()
  const [hydrated, setHydrated] = useState(false)
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [step, setStep] = useState<'cart' | 'zelle'>('cart')
  const [orderNumber, setOrderNumber] = useState('')
  const [zelleLoading, setZelleLoading] = useState(false)
  const [zelleCopied, setZelleCopied] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const payMethodRef = useRef<'stripe' | 'zelle'>('zelle')
  const [error, setError] = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { delivery_method: 'pickup' },
  })
  const deliveryMethod = watch('delivery_method')
  const deliveryFee = deliveryMethod === 'delivery' ? (config?.delivery_fee ?? 0) : 0
  const total = subtotal + deliveryFee

  useEffect(() => {
    // Mark hydrated after client mount — Zustand rehydrates from localStorage after mount
    setHydrated(true)
    fetch('/api/config').then(r => r.json()).then(setConfig).catch(() => {})
  }, [])

  // ── Loading (waiting for cart hydration) ──
  if (!hydrated && step === 'cart') {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader2 size={32} color="#FF9E00" className="animate-spin" />
        </div>
      </>
    )
  }

  // ── Empty cart ──
  if (items.length === 0 && step === 'cart') {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', paddingTop: '80px' }}>
          <span style={{ fontSize: '80px', marginBottom: '20px' }}>🛒</span>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#2E2A24', marginBottom: '8px' }}>Tu carrito está vacío</h1>
          <p style={{ color: '#6B6358', marginBottom: '28px' }}>Agrega tus tequeños favoritos para continuar</p>
          <Link href="/productos" style={{
            backgroundColor: '#FF9E00', color: 'white', fontWeight: 700,
            padding: '14px 32px', borderRadius: '999px', textDecoration: 'none',
          }}>
            Ver productos
          </Link>
        </div>
      </>
    )
  }

  // ── Zelle step ──
  if (step === 'zelle') {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', backgroundColor: '#FBF5E9', paddingTop: '80px', padding: '80px 16px 40px' }}>
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '60px', height: '60px', backgroundColor: '#F5F3FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Smartphone size={28} color="#7C3AED" />
                </div>
                <h2 style={{ fontWeight: 900, color: '#2E2A24', fontSize: '1.4rem', marginBottom: '6px' }}>Paga por Zelle</h2>
                <p style={{ color: '#6B6358', fontSize: '0.875rem' }}>
                  Pedido <strong style={{ color: '#FF9E00' }}>{orderNumber}</strong>
                </p>
              </div>

              <div style={{ backgroundColor: '#F5F3FF', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                {config?.zelle_name && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>Nombre</p>
                    <p style={{ fontWeight: 700, color: '#2E2A24' }}>{config.zelle_name}</p>
                  </div>
                )}
                {config?.zelle_recipient && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>Email / Teléfono</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <p style={{ fontWeight: 700, color: '#2E2A24', flex: 1 }}>{config.zelle_recipient}</p>
                      <button onClick={() => { navigator.clipboard.writeText(config!.zelle_recipient); setZelleCopied(true); setTimeout(() => setZelleCopied(false), 2000) }}
                        style={{ background: 'white', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}>
                        {zelleCopied ? <CheckCircle2 size={16} color="#22C55E" /> : <Copy size={16} color="#6B6358" />}
                      </button>
                    </div>
                  </div>
                )}
                <p style={{ fontSize: '0.82rem', color: '#7C3AED', fontWeight: 600 }}>
                  Envía exactamente <strong>{formatCurrency(total)}</strong> e incluye el número <strong>{orderNumber}</strong> en la nota.
                </p>
              </div>

              <button
                onClick={async () => {
                  setZelleLoading(true)
                  setError('')
                  try {
                    const res = await fetch('/api/orders/zelle', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ order_number: orderNumber }),
                    })
                    const data = await res.json()
                    if (!res.ok) throw new Error(data.error || 'Error')
                    router.push(`/confirmacion/${orderNumber}`)
                  } catch (e: unknown) {
                    setError(e instanceof Error ? e.message : 'Error')
                    setZelleLoading(false)
                  }
                }}
                disabled={zelleLoading}
                style={{
                  width: '100%', backgroundColor: '#7C3AED', color: 'white',
                  fontWeight: 700, fontSize: '1rem', padding: '15px', borderRadius: '14px',
                  border: 'none', cursor: zelleLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  opacity: zelleLoading ? 0.7 : 1,
                }}
              >
                {zelleLoading ? <><Loader2 size={18} className="animate-spin" /> Registrando...</> : <><CheckCircle2 size={18} /> Ya envié el Zelle</>}
              </button>
              {error && <p style={{ color: '#EF4444', fontSize: '0.8rem', marginTop: '8px', textAlign: 'center' }}>{error}</p>}
            </div>
          </div>
        </div>
      </>
    )
  }

  // ── Submit ──
  async function onSubmit(data: Form) {
    setSubmitting(true)
    setError('')
    try {
      // 1. Create order
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map(i => ({
            product_id: i.product.id,
            product_name: i.product.name,
            quantity: i.quantity,
            unit_price: i.product.price,
          })),
          pickup_date: config?.pickup_date,
          pickup_time_slot: config?.pickup_start_time ? `${config.pickup_start_time}–${config.pickup_end_time}` : null,
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Error al crear el pedido')

      setOrderNumber(result.order_number)

      // 2. Handle payment method
      if (payMethodRef.current === 'stripe') {
        const sr = await fetch('/api/stripe/create-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order_number: result.order_number }),
        })
        const sd = await sr.json()
        if (!sr.ok) throw new Error(sd.error || 'Stripe no está configurado. Usa Zelle.')
        clearCart() // only clear after Stripe session confirmed
        window.location.href = sd.url
      } else {
        clearCart() // clear cart then show Zelle instructions
        setStep('zelle')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al procesar el pedido')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Main cart + form layout ──
  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', backgroundColor: '#FBF5E9', paddingTop: '68px' }}>
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '32px 20px 80px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <Link href="/productos" style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', color: '#2E2A24', textDecoration: 'none' }}>
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#2E2A24', lineHeight: 1 }}>Tu pedido</h1>
              <p style={{ color: '#6B6358', fontSize: '0.85rem', marginTop: '3px' }}>{itemCount} {itemCount === 1 ? 'producto' : 'productos'}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }} className="cart-grid">

              {/* ── LEFT: items + form ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Items */}
                <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
                  <p style={{ fontWeight: 800, color: '#2E2A24', marginBottom: '16px', fontSize: '0.95rem' }}>Productos</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map(({ product, quantity }) => {
                      const photo = product.images?.[0] ?? product.image_url
                      return (
                        <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#FBF5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {photo ? <Image src={photo} alt={product.name} width={64} height={64} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '24px' }}>🧀</span>}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontWeight: 700, color: '#2E2A24', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                            <p style={{ color: '#FF9E00', fontWeight: 800, fontSize: '0.95rem' }}>{formatCurrency(product.price)}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1.5px solid #F0EDE8', borderRadius: '999px', overflow: 'hidden' }}>
                            <button type="button" onClick={() => updateQuantity(product.id, quantity - 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Minus size={12} color="#2E2A24" />
                            </button>
                            <span style={{ width: '28px', textAlign: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{quantity}</span>
                            <button type="button" onClick={() => updateQuantity(product.id, quantity + 1)} style={{ width: '32px', height: '32px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Plus size={12} color="#2E2A24" />
                            </button>
                          </div>
                          <p style={{ fontWeight: 800, color: '#2E2A24', fontSize: '0.9rem', minWidth: '56px', textAlign: 'right' }}>{formatCurrency(product.price * quantity)}</p>
                          <button type="button" onClick={() => removeItem(product.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#D1C9BE' }}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Customer form */}
                <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
                  <p style={{ fontWeight: 800, color: '#2E2A24', marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={16} color="#FF9E00" /> Tus datos
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Field label="Nombre completo *" error={errors.customer_name?.message}>
                      <input
                        {...register('customer_name')}
                        placeholder="María García"
                        style={{ width: '100%', border: `1.5px solid ${errors.customer_name ? '#FCA5A5' : '#E5E0D8'}`, borderRadius: '12px', padding: '11px 14px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}
                      />
                    </Field>
                    <Field label="WhatsApp / Teléfono *" error={errors.customer_phone?.message} icon={<Phone size={12} />}>
                      <input
                        {...register('customer_phone')}
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                        style={{ width: '100%', border: `1.5px solid ${errors.customer_phone ? '#FCA5A5' : '#E5E0D8'}`, borderRadius: '12px', padding: '11px 14px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}
                      />
                    </Field>
                  </div>
                </div>

                {/* Delivery method */}
                <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
                  <p style={{ fontWeight: 800, color: '#2E2A24', marginBottom: '16px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#FF9E00" /> Entrega
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                    {[
                      { val: 'pickup', emoji: '📍', label: 'Pickup', sub: config?.pickup_enabled ? 'Disponible' : 'No disponible', disabled: !config?.pickup_enabled },
                      { val: 'delivery', emoji: '🛵', label: 'Delivery', sub: config?.delivery_enabled ? `+${formatCurrency(config.delivery_fee ?? 0)}` : 'No disponible', disabled: !config?.delivery_enabled },
                    ].map(({ val, emoji, label, sub, disabled }) => (
                      <label key={val} style={{
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.45 : 1,
                        border: `2px solid ${deliveryMethod === val ? '#FF9E00' : '#F0EDE8'}`,
                        backgroundColor: deliveryMethod === val ? '#FFF8EE' : 'white',
                        borderRadius: '14px', padding: '14px', transition: 'all .2s',
                      }}>
                        <input type="radio" value={val} disabled={disabled} {...register('delivery_method')} onChange={() => setValue('delivery_method', val as 'pickup' | 'delivery')} style={{ display: 'none' }} />
                        <div style={{ fontSize: '20px', marginBottom: '6px' }}>{emoji}</div>
                        <p style={{ fontWeight: 700, color: '#2E2A24', fontSize: '0.88rem' }}>{label}</p>
                        <p style={{ color: deliveryMethod === val ? '#FF9E00' : '#6B6358', fontSize: '0.78rem', marginTop: '2px' }}>{sub}</p>
                      </label>
                    ))}
                  </div>

                  {deliveryMethod === 'pickup' && config?.pickup_enabled && (
                    <div style={{ backgroundColor: '#FFF8EE', borderRadius: '12px', padding: '14px', border: '1px solid rgba(255,158,0,.2)' }}>
                      <p style={{ fontWeight: 700, color: '#2E2A24', fontSize: '0.85rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} color="#FF9E00" /> Info del pickup
                      </p>
                      {config.pickup_date && <p style={{ fontSize: '0.82rem', color: '#6B6358' }}>📅 {config.pickup_date}</p>}
                      {config.pickup_start_time && <p style={{ fontSize: '0.82rem', color: '#6B6358' }}>🕐 {config.pickup_start_time} – {config.pickup_end_time}</p>}
                      {config.pickup_address && <p style={{ fontSize: '0.82rem', color: '#6B6358' }}>📍 {config.pickup_address}</p>}
                    </div>
                  )}

                  {deliveryMethod === 'delivery' && (
                    <Field label="Dirección de entrega *" error={errors.delivery_address?.message}>
                      <input
                        {...register('delivery_address')}
                        placeholder="123 Calle Principal, Ciudad"
                        style={{ width: '100%', border: `1.5px solid ${errors.delivery_address ? '#FCA5A5' : '#E5E0D8'}`, borderRadius: '12px', padding: '11px 14px', fontSize: '0.9rem', outline: 'none', backgroundColor: 'white', boxSizing: 'border-box' }}
                      />
                    </Field>
                  )}
                </div>

                {/* Note (optional) */}
                <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
                  <label style={{ fontWeight: 700, color: '#2E2A24', fontSize: '0.9rem', display: 'block', marginBottom: '8px' }}>
                    Nota adicional <span style={{ color: '#6B6358', fontWeight: 400, fontSize: '0.8rem' }}>(opcional)</span>
                  </label>
                  <textarea {...register('customer_note')} placeholder="Ej: sin sal, para una reunión, etc." rows={2} style={{ width: '100%', border: '1.5px solid #E5E0D8', borderRadius: '12px', padding: '11px 14px', fontSize: '0.9rem', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              {/* ── RIGHT: summary + payment ── */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'sticky', top: '84px' }}>

                {/* Order summary */}
                <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 12px rgba(0,0,0,.05)' }}>
                  <p style={{ fontWeight: 800, color: '#2E2A24', marginBottom: '16px', fontSize: '0.95rem' }}>Resumen</p>
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#6B6358' }}>
                      <span>{product.name} × {quantity}</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(product.price * quantity)}</span>
                    </div>
                  ))}
                  {deliveryFee > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem', color: '#6B6358' }}>
                      <span>Delivery</span>
                      <span style={{ fontWeight: 600 }}>{formatCurrency(deliveryFee)}</span>
                    </div>
                  )}
                  <div style={{ borderTop: '1.5px solid #F0EDE8', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 900, color: '#2E2A24', fontSize: '1rem' }}>Total</span>
                    <span style={{ fontWeight: 900, color: '#FF9E00', fontSize: '1.5rem' }}>{formatCurrency(total)}</span>
                  </div>
                </div>

                {error && (
                  <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '12px', padding: '12px', color: '#EF4444', fontSize: '0.85rem' }}>
                    {error}
                  </div>
                )}

                {/* Payment buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {config?.stripe_enabled && (
                    <button type="submit" disabled={submitting} onClick={() => { payMethodRef.current = 'stripe' }} style={{
                      width: '100%', backgroundColor: '#4F46E5', color: 'white',
                      fontWeight: 700, fontSize: '0.95rem', padding: '15px', borderRadius: '14px',
                      border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      opacity: submitting ? 0.7 : 1,
                    }}>
                      <CreditCard size={17} /> Pagar con tarjeta
                    </button>
                  )}

                  {config?.zelle_enabled && (
                    <button type="submit" disabled={submitting} onClick={() => { payMethodRef.current = 'zelle' }} style={{
                      width: '100%', backgroundColor: '#7C3AED', color: 'white',
                      fontWeight: 700, fontSize: '0.95rem', padding: '15px', borderRadius: '14px',
                      border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      opacity: submitting ? 0.7 : 1,
                    }}>
                      <Smartphone size={17} /> Pagar con Zelle
                    </button>
                  )}

                  {!config?.stripe_enabled && !config?.zelle_enabled && (
                    <button type="submit" disabled={submitting} onClick={() => { payMethodRef.current = 'zelle' }} style={{
                      width: '100%', backgroundColor: '#FF9E00', color: 'white',
                      fontWeight: 700, fontSize: '1rem', padding: '16px', borderRadius: '14px',
                      border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      opacity: submitting ? 0.7 : 1, boxShadow: '0 8px 30px rgba(255,158,0,.35)',
                    }}>
                      {submitting ? <><Loader2 size={18} className="animate-spin" /> Procesando...</> : <><ShoppingBag size={18} /> Confirmar pedido · {formatCurrency(total)}</>}
                    </button>
                  )}

                  <Link href="/productos" style={{ display: 'block', textAlign: 'center', color: '#6B6358', fontSize: '0.85rem', textDecoration: 'none', padding: '8px' }}>
                    ← Seguir comprando
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
