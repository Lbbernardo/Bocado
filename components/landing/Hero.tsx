import Link from 'next/link'

export default function Hero() {
  return (
    <section className="bocado-hero" aria-labelledby="hero-heading">
      <video className="bocado-hero-video" src="/bocado/video/hero.mp4" autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
      <div className="bocado-hero-shade" />
      <div className="bocado-hero-content">
        <p className="bocado-hero-eyebrow"><span aria-hidden="true">♥</span> Auténticamente venezolanos</p>
        <h1 id="hero-heading">Crujientes por fuera.<br /><span>Puro queso por dentro.</span></h1>
        <p className="bocado-hero-description">Tequeños venezolanos congelados, hechos con queso de verdad. Listos en tu air fryer en 12–14 minutos.</p>
        <div className="bocado-hero-actions">
          <Link className="bocado-hero-primary" href="#comprar">Ver productos <span aria-hidden="true">→</span></Link>
          <a className="bocado-hero-secondary" href="#preparar">Cómo prepararlos</a>
        </div>
        <ul className="bocado-hero-facts" aria-label="Características">
          <li><strong>12–14 min</strong><span>en air fryer</span></li>
          <li><strong>Queso real</strong><span>en cada bocado</span></li>
          <li><strong>Congelados</strong><span>listos cuando quieras</span></li>
        </ul>
        <Link className="bocado-hero-tracking" href="/pedido/buscar">¿Ya tienes un pedido? <span>Síguelo aquí →</span></Link>
      </div>
    </section>
  )
}
