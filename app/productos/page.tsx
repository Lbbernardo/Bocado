import Navbar from '@/components/Navbar'
import { createPublicClient } from '@/lib/supabase/server'
import ProductsClient from './ProductsClient'

export const revalidate = 60

export default async function ProductosPage() {
  const supabase = createPublicClient()
  const [{ data: products }, { data: config }] = await Promise.all([
    supabase.from('products').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('store_config').select('store_is_open').single(),
  ])

  const allProducts = products ?? []
  const categories = Array.from(new Set(allProducts.map((p) => p.category)))
  const storeIsOpen = config?.store_is_open ?? true

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', backgroundColor: 'white', paddingTop: '68px' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #F0EDE8', padding: '40px 26px' }}>
          <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
            <span className="eyebrow">Menú</span>
            <h1 style={{
              fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 900,
              fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#2E2A24', lineHeight: 1.05,
            }}>
              Productos
            </h1>
            <p style={{ color: '#6B6358', fontSize: '0.9rem', marginTop: '6px' }}>
              Tequeños venezolanos auténticos — hechos con queso de verdad
            </p>
          </div>
        </div>

        {storeIsOpen ? (
          <ProductsClient products={allProducts} categories={categories} />
        ) : (
          <div style={{
            maxWidth: '480px', margin: '0 auto', padding: '80px 26px',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: '56px', display: 'block', marginBottom: '20px' }}>🧀</span>
            <h2 style={{
              fontFamily: 'var(--font-fraunces), Georgia, serif', fontWeight: 800,
              fontSize: '1.5rem', color: '#2E2A24', marginBottom: '10px',
            }}>
              En estos momentos estamos cerrados
            </h2>
            <p style={{ color: '#6B6358', fontSize: '0.95rem' }}>
              No estamos recibiendo pedidos en este momento. Vuelve a pasar más tarde.
            </p>
          </div>
        )}
      </div>
    </>
  )
}
