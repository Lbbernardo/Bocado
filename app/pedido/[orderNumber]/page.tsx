import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Package, User, Phone, MapPin } from 'lucide-react'
import Navbar from '@/components/Navbar'
import OrderTimeline from '@/components/OrderTimeline'
import { createClient } from '@/lib/supabase/server'
import { ORDER_STATUS_CONFIG } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'

interface Props {
  params: { orderNumber: string }
}

export const revalidate = 30

export default async function PedidoPage({ params }: Props) {
  const supabase = createClient()

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', params.orderNumber)
    .single()

  if (!order) notFound()

  const statusConfig = ORDER_STATUS_CONFIG[order.order_status as keyof typeof ORDER_STATUS_CONFIG]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bocado-cream pt-16">
        <div className="max-w-2xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-white transition-colors text-gray-500"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <p className="text-gray-500 text-sm">Pedido</p>
              <h1 className="text-2xl font-black text-bocado-orange">
                {order.order_number}
              </h1>
            </div>
          </div>

          {/* Status banner */}
          <div
            className="rounded-2xl p-5 mb-5 border"
            style={{
              backgroundColor: statusConfig.bg,
              borderColor: statusConfig.color + '30',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-3 h-3 rounded-full animate-pulse-slow"
                style={{ backgroundColor: statusConfig.color }}
              />
              <span
                className="font-black text-lg"
                style={{ color: statusConfig.color }}
              >
                {statusConfig.label}
              </span>
            </div>
            <p className="text-gray-600 text-sm">{statusConfig.message}</p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Timeline */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-bocado-dark mb-5 flex items-center gap-2">
                <Package size={18} className="text-bocado-orange" />
                Estado del pedido
              </h2>
              <OrderTimeline currentStatus={order.order_status} />
            </div>

            {/* Items */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-bocado-dark mb-4">
                Productos pedidos
              </h2>
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
                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <p className="font-semibold text-bocado-dark text-sm">
                        {item.product_name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatCurrency(item.unit_price)} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-bocado-dark">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}

                {order.delivery_fee > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-50">
                    <p className="text-gray-500 text-sm">Delivery</p>
                    <span className="font-semibold text-gray-500">
                      {formatCurrency(order.delivery_fee)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2">
                  <p className="font-black text-bocado-dark">Total</p>
                  <span className="font-black text-bocado-orange text-xl">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-black text-bocado-dark mb-4">
                Información del pedido
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600">{order.customer_phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="text-gray-600 capitalize">
                    {order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'}
                    {order.delivery_address && ` — ${order.delivery_address}`}
                  </span>
                </div>
                {order.pickup_date && (
                  <div className="text-sm text-gray-600 pl-7">
                    📅 {formatDate(order.pickup_date)}
                    {order.pickup_time_slot && ` · ${order.pickup_time_slot}`}
                  </div>
                )}
                <div className="text-xs text-gray-400 pl-7">
                  Pedido el {formatDate(order.created_at)}
                </div>
              </div>

              {order.customer_note && (
                <div className="mt-4 bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-1">
                    Nota del pedido
                  </p>
                  <p className="text-sm text-gray-600">{order.customer_note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Refresh hint */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Esta página se actualiza automáticamente ·{' '}
            <button
              onClick={() => window.location.reload()}
              className="text-bocado-orange underline"
            >
              Actualizar ahora
            </button>
          </p>
        </div>
      </div>
    </>
  )
}
