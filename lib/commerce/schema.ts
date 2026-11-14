import { defaultGstRate } from './shared';

export const commerceSchema = `
    CREATE TABLE IF NOT EXISTS sku (
      sku TEXT PRIMARY KEY, name TEXT NOT NULL, price INTEGER NOT NULL CHECK(price > 0),
      stock INTEGER NOT NULL CHECK(stock >= 0), online INTEGER NOT NULL, tax INTEGER NOT NULL DEFAULT ${defaultGstRate},
      wholesale_min INTEGER NOT NULL DEFAULT 0, wholesale_price INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS checkout (
      id TEXT PRIMARY KEY, cart TEXT NOT NULL, created BIGINT NOT NULL, source TEXT NOT NULL,
      delivery TEXT, lines TEXT, shipping INTEGER, total BIGINT, attempt TEXT UNIQUE,
      expires BIGINT, provider TEXT UNIQUE, payment_url TEXT, order_id TEXT UNIQUE
    );
    CREATE TABLE IF NOT EXISTS catalogue (
      sku TEXT PRIMARY KEY REFERENCES sku(sku), category TEXT NOT NULL,
      description TEXT NOT NULL, image TEXT NOT NULL, archived INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS oil_sizes (
      sku TEXT PRIMARY KEY REFERENCES sku(sku), parent_sku TEXT NOT NULL REFERENCES sku(sku),
      grams INTEGER NOT NULL, UNIQUE(parent_sku, grams)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY, checkout_id TEXT UNIQUE NOT NULL REFERENCES checkout(id),
      payment_id TEXT UNIQUE NOT NULL, state TEXT NOT NULL, lines TEXT NOT NULL,
      delivery TEXT NOT NULL, shipping INTEGER NOT NULL, total BIGINT NOT NULL,
      created BIGINT NOT NULL, tracking TEXT, refund_id TEXT
    );
    CREATE TABLE IF NOT EXISTS notifications (
      order_id TEXT NOT NULL REFERENCES orders(id), kind TEXT NOT NULL, sent BIGINT, due BIGINT NOT NULL DEFAULT 0,
      PRIMARY KEY(order_id, kind)
    );
    CREATE TABLE IF NOT EXISTS admin_attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, until BIGINT NOT NULL);
    CREATE TABLE IF NOT EXISTS shipping_settings (
      id INTEGER PRIMARY KEY CHECK(id=1), fee INTEGER NOT NULL CHECK(fee>=0)
    );
    CREATE TABLE IF NOT EXISTS order_invoices (
      order_id TEXT PRIMARY KEY REFERENCES orders(id), pdf BYTEA NOT NULL
    );
    CREATE TABLE IF NOT EXISTS catalogue_updates (
      name TEXT PRIMARY KEY
    );
    CREATE TABLE IF NOT EXISTS property_type_requests (
      term TEXT PRIMARY KEY, requests INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS storefront_events (
      id TEXT PRIMARY KEY, visit TEXT NOT NULL, kind TEXT NOT NULL,
      path TEXT NOT NULL, source TEXT NOT NULL, device TEXT NOT NULL, created BIGINT NOT NULL,
      visitor TEXT
    );
    CREATE INDEX IF NOT EXISTS storefront_events_created ON storefront_events(created);
    CREATE TABLE IF NOT EXISTS checkout_attribution (
      checkout_id TEXT PRIMARY KEY REFERENCES checkout(id), visit TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS checkout_attribution_visit ON checkout_attribution(visit);
    CREATE TABLE IF NOT EXISTS cart_leads (
      id TEXT PRIMARY KEY, cart TEXT NOT NULL, updated BIGINT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS cart_leads_updated ON cart_leads(updated);
    CREATE TABLE IF NOT EXISTS staff_activity (
      id TEXT PRIMARY KEY, action TEXT NOT NULL, subject TEXT NOT NULL, created BIGINT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS staff_activity_subject ON staff_activity(subject,created);
    CREATE TABLE IF NOT EXISTS notification_failures (
      order_id TEXT NOT NULL, kind TEXT NOT NULL, reason TEXT NOT NULL, created BIGINT NOT NULL,
      PRIMARY KEY(order_id,kind)
    );
    CREATE TABLE IF NOT EXISTS store_preferences (
      key TEXT PRIMARY KEY, value TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS promotions (
      id TEXT PRIMARY KEY, code TEXT UNIQUE, title TEXT NOT NULL, description TEXT NOT NULL,
      kind TEXT NOT NULL, value INTEGER NOT NULL, scope TEXT NOT NULL, skus TEXT NOT NULL,
      minimum BIGINT NOT NULL, quantity INTEGER NOT NULL, cap BIGINT NOT NULL,
      starts BIGINT, ends BIGINT, usage_limit INTEGER NOT NULL, customer_limit INTEGER NOT NULL,
      enabled INTEGER NOT NULL, published INTEGER NOT NULL, archived INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS checkout_promotions (
      checkout_id TEXT PRIMARY KEY REFERENCES checkout(id), code TEXT,
      promotion_id TEXT REFERENCES promotions(id), snapshot TEXT, email TEXT
    );
    CREATE INDEX IF NOT EXISTS checkout_promotions_usage ON checkout_promotions(promotion_id,email);

`;
