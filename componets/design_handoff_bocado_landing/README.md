# Handoff: Landing page de Bocado (Tequeños Venezolanos)

## Resumen
Landing page de una sola vista para vender tequeños venezolanos congelados de la marca **Bocado**.
Objetivo principal: que el visitante compre (CTA "Comprar ahora" / "Pídelos ya" → sección de compra con selector de cantidad y total en vivo).
Idioma: español. Tono: cálido, apetitoso, "food-forward", con el naranja vibrante de la marca como color protagonista.

## Sobre los archivos de diseño
Los archivos de este paquete (`Bocado.html` + `assets/` + `screenshots/`) son una **referencia de diseño construida en HTML/CSS/JS vanilla**: un prototipo que muestra el aspecto y el comportamiento buscados, **no código de producción para copiar tal cual**.

La tarea es **recrear este diseño en un codebase real**, usando sus patrones y componentes. Las capturas en `screenshots/` muestran el resultado esperado de cada sección.

## Fidelidad
**Alta fidelidad (hi-fi).** Colores, tipografía, espaciados, fotos e interacciones son finales. Recrea la UI fiel al diseño.

---

## Stack recomendado: Next.js (App Router) + Tailwind CSS

Para una landing de marketing es la mejor opción:
- **Next.js (App Router)** → render estático/SSG, excelente SEO y meta tags, imágenes optimizadas con `next/image`, despliegue trivial en Vercel.
- **Tailwind CSS** → mapea 1:1 con los tokens del diseño y mantiene el CSS pequeño y consistente.
- **TypeScript** → recomendado.

> Si tu proyecto ya usa otro framework (Vue/Nuxt, Astro, Remix…), aplica la misma estructura de componentes y tokens; nada aquí es exclusivo de Next.

### Estructura de componentes sugerida
```
app/
  layout.tsx              # importa fuentes (Baloo 2 + Poppins) y globals.css
  page.tsx                # ensambla las secciones en orden
  globals.css             # @tailwind + capa base (scroll-smooth, colores de selección)
components/
  Header.tsx              # sticky + nav + menú móvil (client component)
  Hero.tsx                # titular, blob animado, foto, chips, sello
  Benefits.tsx            # 4 tarjetas
  Product.tsx             # foto cheese-pull + lista con checks
  HowToPrepare.tsx        # 2 tarjetas (air fryer / horno)
  Gallery.tsx             # mosaico de fotos + tarjeta de stat
  BuySection.tsx          # copy + garantías + PriceCard
  PriceCard.tsx           # stepper de cantidad + total (client component)
  WhereToBuy.tsx          # chips de retailers
  Newsletter.tsx          # formulario de email (client component)
  Footer.tsx
  Icon.tsx                # wrapper de los SVG (o usa lucide-react)
  ui/Button.tsx           # variantes primary / ghost / white
lib/
  reveal.ts               # hook useReveal() para animar al hacer scroll (IntersectionObserver)
public/
  bocado/                 # mover aquí el contenido de assets/
```
Marca como **`"use client"`** solo: `Header`, `PriceCard`, `Newsletter` y el hook de reveal. El resto pueden ser server components.

---

## Design tokens

### `tailwind.config.ts`
```ts
import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange:      "#FF9E00",   // primario
        "orange-2":  "#FFA600",   // naranja de marca alterno
        "orange-deep":"#F07A12",  // hover / texto naranja sobre claro
        yellow:      "#FFC107",   // acento (sol, ribbon, estrellas)
        cream:       "#FBF5E9",   // fondo de secciones suaves
        "cream-2":   "#FDF9F0",   // fondo del header (con opacidad)
        ink:         "#2E2A24",   // texto / footer
        "ink-soft":  "#6B6358",   // texto secundario
      },
      fontFamily: {
        display: ['"Baloo 2"', "system-ui", "sans-serif"], // titulares
        sans:    ['"Poppins"', "system-ui", "sans-serif"], // texto / UI
      },
      maxWidth: { content: "1180px" },
      borderRadius: { card: "26px", pill: "999px" },
      boxShadow: {
        soft: "0 24px 60px -28px rgba(196,118,16,.55)",
        card: "0 18px 40px -24px rgba(70,50,20,.35)",
      },
    },
  },
} satisfies Config;
```

