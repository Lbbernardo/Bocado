# Fase 2 — Diseño del Negocio
## BOCADO — Tequeños Venezolanos

---

## Modelo de Ingresos

BOCADO opera como un negocio **D2C (Direct-to-Consumer)** con canal online propio.

**Fuentes de ingreso actuales:**
1. Venta directa de tequeños congelados por pedido online
2. Combos especiales (eventos, fiestas)

**Fuentes de ingreso futuras:**
3. Suscripción mensual ("BOCADO Club" — caja mensual)
4. Catering para empresas y eventos
5. Wholesale a tiendas o restaurantes venezolanos

---

## Pricing

### Productos Actuales

| Producto | Unidades | Precio | Margen Est. |
|---------|---------|-------|------------|
| Tequeños Clásicos | 20 uds / 500g | $18–22 | ~60% |
| Tequeños Clásicos | 50 uds / 1.25kg | $40–48 | ~65% |
| Combo Familiar | 20 uds + dip | $25–28 | ~55% |
| Combo Fiesta | 50 uds + 2 dips | $52–58 | ~60% |
| Combo Quinceañera | 100 uds | $85–95 | ~65% |

### Estrategia de Pricing
- **Ancla:** Paquete de 50 unidades como opción principal visualmente destacada
- **Psycho-pricing:** $19.99, $44.99, $89.99 (nunca número redondo)
- **Bundling:** Combos con valor percibido mayor que suma de partes
- **No freemium** — producto físico, cero samples gratuitos al inicio

### Proyección Año 1
| Mes | Pedidos/Mes | Ticket Promedio | Ingresos |
|-----|------------|----------------|---------|
| 1-2 | 30-50 | $35 | $1,050–1,750 |
| 3-4 | 80-120 | $38 | $3,040–4,560 |
| 5-6 | 150-200 | $42 | $6,300–8,400 |
| 7-12 | 250-400 | $45 | $11,250–18,000 |
| **Año 1 total** | | | **~$70,000–90,000** |

---

## Funnel Comercial Completo

```
TOPE DEL FUNNEL (Awareness)
│
├── Instagram / TikTok — Reels mostrando tequeños derritiendo queso
├── Facebook — Grupos venezolanos y latinos
├── WhatsApp — Referencias y grupos comunitarios
├── Google — "tequeños venezolanos [ciudad]"
│
MEDIO DEL FUNNEL (Consideration)
│
├── Landing page con hero apetitoso
├── Página de productos con fotos profesionales
├── Social proof — reseñas, fotos de clientes
├── Información de preparación (Air Fryer / horno)
│
FONDO DEL FUNNEL (Decision)
│
├── Carrito simple + checkout rápido (< 2 min)
├── Opciones claras: pickup o delivery
├── Pago manual claro: Zelle / Venmo + instrucciones
│
POST-VENTA (Retention)
│
├── Email de confirmación inmediato
├── Actualizaciones de estado del pedido
├── Email post-entrega: "¿Cómo te quedaron?"
└── Incentivo referido: "$5 de descuento por cada amigo"
```

---

## Estrategia de Adquisición de Clientes

### Canal 1 — Instagram (Principal, $0–$500/mes)
- Reels de tequeños en air fryer (proceso + resultado)
- Stories con encuestas ("¿Cuántos tequeños se comen tú?")
- Testimoniales de clientes en formato video
- Frecuencia: 5–7 posts/semana

### Canal 2 — Grupos Venezolanos (Principal, $0)
- Facebook: Venezolanos en [Ciudad], comunidades latinas
- WhatsApp: Grupos de mamás, grupos venezolanos
- Anuncio semanal con foto del producto
- Regla: nunca parecer spam — aportar valor primero

### Canal 3 — Meta Ads (Secundario, $200–500/mes)
- Target: Venezolanos y latinos, 28–50 años, [ciudad]
- Creativo: Video de queso derritiéndose, caption "¿Los extrañabas?"
- Objetivo: Tráfico a la web o DM directo
- ROAS objetivo: 3x

### Canal 4 — Referidos (Escala, $0 costo base)
- Descuento del 10% para el referidor al primer pedido del referido
- Mensaje automático post-entrega invitando a referir
- "Comparte con tu familia venezolana 🇻🇪"

### Canal 5 — WhatsApp Marketing (Retención)
- Lista de difusión de clientes existentes
- Anuncio de fechas de pickup
- Promos especiales: Navidad, quinceañeras, fin de semana largo

---

## Retención y Reducción de Churn

