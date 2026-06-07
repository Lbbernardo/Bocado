import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 30

export async function GET() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('store_config')
      .select('*')
      .single()

    if (error) {
      return NextResponse.json(null)
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(null)
  }
}
