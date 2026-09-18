import LandingHeader from '@/components/landing/LandingHeader'
import Hero from '@/components/landing/Hero'
import Benefits from '@/components/landing/Benefits'
import Product from '@/components/landing/Product'
import MarqueeRibbon from '@/components/landing/MarqueeRibbon'
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

async function getStoreIsOpen() {
  try {
    const supabase = createClient()
    const { data } = await supabase.from('store_config').select('store_is_open').single()
    return data?.store_is_open ?? true
  } catch {
    return true
  }
}

export default async function HomePage() {
  const [topProducts, storeIsOpen] = await Promise.all([getTopProducts(), getStoreIsOpen()])

  return (
    <>
      <LandingHeader />
      <Hero />
      <Benefits />
      <Product />
      <MarqueeRibbon />
      <HowToPrepare />
      <Gallery />
      <BuySection products={topProducts} storeIsOpen={storeIsOpen} />
      <Newsletter />
      <LandingFooter />
    </>
  )
}
