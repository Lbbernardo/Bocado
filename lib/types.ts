export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string | null
  images: string[]
  is_active: boolean
  stock: number | null
  category: string
  sort_order: number
  created_at: string
  updated_at: string
}

export type OrderStatus =
  | 'received'
  | 'confirmed'
  | 'ready_for_pickup'
  | 'completed'
  | 'cancelled'

export type DeliveryMethod = 'pickup' | 'delivery'

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email: string | null
  delivery_method: DeliveryMethod
  delivery_address: string | null
  pickup_date: string | null
  pickup_time_slot: string | null
  order_status: OrderStatus
  payment_status: string
  payment_method: string | null
  subtotal: number
  delivery_fee: number
  total: number
  customer_note: string | null
  admin_note: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
}

export interface StoreConfig {
  id: string
  pickup_enabled: boolean
  pickup_date: string | null
  pickup_start_time: string | null
  pickup_end_time: string | null
  pickup_address: string | null
  pickup_instructions: string | null
  pickup_contact_phone: string | null
  support_whatsapp_number: string | null
  delivery_enabled: boolean
  delivery_fee: number
  delivery_zones: string | null
  store_is_open: boolean
  min_order_amount: number
  announcement: string | null
  stripe_enabled: boolean
  zelle_enabled: boolean
  zelle_name: string
  zelle_recipient: string
  admin_notify_new_order: boolean
  admin_notification_email: string | null
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; message: string }
> = {
  received: {
    label: 'Pedido recibido',
    color: '#6366F1',
    bg: '#EEF2FF',
    message: 'Recibimos tu pedido. Si pagaste por Zelle, estamos verificando tu pago.',
  },
  confirmed: {
    label: 'Confirmado',
    color: '#0EA5E9',
    bg: '#F0F9FF',
    message: '¡Tu pedido fue confirmado! Estamos preparando todo. 🧡',
  },
  ready_for_pickup: {
    label: 'Listo para recoger',
    color: '#22C55E',
    bg: '#F0FDF4',
    message: '¡Tu pedido está listo! Puedes pasar a recogerlo.',
  },
  completed: {
    label: 'Completado',
    color: '#15803D',
    bg: '#F0FDF4',
    message: '¡Pedido completado! Gracias por comprar en BOCADO 🧡',
  },
  cancelled: {
    label: 'Cancelado',
    color: '#EF4444',
    bg: '#FEF2F2',
    message: 'Tu pedido fue cancelado. Si tienes preguntas, contáctanos.',
  },
}

export const ORDER_STATUS_FLOW: Partial<Record<OrderStatus, OrderStatus[]>> = {
  received: ['confirmed', 'cancelled'],
  confirmed: ['ready_for_pickup', 'cancelled'],
  ready_for_pickup: ['completed', 'cancelled'],
}

export const STATUS_ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  confirmed: 'Confirmar pago recibido',
  ready_for_pickup: 'Marcar listo para recoger',
  completed: 'Marcar como completado',
  cancelled: 'Cancelar pedido',
}

// Estado anterior para retroceder (solo estados reversibles)
export const ORDER_STATUS_PREV: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: 'received',
  ready_for_pickup: 'confirmed',
  completed: 'ready_for_pickup',
}
