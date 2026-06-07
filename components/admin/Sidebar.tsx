'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Package, ShoppingBag, Settings, LogOut, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/admin/pedidos', icon: ShoppingBag, label: 'Pedidos' },
  { href: '/admin/clientes', icon: Users, label: 'Clientes' },
  { href: '/admin/productos', icon: Package, label: 'Productos' },
  { href: '/admin/configuracion', icon: Settings, label: 'Configuración' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside style={{
      width: '220px', minHeight: '100vh',
      backgroundColor: '#2E2A24',
      borderRight: '1px solid rgba(255,255,255,.06)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <Image src="/bocado/logo-w.png" alt="Bocado" width={100} height={34} style={{ height: '32px', width: 'auto' }} />
        <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: '6px' }}>
          Dashboard Admin
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link key={href} href={href} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 14px', borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: 600,
              backgroundColor: active ? 'rgba(255,158,0,.12)' : 'transparent',
              color: active ? '#FF9E00' : 'rgba(255,255,255,.5)',
              transition: 'all .15s',
            }}>
              <Icon size={17} />
              {label}
              {active && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#FF9E00' }} />}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '10px 14px', borderRadius: '12px',
          width: '100%', border: 'none', cursor: 'pointer',
          background: 'none', color: 'rgba(255,255,255,.3)',
          fontSize: '0.875rem', fontWeight: 600,
        }}>
          <LogOut size={17} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
