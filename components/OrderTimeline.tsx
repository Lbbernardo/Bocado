import { Check, Clock } from 'lucide-react'
import type { OrderStatus } from '@/lib/types'
import { ORDER_STATUS_CONFIG } from '@/lib/types'

const TIMELINE_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'received', label: 'Pedido recibido' },
  { status: 'confirmed', label: 'Confirmado' },
  { status: 'ready_for_pickup', label: 'Listo para recoger' },
  { status: 'completed', label: 'Completado' },
]

interface OrderTimelineProps {
  currentStatus: OrderStatus
}

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  if (currentStatus === 'cancelled') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: '16px', padding: '16px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '18px' }}>✕</span>
        </div>
        <div>
          <p style={{ fontWeight: 700, color: '#B91C1C' }}>Pedido cancelado</p>
          <p style={{ color: '#EF4444', fontSize: '0.85rem' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {TIMELINE_STEPS.map((step, idx) => {
        const isDone = idx < currentIndex
        const isCurrent = idx === currentIndex
        const config = ORDER_STATUS_CONFIG[step.status]

        return (
          <div key={step.status} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            {/* Icon */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
              <div
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: `2px solid ${isDone ? '#22C55E' : isCurrent ? config.color : '#F0EDE8'}`,
                  backgroundColor: isDone ? '#22C55E' : isCurrent ? config.bg : 'transparent',
                  transition: 'all .2s',
                }}
              >
                {isDone ? (
                  <Check size={16} color="white" strokeWidth={3} />
                ) : isCurrent ? (
                  <Clock size={14} color={config.color} />
                ) : (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F0EDE8' }} />
                )}
              </div>
              {idx < TIMELINE_STEPS.length - 1 && (
                <div style={{ width: '2px', height: '24px', marginTop: '4px', backgroundColor: isDone ? '#86EFAC' : '#F0EDE8' }} />
              )}
            </div>

            {/* Label */}
            <div style={{ paddingTop: '6px' }}>
              <p style={{
                fontSize: '0.9rem', fontWeight: 600,
                color: isDone ? '#16A34A' : isCurrent ? '#2E2A24' : '#D1C9BE',
              }}>
                {step.label}
              </p>
              {isCurrent && (
                <p style={{ color: '#6B6358', fontSize: '0.78rem', marginTop: '2px' }}>
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
