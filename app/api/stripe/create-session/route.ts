import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(request: NextRequest) {
  try {
    const { order_number } = await request.json()

    if (!order_number) {
      return NextResponse.json({ error: 'Número de pedido requerido' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('order_number', order_number)
      .single()

    if (error || !order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    if (order.order_status !== 'received') {
      return NextResponse.json({ error: 'Este pedido ya tiene un pago registrado' }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.order_items.map(
      (item: { product_name: string; unit_price: number; quantity: number }) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product_name,
          },
          unit_amount: Math.round(item.unit_price * 100),
        },
        quantity: item.quantity,
      })
    )

    if (order.delivery_fee > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: 'Delivery' },
          unit_amount: Math.round(order.delivery_fee * 100),
        },
        quantity: 1,
      })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/confirmacion/${order_number}?payment=stripe`,
      cancel_url: `${baseUrl}/pago/${order_number}?cancelled=true`,
      metadata: {
        order_number,
        order_id: order.id,
      },
      customer_email: order.customer_email ?? undefined,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe session error:', err)
    return NextResponse.json({ error: 'Error al crear sesión de pago' }, { status: 500 })
  }
}
