import type { Metadata, Viewport } from 'next'
import { Poppins, Baloo_2 } from 'next/font/google'
import './globals.css'
import ChatWidget from '@/components/ChatWidget'
import CartToast from '@/components/CartToast'
import CartBar from '@/components/CartBar'
import CartHydration from '@/components/CartHydration'

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
