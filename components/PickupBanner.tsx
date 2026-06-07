import { MapPin, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate, formatTime } from '@/lib/utils'

export default async function PickupBanner() {
  const supabase = createClient()
  const { data: config } = await supabase
    .from('store_config')
    .select('pickup_enabled, pickup_date, pickup_start_time, pickup_end_time, pickup_address, announcement')
    .single()

  if (!config?.pickup_enabled) {
    return (
      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 mt-8">
        <div className="w-2 h-2 bg-gray-500 rounded-full" />
        <span className="text-gray-400 text-sm">
          Pickup no disponible por el momento
        </span>
      </div>
    )
  }

  const date = config.pickup_date ? formatDate(config.pickup_date) : ''
  const start = config.pickup_start_time ? formatTime(config.pickup_start_time) : ''
  const end = config.pickup_end_time ? formatTime(config.pickup_end_time) : ''

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-8">
      <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-5 py-2.5">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <Clock size={14} className="text-green-400" />
        <span className="text-green-400 text-sm font-semibold">
          Pickup: {date} · {start}–{end}
        </span>
      </div>
      {config.pickup_address && (
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2.5">
          <MapPin size={14} className="text-bocado-yellow" />
          <span className="text-bocado-yellow/90 text-sm font-medium">
            {config.pickup_address}
          </span>
        </div>
      )}
    </div>
  )
}
