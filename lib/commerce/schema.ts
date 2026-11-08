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

`;
