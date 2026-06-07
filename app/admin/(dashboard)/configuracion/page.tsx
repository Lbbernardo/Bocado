'use client'

import { useState, useEffect } from 'react'
import { Save, Loader2, ToggleLeft, ToggleRight, CreditCard, Smartphone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { StoreConfig } from '@/lib/types'

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Partial<StoreConfig>>({
    pickup_enabled: false,
    pickup_date: '',
    pickup_start_time: '',
    pickup_end_time: '',
    pickup_address: '',
    pickup_instructions: '',
    delivery_enabled: false,
    delivery_fee: 0,
    announcement: '',
    store_is_open: true,
    stripe_enabled: false,
    zelle_enabled: false,
    zelle_name: '',
    zelle_recipient: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data } = await supabase
        .from('store_config')
        .select('*')
        .single()
      if (data) setConfig(data)
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('store_config').upsert({
      ...config,
      updated_at: new Date().toISOString(),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function update(key: keyof StoreConfig, value: unknown) {
    setConfig((prev) => ({ ...prev, [key]: value }))
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
          <h1 className="text-white font-black text-3xl">Configuración</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestiona pickup, delivery y la tienda
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-bocado-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-all"
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            '✓ Guardado'
          ) : (
            <>
              <Save size={16} />
              Guardar cambios
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        {/* Pickup config */}
        <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg">Pickup</h2>
            <button
              onClick={() => update('pickup_enabled', !config.pickup_enabled)}
              className="flex items-center gap-2"
            >
              {config.pickup_enabled ? (
                <ToggleRight size={36} className="text-bocado-orange" />
              ) : (
                <ToggleLeft size={36} className="text-gray-600" />
              )}
              <span
                className={`text-sm font-bold ${
                  config.pickup_enabled ? 'text-bocado-orange' : 'text-gray-500'
                }`}
              >
                {config.pickup_enabled ? 'Activo' : 'Inactivo'}
              </span>
            </button>
          </div>

          <div
            className={`space-y-4 transition-opacity ${
              config.pickup_enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Fecha de pickup
              </label>
              <input
                type="date"
                value={config.pickup_date ?? ''}
                onChange={(e) => update('pickup_date', e.target.value)}
                className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">
                  Hora inicio
                </label>
                <input
                  type="time"
                  value={config.pickup_start_time ?? ''}
                  onChange={(e) => update('pickup_start_time', e.target.value)}
                  className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">
                  Hora fin
                </label>
                <input
                  type="time"
                  value={config.pickup_end_time ?? ''}
                  onChange={(e) => update('pickup_end_time', e.target.value)}
                  className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Dirección de pickup
              </label>
              <input
                type="text"
                value={config.pickup_address ?? ''}
                onChange={(e) => update('pickup_address', e.target.value)}
                placeholder="123 Calle Principal, Ciudad"
                className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Instrucciones adicionales
              </label>
              <textarea
                value={config.pickup_instructions ?? ''}
                onChange={(e) => update('pickup_instructions', e.target.value)}
                placeholder="Ej: Toca el timbre dos veces, busca el portón azul..."
                rows={2}
                className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Delivery config */}
        <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-lg">Delivery</h2>
            <button
              onClick={() => update('delivery_enabled', !config.delivery_enabled)}
              className="flex items-center gap-2"
            >
              {config.delivery_enabled ? (
                <ToggleRight size={36} className="text-bocado-orange" />
              ) : (
                <ToggleLeft size={36} className="text-gray-600" />
              )}
              <span
                className={`text-sm font-bold ${
                  config.delivery_enabled ? 'text-bocado-orange' : 'text-gray-500'
                }`}
              >
                {config.delivery_enabled ? 'Activo' : 'Inactivo'}
              </span>
            </button>
          </div>

          <div
            className={`space-y-4 transition-opacity ${
              config.delivery_enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Tarifa de delivery ($)
              </label>
              <input
                type="number"
                min="0"
                step="0.50"
                value={config.delivery_fee ?? 0}
                onChange={(e) => update('delivery_fee', parseFloat(e.target.value))}
                className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors"
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Zonas de delivery
              </label>
              <textarea
                value={config.delivery_zones ?? ''}
                onChange={(e) => update('delivery_zones', e.target.value)}
                placeholder="Ej: Ciudad X, Ciudad Y, radio de 15 millas..."
                rows={3}
                className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Store status */}
        <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-bold text-lg">Estado de la tienda</h2>
              <p className="text-gray-500 text-sm">
                Si desactivas la tienda, los clientes no podrán hacer pedidos
              </p>
            </div>
            <button
              onClick={() => update('store_is_open', !config.store_is_open)}
              className="flex items-center gap-2 ml-4"
            >
              {config.store_is_open ? (
                <ToggleRight size={36} className="text-green-500" />
              ) : (
                <ToggleLeft size={36} className="text-gray-600" />
              )}
              <span
                className={`text-sm font-bold ${
                  config.store_is_open ? 'text-green-500' : 'text-gray-500'
                }`}
              >
                {config.store_is_open ? 'Abierta' : 'Cerrada'}
              </span>
            </button>
          </div>
        </div>

        {/* Stripe */}
        <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                <CreditCard size={18} className="text-indigo-400" />
              </div>
              <h2 className="text-white font-bold text-lg">Stripe (Tarjeta)</h2>
            </div>
            <button
              onClick={() => update('stripe_enabled', !config.stripe_enabled)}
              className="flex items-center gap-2"
            >
              {config.stripe_enabled ? (
                <ToggleRight size={36} className="text-bocado-orange" />
              ) : (
                <ToggleLeft size={36} className="text-gray-600" />
              )}
              <span
                className={`text-sm font-bold ${
                  config.stripe_enabled ? 'text-bocado-orange' : 'text-gray-500'
                }`}
              >
                {config.stripe_enabled ? 'Activo' : 'Inactivo'}
              </span>
            </button>
          </div>
          <div
            className={`transition-opacity ${
              config.stripe_enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <p className="text-gray-500 text-sm">
              Configura <code className="text-indigo-400">STRIPE_SECRET_KEY</code>,{' '}
              <code className="text-indigo-400">STRIPE_WEBHOOK_SECRET</code> y{' '}
              <code className="text-indigo-400">NEXT_PUBLIC_BASE_URL</code> en las variables de entorno.
            </p>
          </div>
        </div>

        {/* Zelle */}
        <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Smartphone size={18} className="text-purple-400" />
              </div>
              <h2 className="text-white font-bold text-lg">Zelle</h2>
            </div>
            <button
              onClick={() => update('zelle_enabled', !config.zelle_enabled)}
              className="flex items-center gap-2"
            >
              {config.zelle_enabled ? (
                <ToggleRight size={36} className="text-bocado-orange" />
              ) : (
                <ToggleLeft size={36} className="text-gray-600" />
              )}
              <span
                className={`text-sm font-bold ${
                  config.zelle_enabled ? 'text-bocado-orange' : 'text-gray-500'
                }`}
              >
                {config.zelle_enabled ? 'Activo' : 'Inactivo'}
              </span>
            </button>
          </div>
          <div
            className={`space-y-4 transition-opacity ${
              config.zelle_enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
            }`}
          >
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Nombre en Zelle
              </label>
              <input
                type="text"
                value={config.zelle_name ?? ''}
                onChange={(e) => update('zelle_name', e.target.value)}
                placeholder="Ej: María García"
                className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm font-medium block mb-2">
                Email o teléfono de Zelle
              </label>
              <input
                type="text"
                value={config.zelle_recipient ?? ''}
                onChange={(e) => update('zelle_recipient', e.target.value)}
                placeholder="Ej: pagos@bocado.com o +1 555-0000"
                className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Announcement */}
        <div className="bg-bocado-dark border border-white/5 rounded-2xl p-6">
          <h2 className="text-white font-bold text-lg mb-2">
            Anuncio en la tienda
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            Aparece como banner en la página principal. Déjalo vacío para no mostrar nada.
          </p>
          <textarea
            value={config.announcement ?? ''}
            onChange={(e) => update('announcement', e.target.value)}
            placeholder="Ej: ¡Nuevos tequeños de jamón disponibles este sábado! 🧀"
            rows={3}
            className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors resize-none"
          />
        </div>
      </div>

      {/* Save button bottom */}
      <div className="max-w-5xl mt-6">
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 bg-bocado-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all text-lg"
        >
          {saving ? (
            <Loader2 size={20} className="animate-spin" />
          ) : saved ? (
            '✓ Guardado correctamente'
          ) : (
            <>
              <Save size={20} />
              Guardar todos los cambios
            </>
          )}
        </button>
      </div>
    </div>
  )
}
