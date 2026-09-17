'use client'

import { useState, useEffect } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts'
import { DollarSign, ShoppingBag, XCircle, UserCog, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/utils'
import type { OrderStatus } from '@/lib/types'

// ── Dataviz tokens (dark admin surface) — see dataviz skill palette.md ──
const INK_PRIMARY = '#ffffff'
const INK_SECONDARY = '#c3c2b7'
const INK_MUTED = '#898781'
const GRID_LINE = '#2c2c2a'
const SERIES_BLUE = '#3987e5'      // sequential hue — ventas
const STATUS_CRITICAL = '#e66767'  // status palette, dark — cancelados

// Fixed categorical order (lifecycle) — validated: worst adjacent CVD ΔE 8.4, normal-vision 19.3 (dark)
const STATUS_COLORS: Record<OrderStatus, string> = {
  received: '#3987e5',       // slot 1 blue
  confirmed: '#d95926',      // slot 2 orange
  ready_for_pickup: '#199e70', // slot 3 aqua
  completed: '#c98500',      // slot 4 yellow
  cancelled: '#d55181',      // slot 5 magenta
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  received: 'Recibido',
  confirmed: 'Confirmado',
  ready_for_pickup: 'Listo',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

const DAYS = 30

interface OrderRow {
  order_status: OrderStatus
  total: number
  created_at: string
}

function lastNDays(n: number) {
  const days: string[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function StatTile({
  icon: Icon, label, value, accent,
}: { icon: React.ElementType; label: string; value: string; accent: string }) {
  return (
    <div className="bg-bocado-dark border border-white/5 rounded-2xl p-5 flex items-center gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${accent}1a` }}
      >
        <Icon size={20} style={{ color: accent }} />
      </div>
      <div className="min-w-0">
        <p className="text-white font-black text-xl leading-none truncate">{value}</p>
        <p className="text-gray-500 text-xs mt-1.5">{label}</p>
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
      <p className="text-white font-bold text-sm">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-0.5 mb-4">{subtitle}</p>}
      {!subtitle && <div className="mb-4" />}
      {children}
    </div>
  )
}

function TooltipCard({ active, payload, label, formatValue }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0d0d0d', border: '1px solid rgba(255,255,255,.1)',
      borderRadius: '10px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,.4)',
    }}>
      <p style={{ color: INK_MUTED, fontSize: '11px', marginBottom: '4px' }}>{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: INK_PRIMARY, fontSize: '13px', fontWeight: 700 }}>
          {formatValue ? formatValue(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [adminUserCount, setAdminUserCount] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const since = new Date()
      since.setDate(since.getDate() - DAYS)

      const [{ data: ordersData }, usersRes] = await Promise.all([
        supabase
          .from('orders')
          .select('order_status, total, created_at')
          .gte('created_at', since.toISOString()),
        fetch('/api/admin/users').then((r) => (r.ok ? r.json() : { users: [] })).catch(() => ({ users: [] })),
      ])

      setOrders(ordersData ?? [])
      setAdminUserCount(usersRes.users?.length ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="text-bocado-orange animate-spin" />
      </div>
    )
  }

  const days = lastNDays(DAYS)

  const salesByDay = days.map((date) => {
    const total = orders
      .filter((o) => o.created_at.slice(0, 10) === date && o.order_status !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.total), 0)
    return { date: date.slice(5).replace('-', '/'), total }
  })

  const cancelledByDay = days.map((date) => {
    const count = orders.filter(
      (o) => o.created_at.slice(0, 10) === date && o.order_status === 'cancelled'
    ).length
    return { date: date.slice(5).replace('-', '/'), count }
  })

  const statusOrder: OrderStatus[] = ['received', 'confirmed', 'ready_for_pickup', 'completed', 'cancelled']
  const ordersByStatus = statusOrder.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    count: orders.filter((o) => o.order_status === status).length,
  }))

  const totalSales = salesByDay.reduce((sum, d) => sum + d.total, 0)
  const totalOrders = orders.length
  const totalCancelled = orders.filter((o) => o.order_status === 'cancelled').length

  return (
    <div className="p-8 min-h-screen">
      <div className="mb-8">
        <h1 className="text-white font-black text-3xl">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Resumen de los últimos {DAYS} días</p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6 max-w-6xl">
        <StatTile icon={DollarSign} label="Ventas" value={formatCurrency(totalSales)} accent="#3987e5" />
        <StatTile icon={ShoppingBag} label="Pedidos" value={String(totalOrders)} accent="#199e70" />
        <StatTile icon={XCircle} label="Cancelados" value={String(totalCancelled)} accent={STATUS_CRITICAL} />
        <StatTile icon={UserCog} label="Usuarios administrativos" value={String(adminUserCount ?? 0)} accent="#c98500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 max-w-6xl">
        {/* Ventas en el tiempo */}
        <div className="xl:col-span-2">
          <ChartCard title="Ventas" subtitle={`Ingresos por día · últimos ${DAYS} días`}>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesByDay} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SERIES_BLUE} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={SERIES_BLUE} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID_LINE} vertical={false} />
                <XAxis dataKey="date" tick={{ fill: INK_MUTED, fontSize: 11 }} axisLine={{ stroke: GRID_LINE }} tickLine={false} interval={4} />
                <YAxis tick={{ fill: INK_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={48} />
                <Tooltip content={<TooltipCard formatValue={(v: number) => formatCurrency(v)} />} cursor={{ stroke: GRID_LINE }} />
                <Area type="monotone" dataKey="total" stroke={SERIES_BLUE} strokeWidth={2} fill="url(#salesFill)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Pedidos por estado */}
        <ChartCard title="Pedidos por estado" subtitle={`Últimos ${DAYS} días`}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ordersByStatus} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID_LINE} vertical={false} />
              <XAxis dataKey="label" tick={{ fill: INK_SECONDARY, fontSize: 11 }} axisLine={{ stroke: GRID_LINE }} tickLine={false} />
              <YAxis tick={{ fill: INK_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
              <Tooltip content={<TooltipCard />} cursor={{ fill: 'rgba(255,255,255,.04)' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} label={{ position: 'top', fill: INK_SECONDARY, fontSize: 11 }}>
                {ordersByStatus.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Cancelados en el tiempo */}
        <ChartCard title="Cancelados" subtitle={`Por día · últimos ${DAYS} días`}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={cancelledByDay} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="cancelFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={STATUS_CRITICAL} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={STATUS_CRITICAL} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={GRID_LINE} vertical={false} />
              <XAxis dataKey="date" tick={{ fill: INK_MUTED, fontSize: 11 }} axisLine={{ stroke: GRID_LINE }} tickLine={false} interval={4} />
              <YAxis tick={{ fill: INK_MUTED, fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} width={28} />
              <Tooltip content={<TooltipCard />} cursor={{ stroke: GRID_LINE }} />
              <Area type="monotone" dataKey="count" stroke={STATUS_CRITICAL} strokeWidth={2} fill="url(#cancelFill)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  )
}
