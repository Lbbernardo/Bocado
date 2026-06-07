import { Check, Clock } from 'lucide-react'
import type { OrderStatus } from '@/lib/types'
import { ORDER_STATUS_CONFIG } from '@/lib/types'

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'received', label: 'Pedido recibido' },
  { status: 'confirmed', label: 'Confirmado' },
  { status: 'payment_pending', label: 'Pago pendiente' },
  { status: 'payment_received', label: 'Pago recibido' },
  { status: 'in_preparation', label: 'En preparación' },
  { status: 'ready_for_pickup', label: 'Listo' },
  { status: 'delivered', label: 'Entregado' },
]

interface OrderTimelineProps {
  currentStatus: OrderStatus
}

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <span className="text-lg">✕</span>
        </div>
        <div>
          <p className="font-bold text-red-700">Pedido cancelado</p>
          <p className="text-red-500 text-sm">
            {ORDER_STATUS_CONFIG.cancelled.message}
          </p>
        </div>
      </div>
    )
  }

  const currentIndex = TIMELINE_STEPS.findIndex(
    (s) => s.status === currentStatus
  )

  return (
    <div className="space-y-1">
      {TIMELINE_STEPS.map((step, idx) => {
        const isDone = idx < currentIndex
        const isCurrent = idx === currentIndex
        const isPending = idx > currentIndex
        const config = ORDER_STATUS_CONFIG[step.status]

        return (
          <div key={step.status} className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  isDone
                    ? 'bg-green-500 border-green-500'
                    : isCurrent
                    ? 'border-bocado-orange'
                    : 'bg-transparent border-gray-200'
                }`}
                style={
                  isCurrent
                    ? { backgroundColor: config.bg, borderColor: config.color }
                    : {}
                }
              >
                {isDone ? (
                  <Check size={16} className="text-white" strokeWidth={3} />
                ) : isCurrent ? (
                  <Clock size={14} style={{ color: config.color }} />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-200" />
                )}
              </div>
              {idx < TIMELINE_STEPS.length - 1 && (
                <div
                  className={`w-0.5 h-6 mt-1 ${
                    isDone ? 'bg-green-300' : 'bg-gray-100'
                  }`}
                />
              )}
            </div>

            {/* Label */}
            <div className="pt-1.5">
              <p
                className={`text-sm font-semibold ${
                  isDone
                    ? 'text-green-600'
                    : isCurrent
                    ? 'text-bocado-dark'
                    : 'text-gray-300'
                }`}
              >
                {step.label}
              </p>
              {isCurrent && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {config.message}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
