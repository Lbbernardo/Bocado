import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, createClient } from '@/lib/supabase/server'
import { ORDER_STATUS_CONFIG } from '@/lib/types'
import type { OrderStatus } from '@/lib/types'

const statusSchema = z.object({
  status: z.enum([
    'received',
    'confirmed',
    'payment_pending',
    'payment_received',
    'in_preparation',
    'ready_for_pickup',
    'scheduled_for_delivery',
    'delivered',
    'cancelled',
  ]),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Auth check
    const authClient = createClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = statusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
    }

    const newStatus = parsed.data.status
    const supabase = createAdminClient()

    // Get current order
    const { data: order } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    const oldStatus = order.order_status

    // Update order
    const { error } = await supabase
      .from('orders')
      .update({
        order_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (error) throw error

    // Record history
    await supabase.from('order_status_history').insert({
      order_id: params.id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: user.email ?? 'admin',
    })

    // Send notification email (non-blocking)
    if (order.customer_email && newStatus !== oldStatus) {
      sendStatusEmail(order, newStatus).catch(console.error)
    }

    return NextResponse.json({ success: true, status: newStatus })
  } catch (err) {
    console.error('Status update error:', err)
    return NextResponse.json({ error: 'Error al actualizar estado' }, { status: 500 })
  }
}

async function sendStatusEmail(
  order: {
    customer_email: string
    customer_name: string
    order_number: string
    pickup_date?: string
    pickup_time_slot?: string
  },
  newStatus: OrderStatus
) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const config = ORDER_STATUS_CONFIG[newStatus]

  const subjects: Partial<Record<OrderStatus, string>> = {
    confirmed: `Tu pedido fue confirmado — siguiente paso: el pago 💳`,
    payment_received: `¡Pago recibido! Tu pedido está en preparación 🧀`,
    ready_for_pickup: `¡Tus tequeños están listos! 🎉`,
    scheduled_for_delivery: `Tu pedido viene en camino 🛵`,
    delivered: `¡Que los disfrutes! Gracias por comprar en BOCADO 🧡`,
    cancelled: `Tu pedido fue cancelado`,
  }

  const subject = subjects[newStatus] ?? `Actualización de tu pedido ${order.order_number}`

  const extraInfo =
    newStatus === 'ready_for_pickup' && order.pickup_date
      ? `<p style="color: #FFA600; font-weight: bold;">📅 ${order.pickup_date}${order.pickup_time_slot ? ` · ${order.pickup_time_slot}` : ''}</p>`
      : ''

  await resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME ?? 'BOCADO'} <${process.env.RESEND_FROM_EMAIL ?? 'pedidos@bocado.com'}>`,
    to: order.customer_email,
    subject,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: #FFA600; padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 36px; font-weight: 900; color: white;">BOCADO</h1>
          <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">· TEQUEÑOS VENEZOLANOS ·</p>
        </div>
        <div style="padding: 32px;">
          <div style="background: ${config.bg}; border: 1px solid ${config.color}30; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <p style="color: ${config.color}; font-weight: 800; font-size: 18px; margin: 0 0 8px;">${config.label}</p>
            <p style="color: #888; margin: 0; line-height: 1.6;">${config.message}</p>
          </div>
          <p style="color: #888;">Hola <strong style="color: white;">${order.customer_name}</strong>,</p>
          ${extraInfo}
          <div style="background: #1a1a1a; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #222;">
            <p style="color: #555; margin: 0 0 4px; font-size: 11px;">PEDIDO</p>
            <p style="color: #FFA600; font-size: 22px; font-weight: 900; margin: 0;">${order.order_number}</p>
          </div>
          <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
          <p style="color: #555; font-size: 13px; text-align: center; margin: 0;">
            ¿Tienes preguntas? Escríbenos por WhatsApp.
          </p>
        </div>
      </div>
    `,
  })
}
