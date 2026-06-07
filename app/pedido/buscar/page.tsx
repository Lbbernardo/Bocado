'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { Search, Package } from 'lucide-react'

export default function BuscarPedidoPage() {
  const router = useRouter()
  const [orderNumber, setOrderNumber] = useState('')
  const [phone, setPhone] = useState('')
  const [mode, setMode] = useState<'number' | 'phone'>('number')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (mode === 'number' && orderNumber.trim()) {
      router.push(`/pedido/${orderNumber.trim().toUpperCase()}`)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-bocado-cream flex items-center justify-center px-4 pt-16">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-bocado-orange/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package size={32} className="text-bocado-orange" />
            </div>
            <h1 className="text-3xl font-black text-bocado-dark mb-2">
              Seguir mi pedido
            </h1>
            <p className="text-gray-500">
              Ingresa tu número de pedido para ver el estado
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm">
            {/* Mode tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <button
                onClick={() => setMode('number')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  mode === 'number'
                    ? 'bg-white shadow-sm text-bocado-dark'
                    : 'text-gray-500'
                }`}
              >
                # Número de pedido
              </button>
              <button
                onClick={() => setMode('phone')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  mode === 'phone'
                    ? 'bg-white shadow-sm text-bocado-dark'
                    : 'text-gray-500'
                }`}
              >
                📱 Teléfono
              </button>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              {mode === 'number' ? (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Número de pedido
                  </label>
                  <input
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="BOC-2026-XXXX"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-bocado-dark font-bold text-center text-lg focus:outline-none focus:border-bocado-orange transition-colors uppercase tracking-wider"
                  />
                  <p className="text-gray-400 text-xs text-center mt-2">
                    Lo encontrarás en tu email o pantalla de confirmación
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Número de teléfono
                  </label>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-bocado-dark focus:outline-none focus:border-bocado-orange transition-colors"
                  />
                  <p className="text-gray-400 text-xs text-center mt-2">
                    El mismo número que usaste al hacer el pedido
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={mode === 'number' ? !orderNumber.trim() : !phone.trim()}
                className="w-full bg-bocado-orange hover:bg-orange-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Search size={18} />
                Buscar pedido
              </button>
            </form>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            ¿No encuentras tu pedido?{' '}
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
              className="text-bocado-orange underline"
            >
              Escríbenos por WhatsApp
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
