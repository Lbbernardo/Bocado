import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { order_number } = await request.json()

    if (!order_number) {
      return NextResponse.json({ error: 'Número de pedido requerido' }, { status: 400 })
    }

    const supabase = createAdminClient()

    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('id, order_status')
      .eq('order_number', order_number)
      .single()

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Pedido no encontrado' }, { status: 404 })
    }

    if (order.order_status !== 'received') {
      return NextResponse.json({ error: 'Este pedido ya tiene un pago registrado' }, { status: 400 })
    }

    const { error } = await supabase
      .from('orders')
      .update({
        order_status: 'payment_pending',
        payment_method: 'zelle',
        payment_status: 'zelle_claimed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    if (error) {
      return NextResponse.json({ error: 'Error actualizando pedido' }, { status: 500 })
    }

    await supabase.from('order_status_history').insert({
      order_id: order.id,
      old_status: 'received',
      new_status: 'payment_pending',
      changed_by: 'customer_zelle',
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Zelle payment error:', err)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
