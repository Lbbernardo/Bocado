import Image from 'next/image'

const PHOTOS = [
  { src: '/bocado/img/p6.jpg', alt: 'Compartiendo tequeños', col: 2, row: 2 },
  { src: '/bocado/img/p4.jpg', alt: 'Persona comiendo', col: 1, row: 1 },
  { src: '/bocado/img/p1.jpg', alt: 'Plato limpio', col: 1, row: 1 },
  { src: '/bocado/img/p7.jpg', alt: 'Vista superior', col: 2, row: 1 },
  { src: '/bocado/img/p9.jpg', alt: 'Con salsa', col: 1, row: 1 },
]

export default function Gallery() {
  return (
    <section style={{ backgroundColor: 'white' }} className="section-pad">
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ color: '#FF9E00', fontWeight: 700, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF9E00', display: 'inline-block' }} />
            HECHO CON QUESO Y MUCHO AMOR
          </p>
          <h2 style={{ fontFamily: 'var(--font-display), "Baloo 2", system-ui', fontWeight: 800, color: '#2E2A24', fontSize: 'clamp(2rem,4vw,2.8rem)' }}>
            Antojo a la vista
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: '200px', gap: '12px' }}>
          {PHOTOS.map(({ src, alt, col, row }) => (
            <div key={src} className="gallery-cell" style={{ gridColumn: `span ${col}`, gridRow: `span ${row}`, position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
              <Image src={src} alt={alt} fill sizes="(max-width:768px) 50vw, 25vw" className="gallery-img" style={{ objectFit: 'cover' }} />
            </div>
          ))}

          {/* Stat card */}
          <div style={{ backgroundColor: '#FF9E00', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 900, color: 'white', fontSize: '2.2rem', lineHeight: 1 }}>+50k</p>
            <p style={{ color: 'rgba(255,255,255,.85)', fontSize: '0.82rem', fontWeight: 600, textAlign: 'center', marginTop: '6px' }}>tequeños vendidos</p>
          </div>

          <div className="gallery-cell" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
            <Image src="/bocado/img/p3.jpg" alt="Caja Bocado" fill sizes="25vw" className="gallery-img" style={{ objectFit: 'cover' }} />
          </div>
        </div>
      </div>

    </section>
  )
}
