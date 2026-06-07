'use client'

import { Heart, Snowflake, Leaf } from 'lucide-react'

const ITEMS = [
  { icon: <Heart size={24} color="#FF9E00" />, title: 'Auténticamente venezolanos', desc: 'La receta de siempre, esa que sabe a casa.' },
  { icon: <span style={{ fontSize: '22px' }}>🧀</span>, title: 'Queso de verdad', desc: 'Relleno generoso que estira en cada mordida.' },
  { icon: <Leaf size={24} color="#FF9E00" />, title: 'Ingredientes de calidad', desc: 'Masa fresca, sin rellenos raros ni atajos.' },
  { icon: <Snowflake size={24} color="#FF9E00" />, title: 'Congelados para frescura', desc: 'Listos cuando tú quieras, sin perder sabor.' },
]

export default function Benefits() {
  return (
    <section style={{ backgroundColor: 'white', padding: '0 26px 80px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginTop: '-46px',
        }} className="benefits-grid">
          {ITEMS.map(({ icon, title, desc }) => (
            <div key={title} style={{
              backgroundColor: 'white',
              borderRadius: '26px',
              padding: '28px 24px',
              boxShadow: '0 18px 50px -24px rgba(70,50,20,.2)',
              transition: 'transform .3s',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-6px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div style={{
                width: '54px', height: '54px',
                backgroundColor: '#FBF5E9',
                borderRadius: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                {icon}
              </div>
              <p style={{ fontWeight: 700, color: '#2E2A24', fontSize: '0.95rem', marginBottom: '6px' }}>{title}</p>
              <p style={{ color: '#6B6358', fontSize: '0.85rem', lineHeight: 1.55 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
