import Image from 'next/image'

export default function Product() {
  return (
    <section id="producto" style={{ backgroundColor: '#FBF5E9', padding: '96px 26px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'center' }} className="product-grid">

        {/* Foto */}
        <div style={{ position: 'relative' }}>
          <div style={{ borderRadius: '26px', overflow: 'hidden', transform: 'rotate(-1.5deg)', position: 'relative' }}>
            <Image
              src="/bocado/img/p5.jpg"
              alt="Cheese pull Bocado"
              width={580}
              height={460}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            {/* Tag */}
            <div style={{
              position: 'absolute', top: '20px', left: '20px',
              background: 'white', borderRadius: '999px',
              padding: '10px 18px',
              display: 'flex', alignItems: 'center', gap: '8px',
              boxShadow: '0 4px 20px rgba(0,0,0,.12)',
            }}>
              <span>🧀</span>
              <span style={{ fontWeight: 700, color: '#FF9E00', fontSize: '0.85rem' }}>Queso que estira</span>
            </div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <p style={{ color: '#FF9E00', fontWeight: 700, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF9E00', display: 'inline-block' }} />
            EL PRODUCTO
          </p>
          <h2 style={{ fontFamily: 'var(--font-display), "Baloo 2", system-ui', fontWeight: 800, color: '#2E2A24', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: '16px', lineHeight: 1.1 }}>
            Hechos con ingredientes que sí reconoces
          </h2>
          <p style={{ color: '#6B6358', lineHeight: 1.7, marginBottom: '28px' }}>
            Cada tequeño Bocado está elaborado con queso real, masa artesanal y el cariño de la receta venezolana de siempre. Nada de rellenos artificiales, nada de atajos.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              'Queso de verdad que estira en cada bocado',
              'Masa crujiente por fuera, suave por dentro',
              'Sin conservantes artificiales',
            ].map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{
                  width: '24px', height: '24px', flexShrink: 0,
                  backgroundColor: 'rgba(255,158,0,.12)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: '1px',
                }}>
                  <span style={{ color: '#FF9E00', fontSize: '13px', fontWeight: 900 }}>✓</span>
                </div>
                <span style={{ color: '#2E2A24', fontWeight: 500, fontSize: '0.95rem' }}>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
