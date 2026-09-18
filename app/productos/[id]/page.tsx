import { createPublicClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ProductDetail from './ProductDetail'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', params.id)
    .single()
  return { title: data?.name ?? 'Producto — BOCADO' }
}

export const revalidate = 60

export default async function ProductPage({ params }: Props) {
  const supabase = createPublicClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', backgroundColor: 'white', paddingTop: '68px' }}>
        {/* Breadcrumb */}
        <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '18px 26px 0' }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#6B6358' }}>
            <Link href="/" style={{ color: '#6B6358', textDecoration: 'none' }}>Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/productos" style={{ color: '#6B6358', textDecoration: 'none' }}>Productos</Link>
            <ChevronRight size={12} />
            <span style={{ color: '#2E2A24', fontWeight: 600 }}>{product.name}</span>
          </nav>
        </div>

        <ProductDetail product={product} />
      </div>
    </>
  )
}
