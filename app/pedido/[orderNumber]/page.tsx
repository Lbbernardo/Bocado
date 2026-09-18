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

const cardStyle: React.CSSProperties = {
  backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,.05)',
}

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
      <div style={{ minHeight: '100vh', backgroundColor: '#FBF5E9', paddingTop: '68px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 20px 80px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Link href="/" style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', color: '#2E2A24', textDecoration: 'none' }}>
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p style={{ color: '#6B6358', fontSize: '0.82rem' }}>Pedido</p>
              <h1 style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 900, fontSize: '1.5rem', color: '#FF9E00', lineHeight: 1 }}>
                {order.order_number}
              </h1>
            </div>
          </div>

          {/* Status banner */}
          <div style={{
            borderRadius: '20px', padding: '20px', marginBottom: '16px', border: `1px solid ${statusConfig.color}30`,
            backgroundColor: statusConfig.bg,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: statusConfig.color }} className="animate-pulse-slow" />
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: statusConfig.color }}>
                {statusConfig.label}
              </span>
            </div>
            <p style={{ color: '#6B6358', fontSize: '0.88rem' }}>{statusConfig.message}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Timeline */}
            <div style={cardStyle}>
              <h2 style={{ fontWeight: 800, color: '#2E2A24', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
                <Package size={17} color="#FF9E00" />
                Estado del pedido
              </h2>
              <OrderTimeline currentStatus={order.order_status} />
            </div>

            {/* Items */}
            <div style={cardStyle}>
              <h2 style={{ fontWeight: 800, color: '#2E2A24', marginBottom: '14px', fontSize: '0.95rem' }}>
                Productos pedidos
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {order.order_items?.map((item: {
                  id: string;
                  product_name: string;
                  quantity: number;
                  unit_price: number;
                  subtotal: number;
                }) => (
                  <div
                    key={item.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F2EC' }}
                  >
                    <div>
                      <p style={{ fontWeight: 700, color: '#2E2A24', fontSize: '0.88rem' }}>
                        {item.product_name}
                      </p>
                      <p style={{ color: '#A39C8F', fontSize: '0.78rem' }}>
                        {formatCurrency(item.unit_price)} × {item.quantity}
                      </p>
                    </div>
                    <span style={{ fontWeight: 800, color: '#2E2A24', fontSize: '0.9rem' }}>
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}

                {order.delivery_fee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #F5F2EC' }}>
                    <p style={{ color: '#6B6358', fontSize: '0.88rem' }}>Delivery</p>
                    <span style={{ fontWeight: 600, color: '#6B6358', fontSize: '0.9rem' }}>
                      {formatCurrency(order.delivery_fee)}
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px' }}>
                  <p style={{ fontWeight: 900, color: '#2E2A24' }}>Total</p>
                  <span style={{ fontWeight: 900, color: '#FF9E00', fontSize: '1.3rem' }}>
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer info */}
            <div style={cardStyle}>
              <h2 style={{ fontWeight: 800, color: '#2E2A24', marginBottom: '14px', fontSize: '0.95rem' }}>
                Información del pedido
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                  <User size={16} color="#D1C9BE" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#6B6358' }}>{order.customer_name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                  <Phone size={16} color="#D1C9BE" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#6B6358' }}>{order.customer_phone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                  <MapPin size={16} color="#D1C9BE" style={{ flexShrink: 0 }} />
                  <span style={{ color: '#6B6358', textTransform: 'capitalize' }}>
                    {order.delivery_method === 'pickup' ? 'Pickup' : 'Delivery'}
                    {order.delivery_address && ` — ${order.delivery_address}`}
                  </span>
                </div>
                {order.pickup_date && (
                  <div style={{ fontSize: '0.85rem', color: '#6B6358', paddingLeft: '26px' }}>
                    📅 {formatDate(order.pickup_date)}
                    {order.pickup_time_slot && ` · ${order.pickup_time_slot}`}
                  </div>
                )}
                <div style={{ fontSize: '0.78rem', color: '#A39C8F', paddingLeft: '26px' }}>
                  Pedido el {formatDate(order.created_at)}
                </div>
              </div>

              {order.customer_note && (
                <div style={{ marginTop: '16px', backgroundColor: '#FBF5E9', borderRadius: '14px', padding: '14px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B6358', marginBottom: '4px' }}>
                    Nota del pedido
                  </p>
                  <p style={{ color: '#6B6358', fontSize: '0.85rem' }}>{order.customer_note}</p>
                </div>
              )}
            </div>
          </div>

          {/* Refresh hint */}
          <p style={{ textAlign: 'center', color: '#A39C8F', fontSize: '0.78rem', marginTop: '28px' }}>
            Esta página se actualiza automáticamente ·{' '}
            <a
              href={`/pedido/${order.order_number}`}
              style={{ color: '#FF9E00', textDecoration: 'underline' }}
            >
              Actualizar ahora
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
