'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Clock, Phone, CreditCard, Smartphone } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Reveal from '@/components/landing/Reveal'

interface Props {
  params: { orderNumber: string }
}

function ConfirmacionContent({ orderNumber }: { orderNumber: string }) {
  const searchParams = useSearchParams()
  const paymentType = searchParams.get('payment') // 'stripe' | null

  const isStripe = paymentType === 'stripe'

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', backgroundColor: '#FBF5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', paddingTop: '84px', paddingBottom: '48px' }}>
        <Reveal style={{ maxWidth: '460px', width: '100%' }}>
          {/* Success card */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,.06)', textAlign: 'center', marginBottom: '16px' }}>
            {/* Icon */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div style={{ width: '72px', height: '72px', backgroundColor: '#ECFDF5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={40} color="#22C55E" />
              </div>
            </div>

            <span className="eyebrow" style={{ justifyContent: 'center' }}>Bocado</span>

            <h1 style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 900, fontSize: '1.8rem', color: '#2E2A24', marginBottom: '10px' }}>
              {isStripe ? '¡Pago recibido!' : '¡Pago registrado!'} 🧡
            </h1>

            <p style={{ color: '#6B6358', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
              {isStripe
                ? 'Tu pago fue procesado correctamente. Confirmaremos tu pedido en breve.'
                : 'Recibimos tu aviso de pago por Zelle. Lo verificaremos y confirmaremos tu pedido pronto.'}
            </p>

            {/* Order number */}
            <div style={{ backgroundColor: '#FBF5E9', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
              <p style={{ color: '#6B6358', fontSize: '0.85rem', marginBottom: '4px' }}>Número de pedido</p>
              <p style={{ fontWeight: 900, color: '#FF9E00', fontSize: '1.9rem', letterSpacing: '-0.02em' }}>
                {orderNumber}
              </p>
              <p style={{ color: '#A39C8F', fontSize: '0.75rem', marginTop: '8px' }}>
                Guarda este número para seguir tu pedido
              </p>
            </div>

            {/* Payment badge */}
            <div
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '9px 16px', borderRadius: '6px 14px 6px 14px', fontSize: '0.85rem', fontWeight: 600,
                marginBottom: '24px',
                backgroundColor: isStripe ? '#EEF2FF' : '#F5F3FF',
                color: isStripe ? '#4338CA' : '#7C3AED',
              }}
            >
              {isStripe ? <CreditCard size={14} /> : <Smartphone size={14} />}
              {isStripe ? 'Pagado con tarjeta (Stripe)' : 'Pago por Zelle enviado'}
            </div>

            {/* Next steps */}
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontWeight: 800, color: '#2E2A24', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                ¿Qué sigue?
              </h3>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255,158,0,.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Clock size={14} color="#FF9E00" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#2E2A24', fontSize: '0.88rem' }}>
                    Confirmamos tu pago
                  </p>
                  <p style={{ color: '#6B6358', fontSize: '0.78rem' }}>
                    {isStripe
                      ? 'Verificamos el pago con Stripe y confirmamos tu pedido'
                      : 'Verificamos la transferencia de Zelle y confirmamos tu pedido'}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: 'rgba(255,158,0,.12)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                  <Phone size={14} color="#FF9E00" />
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: '#2E2A24', fontSize: '0.88rem' }}>
                    Te avisamos
                  </p>
                  <p style={{ color: '#6B6358', fontSize: '0.78rem' }}>
                    Recibirás una notificación cuando tu pedido esté confirmado y en preparación
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link href={`/pedido/${orderNumber}`} className="btn-pill primary" style={{ width: '100%', padding: '15px' }}>
              Seguir mi pedido
            </Link>

            <Link
              href="/"
              style={{
                width: '100%', backgroundColor: 'white', border: '1.5px solid #F0EDE8', color: '#6B6358',
                fontWeight: 700, padding: '15px', borderRadius: '14px', textAlign: 'center', textDecoration: 'none', display: 'block',
              }}
            >
              Volver al inicio
            </Link>
          </div>

          <p style={{ textAlign: 'center', color: '#A39C8F', fontSize: '0.78rem', marginTop: '24px' }}>
            ¿Tienes preguntas? Contáctanos por WhatsApp
          </p>
        </Reveal>
      </div>
    </>
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
