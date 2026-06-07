# Fase 6 — Automatización y Escala
## BOCADO — Tequeños Venezolanos

---

## Visión de la Automatización

El dueño de BOCADO debe dedicar su energía a dos cosas: **hacer los mejores tequeños** y **tomar decisiones de negocio**. Todo lo demás debe ser automático. El objetivo es que el negocio funcione como una máquina que se autogestiona en un 80%.

---

## Stack de Automatización

| Herramienta | Rol | Costo/mes |
|-------------|-----|----------|
| n8n (self-hosted en Railway/Render) | Orquestador de workflows | $0–5 |
| Supabase | Base de datos + Realtime + Webhooks | $0–25 |
| Resend | Emails transaccionales | $0–20 |
| Google Sheets | Reportes + backup de datos | $0 |
| Google Calendar | Fechas de pickup | $0 |
| WhatsApp Business API | Notificaciones (Mes 3+) | $0.005/msg |
| Vercel (cron jobs) | Automatizaciones programadas | Incluido |
| **Total Mes 1** | | **~$5–50/mes** |

---

## Workflow 1 — Pedido Nuevo Recibido

**Trigger:** INSERT en tabla `orders` de Supabase
**Latencia objetivo:** < 30 segundos

```
[Supabase Webhook] → nuevo pedido
         ↓
[n8n: Extraer datos del pedido]
         ↓
    ┌────┴────┐
    ↓         ↓
[Resend:   [Supabase: actualizar
 Email de   notification_sent = true]
 confirmación
 al cliente]
    ↓
[Google Sheets: agregar fila
 en hoja "Pedidos"]
    ↓
[Opcional: Push notification
 al dueño vía PWA/browser]
```

**Email enviado:**
```
Para: {customer_email}
Asunto: "¡Hola {name}, recibimos tu pedido en BOCADO! 🧡"

Tu pedido #{order_number} fue recibido correctamente.
Estamos revisando disponibilidad y te confirmaremos pronto.

Resumen:
- {product 1} x{qty} — ${price}
- Total: ${total}
- Método: {delivery_method}

Pronto te contactamos con los detalles de pago.
```

---

## Workflow 2 — Cambio de Estado del Pedido

**Trigger:** UPDATE en `orders.order_status`
**Latencia objetivo:** < 60 segundos

```
[Supabase Webhook] → cambio de estado
         ↓
[n8n: Identificar estado nuevo]
         ↓
[n8n: Seleccionar template correcto]
         ↓
    ┌────┴──────────┐
    ↓               ↓
[Resend:        [WhatsApp API
 Email con       (Mes 3+):
 mensaje         Mensaje con
 del estado]     el estado]
         ↓
[Supabase: INSERT en
 order_status_history]
         ↓
[Google Sheets: actualizar
 estado en fila del pedido]
```

**Lógica de templates:**
```javascript
const statusMessages = {
  confirmed: {
    subject: "Pedido confirmado — Instrucciones de pago 💳",
    body: "Tu pedido fue confirmado. Realiza el pago vía Zelle/Venmo..."
  },
  payment_received: {
    subject: "¡Pago recibido! Ya hacemos tus tequeños 🧀",
    body: "Recibimos tu pago. Tu pedido está en preparación..."
  },
  ready_for_pickup: {
    subject: "¡Tus tequeños están listos! 📍",
    body: "Dirección: {pickup_address}. Horario: {pickup_time}..."
  },
  delivered: {
    subject: "Gracias por comprar en BOCADO 🇻🇪",
    body: "Tu pedido fue entregado. ¡Que los disfrutes!"
  },
  cancelled: {
    subject: "Pedido cancelado",
    body: "Tu pedido fue cancelado. Para preguntas: {whatsapp}"
  }
}
```

---

## Workflow 3 — Reporte Semanal del Negocio

**Trigger:** Cron — Lunes a las 8:00 AM
**Output:** Email al dueño con KPIs de la semana

