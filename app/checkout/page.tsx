'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Navbar from '@/components/Navbar'
import { useCart } from '@/store/cart'
import { formatCurrency } from '@/lib/utils'
import type { StoreConfig } from '@/lib/types'
import { ArrowLeft, User, Phone, Mail, MapPin, MessageSquare, Clock, Loader2 } from 'lucide-react'
import Link from 'next/link'

const checkoutSchema = z
  .object({
    customer_name: z.string().min(2, 'Nombre requerido (mínimo 2 caracteres)'),
    customer_phone: z
      .string()
      .min(7, 'Teléfono requerido')
      .regex(/^[\d\s\+\-\(\)]+$/, 'Teléfono inválido'),
    customer_email: z
      .string()
      .email('Email inválido')
      .optional()
      .or(z.literal('')),
    delivery_method: z.enum(['pickup', 'delivery']),
    delivery_address: z.string().optional(),
    customer_note: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.delivery_method === 'delivery') {
        return data.delivery_address && data.delivery_address.length > 5
      }
      return true
    },
    { message: 'Dirección requerida para delivery', path: ['delivery_address'] }
  )

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [config, setConfig] = useState<StoreConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [redirecting, setRedirecting] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { delivery_method: 'pickup' },
  })

  const deliveryMethod = watch('delivery_method')

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then(setConfig)
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (items.length === 0 && !redirecting) router.push('/productos')
  }, [items, router, redirecting])

  async function onSubmit(data: CheckoutForm) {
    setLoading(true)
    setError('')

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      }))

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: orderItems,
          pickup_date: config?.pickup_date,
          pickup_time_slot: config?.pickup_start_time
            ? `${config.pickup_start_time}–${config.pickup_end_time}`
            : null,
        }),
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.error || 'Error al crear el pedido')

      setRedirecting(true)
      clearCart()
      router.push(`/pago/${result.order_number}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) return null

  const deliveryFee =
    deliveryMethod === 'delivery' ? (config?.delivery_fee ?? 0) : 0
  const total = subtotal + deliveryFee

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', backgroundColor: '#FBF5E9', paddingTop: '68px' }}>
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/carrito"
              className="p-2 rounded-full hover:bg-white transition-colors text-gray-500"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-bocado-dark">
                Confirmar pedido
              </h1>
              <p className="text-gray-500 text-sm">Completa tus datos</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Personal data */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-bocado-dark text-lg mb-5 flex items-center gap-2">
                <User size={18} className="text-bocado-orange" />
                Tus datos
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    Nombre completo *
                  </label>
                  <input
                    {...register('customer_name')}
                    placeholder="María García"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bocado-orange transition-colors"
                  />
                  {errors.customer_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customer_name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5 flex items-center gap-1">
                    <Phone size={13} />
                    WhatsApp / Teléfono *
                  </label>
                  <input
                    {...register('customer_phone')}
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bocado-orange transition-colors"
                  />
                  {errors.customer_phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customer_phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5 flex items-center gap-1">
                    <Mail size={13} />
                    Email{' '}
                    <span className="text-gray-400 font-normal">(opcional)</span>
                  </label>
                  <input
                    {...register('customer_email')}
                    placeholder="maria@ejemplo.com"
                    type="email"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bocado-orange transition-colors"
                  />
                  {errors.customer_email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.customer_email.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-bocado-dark text-lg mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-bocado-orange" />
                Método de entrega
              </h2>

              <div className="grid grid-cols-2 gap-3">
                {/* Pickup */}
                <label
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-bocado-orange bg-bocado-cream'
                      : 'border-gray-200'
                  } ${!config?.pickup_enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    value="pickup"
                    disabled={!config?.pickup_enabled}
                    {...register('delivery_method')}
                    className="hidden"
                    onChange={() => setValue('delivery_method', 'pickup')}
                  />
                  <div className="text-2xl mb-2">📍</div>
                  <div className="font-bold text-bocado-dark text-sm">Pickup</div>
                  {config?.pickup_enabled ? (
                    <div className="text-bocado-orange text-xs mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      Disponible
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs mt-1">No disponible</div>
                  )}
                </label>

                {/* Delivery */}
                <label
                  className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                    deliveryMethod === 'delivery'
                      ? 'border-bocado-orange bg-bocado-cream'
                      : 'border-gray-200'
                  } ${!config?.delivery_enabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    value="delivery"
                    disabled={!config?.delivery_enabled}
                    {...register('delivery_method')}
                    className="hidden"
                    onChange={() => setValue('delivery_method', 'delivery')}
                  />
                  <div className="text-2xl mb-2">🛵</div>
                  <div className="font-bold text-bocado-dark text-sm">Delivery</div>
                  {config?.delivery_enabled ? (
                    <div className="text-bocado-orange text-xs mt-1">
                      +{formatCurrency(config.delivery_fee ?? 0)}
                    </div>
                  ) : (
                    <div className="text-gray-400 text-xs mt-1">No disponible</div>
                  )}
                </label>
              </div>

              {/* Pickup info */}
              {deliveryMethod === 'pickup' && config?.pickup_enabled && (
                <div className="mt-4 bg-bocado-cream rounded-xl p-4 border border-bocado-orange/20">
                  <p className="text-sm text-bocado-dark font-semibold mb-1">
                    📅 Info del pickup
                  </p>
                  {config.pickup_date && (
                    <p className="text-sm text-gray-600">
                      <strong>Fecha:</strong> {config.pickup_date}
                    </p>
                  )}
                  {config.pickup_start_time && (
                    <p className="text-sm text-gray-600">
                      <strong>Horario:</strong> {config.pickup_start_time} –{' '}
                      {config.pickup_end_time}
                    </p>
                  )}
                  {config.pickup_address && (
                    <p className="text-sm text-gray-600">
                      <strong>Dirección:</strong> {config.pickup_address}
                    </p>
                  )}
                </div>
              )}

              {/* Delivery address */}
              {deliveryMethod === 'delivery' && (
                <div className="mt-4">
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    Dirección de entrega *
                  </label>
                  <input
                    {...register('delivery_address')}
                    placeholder="123 Calle Principal, Ciudad, Estado"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bocado-orange transition-colors"
                  />
                  {errors.delivery_address && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.delivery_address.message}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <label className="font-bold text-bocado-dark flex items-center gap-2 mb-3">
                <MessageSquare size={18} className="text-bocado-orange" />
                Nota adicional{' '}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <textarea
                {...register('customer_note')}
                placeholder="Ej: sin sal, para una reunión de 20 personas, etc."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-bocado-orange transition-colors resize-none"
              />
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-bocado-dark text-lg mb-4">
                Resumen del pedido
              </h2>
              <div className="space-y-2 mb-4">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span>
                      {product.name} × {quantity}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(product.price * quantity)}
                    </span>
                  </div>
                ))}
                {deliveryFee > 0 && (
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold">
                      {formatCurrency(deliveryFee)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-black text-bocado-dark">Total</span>
                <span className="font-black text-bocado-orange text-xl">
                  {formatCurrency(total)}
                </span>
              </div>

              <div className="mt-4 bg-bocado-cream rounded-xl p-3 text-xs text-gray-600 text-center">
                💳 Al confirmar elegirás tu método de pago:{' '}
                <strong>Tarjeta (Stripe)</strong> o <strong>Zelle</strong>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bocado-orange hover:bg-orange-500 disabled:opacity-60 text-white font-black text-xl py-5 rounded-2xl transition-all duration-200 hover:shadow-bocado flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 size={22} className="animate-spin" />
                  Procesando...
                </>
              ) : (
                'Confirmar mi pedido →'
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
