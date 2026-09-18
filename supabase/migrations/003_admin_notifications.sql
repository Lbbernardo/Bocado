-- =============================================
-- BOCADO — Notificación por correo al recibir un pedido nuevo
-- Ejecutar en: Supabase SQL Editor
-- =============================================

ALTER TABLE store_config ADD COLUMN IF NOT EXISTS admin_notify_new_order BOOLEAN DEFAULT true;
ALTER TABLE store_config ADD COLUMN IF NOT EXISTS admin_notification_email TEXT;