| Táctica | Implementación | Costo |
|---------|---------------|-------|
| Email post-pedido con receta/tips | Automático con Resend | $0 |
| Descuento en segundo pedido (10%) | Código en email post-entrega | Margen |
| Programa de puntos (futuro) | App o Supabase tracking | Fase 6 |
| WhatsApp personal post-entrega | Dueño envía mensaje manual al inicio | $0 |
| Newsletter mensual de novedades | Resend / Mailchimp | $0–$20 |

**Benchmark de retención objetivo:**
- Mes 1–3: 30% de clientes repiten
- Mes 4–6: 45% de clientes repiten
- Mes 7–12: 60% de clientes repiten

---

## Sistema de Referidos

```
REFERIDO BOCADO

Cliente A refiere a Cliente B
→ Cliente B hace su primer pedido
→ Cliente A recibe $5 de crédito (próximo pedido)
→ Cliente B recibe 10% de descuento en primer pedido

Mecánica:
- Código único por cliente (ej: MARIA2026)
- Tracking automático en Supabase
- Crédito aplicado automáticamente en siguiente pedido
```

---

## Unit Economics

### Por pedido promedio ($42)

| Concepto | Valor |
|---------|------|
| Precio de venta | $42.00 |
| Costo de producto (COGS) | $14.00 |
| Empaque + etiquetas | $2.50 |
| Delivery/transporte (si aplica) | $4.00 |
| Procesamiento de pago | $1.30 |
| **Margen bruto por pedido** | **$20.20 (48%)** |

### CAC (Costo de Adquisición de Cliente)
| Etapa | CAC Estimado |
|-------|-------------|
| Mes 1–3 (orgánico) | $0–8 |
| Mes 4–6 (orgánico + referidos) | $5–12 |
| Mes 7–12 (con paid ads) | $15–25 |
| **CAC objetivo sostenible** | **< $20** |

### LTV (Lifetime Value)
| Métrica | Valor |
|--------|------|
| Pedidos/año por cliente activo | 18 |
| Ticket promedio | $42 |
| Margen bruto (48%) | $20.16 |
| **LTV Año 1** | **$362.88** |
| **LTV:CAC ratio** | **~18:1** (excelente) |

### Payback Period
- CAC $20 → Recuperado en el **primer pedido** ($20.20 margen)
- Payback period: **< 1 mes** ✅

---

## Canales de Distribución

| Canal | Fase | Descripción |
|-------|------|-------------|
| Pickup en punto físico | Inmediato | Cliente recoge en dirección del dueño o punto acordado |
| Delivery local (dueño) | Inmediato | El dueño o empleado entrega en auto |
| Delivery con servicio externo | Mes 3–6 | Integrar mensajero o app de delivery |
| Envío regional (congelado) | Futuro | Packaging especial para envío 2-day |

---

## Operaciones Básicas

### Flujo de operación diaria
```
7:00 AM  → Dueño revisa pedidos en dashboard
8:00 AM  → Confirma pedidos y envía mensajes de pago
10:00 AM → Marca pagos recibidos
12:00 PM → Inicia preparación de pedidos del día
3:00 PM  → Empaca y etiqueta pedidos
4:00 PM  → Pickup / salida para delivery
6:00 PM  → Marca pedidos como entregados
7:00 PM  → Responde mensajes y revisa métricas
```

### Capacidad inicial estimada
- Batch por sesión: 100–200 tequeños
- Pedidos por semana: 20–40
- Con escala: contratar 1 ayudante de cocina

---

## Customer Success

| Touchpoint | Acción | Responsable |
|-----------|--------|------------|
| Pedido recibido | Email/mensaje automático | Sistema |
| Pedido confirmado | Mensaje con instrucciones de pago | Sistema |
| Pago recibido | Mensaje de confirmación | Sistema |
| Listo para recoger | Notificación con dirección y horario | Sistema |
| Post-entrega (24h) | "¿Cómo estuvieron los tequeños?" | WhatsApp manual |
| Problema/queja | Respuesta en < 2 horas | Dueño |

---

## Partnerships Estratégicos

| Partner | Tipo | Beneficio |
|---------|------|---------|
| Influencers venezolanos locales | Content | Alcance auténtico a comunidad |
| Tiendas de productos venezolanos | Distribution | Punto de venta y pickup adicional |
| Organizadores de eventos venezolanos | B2B | Catering para quinceañeras, fiestas |
| Grupos de madres venezolanas | Community | Referidos orgánicos masivos |
| Restaurantes venezolanos locales | Wholesale | Venta a restaurantes que no hacen tequeños |

---

## White Label / Eventos Mode

**Próxima evolución del negocio (Mes 6+):**
- Paquetes para quinceañeras con etiqueta personalizada
- Kits de tequeños con nombre del evento impreso
- Precio premium: +30% por personalización
- Mínimo de orden: 100 unidades

---

*Fase 2 completada — 2026-05-20*
