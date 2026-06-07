'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import type { Order, StoreConfig } from '@/lib/types'
import {
  CreditCard,
  Smartphone,
  Loader2,
  CheckCircle2,
  Copy,
  AlertCircle,
} from 'lucide-react'

export default function PagoPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const router = useRouter()
  const searchParams = useSearchParams()
  const cancelled = searchParams.get('cancelled')

  const [order, setOrder] = useState<Order | null>(null)
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [zelleLoading, setZelleLoading] = useState(false)
  const [stripeLoading, setStripeLoading] = useState(false)
  const [zelleCopied, setZelleCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const [{ data: orderData }, configRes] = await Promise.all([
        supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('order_number', orderNumber)
          .single(),
        fetch('/api/config').then((r) => r.json()),
      ])
      setOrder(orderData)
      setConfig(configRes)
      setLoading(false)
    }
    load()
  }, [orderNumber])

  async function handleStripe() {
    setStripeLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear sesión de pago')
      window.location.href = data.url
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al conectar con Stripe')
      setStripeLoading(false)
    }
  }

  async function handleZellePaid() {
    setZelleLoading(true)
    setError('')
    try {
      const res = await fetch('/api/orders/zelle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_number: orderNumber }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al registrar el pago')
      router.push(`/confirmacion/${orderNumber}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al procesar')
      setZelleLoading(false)
    }
  }

  function copyZelle() {
    if (config?.zelle_recipient) {
      navigator.clipboard.writeText(config.zelle_recipient)
      setZelleCopied(true)
      setTimeout(() => setZelleCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bocado-cream flex items-center justify-center">
        <Loader2 size={32} className="text-bocado-orange animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-bocado-cream flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl font-bold text-bocado-dark mb-2">Pedido no encontrado</p>
          <p className="text-gray-500 text-sm">Verifica el número de pedido</p>
        </div>
      </div>
    )
  }

  const alreadyPaid = order.order_status !== 'received'

  if (alreadyPaid) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-bocado-cream flex items-center justify-center p-4 pt-16">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm text-center">
            <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-black text-bocado-dark mb-2">
              Pago ya registrado
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Tu pedido <span className="font-bold text-bocado-orange">{orderNumber}</span> ya
              tiene un pago registrado.
            </p>
            <button
              onClick={() => router.push(`/pedido/${orderNumber}`)}
              className="w-full bg-bocado-orange hover:bg-orange-500 text-white font-bold py-4 rounded-2xl transition-all"
            >
              Ver estado del pedido
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bocado-cream pt-16">
        <div className="max-w-lg mx-auto px-4 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-bocado-yellow text-xs tracking-[0.25em] uppercase font-bold mb-2">
              · BOCADO ·
            </div>
            <h1 className="text-3xl font-black text-bocado-dark">Elige cómo pagar</h1>
            <p className="text-gray-500 text-sm mt-1">
              Pedido{' '}
              <span className="font-bold text-bocado-orange">{orderNumber}</span>
            </p>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-5">
            <h2 className="font-bold text-bocado-dark text-sm uppercase tracking-wide mb-3">
              Resumen
            </h2>
            <div className="space-y-1.5 mb-3">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="font-semibold">{formatCurrency(item.subtotal)}</span>
                </div>
              ))}
              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery</span>
                  <span className="font-semibold">{formatCurrency(order.delivery_fee)}</span>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="font-black text-bocado-dark">Total a pagar</span>
              <span className="font-black text-bocado-orange text-xl">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>

          {cancelled && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
              <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-amber-700 text-sm">
                El pago fue cancelado. Puedes intentarlo de nuevo o elegir otro método.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-5">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Payment options */}
          <div className="space-y-4">
            {/* Stripe */}
            {config?.stripe_enabled && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-bocado-orange/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <CreditCard size={20} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-black text-bocado-dark">Tarjeta de crédito/débito</p>
                    <p className="text-gray-400 text-xs">Pago seguro con Stripe</p>
                  </div>
                  <div className="ml-auto flex gap-1">
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded font-mono">VISA</span>
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded font-mono">MC</span>
                  </div>
                </div>
                <button
                  onClick={handleStripe}
                  disabled={stripeLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {stripeLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Redirigiendo...
                    </>
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Pagar {formatCurrency(order.total)} con tarjeta
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Zelle */}
            {config?.zelle_enabled && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-bocado-orange/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Smartphone size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-black text-bocado-dark">Zelle</p>
                    <p className="text-gray-400 text-xs">Transferencia directa</p>
                  </div>
                </div>

                {/* Zelle info */}
                <div className="bg-purple-50 rounded-xl p-4 mb-4 space-y-2">
                  {config.zelle_name && (
                    <div>
                      <p className="text-purple-600 text-xs font-medium">Nombre</p>
                      <p className="text-bocado-dark font-bold text-sm">{config.zelle_name}</p>
                    </div>
                  )}
                  {config.zelle_recipient && (
                    <div>
                      <p className="text-purple-600 text-xs font-medium">
                        Email / Teléfono
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="text-bocado-dark font-bold text-sm flex-1">
                          {config.zelle_recipient}
                        </p>
                        <button
                          onClick={copyZelle}
                          className="p-1.5 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                        >
                          {zelleCopied ? (
                            <CheckCircle2 size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                  <p className="text-purple-700 text-xs mt-1">
                    Envía exactamente{' '}
                    <strong>{formatCurrency(order.total)}</strong> e incluye
                    tu número de pedido <strong>{orderNumber}</strong> en la nota.
                  </p>
                </div>

                <button
                  onClick={handleZellePaid}
                  disabled={zelleLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  {zelleLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Ya envié el pago por Zelle
                    </>
                  )}
                </button>
              </div>
            )}

            {!config?.stripe_enabled && !config?.zelle_enabled && (
              <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                <p className="text-gray-500 text-sm">
                  No hay métodos de pago activos. Contáctanos por WhatsApp para coordinar el pago.
                </p>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            ¿Tienes preguntas? Contáctanos por WhatsApp
          </p>
        </div>
      </div>
    </>
  )
}
