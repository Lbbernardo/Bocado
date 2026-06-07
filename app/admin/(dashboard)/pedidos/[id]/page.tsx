'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Phone, Mail, MapPin, MessageSquare } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  ORDER_STATUS_CONFIG,
  ORDER_STATUS_FLOW,
  ORDER_STATUS_PREV,
  STATUS_ACTION_LABELS,
} from '@/lib/types'
import type { Order, OrderStatus } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PedidoDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [adminNote, setAdminNote] = useState('')

  useEffect(() => {
    fetchOrder()
  }, [id])

  async function fetchOrder() {
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', id)
      .single()
    setOrder(data)
    setAdminNote(data?.admin_note ?? '')
    setLoading(false)
  }

  async function changeStatus(newStatus: OrderStatus) {
    setUpdating(newStatus)
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        await fetchOrder()
      }
    } finally {
      setUpdating(null)
    }
  }

  async function saveAdminNote() {
    const supabase = createClient()
    await supabase.from('orders').update({ admin_note: adminNote }).eq('id', id)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="text-bocado-orange animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p className="text-xl font-bold mb-4">Pedido no encontrado</p>
        <Link href="/admin/pedidos" className="text-bocado-orange underline">
          Volver a pedidos
        </Link>
      </div>
    )
  }

  const statusCfg = ORDER_STATUS_CONFIG[order.order_status]
  const nextStatuses = ORDER_STATUS_FLOW[order.order_status] ?? []
  const prevStatus = ORDER_STATUS_PREV[order.order_status]

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/pedidos"
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-gray-500 text-sm">Detalle del pedido</p>
          <h1 className="text-white font-black text-2xl">
            {order.order_number}
          </h1>
        </div>
        <div className="ml-auto">
          <span
            className="font-bold px-4 py-2 rounded-full text-sm"
            style={{
              backgroundColor: statusCfg.color + '20',
              color: statusCfg.color,
            }}
          >
            {statusCfg.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: order info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Customer */}
          <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-4">Cliente</h2>
            <div className="space-y-3">
              <p className="text-white font-black text-lg">
                {order.customer_name}
              </p>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone size={14} />
                <a
                  href={`tel:${order.customer_phone}`}
                  className="hover:text-bocado-orange transition-colors"
                >
                  {order.customer_phone}
                </a>
              </div>
              {order.customer_email && (
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail size={14} />
                  <span>{order.customer_email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin size={14} />
                <span className="capitalize">
                  {order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'}
                  {order.delivery_address && ` — ${order.delivery_address}`}
                </span>
              </div>
              {order.pickup_date && (
                <p className="text-gray-400 text-sm pl-5">
                  📅 {formatDate(order.pickup_date)}
                  {order.pickup_time_slot && ` · ${order.pickup_time_slot}`}
                </p>
              )}
            </div>

            {order.customer_note && (
              <div className="mt-4 bg-white/5 rounded-xl p-3">
                <p className="text-gray-500 text-xs mb-1">Nota del cliente</p>
                <p className="text-gray-300 text-sm">{order.customer_note}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-4">Productos</h2>
            <div className="space-y-3">
              {order.order_items?.map((item: {
                id: string;
                product_name: string;
                quantity: number;
                unit_price: number;
                subtotal: number;
              }) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center py-2 border-b border-white/5 last:border-0"
                >
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {item.product_name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatCurrency(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <span className="text-white font-bold">
                    {formatCurrency(item.subtotal)}
                  </span>
                </div>
              ))}

              {order.delivery_fee > 0 && (
                <div className="flex justify-between text-sm text-gray-400 py-2 border-b border-white/5">
                  <span>Delivery</span>
                  <span>{formatCurrency(order.delivery_fee)}</span>
                </div>
              )}

              <div className="flex justify-between pt-2">
                <span className="text-white font-black">Total</span>
                <span className="text-bocado-orange font-black text-xl">
                  {formatCurrency(order.total)}
                </span>
              </div>
            </div>
          </div>

          {/* Admin note */}
          <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
            <h2 className="text-white font-bold mb-3 flex items-center gap-2">
              <MessageSquare size={16} className="text-bocado-orange" />
              Nota interna
            </h2>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              onBlur={saveAdminNote}
              rows={3}
              placeholder="Notas internas del pedido (no visibles para el cliente)..."
              className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors resize-none placeholder-gray-600"
            />
            <p className="text-gray-600 text-xs mt-2">
              Se guarda automáticamente al perder el foco
            </p>
          </div>
        </div>

        {/* Right: actions */}
        <div className="space-y-4">
          {/* Status card */}
          <div
            className="rounded-2xl p-5 border"
            style={{
              backgroundColor: statusCfg.color + '10',
              borderColor: statusCfg.color + '30',
            }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: statusCfg.color }}>
              Estado actual
            </p>
            <p className="text-white font-black text-xl">{statusCfg.label}</p>
            <p className="text-gray-400 text-xs mt-2">{statusCfg.message}</p>
          </div>

          {/* Action buttons */}
          {(nextStatuses.length > 0 || prevStatus) && (
            <div className="bg-bocado-dark border border-white/5 rounded-2xl p-5">
              <h2 className="text-white font-bold mb-4 text-sm uppercase tracking-wide">
                Acciones
              </h2>
              <div className="space-y-2">
                {nextStatuses.map((status) => {
                  const isCancelling = status === 'cancelled'
                  return (
                    <button
                      key={status}
                      onClick={() => changeStatus(status)}
                      disabled={!!updating}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 ${
                        isCancelling
                          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20'
                          : 'bg-bocado-orange hover:bg-orange-500 text-white'
                      }`}
                    >
                      <span>{STATUS_ACTION_LABELS[status] ?? status}</span>
                      {updating === status ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <span>{isCancelling ? '✕' : '→'}</span>
                      )}
                    </button>
                  )
                })}

                {prevStatus && (
                  <button
                    onClick={() => changeStatus(prevStatus)}
                    disabled={!!updating}
                    className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-60 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-gray-200 border border-white/10 mt-1"
                  >
                    <span>← Retroceder a {ORDER_STATUS_CONFIG[prevStatus].label}</span>
                    {updating === prevStatus && <Loader2 size={16} className="animate-spin" />}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Order meta */}
          <div className="bg-bocado-dark border border-white/5 rounded-2xl p-5 text-xs text-gray-500 space-y-2">
            <div className="flex justify-between">
              <span>Fecha del pedido</span>
              <span className="text-gray-300">{formatDate(order.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span>Método de entrega</span>
              <span className="text-gray-300 capitalize">{order.delivery_method}</span>
            </div>
            <div className="flex justify-between">
              <span>Método de pago</span>
              <span className="text-gray-300 capitalize">
                {order.payment_method === 'stripe'
                  ? '💳 Tarjeta (Stripe)'
                  : order.payment_method === 'zelle'
                  ? '📱 Zelle'
                  : '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estado de pago</span>
              <span className="text-gray-300">{order.payment_status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
