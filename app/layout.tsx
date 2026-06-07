import type { Metadata, Viewport } from 'next'
import { Poppins, Baloo_2 } from 'next/font/google'
import './globals.css'
import dynamic from 'next/dynamic'

// Load cart UI components client-only to avoid hydration mismatch with localStorage
const CartToast = dynamic(() => import('@/components/CartToast'), { ssr: false })
const CartBar = dynamic(() => import('@/components/CartBar'), { ssr: false })
const CartHydration = dynamic(() => import('@/components/CartHydration'), { ssr: false })
const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false })

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
})

const baloo = Baloo_2({
  weight: ['600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'BOCADO — Tequeños Venezolanos',
  description:
    'Tequeños venezolanos congelados, listos en 15 minutos. Crunchy outside, cheesy inside.',
  openGraph: {
    title: 'BOCADO — Tequeños Venezolanos',
    description: 'Crunchy outside, cheesy inside.',
    type: 'website',
    siteName: 'BOCADO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BOCADO — Tequeños Venezolanos',
    description: 'Crunchy outside, cheesy inside.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFA600',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${poppins.variable} ${baloo.variable}`}>
      <body className="font-poppins bg-white text-bocado-dark antialiased">
        {children}
        <CartHydration />
        <CartToast />
        <CartBar />
        <ChatWidget />
      </body>
    </html>
  )
}