### Tipografía
- **Display / titulares:** `"Baloo 2"` (600/700/800) — redondeada, juguetona.
- **Texto / UI:** `"Poppins"` (400/500/600/700).
- En Next: usa `next/font/google` para `Baloo_2` y `Poppins` y expónlas como variables CSS.
- Titulares: `letter-spacing: -.01em`, `line-height: 1.04`.
- **Escala fluida** (clamp): h1 `clamp(2.6rem,5.6vw,4.6rem)`; h2 de sección `clamp(2rem,4vw,3rem)`; body `1rem–1.12rem`.

### Espaciado / layout
- Ancho de contenido: `1180px`, centrado, padding lateral `26px` (→ `18px` en móvil).
- Padding vertical de sección: `96px` (→ `66px` en móvil).
- Radio de tarjetas grandes `26px`; botones y chips son **píldora** (`999px`).

---

## Secciones (orden vertical) — ver `screenshots/`

| # | Sección | Captura | Notas clave |
|---|---|---|---|
| 0 | **Header** | (en 00) | Sticky, blur, altura 78px; al hacer scroll >12px gana sombra. Móvil → hamburguesa fullscreen. |
| 0 | **Hero** | `00-hero.png` | Grid 2 col `1.05fr/.95fr`. Blob naranja animado, foto rotada -2°, sello giratorio, 2 chips flotantes, 3 métricas. **El hero NO anima (visible al instante).** |
| 1 | **Beneficios** | `01-benefits.png` | 4 tarjetas blancas, icono en cuadro 54px fondo crema, **icono color naranja**. Montadas sobre el hero con `margin-top:-46px`. Hover: `translateY(-6px)`. |
| 2 | **Producto** | `02-producto.png` | Foto cheese-pull (fondo oscuro) rotada -1.5° + tag "🧀 Queso que estira"; copy + lista de 3 checks naranjas. |
| 3 | **Cómo preparar** | `03-preparar.png` | 2 tarjetas con borde, badge naranja 64px, `<ol>` con números en círculos crema. Air Fryer 12–14 min · Horno 15–18 min. |
| 4 | **Galería** | `04-gallery.png` | Mosaico grid 4 col, `auto-rows:200px`. 1 celda destacada 2×2, 1 ancha 2×1, resto 1×1; 1 tarjeta naranja "+50k". Zoom de imagen en hover. |
| 5 | **Comprar** | `05-comprar.png` | Copy + 3 garantías; PriceCard con ribbon "MÁS VENDIDO", specs, rating, precio `$12.99` (antes `$15.99`), stepper + "Agregar al carrito". |
| 6 | **Dónde comprar** | — | 5 chips de retailers (placeholder). |
| 7 | **Newsletter** | `06-newsletter.png` | Banda naranja con patrón de tequeños, logo blanco, captura de email (descuento 10%). |
| 8 | **Footer** | `07-footer.png` | Fondo tinta `#2E2A24`, marca + redes + 3 columnas de enlaces + barra legal. |

---

## Componentes y detalle

### Botón (`ui/Button.tsx`)
Píldora, `font-family: display`, peso 700, padding `.92em 1.5em`, transición `.18s`.
- **primary**: bg `orange`, texto blanco, sombra naranja. Hover: `-translate-y-0.5` + bg `orange-deep`.
- **ghost**: bg blanco, texto `orange-deep`, borde interior `inset 0 0 0 2.5px rgba(255,158,0,.35)`. Hover: borde sólido naranja.
- **white**: bg blanco, texto naranja (para fondos oscuros/naranjas).

### Hero
- **Blob**: círculo con `border-radius` orgánico animado (keyframes 14s) + gradiente radial naranja.
- **Foto**: rotada `-2deg`, `rounded-[30px]`, `object-cover`, sombra fuerte.
- **Sello** circular giratorio (keyframes 26s) "HECHO CON QUESO Y MUCHO AMOR".
- **Chips** blancos absolutos con icono naranja.
- **Métricas**: 12 min air fryer · 100% queso real · 20 uds / 500g.
- Onda SVG de transición hacia el fondo crema.

### PriceCard (estado en cliente)
- Precio unitario `$12.99`. Stepper `+/−` (1–20) actualiza cantidad, **total = 12.99 × n** y la nota ("ahorra 18%" o "envío gratis 🎉" desde 3 cajas).
- Producto: "Caja Bocado · 20 unidades · 500 g". Rating 4.9 (estrellas amarillas). Ribbon diagonal amarillo.

---

## Interacciones y comportamiento

