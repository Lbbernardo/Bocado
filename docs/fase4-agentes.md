# Fase 4 — AI Agent System Design
## BOCADO — Tequeños Venezolanos

---

## Visión del Sistema de Agentes

BOCADO necesita agentes IA que reduzcan el trabajo manual del dueño, mantengan a los clientes informados sin esfuerzo, y escalen el negocio sin contratar personas. El objetivo es que el dueño solo tenga que **confirmar pedidos y hacer tequeños** — el resto lo hacen los agentes.

---

## Agente 1 — Order Confirmation Agent

**Nombre:** `bocado-order-bot`
**Misión:** Procesar cada pedido nuevo y enviar la comunicación inicial al cliente de forma automática.

| Atributo | Detalle |
|---------|---------|
| **Trigger** | Nuevo pedido creado en Supabase |
| **Input** | Datos del pedido (nombre, productos, teléfono, método de entrega) |
| **Output** | Email de confirmación + notificación en dashboard |
| **Herramientas** | Resend API, Supabase, n8n |
| **Latencia** | < 30 segundos después del pedido |
| **Costo** | ~$0.001 por pedido (solo email) |

**Prompt del sistema:**
```
Eres el asistente virtual de BOCADO, marca de tequeños venezolanos.
Tu tarea es redactar mensajes cálidos, entusiastas y auténticos para confirmar 
pedidos. Usa el nombre del cliente. Usa emojis de forma moderada (🧡, 🧀, ❄️).
El tono es: venezolano, familiar, confiable, apetitoso.
Siempre incluye el número de pedido. Nunca prometas tiempos que no puedes cumplir.
```

**Flujo:**
```
Pedido creado
    ↓
n8n trigger (webhook Supabase)
    ↓
Extraer datos del pedido
    ↓
Claude genera mensaje personalizado (opcional) ó usa template
    ↓
Resend envía email
    ↓
Marcar pedido como "notificado"
    ↓
Push notification al admin (browser o PWA)
```

**Métricas de éxito:**
- Email enviado en < 1 minuto del pedido: 99%
- Tasa de apertura de email: > 70%
- Cero errores de envío: < 0.1%

---

## Agente 2 — Status Update Agent

**Nombre:** `bocado-status-agent`
**Misión:** Notificar al cliente en cada cambio de estado del pedido, con el mensaje correcto, por el canal correcto.

| Atributo | Detalle |
|---------|---------|
| **Trigger** | Cambio de `order_status` en Supabase |
| **Input** | Estado anterior, estado nuevo, datos del pedido |
| **Output** | Email al cliente + (futuro) mensaje WhatsApp |
| **Herramientas** | Supabase Realtime, Resend, n8n, WhatsApp API (futuro) |
| **Latencia** | < 60 segundos del cambio de estado |
| **Costo** | ~$0.001 por notificación (email) / ~$0.005 (WhatsApp) |

**Templates por estado:**

```
RECEIVED → EMAIL:
Asunto: "Hola {nombre}, recibimos tu pedido en BOCADO 🧡"
Cuerpo: "Tu pedido #{order_number} fue recibido. Estamos revisando 
disponibilidad y pronto te confirmamos."

CONFIRMED → EMAIL:
Asunto: "Pedido confirmado — siguiente paso: el pago 💳"
Cuerpo: "Tu pedido fue confirmado. Puedes proceder con el pago vía 
{payment_methods}. Al realizarlo, envíanos el comprobante al {admin_whatsapp}."

PAYMENT_RECEIVED → EMAIL:
Asunto: "¡Pago recibido! Tu pedido está en preparación 🧀"
Cuerpo: "Recibimos tu pago. Ya estamos preparando tus tequeños con mucho amor."

READY_FOR_PICKUP → EMAIL:
Asunto: "¡Tus tequeños están listos! 🎉"
Cuerpo: "Tu pedido está listo para recoger. 
Dirección: {pickup_address}
Horario: {pickup_time}
Número de pedido: #{order_number}"

DELIVERED → EMAIL:
Asunto: "¡Que los disfrutes! Gracias por comprar en BOCADO 🇻🇪"
Cuerpo: "Tu pedido fue entregado. Esperamos que cada tequeño sea un pedacito 
de Venezuela. ¿Nos regalarías una foto? 📸 @bocadotequeños"
```

