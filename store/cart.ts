import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, CartItem } from '@/lib/types'

interface CartStore {
  items: CartItem[]
  itemCount: number
  subtotal: number
  lastAdded: Product | null
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  clearLastAdded: () => void
}

function derived(items: CartItem[]) {
  return {
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
    subtotal: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
  }
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,
      lastAdded: null,

      addItem: (product, quantity = 1) => {
        const state = get()
        const existing = state.items.find((i) => i.product.id === product.id)
        const items = existing
          ? state.items.map((i) =>
              i.product.id === product.id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            )
          : [...state.items, { product, quantity }]
        set({ items, lastAdded: product, ...derived(items) })
      },

      removeItem: (productId) => {
        const items = get().items.filter((i) => i.product.id !== productId)
        set({ items, ...derived(items) })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeItem(productId); return }
        const items = get().items.map((i) =>
          i.product.id === productId ? { ...i, quantity } : i
        )
        set({ items, ...derived(items) })
      },

      clearCart: () => set({ items: [], itemCount: 0, subtotal: 0 }),
      clearLastAdded: () => set({ lastAdded: null }),
    }),
    {
      name: 'bocado-cart',
      skipHydration: true,
      partialize: (s) => ({ items: s.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const d = derived(state.items)
          state.itemCount = d.itemCount
          state.subtotal = d.subtotal
        }
      },
    }
  )
)
