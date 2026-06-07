# Fase 3 — Producto y MVP
## BOCADO — Tequeños Venezolanos

---

## Visión del Producto

Una plataforma web minimalista y apetitosa donde los clientes piden tequeños venezolanos en menos de 2 minutos, y el dueño gestiona todo desde un dashboard limpio y accionable.

**Principio de diseño:** Cada elemento debe hacer al usuario sentir que ya puede saborear los tequeños.

---

## PRD — Product Requirements Document

### Resumen Ejecutivo
| Atributo | Valor |
|---------|------|
| Producto | Plataforma web D2C BOCADO |
| Usuarios | Clientes (público) + Dueño (admin) |
| Plataforma | Web responsive (mobile-first) |
| Lanzamiento MVP | 4–6 semanas desde inicio de desarrollo |
| Stack | Next.js 14 + Supabase + Vercel |

---

## Features — Priorización MoSCoW

### MUST HAVE (MVP)
- [x] Página principal con hero, productos y CTA
- [x] Catálogo de productos con fotos, precio y descripción
- [x] Carrito de compras (sin cuenta requerida)
- [x] Checkout con datos del cliente y método de entrega
- [x] Sistema de estados del pedido (9 estados)
- [x] Dashboard admin con login privado
- [x] Gestión de pedidos (ver, cambiar estado, cancelar)
- [x] Control de pickup activo/inactivo + fecha/horario
- [x] Gestión de productos (crear, editar, desactivar)
- [x] Notificaciones por email al cambiar estado
- [x] Página de seguimiento de pedido por número/teléfono
- [x] Página de confirmación post-pedido
- [x] Responsive design mobile-first

### SHOULD HAVE (Post-MVP)
- [ ] Notificaciones por WhatsApp
- [ ] Historial de pedidos del cliente (por teléfono/email)
- [ ] Analytics básicos en dashboard (pedidos/semana, ingresos)
- [ ] Múltiples puntos de pickup
- [ ] Fotos de productos cargadas desde admin
- [ ] Control de inventario/stock

### COULD HAVE (Futuro)
- [ ] Sistema de pagos con Stripe
- [ ] Programa de referidos con códigos únicos
- [ ] Suscripción mensual (BOCADO Club)
- [ ] App móvil nativa
- [ ] Sistema de reviews/reseñas

### WON'T HAVE (Fuera de alcance inicial)
- Marketplace multi-vendor
- Sistema de reservas para restaurante
- Programa de loyalty con puntos complejos
- Integración con apps de delivery externas

---

## Arquitectura Técnica

```
┌─────────────────────────────────────────────────────┐
│                    VERCEL (Deploy)                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│    NEXT.JS 14 APP ROUTER                            │
│    ├── /app/(store)/         → Tienda pública       │
│    │   ├── page.tsx          → Home                 │
│    │   ├── productos/        → Catálogo             │
│    │   ├── carrito/          → Cart                 │
│    │   ├── checkout/         → Pedido               │
│    │   ├── confirmacion/     → Éxito                │
│    │   └── pedido/[id]/      → Tracking             │
│    │                                                 │
│    └── /app/admin/           → Dashboard privado    │
│        ├── login/            → Auth                 │
│        ├── pedidos/          → Lista pedidos        │
│        ├── pedidos/[id]/     → Detalle pedido       │
│        ├── productos/        → CRUD productos       │
│        └── configuracion/    → Pickup + settings    │
│                                                      │
├─────────────────────────────────────────────────────┤
│                  SUPABASE                           │
│    ├── PostgreSQL Database                          │
│    ├── Supabase Auth (admin only)                  │
│    ├── Realtime (pedidos en vivo)                  │
│    └── Storage (imágenes de productos)             │
├─────────────────────────────────────────────────────┤
│                  RESEND                             │
│    └── Emails transaccionales de estado            │
└─────────────────────────────────────────────────────┘
```

---

## Schema de Base de Datos

