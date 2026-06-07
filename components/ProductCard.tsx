'use client'

import Image from 'next/image'
import { Plus, Minus, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import type { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  const photos = product.images?.length ? product.images : product.image_url ? [product.image_url] : []
  const hasMultiple = photos.length > 1

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    setQuantity(1)
  }

  function prev(e: React.MouseEvent) {
    e.stopPropagation()
    setPhotoIndex((i) => (i - 1 + photos.length) % photos.length)
  }

  function next(e: React.MouseEvent) {
    e.stopPropagation()
    setPhotoIndex((i) => (i + 1) % photos.length)
  }

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col group">
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-bocado-cream to-bocado-cream-dark overflow-hidden">
        {photos.length > 0 ? (
          <Image
            src={photos[photoIndex]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-7xl">🧀</span>
          </div>
        )}

        {/* Prev/Next arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronRight size={16} />
            </button>
            {/* Dots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setPhotoIndex(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === photoIndex ? 'bg-white w-3' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Out of stock overlay */}
        {product.stock !== null && product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-white text-bocado-dark font-bold text-sm px-4 py-2 rounded-full">
              Agotado
            </span>
          </div>
        )}

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-bocado-dark/70 text-bocado-yellow text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-black text-bocado-dark text-lg leading-tight mb-1">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">
          {product.description}
        </p>

        {/* Price + controls */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-bocado-orange font-black text-2xl">
            {formatCurrency(product.price)}
          </span>

          <div className="flex items-center gap-2">
            {/* Quantity */}
            <div className="flex items-center border border-gray-200 rounded-full overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={14} />
              </button>
              <span className="w-7 text-center font-bold text-sm text-bocado-dark">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAdd}
              disabled={product.stock !== null && product.stock === 0}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${
                added
                  ? 'bg-green-500 text-white'
                  : 'bg-bocado-orange hover:bg-orange-500 text-white hover:shadow-bocado-sm'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <ShoppingCart size={14} />
              {added ? '¡Listo!' : 'Agregar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
