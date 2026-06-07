# Fase 7 — Ejecución
## BOCADO — Tequeños Venezolanos

---

## Plan de Acción — 7 Días

### Día 1 (Martes) — Cimientos Técnicos
**Objetivo:** Proyecto configurado y corriendo localmente.

- [ ] Crear repositorio GitHub: `bocado-web`
- [ ] Inicializar proyecto Next.js 14: `npx create-next-app@latest bocado-web`
- [ ] Configurar Tailwind CSS + fuente Poppins (Google Fonts)
- [ ] Crear proyecto en Supabase y configurar las 5 tablas del schema
- [ ] Configurar variables de entorno (`.env.local`)
- [ ] Conectar repo con Vercel (deploy automático en cada push)
- [ ] Crear cuenta en Resend y verificar dominio de email

**Resultado esperado:** App corriendo en localhost:3000, tablas en Supabase, deploy en Vercel.

---

### Día 2 (Miércoles) — Página Principal + Catálogo
**Objetivo:** Tienda visible con productos reales.

- [ ] Diseñar layout base con colores BOCADO (#FFA600, #FFC107)
- [ ] Implementar página principal (hero, beneficios, CTA)
- [ ] Subir fotos profesionales de los tequeños a Supabase Storage
- [ ] Crear los primeros 4 productos en la base de datos:
  - Tequeños Clásicos 20 uds → $19.99
  - Tequeños Clásicos 50 uds → $44.99
  - Combo Familiar 20 uds + dip → $26.99
  - Combo Fiesta 50 uds + 2 dips → $54.99
- [ ] Página de catálogo con cards de productos
- [ ] Componente de carrito básico (estado global con Zustand)

**Resultado esperado:** Home + catálogo navegable con productos reales.

---

### Día 3 (Jueves) — Flujo de Pedido Completo
**Objetivo:** Un cliente puede completar un pedido de principio a fin.

- [ ] Página de carrito con selector de cantidad y resumen
- [ ] Página de checkout con formulario de datos del cliente
- [ ] Validación del formulario con React Hook Form + Zod
- [ ] Control de método de entrega (pickup/delivery)
- [ ] Integración con Supabase: guardar pedido en DB
- [ ] Generación de número de pedido: `BOC-2026-XXXX`
- [ ] Página de confirmación con número de pedido

**Resultado esperado:** Pedido de prueba guardado en Supabase exitosamente.

---

### Día 4 (Viernes) — Dashboard Admin + Emails
**Objetivo:** El dueño puede ver y gestionar todos los pedidos.

- [ ] Login admin con Supabase Auth
- [ ] Página de lista de pedidos con filtros por estado
- [ ] Panel de detalle de pedido con todos los datos del cliente
- [ ] Botones de cambio de estado (Confirmar, Pago recibido, etc.)
- [ ] Integración con Resend para emails de estado
- [ ] Crear todos los templates de email (9 estados)
- [ ] Proteger rutas `/admin/*` (redirect al login si no autenticado)

**Resultado esperado:** Dueño puede ver pedidos y cambiar estados con emails automáticos.

---

### Día 5 (Sábado) — Pickup + Seguimiento
**Objetivo:** Control completo de pickup y visibilidad del cliente.

- [ ] Página de configuración de pickup en dashboard:
  - Toggle activo/inactivo
  - Selector de fecha
  - Horario de inicio y fin
  - Dirección de pickup
- [ ] Banner en la página principal que muestra info del pickup si está activo
- [ ] Deshabilitar opción de pickup en checkout si está inactivo
- [ ] Página de seguimiento de pedido (`/pedido/[orderNumber]`)
- [ ] Timeline de estados en la página de seguimiento
- [ ] Búsqueda de pedido por número de teléfono

**Resultado esperado:** Sistema de pickup completo + cliente puede ver su estado.

---

### Día 6 (Domingo) — Gestión de Productos + Calidad
**Objetivo:** CRUD de productos y site listo para lanzar.

- [ ] Página de gestión de productos en dashboard
- [ ] Crear producto: formulario con nombre, precio, descripción, imagen, categoría
- [ ] Editar producto existente
- [ ] Toggle activo/inactivo por producto
- [ ] Subida de imágenes a Supabase Storage desde admin
- [ ] Testing completo en móvil (iPhone + Android)
- [ ] Revisar todos los flujos: pedido, confirmación, cambio de estado, seguimiento
- [ ] Optimización básica: imágenes, velocidad de carga

**Resultado esperado:** CRUD completo + site probado en móvil sin errores.

---

### Día 7 (Lunes) — Lanzamiento
**Objetivo:** BOCADO está online y los primeros pedidos llegan.

- [ ] Configurar dominio personalizado en Vercel
- [ ] SEO básico: meta tags, og:image, favicon con logo BOCADO
- [ ] Hacer pedido de prueba real completo (end-to-end)
- [ ] Publicar en Instagram: "¡Estamos online! 🎉"
- [ ] Publicar en 5 grupos de venezolanos en Facebook/WhatsApp
- [ ] Enviar mensaje a lista de contactos de WhatsApp
- [ ] Configurar primer pickup: fecha de este fin de semana
- [ ] **RECIBIR EL PRIMER PEDIDO REAL**

**Resultado esperado:** Primer pedido real recibido. BOCADO está en el mercado.

---

## Quick Wins — Dinero en 7–14 días

### Win 1 — Pre-pedidos (Antes de tener la web lista)
Mientras construyes la plataforma, puedes empezar a tomar pedidos manualmente:
1. Publicar foto en Instagram + grupos venezolanos
2. Tomar pedidos por WhatsApp
3. Registrarlos en un Google Sheet simple
4. Cobrar por Zelle/Venmo
5. **Objetivo: 5–10 pedidos antes del lanzamiento**

### Win 2 — Pickup del primer fin de semana
Configurar el primer pickup para el fin de semana de lanzamiento:
- Anunciar fecha con 5 días de anticipación
- Crear urgencia: "Cupos limitados — solo 30 pedidos"
- **Objetivo: 15–20 pedidos en el primer pickup**

### Win 3 — Referidos activados desde el día 1
Cada cliente del primer pickup recibe un mensaje post-entrega:
- "Refiere a un amigo y ambos obtienen 10% de descuento"
- **Objetivo: cada cliente trae 1 cliente más en 2 semanas**

---

## Riesgo Mayor y Mitigación

### Riesgo 1 — Poca demanda inicial
**Probabilidad:** Media
**Impacto:** Alto
**Mitigación:**
- Validar con 10 pre-pedidos ANTES de construir la web
- Si no hay 10 pre-pedidos en 1 semana → revisar precio o canal
- No invertir en ads hasta tener 5 pedidos orgánicos confirmados

### Riesgo 2 — Problema de cadena de frío en delivery
**Probabilidad:** Media
**Impacto:** Alto (producto arruinado + cliente insatisfecho)
**Mitigación:**
- Empezar SOLO con pickup — sin delivery en el MVP
- Invertir en bolsas térmicas y hielo seco para delivery cuando escale
- Política clara: "Si llega descongelado, lo reponemos"

### Riesgo 3 — Dueño abrumado con pedidos manuales al inicio
**Probabilidad:** Alta
**Impacto:** Medio
**Mitigación:**
- El dashboard fue diseñado para reducir esto al mínimo
- Batches de producción — no cocinar pedido por pedido sino en grupos
- Definir capacidad máxima por pickup desde el inicio (ej: 30 pedidos máximo)

### Riesgo 4 — Problemas técnicos el día del lanzamiento
**Probabilidad:** Baja
**Impacto:** Alto
**Mitigación:**
- Probar el flujo completo 3 veces antes del lanzamiento
- Tener formulario de Google Forms como backup para tomar pedidos si la web falla
- Monitorear Vercel + Supabase con alertas

---

## Decisión Recomendada — Qué Construir Primero

### Recomendación: Empezar con el flujo de pedido + dashboard admin

**Por qué este orden:**

1. **El flujo de pedido** genera ingresos directamente
2. **El dashboard** libera tiempo del dueño desde el día 1
3. El pickup y el seguimiento son los diferenciales principales vs. WhatsApp manual
4. Todo lo demás (agentes IA, automatización avanzada, referidos) viene después

**Lo que NO construir en el MVP:**
- ❌ Sistema de pagos online (Stripe) — pagos manuales funcionan al inicio
- ❌ App móvil — web responsive es suficiente
- ❌ Sistema de reviews sofisticado — captúralas manualmente primero
- ❌ Analytics avanzados — Google Analytics básico es suficiente para empezar

---

## Stack Recomendado para Lanzamiento

```bash
# Crear el proyecto
npx create-next-app@latest bocado-web --typescript --tailwind --app

# Dependencias principales
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zustand react-hook-form zod @hookform/resolvers
npm install resend
npm install date-fns
npm install lucide-react

# Dev dependencies
npm install -D @types/node
```

---

## Checklist de Lanzamiento

### Técnico
- [ ] Supabase: tablas, auth, storage configurados
- [ ] Vercel: deploy exitoso con dominio personalizado
- [ ] Resend: emails transaccionales funcionando
- [ ] SSL: certificado activo en dominio

### Producto
- [ ] Flujo completo probado: pedido → confirmación → admin → email → seguimiento
- [ ] Mobile: probado en iPhone y Android
- [ ] Admin: probado crear pedido, cambiar estados, configurar pickup
- [ ] Productos: mínimo 4 productos con fotos reales cargados

### Negocio
- [ ] Instagram: perfil activo con mínimo 6 posts
- [ ] WhatsApp Business: perfil configurado con foto y descripción
- [ ] Primer pickup configurado en el dashboard
- [ ] Métodos de pago: Zelle/Venmo configurados y probados

### Marketing
- [ ] Post de lanzamiento en Instagram listo (no publicado)
- [ ] Mensaje a grupos venezolanos redactado
- [ ] Lista de WhatsApp con primeros contactos
- [ ] 5 amigos/familia listos para hacer el primer pedido y dejar reseña

---

## Métricas de Éxito — Primeros 30 Días

| Métrica | Mínimo éxito | Gran éxito |
|--------|-------------|-----------|
| Pedidos mes 1 | 20 | 50+ |
| Clientes únicos | 15 | 40+ |
| Ticket promedio | $35 | $45+ |
| Ingresos mes 1 | $700 | $2,000+ |
| Tasa de repetición | 20% | 40%+ |
| Reviews positivas | 5 | 15+ |
| Followers Instagram | 100 | 400+ |

---

## Siguiente Evolución (Mes 2–3)

Una vez validado el modelo con 50+ pedidos:

1. **Activar delivery** con mensajero local o propio
2. **Integrar WhatsApp Business API** para notificaciones
3. **Lanzar programa de referidos** con código único
4. **Iniciar Meta Ads** con presupuesto de $200/mes
5. **Añadir SKU** nuevo: tequeños de jamón, tequeños mini
6. **Evaluar Stripe** para pagos en línea automatizados

---

*Fase 7 completada — 2026-05-20*
*BOCADO está listo para lanzar. 🧡🇻🇪*