### Tabla: `products`
```sql
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  price       DECIMAL(10,2) NOT NULL,
  image_url   TEXT,
  is_active   BOOLEAN DEFAULT true,
  stock       INTEGER DEFAULT NULL,  -- NULL = sin límite
  category    TEXT DEFAULT 'tequeños',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: `orders`
```sql
CREATE TABLE orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT UNIQUE NOT NULL,  -- BOC-2026-0001
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_email   TEXT,
  delivery_method  TEXT NOT NULL CHECK (delivery_method IN ('pickup', 'delivery')),
  delivery_address TEXT,
  pickup_date      DATE,
  pickup_time_slot TEXT,
  order_status     TEXT NOT NULL DEFAULT 'received' CHECK (
    order_status IN (
      'received',
      'confirmed',
      'payment_pending',
      'payment_received',
      'in_preparation',
      'ready_for_pickup',
      'scheduled_for_delivery',
      'delivered',
      'cancelled'
    )
  ),
  payment_status   TEXT DEFAULT 'pending',
  subtotal         DECIMAL(10,2) NOT NULL,
  delivery_fee     DECIMAL(10,2) DEFAULT 0,
  total            DECIMAL(10,2) NOT NULL,
  customer_note    TEXT,
  admin_note       TEXT,
  created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: `order_items`
