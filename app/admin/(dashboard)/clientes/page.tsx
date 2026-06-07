'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ORDER_STATUS_CONFIG } from '@/lib/types'
import { Phone, Mail, ShoppingBag, ChevronDown, ChevronUp, Search, Users } from 'lucide-react'
import Link from 'next/link'

interface CustomerOrder {
  id: string
  order_number: string
  order_status: string
  total: number
  created_at: string
  delivery_method: string
  items_count: number
}

interface Customer {
  customer_phone: string
  customer_name: string
  customer_email: string | null
  orders: CustomerOrder[]
  total_spent: number
  last_order_at: string
}

export default function ClientesPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetchCustomers()
  }, [])

  async function fetchCustomers() {
    const supabase = createClient()
    const { data: orders } = await supabase
      .from('orders')
      .select(`
        id, order_number, order_status, total, created_at,
        delivery_method, customer_name, customer_phone, customer_email,
        order_items(id)
      `)
      .order('created_at', { ascending: false })

    if (!orders) { setLoading(false); return }

    const map = new Map<string, Customer>()

    for (const order of orders) {
      const phone = order.customer_phone
      if (!map.has(phone)) {
        map.set(phone, {
          customer_phone: phone,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          orders: [],
          total_spent: 0,
          last_order_at: order.created_at,
        })
      }
      const customer = map.get(phone)!
      customer.orders.push({
        id: order.id,
        order_number: order.order_number,
        order_status: order.order_status,
        total: order.total,
        created_at: order.created_at,
        delivery_method: order.delivery_method,
        items_count: Array.isArray(order.order_items) ? order.order_items.length : 0,
      })
      customer.total_spent += order.total
    }

    const sorted = Array.from(map.values()).sort(
      (a, b) => new Date(b.last_order_at).getTime() - new Date(a.last_order_at).getTime()
    )
    setCustomers(sorted)
    setLoading(false)
  }

  const filtered = customers.filter(
    (c) =>
      c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_phone.includes(search) ||
      c.customer_email?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-bocado-orange border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-3xl">Clientes</h1>
          <p className="text-gray-500 text-sm mt-1">
            {customers.length} clientes registrados
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, teléfono o email..."
          className="w-full bg-bocado-darker border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 outline-none focus:border-bocado-orange/40 transition-colors"
        />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-24">
          <Users size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-500 font-semibold">
            {search ? 'Sin resultados' : 'Aún no hay clientes'}
          </p>
        </div>
      )}

      {/* Customers list */}
      <div className="space-y-3">
        {filtered.map((customer) => {
          const isOpen = expanded === customer.customer_phone
          const activeOrder = customer.orders.find(
            (o) => !['delivered', 'cancelled'].includes(o.order_status)
          )

          return (
            <div
              key={customer.customer_phone}
              className="bg-bocado-darker border border-white/5 rounded-2xl overflow-hidden"
            >
              {/* Customer row */}
              <button
                onClick={() => setExpanded(isOpen ? null : customer.customer_phone)}
                className="w-full flex items-center gap-4 p-5 hover:bg-white/3 transition-colors text-left"
              >
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-bocado-orange/15 flex items-center justify-center flex-shrink-0">
                  <span className="text-bocado-orange font-black text-lg">
                    {customer.customer_name.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-bold">{customer.customer_name}</p>
                    {activeOrder && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-bocado-orange/20 text-bocado-orange">
                        Pedido activo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-gray-500 text-xs">
                      <Phone size={11} />
                      {customer.customer_phone}
                    </span>
                    {customer.customer_email && (
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
                        <Mail size={11} />
                        {customer.customer_email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-bocado-orange font-black">
                    {formatCurrency(customer.total_spent)}
                  </p>
                  <p className="text-gray-600 text-xs flex items-center gap-1 justify-end">
                    <ShoppingBag size={11} />
                    {customer.orders.length} pedido{customer.orders.length !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex-shrink-0 text-gray-600">
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </button>

              {/* Orders list */}
              {isOpen && (
                <div className="border-t border-white/5">
                  <div className="divide-y divide-white/5">
                    {customer.orders.map((order) => {
                      const statusKey = order.order_status as keyof typeof ORDER_STATUS_CONFIG
                      const status = ORDER_STATUS_CONFIG[statusKey]
                      return (
                        <Link
                          key={order.id}
                          href={`/admin/pedidos/${order.id}`}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/3 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold text-sm">
                                {order.order_number}
                              </span>
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
                            <p className="text-gray-600 text-xs mt-0.5">
                              {formatDate(order.created_at)} ·{' '}
                              {order.delivery_method === 'pickup' ? 'Retiro' : 'Delivery'} ·{' '}
                              {order.items_count} ítem{order.items_count !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <span className="text-bocado-orange font-black text-sm flex-shrink-0">
                            {formatCurrency(order.total)}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                  <div className="px-5 py-3 border-t border-white/5">
                    <Link
                      href={`/admin/clientes/${encodeURIComponent(customer.customer_phone)}`}
                      className="text-xs font-bold text-bocado-orange hover:underline"
                    >
                      Ver historial completo →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
