'use client'

import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, ToggleLeft, ToggleRight, Loader2, X, Upload, ImageIcon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'
import Image from 'next/image'

export default function ProductosAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .order('sort_order')
    setProducts(data ?? [])
    setLoading(false)
  }

  async function toggleActive(product: Product) {
    const supabase = createClient()
    await supabase
      .from('products')
      .update({ is_active: !product.is_active })
      .eq('id', product.id)
    fetchProducts()
  }

  function handleEdit(product: Product) {
    setEditing(product)
    setShowForm(true)
  }

  function handleNew() {
    setEditing(null)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="text-bocado-orange animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-3xl">Productos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {products.length} productos registrados
          </p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center gap-2 bg-bocado-orange hover:bg-orange-500 text-white font-bold px-5 py-3 rounded-xl transition-all"
        >
          <Plus size={18} />
          Nuevo producto
        </button>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className={`bg-bocado-dark border rounded-2xl overflow-hidden transition-all ${
              product.is_active
                ? 'border-white/5 opacity-100'
                : 'border-white/5 opacity-50'
            }`}
          >
            {/* Image */}
            <div className="relative h-40 bg-bocado-darker">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-5xl">
                  🧀
                </div>
              )}
              {/* Active toggle overlay */}
              <button
                onClick={() => toggleActive(product)}
                className="absolute top-3 right-3 p-1.5 bg-black/50 backdrop-blur-sm rounded-lg"
              >
                {product.is_active ? (
                  <ToggleRight size={20} className="text-bocado-orange" />
                ) : (
                  <ToggleLeft size={20} className="text-gray-500" />
                )}
              </button>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-white font-bold flex-1">{product.name}</h3>
                <span className="text-bocado-orange font-black ml-2">
                  {formatCurrency(product.price)}
                </span>
              </div>
              <p className="text-gray-500 text-xs mb-3 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-lg">
                    {product.category}
                  </span>
                  {product.stock !== null && (
                    <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-lg">
                      Stock: {product.stock}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleEdit(product)}
                  className="flex items-center gap-1.5 text-gray-400 hover:text-bocado-orange text-xs font-semibold transition-colors"
                >
                  <Pencil size={13} />
                  Editar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product form modal */}
      {showForm && (
        <ProductFormModal
          product={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false)
            fetchProducts()
          }}
        />
      )}
    </div>
  )
}

interface ProductFormModalProps {
  product: Product | null
  onClose: () => void
  onSaved: () => void
}

const MAX_IMAGES = 6