```sql
CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,  -- snapshot del nombre al momento del pedido
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit_price  DECIMAL(10,2) NOT NULL,
  subtotal    DECIMAL(10,2) NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: `store_config`
```sql
CREATE TABLE store_config (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_enabled      BOOLEAN DEFAULT false,
  pickup_date         DATE,
  pickup_start_time   TIME,
  pickup_end_time     TIME,
  pickup_address      TEXT,
  pickup_instructions TEXT,
  delivery_enabled    BOOLEAN DEFAULT false,
  delivery_fee        DECIMAL(10,2) DEFAULT 0,
  delivery_zones      TEXT,  -- JSON string con zonas
  store_is_open       BOOLEAN DEFAULT true,
  min_order_amount    DECIMAL(10,2) DEFAULT 0,
  announcement        TEXT,  -- Banner de anuncio en home
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Tabla: `order_status_history`
```sql
CREATE TABLE order_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status  TEXT,
  new_status  TEXT NOT NULL,
  changed_by  TEXT DEFAULT 'admin',
  note        TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## Estados del Pedido — Lógica de Transición

```
received
    ↓
confirmed
    ↓
payment_pending
    ↓
payment_received
    ↓
in_preparation
    ↓
ready_for_pickup ──── (pickup)
    ó
scheduled_for_delivery (delivery)
    ↓
delivered
    
Desde cualquier estado → cancelled (solo admin)
```

### Mensajes por estado (plantillas)

| Estado | Mensaje al cliente |
|--------|------------------|
| `received` | "Tu pedido fue recibido correctamente. Estamos revisando disponibilidad." |
| `confirmed` | "Tu pedido fue confirmado. Ya puedes proceder con el pago." |
| `payment_pending` | "Tu pedido está confirmado. Por favor realiza el pago para continuar con la preparación." |
| `payment_received` | "Hemos recibido tu pago. Tu pedido está en preparación." |
| `in_preparation` | "Estamos preparando tu pedido con mucho amor. 🤎" |
| `ready_for_pickup` | "¡Tu pedido está listo para recoger! Puedes pasar el {fecha} entre {hora_inicio} y {hora_fin}." |
| `scheduled_for_delivery` | "Tu pedido será entregado el día {fecha}." |
| `delivered` | "Tu pedido fue entregado. ¡Gracias por comprar en BOCADO! 🧡" |
| `cancelled` | "Tu pedido fue cancelado. Si tienes preguntas, contáctanos." |

---

## Páginas y Componentes

### 1. Página Principal (`/`)
```
[HERO]
  - Logo BOCADO grande
  - Foto apetitosa de tequeños con queso derritiéndose
  - Headline: "Tequeños venezolanos. Listos en 15 minutos."
  - Subheadline: "Crunchy outside, cheesy inside."
  - CTA: "Hacer mi pedido →" (naranja, grande)
  - Indicador de pickup: "Pickup disponible este sábado 2PM–6PM" o banner deshabilitado

[PRODUCTOS DESTACADOS]
  - 3 cards de productos más vendidos
  - Foto, nombre, precio, "Agregar al carrito"

[CÓMO FUNCIONA]
  - 3 pasos: Elige → Pide → Recoge/Recibe
  - Íconos simples

[BENEFICIOS]
  - ❄️ Congelados para frescura
  - 🧀 Queso de verdad
  - ⚡ Air Fryer 12-14 min
  - 🇻🇪 Receta venezolana auténtica

[FOOTER]
  - Instagram link
  - WhatsApp link
  - "Hecho con ❤️ en [Ciudad]"
```

### 2. Catálogo de Productos (`/productos`)
```
[HEADER]
  - "Nuestros Tequeños"
  - Banner de pickup si está activo

[GRID DE PRODUCTOS]
  Por cada producto activo:
  - Imagen del producto
  - Nombre y descripción corta
  - Precio destacado
  - Selector de cantidad (+/-)
  - Botón "Agregar"

[CARRITO FLOTANTE]
  - Badge con número de items
  - Precio total
  - "Ver carrito →"
```

### 3. Carrito (`/carrito`)
```
[LISTA DE ITEMS]
  - Producto, cantidad, precio unitario, subtotal
  - Botón eliminar item
  - Modificar cantidad

[RESUMEN]
  - Subtotal
  - Delivery fee (si aplica)
  - Total

[CTA]
  - "Continuar con mi pedido →"
```

### 4. Checkout (`/checkout`)
```
[DATOS DEL CLIENTE]
  - Nombre completo *
  - Teléfono * (WhatsApp)
  - Email (opcional)

[MÉTODO DE ENTREGA]
  - Pickup (solo si está habilitado, muestra fecha/horario)
  - Delivery (si está habilitado, campo de dirección)

[NOTAS ADICIONALES]
  - Textarea opcional

[RESUMEN DEL PEDIDO]
  - Items, total

[INFORMACIÓN DE PAGO]
  - "Al confirmar, te enviaremos instrucciones de pago."
  - Métodos aceptados: Zelle / Venmo / Efectivo

[BOTÓN CONFIRMAR]
  - "Confirmar mi pedido" (naranja, grande)
```

### 5. Confirmación (`/confirmacion/[orderNumber]`)
```
[ÍCONO DE ÉXITO]
  - Check animado en naranja

[MENSAJE]
  - "¡Tu pedido fue recibido!"
  - Número de pedido: BOC-2026-0001
  - "Pronto te confirmaremos disponibilidad y detalles de pago."

[SIGUIENTE PASO]
  - "Revisa tu teléfono/email — te contactaremos pronto."
  - "Seguir comprando →"
```

### 6. Seguimiento (`/pedido/[orderNumber]`)
```
[HEADER]
  - Número de pedido
  - Estado actual (badge de color)

[TIMELINE DE ESTADOS]
  - Línea vertical con los 9 estados
  - Estado actual resaltado
  - Estados completados con check
  - Estados pendientes en gris

[DETALLE DEL PEDIDO]
  - Productos pedidos
  - Método de entrega
  - Total
  - Notas

[BÚSQUEDA POR TELÉFONO]
  - Si no tiene el link, puede buscar por número de teléfono
```

### 7. Dashboard Admin (`/admin`)

**Autenticación:** Login con email/password (Supabase Auth)

```
[SIDEBAR]
  - Logo BOCADO
  - Pedidos (con badge de nuevos)
  - Productos
  - Configuración
  - Cerrar sesión

[PÁGINA: PEDIDOS]
  - Filtros: Todos / Nuevos / Confirmados / Listos / Entregados / Cancelados
  - Tabla con: Número, Cliente, Productos, Total, Estado, Fecha, Acción
  - Click en pedido → Panel lateral con detalles completos y botones de acción

[PANEL DE PEDIDO]
  - Toda la info del cliente
  - Lista de items
  - Botones de acción por estado actual:
    [Confirmar pedido] [Marcar pago recibido] [En preparación]
    [Listo para recoger] [Entregado] [Cancelar]

[PÁGINA: PRODUCTOS]
  - Lista de productos con foto, precio, estado
  - Botón crear nuevo producto
  - Editar / activar / desactivar inline

[PÁGINA: CONFIGURACIÓN]
  - Toggle: Pickup activo/inactivo
  - Selector de fecha de pickup
  - Horario de inicio y fin
  - Dirección de pickup
  - Toggle: Delivery activo/inactivo
  - Tarifa de delivery
  - Anuncio del banner (texto libre)
```

---

## Flujo de Usuario Completo

```
CLIENTE
1. Entra a bocado.com (Instagram → link en bio)
2. Ve el hero con CTA "Hacer mi pedido"
3. Ve el catálogo de productos
4. Agrega tequeños al carrito (ej: 1 paquete de 50 uds)
5. Ve el carrito → revisa total → "Continuar"
6. Llena sus datos: Nombre, WhatsApp, método de entrega
7. Confirma el pedido
8. Ve pantalla de confirmación con número de pedido
9. Recibe email: "Pedido recibido"
   ↓
DUEÑO (dashboard)
10. Ve el pedido nuevo en dashboard (con notificación visual)
11. Revisa los detalles del pedido
12. Confirma el pedido → sistema envía email con instrucciones de pago
13. Cliente envía el pago (Zelle/Venmo)
14. Dueño marca "Pago recibido" → email automático
15. Prepara el pedido
16. Marca "Listo para recoger" → email con dirección y horario
    ó "Programado para entrega" → email con fecha
17. Entrega el pedido
18. Marca "Entregado" → email de gracias
```

---

## Roadmap por Sprints

### Sprint 1 (Semana 1) — Base
- Setup Next.js + Supabase + Tailwind + Vercel
- Schema de base de datos creado
- Variables de entorno configuradas
- Página principal (home) funcional
- Catálogo de productos funcional

### Sprint 2 (Semana 2) — Flujo de Compra
- Carrito de compras con estado global (Zustand)
- Checkout con validación de formulario
- Integración con Supabase para crear pedidos
- Página de confirmación con número de pedido

### Sprint 3 (Semana 3) — Admin Dashboard
- Login con Supabase Auth
- Lista de pedidos con filtros
- Panel de detalle de pedido
- Botones de cambio de estado
- Historial de estados por pedido

### Sprint 4 (Semana 4) — Notificaciones + Pickup
- Integración con Resend para emails transaccionales
- Todos los templates de email por estado
- Página de seguimiento de pedido
- Configuración de pickup en dashboard
- Control pickup activo/inactivo

### Sprint 5 (Semana 5) — Gestión de Productos
- CRUD de productos en dashboard
- Upload de imágenes a Supabase Storage
- Activar/desactivar productos
- Dashboard: Analytics básicos (KPIs del día)

### Sprint 6 (Semana 6) — QA y Lanzamiento
- Testing en móvil (iPhone + Android)
- Optimización de performance (Core Web Vitals)
- SEO básico (meta tags, OG images)
- Dominio personalizado (bocado.com o bocadotequeños.com)
- Lanzamiento 🚀

---

## Stack Completo con Versiones

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 14.x (App Router) | Framework frontend + API routes |
| React | 18.x | UI |
| TypeScript | 5.x | Tipado |
| Tailwind CSS | 3.x | Estilos |
| Supabase | Latest | DB + Auth + Storage + Realtime |
| Resend | Latest | Emails transaccionales |
| Zustand | 4.x | Estado del carrito |
| React Hook Form | 7.x | Formularios |
| Zod | 3.x | Validación |
| Vercel | Latest | Deploy + Edge |
| date-fns | Latest | Manejo de fechas |

---

## Variables de Entorno Necesarias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend (emails)
RESEND_API_KEY=
RESEND_FROM_EMAIL=pedidos@bocado.com

# App
NEXT_PUBLIC_APP_URL=https://bocado.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@bocado.com

# WhatsApp (futuro)
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
```

---

## KPIs del Producto

| Métrica | Objetivo MVP |
|--------|-------------|
| Tiempo para completar pedido | < 2 minutos |
| Tasa de abandono en checkout | < 30% |
| Tiempo de carga página principal | < 2 segundos |
| Mobile Lighthouse Score | > 85 |
| Uptime | 99.9% |

---

*Fase 3 completada — 2026-05-20*
