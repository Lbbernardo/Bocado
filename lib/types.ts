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
  | 'payment_pending'
  | 'payment_received'
  | 'in_preparation'
  | 'ready_for_pickup'
  | 'scheduled_for_delivery'
  | 'delivered'
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
    label: 'Recibido',
    color: '#6366F1',
    bg: '#EEF2FF',
    message: 'Tu pedido fue recibido correctamente. Estamos revisando disponibilidad.',
  },
  confirmed: {
    label: 'Pedido confirmado',
    color: '#0EA5E9',
    bg: '#F0F9FF',
    message: '¡Tu pedido fue confirmado! Estamos preparando todo. 🧡',
  },
  payment_pending: {
    label: 'Pago por confirmar',
    color: '#F59E0B',
    bg: '#FFFBEB',
    message: 'Tu pago está siendo verificado. Te confirmaremos pronto.',
  },
  payment_received: {
    label: 'Pago recibido',
    color: '#10B981',
    bg: '#ECFDF5',
    message: 'Hemos recibido tu pago. Tu pedido está en preparación.',
  },
  in_preparation: {
    label: 'En preparación',
    color: '#8B5CF6',
    bg: '#F5F3FF',
    message: 'Estamos preparando tu pedido con mucho amor. 🤎',
  },
  ready_for_pickup: {
    label: 'Listo para recoger',
    color: '#22C55E',
    bg: '#F0FDF4',
    message: '¡Tu pedido está listo! Puedes pasar a recogerlo.',
  },
  scheduled_for_delivery: {
    label: 'Programado para entrega',
    color: '#FFA600',
    bg: '#FFF8EE',
    message: 'Tu pedido será entregado pronto.',
  },
  delivered: {
    label: 'Entregado',
    color: '#15803D',
    bg: '#F0FDF4',
    message: 'Tu pedido fue entregado. ¡Gracias por comprar en BOCADO! 🧡',
  },
  cancelled: {
    label: 'Cancelado',
    color: '#EF4444',
    bg: '#FEF2F2',
    message: 'Tu pedido fue cancelado. Si tienes preguntas, contáctanos.',
  },
}

export const ORDER_STATUS_FLOW: Partial<Record<OrderStatus, OrderStatus[]>> = {
  received: ['cancelled'],
  payment_pending: ['confirmed', 'cancelled'],
  confirmed: ['in_preparation', 'cancelled'],
  in_preparation: ['ready_for_pickup', 'scheduled_for_delivery', 'cancelled'],
  ready_for_pickup: ['delivered', 'cancelled'],
  scheduled_for_delivery: ['delivered', 'cancelled'],
}

export const STATUS_ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  confirmed: 'Confirmar pago recibido',
  in_preparation: 'Iniciar preparación',
  ready_for_pickup: 'Listo para recoger',
  scheduled_for_delivery: 'Programar entrega',
  delivered: 'Marcar como entregado',
  cancelled: 'Cancelar pedido',
}

// Estado anterior para retroceder (solo estados reversibles)
export const ORDER_STATUS_PREV: Partial<Record<OrderStatus, OrderStatus>> = {
  confirmed: 'payment_pending',
  in_preparation: 'confirmed',
  ready_for_pickup: 'in_preparation',
  scheduled_for_delivery: 'in_preparation',
}
