import { createClient } from '@/lib/supabase/server'
import { ORDER_STATUS_CONFIG } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Package, ChevronRight, RefreshCw } from 'lucide-react'

export const revalidate = 0

const STATUS_FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'received', label: 'Nuevos' },
  { key: 'confirmed', label: 'Confirmados' },
  { key: 'payment_pending', label: 'Pago pendiente' },
  { key: 'payment_received', label: 'Pago recibido' },
  { key: 'in_preparation', label: 'Preparación' },
  { key: 'ready_for_pickup', label: 'Listos' },
  { key: 'delivered', label: 'Entregados' },
  { key: 'cancelled', label: 'Cancelados' },
] as const

interface Props {
  searchParams: { status?: string }
}

export default async function PedidosAdminPage({ searchParams }: Props) {
  const supabase = createClient()
  const activeFilter = searchParams.status ?? 'all'

  let query = supabase
    .from('orders')
    .select('*, order_items(product_name, quantity)')
    .order('created_at', { ascending: false })

  if (activeFilter !== 'all') {
    query = query.eq('order_status', activeFilter)
  }

  const { data: orders, error } = await query

  // Count by status for badges
  const { data: counts } = await supabase
    .from('orders')
    .select('order_status')

  const countByStatus = counts?.reduce(
    (acc: Record<string, number>, o) => {
      acc[o.order_status] = (acc[o.order_status] ?? 0) + 1
      return acc
    },
    {}
  ) ?? {}

  const newOrders = countByStatus['received'] ?? 0

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-3xl">Pedidos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {orders?.length ?? 0} pedidos{' '}
            {activeFilter !== 'all' ? `· filtro: ${activeFilter}` : 'en total'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {newOrders > 0 && (
            <div className="flex items-center gap-2 bg-bocado-orange/10 border border-bocado-orange/20 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-bocado-orange rounded-full animate-pulse" />
              <span className="text-bocado-orange text-sm font-bold">
                {newOrders} nuevo{newOrders !== 1 ? 's' : ''}
              </span>
            </div>
          )}
          <Link
            href="/admin/pedidos"
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all"
          >
            <RefreshCw size={18} />
          </Link>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        {STATUS_FILTERS.map(({ key, label }) => {
          const count = key === 'all'
            ? (counts?.length ?? 0)
            : (countByStatus[key] ?? 0)
          const active = activeFilter === key
          return (
            <Link
              key={key}
              href={`/admin/pedidos${key !== 'all' ? `?status=${key}` : ''}`}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                active
                  ? 'bg-bocado-orange text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-gray-200'
              }`}
            >
              {label}
              {count > 0 && (
                <span
                  className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                    active ? 'bg-white/20 text-white' : 'bg-white/10 text-gray-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Orders list */}
      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-red-400">
          Error al cargar pedidos. Revisa la conexión a la base de datos.
        </div>
      ) : orders?.length === 0 ? (
        <div className="text-center py-24">
          <Package size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">No hay pedidos aquí</p>
          <p className="text-gray-600 text-sm">
            {activeFilter !== 'all'
              ? 'Prueba cambiando el filtro'
              : 'Cuando lleguen pedidos, aparecerán aquí'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders?.map((order) => {
            const statusCfg = ORDER_STATUS_CONFIG[order.order_status as keyof typeof ORDER_STATUS_CONFIG]
            const itemsSummary = order.order_items
              ?.map((i: { product_name: string; quantity: number }) => `${i.product_name} ×${i.quantity}`)
              .join(', ')

            return (
              <Link
                key={order.id}
                href={`/admin/pedidos/${order.id}`}
                className="bg-bocado-dark border border-white/5 hover:border-bocado-orange/30 rounded-2xl p-5 flex items-center gap-4 transition-all duration-200 group block"
              >
                {/* Status indicator */}
                <div
                  className="w-2 h-full min-h-[60px] rounded-full flex-shrink-0"
                  style={{ backgroundColor: statusCfg?.color }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-bocado-orange font-black text-sm">
                      {order.order_number}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatDate(order.created_at)}
                    </span>
                  </div>

                  <p className="text-white font-semibold truncate">
                    {order.customer_name}
                  </p>
                  <p className="text-gray-500 text-xs truncate mt-0.5">
                    {itemsSummary}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="font-black text-white">
                    {formatCurrency(order.total)}
                  </span>
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: statusCfg?.color + '20',
                      color: statusCfg?.color,
                    }}
                  >
                    {statusCfg?.label}
                  </span>
                </div>

                <ChevronRight
                  size={18}
                  className="text-gray-600 group-hover:text-gray-300 transition-colors flex-shrink-0"
                />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