1. **Header scrolled**: añade sombra cuando `scrollY > 12`.
2. **Menú móvil**: overlay fullscreen; se cierra al hacer clic en un enlace.
3. **Reveal on scroll**: secciones aparecen (fade + subir 26px) al entrar al viewport. En el prototipo se hace con `getBoundingClientRect`; en React usa un hook `useReveal()` con **IntersectionObserver** (`threshold ~0.15`, `rootMargin` negativo abajo). **El hero queda excluido** (visible siempre). Respeta `prefers-reduced-motion`.
4. **Stepper + precio en vivo** (ver PriceCard).
5. **Toast**: al "Agregar al carrito" o suscribirse, sube un toast inferior ~2.6s.
6. **Newsletter**: `onSubmit` previene envío, limpia el input y muestra toast.
7. **Smooth scroll** por anclas.

### Estado necesario
- `qty` (1–20) → deriva `total` y la nota.
- `mobileMenuOpen`, `scrolled`, `toast {visible, message}`.
- En producción: conectar "Agregar al carrito" y newsletter a tu checkout/servicio reales (hoy son simulados con un toast).

### Responsive (breakpoints)
- `≤980px` (`md`): nav→hamburguesa; hero, producto y compra a 1 columna; beneficios y footer a 2 columnas; pasos apilados; galería 2 columnas.
- `≤560px` (`sm`): padding lateral 18px; beneficios 1 columna; newsletter y footer apilados; secciones a 66px.

---

## Assets
Todo en `assets/`. Muévelo a `public/bocado/` (o tu carpeta de estáticos) y actualiza rutas. Fotos del cliente optimizadas a JPEG ~1200px (~150 KB c/u) en `assets/img/`.

| Archivo | Uso |
|---|---|
| `assets/logo.png` | Logo Bocado naranja (transparente) — header |
| `assets/logo-w.png` | Logo Bocado blanco — newsletter y footer |
| `assets/pattern.svg` | Patrón de tequeños en contorno (fondo de la banda naranja) |
| `assets/img/p2.jpg` | Hero — manos estirando el queso |
| `assets/img/p5.jpg` | Producto — cheese pull dramático (fondo oscuro) |
| `assets/img/p6.jpg` | Galería destacada — compartiendo |
| `assets/img/p4.jpg` | Galería — persona comiendo |
| `assets/img/p1.jpg` | Galería — plato limpio |
| `assets/img/p7.jpg` | Galería ancha — vista superior con salsas |
| `assets/img/p9.jpg` | Galería — con salsa de queso |
| `assets/img/p10.jpg` | Galería — recién servido |
| `assets/img/p3.jpg` | Galería — caja Bocado abierta |
| `assets/img/p8.jpg` | PriceCard — caja Bocado (`object-position: left`) |

**Iconos:** en el prototipo son SVG inline (sprite `<symbol>` al inicio del `<body>`): copo de nieve, air fryer, horno, queso, hoja, corazón, tequeño, check, camión, reloj, estrella, flecha, escudo, redes (IG/TikTok/WhatsApp). Trazo redondeado, `currentColor`. Puedes copiarlos a un `<Icon>` o reemplazarlos por **lucide-react** (`Snowflake`, `Microwave`, `CookingPot`, `Heart`, `Leaf`, `Check`, `Truck`, `Clock`, `Star`, `ArrowRight`, `Shield`, etc.).

---

## Archivos en este paquete
- `README.md` — este documento.
- `Bocado.html` — prototipo completo (HTML + CSS + JS en un solo archivo; abre directo en el navegador, solo necesita internet para las fuentes).
- `assets/` — logos, patrón y fotos optimizadas.
- `screenshots/` — referencia visual de cada sección (00–07).

## Cómo recrearlo (pasos)
1. Crea el proyecto: `npx create-next-app@latest bocado --ts --tailwind --app`.
2. Pega los **tokens** en `tailwind.config.ts` y carga las fuentes con `next/font/google` (Baloo 2 + Poppins).
3. Mueve `assets/` → `public/bocado/` y usa `next/image`.
4. Crea los componentes de `components/` (lista arriba) y ensámblalos en `app/page.tsx` en orden.
5. Implementa las **interacciones** con estado de React + el hook `useReveal()`.
6. Compara cada sección contra `screenshots/` hasta que coincida.
7. Conecta carrito/newsletter a tus servicios reales y añade meta tags / Open Graph.

> Atajo con Claude Code: *"Lee `design_handoff_bocado_landing/README.md` y recrea esta landing en Next.js + Tailwind siguiendo la estructura de componentes y los tokens. Usa las imágenes de `assets/` y compara con `screenshots/`."*