**Reglas de comportamiento:**
- Si el estado cambia a `cancelled`, incluir disculpa y contacto del dueño
- Si el cliente no tiene email, registrar para futura notificación por WhatsApp
- No enviar más de 1 email por cambio de estado
- Incluir siempre el número de pedido

---

## Agente 3 — Customer Support Agent

**Nombre:** `bocado-support-agent`
**Misión:** Responder preguntas frecuentes de clientes vía WhatsApp o chat, filtrar las urgentes para el dueño.

| Atributo | Detalle |
|---------|---------|
| **Trigger** | Mensaje entrante de cliente (WhatsApp / chat web) |
| **Input** | Mensaje del cliente, número de teléfono |
| **Output** | Respuesta automática ó escalada al dueño |
| **Herramientas** | WhatsApp Business API, Claude API, Supabase |
| **Memoria** | Historial de la conversación (corto plazo, 24h) |
| **Costo** | ~$0.01–0.05 por conversación |

**Prompt del sistema:**
```
Eres el asistente virtual de BOCADO, marca de tequeños venezolanos.
Eres cálido, venezolano, y sabes todo sobre los productos de BOCADO.
Tu rol es ayudar a los clientes con:
- Estado de su pedido (consulta en Supabase por teléfono)
- Información sobre productos (qué son, cómo se preparan)
- Horarios de pickup
- Métodos de pago aceptados
- Preguntas sobre ingredientes y alérgenos

SIEMPRE que no puedas ayudar o sea urgente, di:
"Déjame comunicarte con el equipo de BOCADO. Un momento 🧡"
Y marca la conversación como "escalada".

NUNCA:
- Prometas descuentos no autorizados
- Inventes información sobre pedidos
- Des información de precios que no esté en el catálogo
- Respondas temas fuera de BOCADO
```

**Preguntas frecuentes con respuestas:**
```json
{
  "¿Cuánto duran congelados?": "Hasta 3 meses en el congelador. Siempre mantenlos a -18°C.",
  "¿Cómo los preparo?": "Air Fryer: 12-14 min a 375°F. Horno: 15-18 min a 375°F. Sin descongelar.",
  "¿Tienen gluten?": "Sí, los tequeños contienen harina de trigo.",
  "¿Cuándo es el próximo pickup?": "[Consulta en tiempo real la config de Supabase]",
  "¿Aceptan Zelle?": "Sí, aceptamos Zelle, Venmo y efectivo."
}
```

**Fallbacks:**
- Si Claude no puede responder → "Dame un momento, te comunico con el equipo."
- Si el cliente está molesto → Escalar inmediatamente + notificar al dueño
- Si pregunta por pedido → Buscar en Supabase por número de teléfono

---

## Agente 4 — Content Marketing Agent

**Nombre:** `bocado-content-agent`
**Misión:** Generar contenido listo para publicar en Instagram, Facebook y WhatsApp 3 veces por semana.

| Atributo | Detalle |
|---------|---------|
| **Trigger** | Cron job — Lunes, miércoles, viernes 9AM |
| **Input** | Calendario de contenido, temporada, eventos venezolanos |
| **Output** | Caption de Instagram + hook de TikTok + mensaje WhatsApp |
| **Herramientas** | Claude API, Notion/Google Sheets (calendario) |
| **Costo** | ~$0.05 por set de contenido |

**Tipos de contenido que genera:**

1. **Recetas / Tips de preparación**
   - "¿Air fryer o horno? Te decimos el secreto para tequeños perfectos 🔥"
   
2. **Cultura venezolana / nostalgia**
   - "Navidad sin tequeños no es Navidad. ¿Cuántos aguantas de una sentada? 🎄"
   
3. **Social proof**
   - "Otra familia venezolana que encuentra el sabor de casa en BOCADO 🧡"
   
