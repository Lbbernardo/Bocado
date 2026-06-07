'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Phone, Mail, ShoppingBag, TrendingUp,
  Calendar, MapPin, ChevronDown, ChevronUp, Package
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ORDER_STATUS_CONFIG } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface OrderItem {
  id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface CustomerOrder {
  id: string
  order_number: string
  order_status: string
  total: number
  subtotal: number
  delivery_fee: number
  created_at: string
  delivery_method: string
  delivery_address: string | null
  pickup_date: string | null
  pickup_time_slot: string | null
  customer_note: string | null
  order_items: OrderItem[]
}

interface CustomerInfo {
  customer_name: string
  customer_phone: string
  customer_email: string | null
}

export default function ClienteDetailPage() {
  const { phone } = useParams()
  const decodedPhone = decodeURIComponent(phone as string)

  const [customer, setCustomer] = useState<CustomerInfo | null>(null)
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_phone', decodedPhone)
      .order('created_at', { ascending: false })

    if (!data || data.length === 0) { setLoading(false); return }

    setCustomer({
      customer_name: data[0].customer_name,
      customer_phone: data[0].customer_phone,
      customer_email: data[0].customer_email,
    })
    setOrders(data)
    setLoading(false)
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const activeOrders = orders.filter(
    (o) => !['delivered', 'cancelled'].includes(o.order_status)
  ).length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-bocado-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500 mb-4">Cliente no encontrado</p>
        <Link href="/admin/clientes" className="text-bocado-orange hover:underline">
          ← Volver a clientes
        </Link>
      </div>
    )
  }

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/clientes"
          className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <p className="text-gray-500 text-sm">Historial del cliente</p>
          <h1 className="text-white font-black text-2xl">{customer.customer_name}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Customer info */}
        <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-bocado-orange/15 flex items-center justify-center flex-shrink-0">
              <span className="text-bocado-orange font-black text-2xl">
                {customer.customer_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-black text-lg leading-tight">{customer.customer_name}</p>
              {activeOrders > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bocado-orange/20 text-bocado-orange">
                  {activeOrders} pedido{activeOrders !== 1 ? 's' : ''} activo{activeOrders !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 text-gray-400 text-sm">
              <Phone size={14} className="flex-shrink-0" />
              <a href={`tel:${customer.customer_phone}`} className="hover:text-bocado-orange transition-colors">
                {customer.customer_phone}
              </a>
            </div>
            {customer.customer_email && (
              <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                <Mail size={14} className="flex-shrink-0" />
                <span>{customer.customer_email}</span>
              </div>
            )}
            {orders.length > 0 && (
              <div className="flex items-center gap-2.5 text-gray-400 text-sm">
                <Calendar size={14} className="flex-shrink-0" />
                <span>Cliente desde {formatDate(orders[orders.length - 1].created_at)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <TrendingUp size={14} />
            Total gastado
          </div>
          <p className="text-bocado-orange font-black text-3xl">{formatCurrency(totalSpent)}</p>
        </div>

        <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <ShoppingBag size={14} />
            Total de pedidos
          </div>
          <p className="text-white font-black text-3xl">{orders.length}</p>
          {orders.length > 0 && (
            <p className="text-gray-600 text-xs mt-1">
              Último: {formatDate(orders[0].created_at)}
            </p>
          )}
        </div>
      </div>

      {/* Order history */}
      <h2 className="text-white font-black text-lg mb-4">Historial de pedidos</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <Package size={40} className="mx-auto mb-3 opacity-40" />
          <p>Sin pedidos registrados</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order, index) => {
            const statusKey = order.order_status as keyof typeof ORDER_STATUS_CONFIG
            const status = ORDER_STATUS_CONFIG[statusKey]
            const isOpen = expanded === order.id
            const isLatest = index === 0

            return (
              <div
                key={order.id}
                className="bg-bocado-dark border border-white/5 rounded-2xl overflow-hidden"
              >
                {/* Order header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                  className="w-full flex items-center gap-4 p-5 hover:bg-white/3 transition-colors text-left"
                >
                  {/* Status bar */}
                  <div
                    className="w-1 self-stretch rounded-full flex-shrink-0"
                    style={{ backgroundColor: status?.color ?? '#444' }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-black">{order.order_number}</span>
                      {isLatest && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-gray-400">
                          Más reciente
                        </span>
                      )}
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: (status?.color ?? '#444') + '20',
                          color: status?.color ?? '#888',
                        }}
                      >
                        {status?.label ?? order.order_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      <span>{formatDate(order.created_at)}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={10} />
                        {order.delivery_method === 'pickup' ? 'Retiro' : 'Delivery'}
                      </span>
                      <span>·</span>
                      <span>{order.order_items?.length ?? 0} ítem{(order.order_items?.length ?? 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-bocado-orange font-black">{formatCurrency(order.total)}</span>
                    {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                  </div>
                </button>

                {/* Order detail */}
                {isOpen && (
                  <div className="border-t border-white/5 px-6 py-4 space-y-4">
                    {/* Items */}
                    <div>
                      <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-3">Productos</p>
                      <div className="space-y-2">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center justify-between">
                            <div>
                              <p className="text-white text-sm font-semibold">{item.product_name}</p>
                              <p className="text-gray-600 text-xs">{formatCurrency(item.unit_price)} × {item.quantity}</p>
                            </div>
                            <span className="text-gray-300 font-bold text-sm">{formatCurrency(item.subtotal)}</span>
                          </div>
                        ))}
                        {order.delivery_fee > 0 && (
                          <div className="flex justify-between text-xs text-gray-500 pt-1 border-t border-white/5">
                            <span>Delivery</span>
                            <span>{formatCurrency(order.delivery_fee)}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-white/5">
                          <span className="text-white font-bold text-sm">Total</span>
                          <span className="text-bocado-orange font-black">{formatCurrency(order.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes + link */}
                    <div className="flex items-center justify-between pt-1">
                      {order.customer_note && (
                        <p className="text-gray-500 text-xs italic">"{order.customer_note}"</p>
                      )}
                      <Link
                        href={`/admin/pedidos/${order.id}`}
                        className="ml-auto text-xs font-bold text-bocado-orange hover:underline"
                      >
                        Ver pedido completo →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
