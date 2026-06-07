-- =============================================
-- BOCADO — Schema inicial de base de datos
-- Ejecutar en: Supabase SQL Editor
-- =============================================

-- Productos
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  price       DECIMAL(10,2) NOT NULL,
  image_url   TEXT,
  is_active   BOOLEAN DEFAULT true,
  stock       INTEGER DEFAULT NULL,
  category    TEXT DEFAULT 'tequeños',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Pedidos
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number     TEXT UNIQUE NOT NULL,
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_email   TEXT,
  delivery_method  TEXT NOT NULL CHECK (delivery_method IN ('pickup', 'delivery')),
  delivery_address TEXT,
  pickup_date      DATE,
  pickup_time_slot TEXT,
  order_status     TEXT NOT NULL DEFAULT 'received' CHECK (
    order_status IN (
      'received', 'confirmed', 'payment_pending', 'payment_received',
      'in_preparation', 'ready_for_pickup', 'scheduled_for_delivery',
      'delivered', 'cancelled'
    )
  ),
  payment_status   TEXT DEFAULT 'pending',
  subtotal         DECIMAL(10,2) NOT NULL,
  delivery_fee     DECIMAL(10,2) DEFAULT 0,
  total            DECIMAL(10,2) NOT NULL,
  customer_note    TEXT,
  admin_note       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Items del pedido
CREATE TABLE IF NOT EXISTS order_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id   UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity     INTEGER NOT NULL CHECK (quantity > 0),
  unit_price   DECIMAL(10,2) NOT NULL,
  subtotal     DECIMAL(10,2) NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Historial de estados
CREATE TABLE IF NOT EXISTS order_status_history (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  old_status  TEXT,
  new_status  TEXT NOT NULL,
  changed_by  TEXT DEFAULT 'admin',
  note        TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Configuración de la tienda (singleton)
CREATE TABLE IF NOT EXISTS store_config (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_enabled      BOOLEAN DEFAULT false,
  pickup_date         DATE,
  pickup_start_time   TIME,
  pickup_end_time     TIME,
  pickup_address      TEXT,
  pickup_instructions TEXT,
  delivery_enabled    BOOLEAN DEFAULT false,
  delivery_fee        DECIMAL(10,2) DEFAULT 0,
  delivery_zones      TEXT,
  store_is_open       BOOLEAN DEFAULT true,
  min_order_amount    DECIMAL(10,2) DEFAULT 0,
  announcement        TEXT,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar configuración inicial (singleton)
INSERT INTO store_config (pickup_enabled, delivery_enabled, store_is_open)
VALUES (false, false, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- Productos de ejemplo para BOCADO
-- =============================================
INSERT INTO products (name, description, price, category, sort_order, is_active) VALUES
  ('Tequeños Clásicos 20 uds', 'Nuestros tequeños venezolanos de queso. 500g listos para preparar en air fryer u horno.', 19.99, 'tequeños', 1, true),
  ('Tequeños Clásicos 50 uds', 'El paquete familiar. 1.25kg de tequeños venezolanos de queso, perfectos para fiestas y reuniones.', 44.99, 'tequeños', 2, true),
  ('Combo Familiar', 'Paquete de 20 tequeños + salsa de queso especial. El dúo perfecto para disfrutar en casa.', 26.99, 'combos', 3, true),
  ('Combo Fiesta', 'Paquete de 50 tequeños + 2 salsas especiales. ¡Para que tu fiesta sea inolvidable!', 54.99, 'combos', 4, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- Row Level Security (RLS)
-- =============================================

-- Activar RLS en todas las tablas
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_config ENABLE ROW LEVEL SECURITY;

-- Products: lectura pública
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);

-- Products: escritura solo admin (service role bypasses RLS)
CREATE POLICY "products_admin_all" ON products
  FOR ALL USING (auth.role() = 'service_role');

-- Orders: cualquiera puede crear
CREATE POLICY "orders_public_insert" ON orders
  FOR INSERT WITH CHECK (true);

-- Orders: lectura por número de pedido (para tracking público)
CREATE POLICY "orders_public_read_by_number" ON orders
  FOR SELECT USING (true);

-- Order items: lectura y escritura pública (controlled via service role)
CREATE POLICY "order_items_public_read" ON order_items
  FOR SELECT USING (true);

CREATE POLICY "order_items_public_insert" ON order_items
  FOR INSERT WITH CHECK (true);

-- Status history: lectura pública
CREATE POLICY "status_history_public_read" ON order_status_history
  FOR SELECT USING (true);

CREATE POLICY "status_history_public_insert" ON order_status_history
  FOR INSERT WITH CHECK (true);

-- Store config: lectura pública
CREATE POLICY "config_public_read" ON store_config
  FOR SELECT USING (true);

-- =============================================
-- Índices para performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
