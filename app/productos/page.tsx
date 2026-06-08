import Navbar from '@/components/Navbar'
import { createPublicClient } from '@/lib/supabase/server'
import ProductsClient from './ProductsClient'

export const revalidate = 60

export default async function ProductosPage() {
  const supabase = createPublicClient()
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('sort_order')

  const allProducts = products ?? []
  const categories = Array.from(new Set(allProducts.map((p) => p.category)))

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-16">
        {/* Header */}
        <div className="border-b border-gray-100 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-black text-bocado-dark">
              Productos
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Tequeños venezolanos auténticos — hechos con queso de verdad
            </p>
          </div>
        </div>

        <ProductsClient products={allProducts} categories={categories} />
      </div>
    </>
  )
}