```
[Cron: Lunes 8AM]
         ↓
[Supabase: Query pedidos
 de los últimos 7 días]
         ↓
[Calcular métricas:
 - Total pedidos
 - Pedidos completados / cancelados
 - Ingresos totales
 - Ticket promedio
 - Producto más vendido
 - Nuevos clientes vs recurrentes]
         ↓
[Claude API: Generar insight
 y recomendación semanal]
         ↓
[Resend: Email al dueño
 con reporte completo]
         ↓
[Google Sheets: Agregar fila
 en hoja "Reportes Semanales"]
```

**Query SQL del reporte:**
```sql
SELECT 
  COUNT(*) as total_orders,
  COUNT(CASE WHEN order_status = 'delivered' THEN 1 END) as completed,
  COUNT(CASE WHEN order_status = 'cancelled' THEN 1 END) as cancelled,
  SUM(CASE WHEN order_status != 'cancelled' THEN total ELSE 0 END) as revenue,
  AVG(CASE WHEN order_status != 'cancelled' THEN total ELSE NULL END) as avg_ticket,
  COUNT(DISTINCT customer_phone) as unique_customers
FROM orders
WHERE created_at >= NOW() - INTERVAL '7 days';
```

---

## Workflow 4 — Recordatorio de Pickup (Pre-evento)

**Trigger:** Cron — 48 horas antes de cada fecha de pickup configurada
**Output:** Email a todos los clientes con pedidos confirmados para ese pickup

```
[Cron: 48h antes del pickup]
         ↓
[Supabase: Query pedidos
 con pickup_date = fecha siguiente]
         ↓
[Para cada pedido confirmado:]
         ↓
[Resend: Email de recordatorio
 "Tu pickup es en 2 días"]
```

**Email recordatorio:**
```
Asunto: "Recordatorio: tu pickup de BOCADO es en 2 días 📅"

Hola {nombre},

Solo un recordatorio: tu pedido #{order_number} está programado 
para recogerse:

📅 Fecha: {pickup_date}
⏰ Horario: {pickup_start} – {pickup_end}
📍 Dirección: {pickup_address}

Si tienes alguna pregunta, responde este email o escríbenos al WhatsApp.

¡Nos vemos pronto! 🧡
```

---

## Workflow 5 — Seguimiento Post-Entrega

**Trigger:** UPDATE status a `delivered`
**Output:** Email de agradecimiento + solicitud de foto a las 24h

```
[Pedido marcado como entregado]
         ↓
[Esperar 24 horas] (n8n delay node)
         ↓
[Resend: Email "¿Cómo estuvieron?"]
         ↓
[Esperar 7 días]
         ↓
[Resend: Email de retención
 "¿Ya se acabaron? Siguiente pickup..."]
```

---

## Workflow 6 — Recuperación de Leads (Mes 3+)

**Trigger:** Sesión de carrito sin checkout completado por > 2 horas
**Output:** Mensaje de recuperación por WhatsApp o email

```
[Session con carrito activo]
         ↓
[Timer: 2 horas sin checkout]
         ↓
[¿Se capturó email/teléfono?]
    Si ↓          No ↓
[Enviar       [Registrar en
 mensaje de    analytics como
 recuperación] carrito perdido]
         ↓
[Si no convierte en 24h:
 Segundo mensaje con descuento 10%]
```

---

## CRM Setup en Supabase

### Vista de clientes por comportamiento
```sql
CREATE VIEW customer_insights AS
SELECT 
  customer_phone,
  customer_name,
  customer_email,
  COUNT(*) as total_orders,
  SUM(total) as lifetime_value,
  MAX(created_at) as last_order_date,
  AVG(total) as avg_ticket,
  CASE 
    WHEN COUNT(*) >= 5 THEN 'VIP'
    WHEN COUNT(*) >= 2 THEN 'Regular'
    ELSE 'Nuevo'
  END as customer_tier
FROM orders
WHERE order_status NOT IN ('cancelled')
GROUP BY customer_phone, customer_name, customer_email
ORDER BY lifetime_value DESC;
```

### Lead scoring automático
```
Score = (frecuencia x 30) + (recencia x 40) + (valor x 30)

Frecuencia: pedidos en últimos 90 días
Recencia: días desde último pedido (inverso)
Valor: total gastado / promedio del segmento

Score > 70 → VIP → Acceso a preventa
Score 40-70 → Regular → Descuento de lealtad
Score < 40 → En riesgo → Campaña de reactivación
```

