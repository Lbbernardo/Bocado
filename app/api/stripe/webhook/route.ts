import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Sin firma Stripe' }, { status: 400 })
  }

  const stripe = getStripe()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature failed:', err)
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const order_number = session.metadata?.order_number
    const order_id = session.metadata?.order_id

    if (!order_number || !order_id) {
      return NextResponse.json({ error: 'Metadata faltante' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { error } = await supabase
      .from('orders')
      .update({
        order_status: 'payment_pending',
        payment_method: 'stripe',
        payment_status: 'paid',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id)

    if (error) {
      console.error('DB update error:', error)
      return NextResponse.json({ error: 'Error actualizando pedido' }, { status: 500 })
    }

    await supabase.from('order_status_history').insert({
      order_id,
      old_status: 'received',
      new_status: 'payment_pending',
      changed_by: 'stripe_webhook',
    })
  }

  return NextResponse.json({ received: true })
}
