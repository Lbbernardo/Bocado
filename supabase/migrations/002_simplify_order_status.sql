-- =============================================
-- BOCADO — Simplificar flujo de estados de pedido
-- De 8 estados a 4 + cancelado:
--   received → confirmed → ready_for_pickup → completed (+ cancelled)
-- Los pedidos de prueba ya fueron borrados, así que solo hace falta
-- reemplazar el CHECK constraint.
-- Ejecutar en: Supabase SQL Editor
-- =============================================

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_order_status_check CHECK (
  order_status IN ('received', 'confirmed', 'ready_for_pickup', 'completed', 'cancelled')
);
