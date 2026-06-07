import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'
import { generateOrderNumber } from '@/lib/utils'

const orderItemSchema = z.object({
  product_id: z.string().uuid(),
  product_name: z.string(),
  quantity: z.number().min(1),
  unit_price: z.number().min(0),
})

const createOrderSchema = z.object({
  customer_name: z.string().min(2),
  customer_phone: z.string().min(7),
  customer_email: z.string().email().optional().or(z.literal('')),
  delivery_method: z.enum(['pickup', 'delivery']),
  delivery_address: z.string().optional(),
  pickup_date: z.string().nullable().optional(),
  pickup_time_slot: z.string().nullable().optional(),
  customer_note: z.string().optional(),
  items: z.array(orderItemSchema).min(1),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createOrderSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos del pedido inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data
    const supabase = createAdminClient()

    // Calculate totals
    const subtotal = data.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    )

    // Get delivery fee from config
    let deliveryFee = 0
    if (data.delivery_method === 'delivery') {
      const { data: config } = await supabase
        .from('store_config')
        .select('delivery_fee')
        .single()
      deliveryFee = config?.delivery_fee ?? 0
    }

    const total = subtotal + deliveryFee
    const orderNumber = generateOrderNumber()

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email || null,
        delivery_method: data.delivery_method,
        delivery_address: data.delivery_address || null,
        pickup_date: data.pickup_date || null,
        pickup_time_slot: data.pickup_time_slot || null,
        order_status: 'received',
        payment_status: 'pending',
        subtotal,
        delivery_fee: deliveryFee,
        total,
        customer_note: data.customer_note || null,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order creation error:', orderError)
      return NextResponse.json(
        { error: 'Error al crear el pedido' },
        { status: 500 }
      )
    }

    // Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.unit_price * item.quantity,
    }))

    await supabase.from('order_items').insert(orderItems)

    // Record initial status
    await supabase.from('order_status_history').insert({
      order_id: order.id,
      old_status: null,
      new_status: 'received',
      changed_by: 'customer',
    })

    // Send confirmation email (non-blocking)
    if (data.customer_email) {
      sendConfirmationEmail(order, data.items).catch(console.error)
    }

    return NextResponse.json(
      { order_number: orderNumber, order_id: order.id },
      { status: 201 }
    )
  } catch (err) {
    console.error('Order error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

async function sendConfirmationEmail(
  order: { order_number: string; customer_name: string; customer_email: string },
  items: { product_name: string; quantity: number; unit_price: number }[]
) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  const itemsList = items
    .map((i) => `${i.product_name} ×${i.quantity}`)
    .join(', ')

  await resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME ?? 'BOCADO'} <${process.env.RESEND_FROM_EMAIL ?? 'pedidos@bocado.com'}>`,
    to: order.customer_email,
    subject: `¡Hola ${order.customer_name}, recibimos tu pedido en BOCADO! 🧡`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: #FFA600; padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 36px; font-weight: 900; color: white; letter-spacing: -1px;">BOCADO</h1>
          <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">· TEQUEÑOS VENEZOLANOS ·</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: white; font-size: 24px; margin-top: 0;">¡Pedido recibido! 🧡</h2>
          <p style="color: #888; line-height: 1.6;">
            Hola <strong style="color: white;">${order.customer_name}</strong>, tu pedido fue recibido correctamente.
            Estamos revisando disponibilidad y pronto te confirmaremos.
          </p>
          <div style="background: #1a1a1a; border-radius: 12px; padding: 20px; margin: 24px 0; border: 1px solid #222;">
            <p style="color: #888; margin: 0 0 4px; font-size: 12px;">NÚMERO DE PEDIDO</p>
            <p style="color: #FFA600; font-size: 28px; font-weight: 900; margin: 0;">${order.order_number}</p>
          </div>
          <p style="color: #666; font-size: 14px; margin-bottom: 4px;">Productos:</p>
          <p style="color: #aaa; font-size: 14px;">${itemsList}</p>
          <hr style="border: none; border-top: 1px solid #222; margin: 24px 0;" />
          <p style="color: #666; font-size: 13px; text-align: center; margin: 0;">
            ¿Tienes preguntas? Responde este correo o escríbenos por WhatsApp.
          </p>
        </div>
      </div>
    `,
  })
}
