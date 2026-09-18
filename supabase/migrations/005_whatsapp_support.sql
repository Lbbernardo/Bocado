-- =============================================
-- BOCADO — Número de WhatsApp para soporte al cliente
-- Ejecutar en: Supabase SQL Editor
-- =============================================

ALTER TABLE store_config ADD COLUMN IF NOT EXISTS support_whatsapp_number TEXT;
