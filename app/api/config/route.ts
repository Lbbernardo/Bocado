import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 30

export async function GET() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('store_config')
      .select(
        `id, pickup_enabled, pickup_date, pickup_start_time, pickup_end_time,
         pickup_address, pickup_instructions, pickup_contact_phone, delivery_enabled, delivery_fee,
         delivery_zones, store_is_open, min_order_amount, announcement,
         stripe_enabled, zelle_enabled, zelle_name, zelle_recipient, support_whatsapp_number, updated_at`
      )
      .single()

    if (error) {
      return NextResponse.json(null)
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(null)
  }
}
