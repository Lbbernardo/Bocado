# BOCADO — Tequeños Venezolanos

> Plataforma web D2C para pedidos online de tequeños venezolanos congelados listos para preparar.

**Tagline:** Crunchy outside, cheesy inside.
**Estado actual:** Fase 1 → Fase 7 — Completado ✅

---

## Idea en una línea
Tienda online donde los clientes piden tequeños venezolanos congelados con pickup o delivery, y el dueño gestiona todo desde un dashboard administrativo con control de estados en tiempo real.

## Branding
- **Colores:** #FFA600 (naranja) · #FFC107 (amarillo) · #FFFFFF (blanco)
- **Tipografía:** Poppins Bold
- **Íconos clave:** Keep Frozen · Air Fryer 12-14 min · Oven 15-18 min · Queso Real · Hecho con Amor

## Stack Técnico
| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 14 App Router + Tailwind CSS |
| Base de datos | Supabase (PostgreSQL) |
| Auth admin | Supabase Auth |
| Deploy | Vercel |
| Emails | Resend |
| Pagos (fase 1) | Manual — Zelle / Venmo / Efectivo |
| Pagos (futuro) | Stripe |
| Notificaciones (futuro) | WhatsApp Business API |
| Automatización | n8n |

## Estructura del proyecto
```
bocado/
├── tracker/
│   └── ProjectTracker.jsx     ← Dashboard de seguimiento del negocio
├── docs/
│   ├── fase1-discovery.md     ← Análisis del mercado y cliente
│   ├── fase2-negocio.md       ← Modelo de ingresos y funnel
│   ├── fase3-mvp.md           ← PRD + arquitectura técnica
│   ├── fase4-agentes.md       ← Sistema de agentes IA
│   ├── fase5-gtm.md           ← Estrategia de lanzamiento
│   ├── fase6-automatizacion.md← Workflows y escala
│   └── fase7-ejecucion.md     ← Plan de acción 7 días
└── README.md
```

## Fases del proyecto
| # | Fase | Estado |
|---|------|--------|
| 1 | Discovery del Negocio | ✅ Completado |
| 2 | Diseño del Negocio | ✅ Completado |
| 3 | Producto y MVP | ✅ Completado |
| 4 | AI Agent System | ✅ Completado |
| 5 | Go To Market | ✅ Completado |
| 6 | Automatización y Escala | ✅ Completado |
| 7 | Ejecución | ✅ Completado |

---
*Generado por AI Business Developer — 2026-05-20*