---

## Dashboard de Métricas (Admin)

### KPIs en tiempo real (dashboard admin)
```
┌─────────────────────────────────────────┐
│ 📊 BOCADO — Dashboard                   │
├──────────┬──────────┬────────┬──────────┤
│ Pedidos  │ Ingresos │ Ticket │ Clientes │
│ hoy: 8  │ hoy: $312│ avg:$39│ nuevos:3 │
├──────────┴──────────┴────────┴──────────┤
│ 🔔 Pendientes de confirmación: 3        │
│ 💳 Esperando pago: 2                    │
│ 🍳 En preparación: 1                    │
├─────────────────────────────────────────┤
│ 📈 Esta semana vs semana pasada         │
│ Pedidos: +23% ↑                         │
│ Ingresos: +18% ↑                        │
└─────────────────────────────────────────┘
```

---

## Google Sheets — Estructura de Reportes

### Hoja 1: Pedidos (Master)
| Columna | Tipo | Descripción |
|---------|------|-------------|
| Fecha | DATE | Fecha del pedido |
| # Pedido | TEXT | BOC-2026-XXXX |
| Cliente | TEXT | Nombre |
| Teléfono | TEXT | WhatsApp |
| Productos | TEXT | Resumen |
| Total | CURRENCY | Monto total |
| Estado | TEXT | Estado actual |
| Método | TEXT | Pickup / Delivery |
| Notas | TEXT | Notas del cliente |

### Hoja 2: Métricas Semanales (Auto)
- Total pedidos por semana
- Ingresos por semana
- Ticket promedio
- Nuevos vs recurrentes
- Producto más vendido

### Hoja 3: Clientes (CRM)
- Lista única de clientes
- LTV acumulado
- Número de pedidos
- Fecha último pedido
- Tier (VIP/Regular/Nuevo)

---

## Pipeline de Ventas Automatizado

```
AWARENESS
[Instagram/Facebook] → [Landing page] → [Carrito]
         ↓                                   ↓
   [No convirtió]                     [Convirtió]
         ↓                                   ↓
[Retargeting Ad 48h]              [Email confirmación]
         ↓                                   ↓
   [No convirtió]                   [Email + estado]
         ↓                                   ↓
[WhatsApp follow-up]              [Post-entrega: review]
         ↓                                   ↓
   [No convirtió]                   [Programa referidos]
         ↓                                   ↓
[Perder por ahora +             [Retención: email D7]
 agregar a lista mensual]
```

---

## Experimentos A/B Planificados

| Experimento | Variable A | Variable B | Métrica |
|-------------|-----------|-----------|---------|
| CTA del hero | "Hacer mi pedido" | "Ver los tequeños" | Click rate |
| Precio paquete 20 uds | $19.99 | $21.99 | Conversión |
| Email de confirmación | Template simple | Template con fotos | Open rate |
| Oferta de recuperación | 10% descuento | Envío gratis | Conversión |
| Instagram: format | Foto producto | Reel de preparación | Engagement |

---

## Automatización de Inventario (Futuro — Mes 4+)

```
[Pedido completado]
         ↓
[Supabase: Restar unidades del stock]
         ↓
[Stock < 20 unidades de algún producto?]
         ↓
[Email automático al dueño:
 "Queda poco stock de {producto}"]
         ↓
[Dashboard: Banner de alerta rojo]
```

---

## Costos de Automatización por Escala

| Volumen mensual | n8n | Resend | WhatsApp | Supabase | **Total** |
|----------------|-----|--------|---------|---------|----------|
| 50 pedidos | $5 | $0 | $0 | $0 | **$5/mes** |
| 200 pedidos | $5 | $10 | $5 | $0 | **$20/mes** |
| 500 pedidos | $5 | $20 | $15 | $25 | **$65/mes** |
| 1,000 pedidos | $15 | $40 | $30 | $25 | **$110/mes** |

---

*Fase 6 completada — 2026-05-20*
