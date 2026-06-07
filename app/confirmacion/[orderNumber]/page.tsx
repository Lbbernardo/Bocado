'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Clock, Phone, CreditCard, Smartphone } from 'lucide-react'

interface Props {
  params: { orderNumber: string }
}

function ConfirmacionContent({ orderNumber }: { orderNumber: string }) {
  const searchParams = useSearchParams()
  const paymentType = searchParams.get('payment') // 'stripe' | null

  const isStripe = paymentType === 'stripe'

  return (
    <div className="min-h-screen bg-bocado-cream flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Success card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm text-center mb-4">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 size={48} className="text-green-500" />
            </div>
          </div>

          <div className="text-bocado-yellow text-xs tracking-[0.25em] uppercase font-bold mb-2">
            · BOCADO ·
          </div>

          <h1 className="text-3xl font-black text-bocado-dark mb-3">
            {isStripe ? '¡Pago recibido!' : '¡Pago registrado!'} 🧡
          </h1>

          <p className="text-gray-500 text-base leading-relaxed mb-6">
            {isStripe
              ? 'Tu pago fue procesado correctamente. Confirmaremos tu pedido en breve.'
              : 'Recibimos tu aviso de pago por Zelle. Lo verificaremos y confirmaremos tu pedido pronto.'}
          </p>

          {/* Order number */}
          <div className="bg-bocado-cream rounded-2xl p-5 mb-6">
            <p className="text-gray-500 text-sm mb-1">Número de pedido</p>
            <p className="font-black text-bocado-orange text-3xl tracking-tight">
              {orderNumber}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Guarda este número para seguir tu pedido
            </p>
          </div>

          {/* Payment badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${
              isStripe
                ? 'bg-indigo-50 text-indigo-700'
                : 'bg-purple-50 text-purple-700'
            }`}
          >
            {isStripe ? <CreditCard size={14} /> : <Smartphone size={14} />}
            {isStripe ? 'Pagado con tarjeta (Stripe)' : 'Pago por Zelle enviado'}
          </div>

          {/* Next steps */}
          <div className="text-left space-y-4">
            <h3 className="font-bold text-bocado-dark text-sm uppercase tracking-wide">
              ¿Qué sigue?
            </h3>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-bocado-orange/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock size={14} className="text-bocado-orange" />
              </div>
              <div>
                <p className="font-semibold text-bocado-dark text-sm">
                  Confirmamos tu pago
                </p>
                <p className="text-gray-500 text-xs">
                  {isStripe
                    ? 'Verificamos el pago con Stripe y confirmamos tu pedido'
                    : 'Verificamos la transferencia de Zelle y confirmamos tu pedido'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-bocado-orange/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone size={14} className="text-bocado-orange" />
              </div>
              <div>
                <p className="font-semibold text-bocado-dark text-sm">
                  Te avisamos
                </p>
                <p className="text-gray-500 text-xs">
                  Recibirás una notificación cuando tu pedido esté confirmado y en preparación
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href={`/pedido/${orderNumber}`}
            className="w-full bg-bocado-orange hover:bg-orange-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-bocado-sm"
          >
            Seguir mi pedido
          </Link>

          <Link
            href="/"
            className="w-full bg-white border border-gray-200 text-gray-600 hover:text-bocado-dark font-semibold py-4 rounded-2xl text-center block transition-colors"
          >
            Volver al inicio
          </Link>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          ¿Tienes preguntas? Contáctanos por WhatsApp
        </p>
      </div>
    </div>
  )
}

import { Suspense } from 'react'

export default function ConfirmacionPage({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <ConfirmacionContent orderNumber={params.orderNumber} />
    </Suspense>
  )
}