function ProductFormModal({ product, onClose, onSaved }: ProductFormModalProps) {
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    image_url: product?.image_url ?? '',
    images: product?.images ?? [],
    category: product?.category ?? 'tequeños',
    stock: product?.stock ?? '',
    sort_order: product?.sort_order ?? 0,
    is_active: product?.is_active ?? true,
  })
  const [saving, setSaving] = useState(false)
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null)
  const fileRefs = useRef<(HTMLInputElement | null)[]>([])

  function update(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, slot: number) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingSlot(slot)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${slot}.${ext}`

    const { error } = await supabase.storage
      .from('products')
      .upload(path, file, { upsert: true })

    if (!error) {
      const { data } = supabase.storage.from('products').getPublicUrl(path)
      const url = data.publicUrl
      const newImages = [...form.images]
      newImages[slot] = url
      const filtered = newImages.filter(Boolean)
      update('images', filtered)
      if (slot === 0 || !form.image_url) update('image_url', url)
    }
    setUploadingSlot(null)
    if (fileRefs.current[slot]) fileRefs.current[slot]!.value = ''
  }

  function removeImage(slot: number) {
    const newImages = [...form.images]
    newImages.splice(slot, 1)
    update('images', newImages)
    if (slot === 0) update('image_url', newImages[0] ?? '')
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const payload = {
      ...form,
      stock: form.stock === '' ? null : Number(form.stock),
      price: Number(form.price),
      image_url: form.images[0] ?? form.image_url ?? null,
      updated_at: new Date().toISOString(),
    }

    if (product) {
      await supabase.from('products').update(payload).eq('id', product.id)
    } else {
      await supabase.from('products').insert(payload)
    }

    setSaving(false)
    onSaved()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bocado-dark border border-white/10 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-white font-black text-xl">
            {product ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white rounded-xl hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <Field label="Nombre *">
            <input
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Tequeños Clásicos 20 uds"
              className="input-dark"
            />
          </Field>

          <Field label="Descripción">
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={2}
              placeholder="Tequeños de queso venezolano, listos para preparar..."
              className="input-dark resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio ($) *">
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                className="input-dark"
              />
            </Field>
            <Field label="Stock (vacío = ilimitado)">
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => update('stock', e.target.value)}
                placeholder="—"
                className="input-dark"
              />
            </Field>
          </div>

          <Field label="Categoría">
            <input
              value={form.category}
              onChange={(e) => update('category', e.target.value)}
              placeholder="tequeños"
              className="input-dark"
            />
          </Field>

          <Field label={`Fotos del producto (${form.images.length}/${MAX_IMAGES})`}>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: MAX_IMAGES }).map((_, slot) => {
                const url = form.images[slot]
                const isUploading = uploadingSlot === slot
                return (
                  <div key={slot} className="relative aspect-square">
                    <input
                      ref={(el) => { fileRefs.current[slot] = el }}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, slot)}
                      className="hidden"
                    />
                    {url ? (
                      <div className="relative w-full h-full rounded-xl overflow-hidden group">
                        <Image src={url} alt={`foto ${slot + 1}`} fill className="object-cover" />
                        {slot === 0 && (
                          <span className="absolute top-1 left-1 text-[10px] bg-bocado-orange text-white font-bold px-1.5 py-0.5 rounded-md">
                            Principal
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileRefs.current[slot]?.click()}
                            className="p-1.5 bg-white/20 rounded-lg hover:bg-white/40 transition-colors"
                          >
                            <Upload size={14} className="text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(slot)}
                            className="p-1.5 bg-red-500/70 rounded-lg hover:bg-red-500 transition-colors"
                          >
                            <X size={14} className="text-white" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => form.images.length > slot || slot === form.images.length
                          ? fileRefs.current[slot]?.click()
                          : null}
                        disabled={slot > form.images.length}
                        className="w-full h-full rounded-xl border border-dashed border-white/15 flex flex-col items-center justify-center gap-1 text-gray-600 hover:border-bocado-orange/50 hover:text-bocado-orange transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {isUploading ? (
                          <Loader2 size={18} className="animate-spin text-bocado-orange" />
                        ) : (
                          <>
                            <ImageIcon size={18} />
                            <span className="text-[10px] font-semibold">{slot + 1}</span>
                          </>
                        )}
                      </button>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                        <Loader2 size={18} className="animate-spin text-bocado-orange" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <p className="text-gray-600 text-xs mt-2">La primera foto es la imagen principal del producto.</p>
          </Field>

          <Field label="Orden de visualización">
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => update('sort_order', parseInt(e.target.value))}
              className="input-dark"
            />
          </Field>

          <div className="flex items-center justify-between p-4 bg-bocado-darker rounded-xl">
            <span className="text-white font-semibold text-sm">
              Producto activo
            </span>
            <button onClick={() => update('is_active', !form.is_active)}>
              {form.is_active ? (
                <ToggleRight size={32} className="text-bocado-orange" />
              ) : (
                <ToggleLeft size={32} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.price}
            className="w-full bg-bocado-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {saving ? (
              <Loader2 size={18} className="animate-spin" />
            ) : product ? (
              'Guardar cambios'
            ) : (
              'Crear producto'
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .input-dark {
          width: 100%;
          background: #0A0A0A;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s;
          font-family: var(--font-poppins), sans-serif;
        }
        .input-dark:focus {
          border-color: rgba(255, 166, 0, 0.5);
        }
        .input-dark::placeholder {
          color: #444;
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="text-gray-400 text-sm font-medium block mb-2">
        {label}
      </label>
      {children}
    </div>
  )
}
