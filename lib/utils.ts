import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${m} ${ampm}`
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  const ts = Date.now().toString().slice(-4)
  return `BOC-${year}-${random}${ts}`
}

export function formatPickupInfo(config: {
  pickup_date: string | null
  pickup_start_time: string | null
  pickup_end_time: string | null
}): string {
  if (!config.pickup_date || !config.pickup_start_time || !config.pickup_end_time) {
    return 'Consulta disponibilidad'
  }
  const date = formatDate(config.pickup_date)
  const start = formatTime(config.pickup_start_time)
  const end = formatTime(config.pickup_end_time)
  return `${date} · ${start}–${end}`
}
