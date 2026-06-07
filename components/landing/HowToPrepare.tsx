const METHODS = [
  {
    icon: '🌀',
    title: 'Air Fryer',
    time: '12–14 minutos',
    steps: [
      'Precalienta la air fryer a 180 °C.',
      'Acomoda los tequeños sin amontonar, directo del congelador.',
      'Cocina 12–14 min hasta que estén dorados y crujientes.',
      'Sirve de inmediato y disfruta.',
    ],
  },
  {
    icon: '🔥',
    title: 'Horno',
    time: '15–18 minutos',
    steps: [
      'Precalienta el horno a 200 °C (400 °F).',
      'Coloca en bandeja con papel pergamino.',
      'Hornea 15–18 min hasta dorar bien.',
      'Deja reposar 2 min antes de servir.',
    ],
  },
]

export default function HowToPrepare() {
  return (
    <section id="preparar" style={{ backgroundColor: 'white', padding: '96px 26px' }}>
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p style={{ color: '#FF9E00', fontWeight: 700, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF9E00', display: 'inline-block' }} />
            LISTOS PARA PREPARAR
          </p>
          <h2 style={{ fontFamily: 'var(--font-display), "Baloo 2", system-ui', fontWeight: 800, color: '#2E2A24', fontSize: 'clamp(2rem,4vw,2.8rem)', marginBottom: '16px' }}>
            Del freezer a la mesa, en minutos
          </h2>
          <p style={{ color: '#6B6358', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
            Sin descongelar. Elige tu método favorito y disfruta tequeños recién hechos cuando se te antoje.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }} className="prep-grid">
          {METHODS.map(({ icon, title, time, steps }) => (
            <div key={title} style={{
              border: '2px solid #F0EDE8',
              borderRadius: '26px',
              padding: '36px',
              backgroundColor: 'white',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div style={{
                  width: '64px', height: '64px',
                  backgroundColor: '#FF9E00',
                  borderRadius: '16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '28px', flexShrink: 0,
                }}>
                  {icon}
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#2E2A24', fontSize: '1.3rem' }}>{title}</p>
                  <p style={{ color: '#FF9E00', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⏱ {time}
                  </p>
                </div>
              </div>

              <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {steps.map((step, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <span style={{
                      width: '28px', height: '28px', flexShrink: 0,
                      backgroundColor: '#FBF5E9',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, color: '#FF9E00',
                    }}>
                      {i + 1}
                    </span>
                    <span style={{ color: '#6B6358', fontSize: '0.9rem', lineHeight: 1.5, paddingTop: '4px' }}>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
