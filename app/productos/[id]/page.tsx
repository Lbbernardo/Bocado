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
      <div className="min-h-screen bg-white pt-16">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-1.5 text-xs text-gray-400">
            <Link href="/" className="hover:text-bocado-dark transition-colors">Inicio</Link>
            <ChevronRight size={12} />
            <Link href="/productos" className="hover:text-bocado-dark transition-colors">Productos</Link>
            <ChevronRight size={12} />
            <span className="text-bocado-dark font-medium">{product.name}</span>
          </nav>
        </div>

        <ProductDetail product={product} />
      </div>
    </>
  )
}
