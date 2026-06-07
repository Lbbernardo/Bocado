import Image from 'next/image'
import Link from 'next/link'

export default function Hero() {
  return (
    <section style={{
      backgroundColor: '#FBF5E9',
      paddingTop: '78px',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: '1180px',
        margin: '0 auto',
        padding: '60px 26px 0',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0',
        alignItems: 'center',
        minHeight: '620px',
      }} className="hero-grid">

        {/* ── COLUMNA IZQUIERDA ── */}
        <div style={{ paddingRight: '40px', paddingBottom: '60px' }}>

          <div className="anim-fade" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'white', borderRadius: '999px',
            padding: '8px 18px', marginBottom: '22px',
            boxShadow: '0 2px 12px rgba(0,0,0,.08)',
            animationDelay: '0s',
          }}>
            <span style={{ color: '#FF9E00' }}>♥</span>
            <span style={{ color: '#2E2A24', fontWeight: 700, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Auténticamente Venezolanos
            </span>
          </div>

          <h1 className="anim-up" style={{
            fontFamily: 'var(--font-display), "Baloo 2", system-ui, sans-serif',
            fontWeight: 800, lineHeight: 1.04, letterSpacing: '-0.01em', color: '#2E2A24',
            fontSize: 'clamp(2.8rem, 4.5vw, 4.8rem)',
            marginBottom: '16px', animationDelay: '0.1s',
          }}>
            El tequeño{' '}
            <span style={{ color: '#FF9E00' }}>crujiente</span>
            {' '}y lleno de queso, listo en minutos.
          </h1>

          <p className="anim-up" style={{ color: '#FF9E00', fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px', animationDelay: '0.2s' }}>
            Crunchy outside, cheesy inside.
          </p>

          <p className="anim-up" style={{ color: '#6B6358', lineHeight: 1.65, marginBottom: '32px', animationDelay: '0.25s' }}>
            Tequeños congelados, hechos con queso de verdad e ingredientes de calidad.
            Del freezer a la mesa en el tiempo de un capítulo.
          </p>

          <div className="anim-up" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '40px', animationDelay: '0.35s' }}>
            <Link href="#comprar" style={{
              backgroundColor: '#FF9E00', color: 'white', fontWeight: 700,
              padding: '14px 30px', borderRadius: '999px', textDecoration: 'none',
              fontSize: '0.95rem', boxShadow: '0 20px 50px -20px rgba(196,118,16,.6)', display: 'inline-block',
            }}>
              Comprar ahora →
            </Link>
            <a href="#preparar" style={{
              background: 'white', color: '#F07A12', fontWeight: 700,
              padding: '14px 30px', borderRadius: '999px', textDecoration: 'none',
              fontSize: '0.95rem', boxShadow: 'inset 0 0 0 2.5px rgba(255,158,0,.4)', display: 'inline-block',
            }}>
              Ver cómo se preparan
            </a>
          </div>

          <div className="anim-fade" style={{ display: 'flex', gap: '24px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,.08)', animationDelay: '0.45s' }}>
            {[
              { val: '12 min', label: 'en air fryer', icon: '⏱' },
              { val: '100%',   label: 'queso real',   icon: '🧀' },
              { val: '20 uds', label: '500 g / caja', icon: '📦' },
            ].map(({ val, label, icon }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <span>{icon}</span>
                <div>
                  <p style={{ fontWeight: 800, color: '#2E2A24', fontSize: '0.9rem', lineHeight: 1 }}>{val}</p>
                  <p style={{ color: '#6B6358', fontSize: '0.7rem' }}>{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── COLUMNA DERECHA: blob + foto ── */}
        <div className="anim-fade" style={{
          position: 'relative',
          height: '620px',
          animationDelay: '0.1s',
        }}>
          {/* Blob — centrado en la columna, se sale por arriba y derecha */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            left: '50%',
            transform: 'translateX(-55%)',
            width: '520px', height: '520px',
            background: '#FF9E00',
            borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
            animation: 'blob 8s ease-in-out infinite',
            zIndex: 1,
          }} />

          {/* Foto — centrada sobre el blob */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-55%, -50%) rotate(-2deg)',
            zIndex: 3,
            width: '400px',
            height: '480px',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 30px 70px -20px rgba(70,50,20,.5)',
          }}>
            <Image
              src="/bocado/img/p2.jpg"
              alt="Tequeños Bocado"
              fill
              sizes="400px"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>

          {/* Chip superior izquierdo */}
          <div style={{
            position: 'absolute', top: '60px', left: '-10px', zIndex: 6,
            background: 'white', borderRadius: '999px',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 6px 24px rgba(0,0,0,.12)',
            whiteSpace: 'nowrap',
          }}>
            <span>❄️</span>
            <span style={{ fontWeight: 600, color: '#2E2A24', fontSize: '0.82rem' }}>Congelados para frescura</span>
          </div>

          {/* Chip derecho */}
          <div style={{
            position: 'absolute', bottom: '160px', right: '10px', zIndex: 6,
            background: 'white', borderRadius: '999px',
            padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 6px 24px rgba(0,0,0,.12)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ color: '#FF9E00' }}>🌿</span>
            <span style={{ fontWeight: 600, color: '#2E2A24', fontSize: '0.82rem' }}>Ingredientes de calidad</span>
          </div>

          {/* Sello giratorio */}
          <div style={{
            position: 'absolute', bottom: '60px', right: '20px', zIndex: 6,
            width: '96px', height: '96px',
            backgroundColor: '#2E2A24',
            borderRadius: '50%',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', textAlign: 'center',
            padding: '10px',
            animation: 'spin-slow 26s linear infinite',
            boxShadow: '0 8px 30px rgba(0,0,0,.3)',
          }}>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.4 }}>HECHO CON</p>
            <p style={{ color: '#FF9E00', fontWeight: 900, fontSize: '15px', lineHeight: 1, margin: '2px 0' }}>QUESO</p>
            <p style={{ color: 'rgba(255,255,255,.7)', fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.4 }}>Y MUCHO AMOR</p>
          </div>
        </div>
      </div>

      {/* Wave */}
      <svg viewBox="0 0 1440 60" style={{ width: '100%', display: 'block', marginBottom: '-2px' }}>
        <path fill="white" d="M0,40 Q360,0 720,32 Q1080,56 1440,16 L1440,60 L0,60 Z" />
      </svg>
    </section>
  )
}
