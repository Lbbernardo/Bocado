const TAGLINE = 'Crunchy outside, cheesy inside'

export default function MarqueeRibbon() {
  const items = Array.from({ length: 16 })
  return (
    <div className="marquee-ribbon">
      <div className="marquee-track">
        {items.map((_, i) => (
          <span key={i}>{TAGLINE} ·</span>
        ))}
      </div>
    </div>
  )
}
