-- =============================================
-- BOCADO — Teléfono de contacto para coordinar el retiro (pickup)
-- Ejecutar en: Supabase SQL Editor
-- =============================================

ALTER TABLE store_config ADD COLUMN IF NOT EXISTS pickup_contact_phone TEXT;