4. **Producto / CTA**
   - "Pickup disponible este sábado. ¿Ya hiciste tu pedido? Link en bio 👆"

**Prompt del sistema:**
```
Eres el social media manager de BOCADO, marca de tequeños venezolanos.
El tono de BOCADO es: venezolano, familiar, apetitoso, nostálgico y moderno.
Usa referencias venezolanas cuando aplique (Navidad venezolana, hallacas, etc).
Los captions deben tener:
- Hook en la primera línea (que genere curiosidad o emoción)
- 2-3 líneas de cuerpo
- CTA claro ("Pedido por link en bio", "DM para pedir")
- 5-8 hashtags relevantes
Máximo 150 palabras. Emojis: 2-4 por caption.
NUNCA menciones a la competencia.
```

---

## Agente 5 — Orders Analytics Agent

**Nombre:** `bocado-analytics-agent`
**Misión:** Generar el reporte semanal del negocio para el dueño, en lenguaje simple y accionable.

| Atributo | Detalle |
|---------|---------|
| **Trigger** | Cron job — Cada lunes 8AM |
| **Input** | Datos de Supabase: pedidos, productos, estados |
| **Output** | Reporte por email o WhatsApp con KPIs de la semana |
| **Herramientas** | Supabase, Claude API, Resend |
| **Costo** | ~$0.03 por reporte |

**Reporte semanal incluye:**
```
📊 REPORTE BOCADO — Semana del [fecha]

💰 Ingresos
- Total semana: $X
- Vs semana anterior: +X% ↑

📦 Pedidos
- Total pedidos: X
- Completados: X
- Cancelados: X
- Ticket promedio: $X

🏆 Producto más vendido
- [Nombre del producto]: X unidades

⚡ A tener en cuenta
- [Insight 1 generado por Claude]
- [Insight 2]

💡 Recomendación de esta semana
- [Acción concreta basada en los datos]
```

---

## Agente 6 — Lead Recovery Agent (Futuro — Mes 3+)

**Nombre:** `bocado-recovery-agent`
**Misión:** Recuperar clientes que iniciaron un carrito pero no completaron el pedido.

| Atributo | Detalle |
|---------|---------|
| **Trigger** | Carrito abandonado por > 2 horas |
| **Input** | Datos del carrito, teléfono/email si se capturó |
| **Output** | Email o WhatsApp de recordatorio |
| **Costo** | ~$0.002 por recuperación |

**Mensaje de recuperación:**
```
"Hola [nombre], vimos que dejaste tus tequeños en el carrito 🧀
¿Todavía quieres tu pedido? El pickup es el [fecha].
[Botón: Completar mi pedido]"
```

**Métrica objetivo:** Recuperar 15–25% de carritos abandonados.

---

## Arquitectura del Sistema de Agentes

```
                    SUPABASE
                    (Events)
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
    Nuevo pedido  Cambio estado  Analytics
          │            │            │
          ↓            ↓            ↓
        n8n ──────── n8n ──────── n8n (cron)
          │            │            │
          ↓            ↓            ↓
      RESEND       RESEND +       Claude API
    (email conf)   WhatsApp     (reporte)
                  (futuro)          │
                                    ↓
                              Email/WhatsApp
                               al dueño
```

---

## Costos Estimados del Sistema de Agentes

| Agente | Costo/mes (100 pedidos) | Costo/mes (500 pedidos) |
|--------|------------------------|------------------------|
| Order Confirmation | $0.10 | $0.50 |
| Status Updates | $0.30 | $1.50 |
| Support Agent | $2.00 | $10.00 |
| Content Agent | $0.60 | $0.60 |
| Analytics Agent | $0.12 | $0.12 |
| **Total** | **~$3/mes** | **~$13/mes** |

**ROI del sistema de agentes:**
- Tiempo del dueño ahorrado: ~15 horas/semana en mensajes manuales
- Costo alternativo (asistente humano): $800–1,200/mes
- Costo del sistema: $3–13/mes
- **ROI: 60–400x**

---

*Fase 4 completada — 2026-05-20*
