import LandingHeader from '@/components/landing/LandingHeader'
import Hero from '@/components/landing/Hero'
import Benefits from '@/components/landing/Benefits'
import Product from '@/components/landing/Product'
import HowToPrepare from '@/components/landing/HowToPrepare'
import Gallery from '@/components/landing/Gallery'
import BuySection from '@/components/landing/BuySection'
import Newsletter from '@/components/landing/Newsletter'
import LandingFooter from '@/components/landing/LandingFooter'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 60

async function getTopProducts() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
      .limit(3)
    return data ?? []
  } catch {
    return []
  }
}

export default async function HomePage() {
  const topProducts = await getTopProducts()

  return (
    <>
      <LandingHeader />
      <Hero />
      <Benefits />
      <Product />
      <HowToPrepare />
      <Gallery />
      <BuySection products={topProducts} />
      <Newsletter />
      <LandingFooter />
    </>
  )
}
