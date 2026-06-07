'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus, ShoppingCart, Check } from 'lucide-react'
import { useCart } from '@/store/cart'
import type { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface Props {
  product: Product
}

export default function ProductDetail({ product }: Props) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)

  const photos = product.images?.length
    ? product.images
    : product.image_url
    ? [product.image_url]
    : []

  const isOutOfStock = product.stock !== null && product.stock === 0

  function handleAdd() {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Left: Images */}
        <div className="flex flex-col-reverse lg:flex-row gap-3">
          {/* Thumbnails */}
          {photos.length > 1 && (
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-y-auto lg:max-h-[520px]">
              {photos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhoto(i)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activePhoto === i
                      ? 'border-bocado-orange'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main image */}
          <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-bocado-cream">
            {photos.length > 0 ? (
              <Image
                src={photos[activePhoto]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-8xl">🧀</span>
              </div>
            )}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="bg-white text-bocado-dark font-black text-lg px-6 py-3 rounded-full">
                  Agotado
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          {/* Category */}
          <span className="text-xs font-bold uppercase tracking-widest text-bocado-orange mb-2">
            {product.category}
          </span>

          {/* Name */}
          <h1 className="text-3xl font-black text-bocado-dark leading-tight mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <p className="text-3xl font-black text-bocado-dark mb-6">
            {formatCurrency(product.price)}
          </p>

          <div className="border-t border-gray-100 pt-6 space-y-6">
            {/* Description */}
            {product.description && (
              <p className="text-gray-600 leading-relaxed text-sm">
                {product.description}
              </p>
            )}

            {!isOutOfStock && (
              <>
                {/* Quantity */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">
                    Cantidad
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl w-fit overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-black text-bocado-dark text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-11 h-11 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAdd}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg transition-all duration-300 ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-bocado-orange hover:bg-orange-500 text-white hover:shadow-bocado'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={22} />
                      ¡Agregado al carrito!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={22} />
                      Agregar al carrito
                    </>
                  )}
                </button>
              </>
            )}

            {isOutOfStock && (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                <p className="text-gray-500 font-semibold">Este producto está agotado</p>
                <p className="text-gray-400 text-sm mt-1">Vuelve pronto para más tequeños 🧡</p>
              </div>
            )}

            {/* Stock info */}
            {!isOutOfStock && product.stock !== null && product.stock > 0 && product.stock <= 10 && (
              <p className="text-amber-600 text-sm font-semibold">
                ¡Solo quedan {product.stock} disponibles!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
