import { AsyncLocalStorage } from 'node:async_hooks';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync, type SQLInputValue } from 'node:sqlite';
import { Pool, types, type PoolClient } from 'pg';
import { commerceCatalog, enquiryEquipment } from './catalog';
import { mockPayments } from './payment-mode';
import { commerceSchema } from './schema';
import { oilPackPercent, oilPackPrice, oilWeightLabel, oilWeights } from './oil-sizes';
import { defaultGstRate } from './shared';
import { supabaseCa } from './supabase-ca';

const seededOilSizes = commerceCatalog.filter(item => item.category === 'oil').flatMap(item =>
  oilWeights.map(grams => ({
    ...item,
    parent: item.sku,
    sku: item.sku + '-' + grams + 'g',
    name: item.name.split(' · ')[0] + ' · ' + oilWeightLabel(grams),
    grams,
    price: oilPackPrice(item.price * 10, grams),
  })),
);

const seedSizeSql = 'INSERT INTO oil_sizes (sku,parent_sku,grams) VALUES (?,?,?) ON CONFLICT(sku) DO NOTHING';
const openingStock = 10;
const catalogueUpdate = 'INSERT INTO catalogue_updates (name) VALUES (\'open-catalogue-v1\') ON CONFLICT DO NOTHING';
const gstUpdate = "INSERT INTO catalogue_updates (name) VALUES ('catalogue-gst-18-v1') ON CONFLICT DO NOTHING";
const packPriceUpdate = "INSERT INTO catalogue_updates (name) VALUES ('oil-pack-prices-from-kilo-v1') ON CONFLICT DO NOTHING";
const amberValleyUpdate = "INSERT INTO catalogue_updates (name) VALUES ('rename-amber-valley-v1') ON CONFLICT DO NOTHING";
const renameAmberValley = `
  UPDATE sku SET name=REPLACE(name, 'BR 540', 'Amber Valley')
  WHERE (sku='oil-br-540' OR sku IN (SELECT sku FROM oil_sizes WHERE parent_sku='oil-br-540'))
    AND name LIKE 'BR 540%';
`;
const recalculateOilPackPrices = `UPDATE sku SET price=(
  SELECT CAST(ROUND(base.price * 1.0 * CASE pack.grams
    ${oilWeights.filter(grams => grams !== 1000).map(grams => `WHEN ${grams} THEN ${grams * oilPackPercent[grams]}`).join(' ')}
    END / 100000.0) AS INTEGER)
  FROM oil_sizes pack JOIN oil_sizes kilo ON kilo.parent_sku=pack.parent_sku AND kilo.grams=1000
    JOIN sku base ON base.sku=kilo.sku WHERE pack.sku=sku.sku
) WHERE sku IN (SELECT pack.sku FROM oil_sizes pack
  JOIN oil_sizes kilo ON kilo.parent_sku=pack.parent_sku AND kilo.grams=1000
  JOIN sku base ON base.sku=kilo.sku
  WHERE pack.grams IN (50,100,250,500) AND base.price>=20)`;
const applyGst = `UPDATE sku SET tax=${defaultGstRate}`;
const equipmentUpdate = "INSERT INTO catalogue_updates (name) VALUES ('equipment-prices-and-enquiries-v1') ON CONFLICT DO NOTHING";
const updateEquipment = `
  UPDATE sku SET price=445000 WHERE sku='hume-commercial-scent-machine-pro' AND price=419000;
  UPDATE sku SET price=870000 WHERE sku='800ml-commercial-diffuser' AND price=795000;
  UPDATE sku SET price=1120000 WHERE sku='hume-pro-commercial-tower' AND price=965000;
  UPDATE sku SET online=0 WHERE sku IN (${enquiryEquipment.map(sku => "'" + sku + "'").join(',')});
`;
const openCatalogueSql = `
  UPDATE sku SET
    online=CASE WHEN sku.sku IN ('${enquiryEquipment.join("','")}') THEN 0 ELSE 1 END,
    stock=CASE WHEN stock=0 AND sku.sku NOT IN ('${enquiryEquipment.join("','")}') THEN ${openingStock} ELSE stock END,
    price=CASE WHEN price=1 THEN COALESCE((
      SELECT CAST(ROUND(parent.price / 100.0 * oil_sizes.grams) AS INTEGER)
      FROM oil_sizes JOIN sku AS parent ON parent.sku=oil_sizes.parent_sku
      WHERE oil_sizes.sku=sku.sku
    ), price) ELSE price END
  WHERE sku.sku IN (SELECT catalogue.sku FROM catalogue WHERE archived=0 AND category='equipment')
    OR sku.sku IN (
      SELECT oil_sizes.sku FROM oil_sizes
      JOIN catalogue AS pack ON pack.sku=oil_sizes.sku
      JOIN catalogue AS listing ON listing.sku=oil_sizes.parent_sku
      WHERE pack.archived=0 AND listing.archived=0
    )
`;

const postgresTransactions = new AsyncLocalStorage<PoolClient>();
const scopedClients = new WeakSet<PoolClient>();
const sqliteTransactions = new AsyncLocalStorage<DatabaseSync>();
let sqlite: DatabaseSync | undefined;
let pool: Pool | undefined;
let schemaReady: Promise<void> | undefined;
let sqliteTail: Promise<unknown> = Promise.resolve();

export function commerceStorageConfigured() {
  return Boolean(process.env.DATABASE_URL?.trim() || process.env.COMMERCE_DB_PATH?.trim())
    || process.env.NODE_ENV !== 'production';
}

function postgresUrl() {
  return mockPayments() ? undefined : process.env.DATABASE_URL?.trim();
}

export function deliveryJsonField(field: 'email' | 'name') {
  const value = postgresUrl() ? 'CAST(delivery AS JSON)' : 'delivery';
  return `(${value} ->> '${field}')`;
}

function localDatabase() {
  if (sqlite) return sqlite;
  const configured = process.env.COMMERCE_DB_PATH?.trim();
  if (!commerceStorageConfigured()) throw new Error('Commerce storage is not configured.');
  const path = resolve(configured || (mockPayments() ? '.commerce/preview.sqlite' : '.commerce/store.sqlite'));
  mkdirSync(dirname(path), { recursive: true });
  const connection = new DatabaseSync(path);
  connection.exec('PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;');
  connection.exec(commerceSchema);
  const seed = connection.prepare(`INSERT INTO sku (sku,name,price,stock,online,tax) VALUES (?,?,?,?,?,${defaultGstRate}) ON CONFLICT(sku) DO NOTHING`);
  const seedCatalogue = connection.prepare('INSERT INTO catalogue (sku,category,description,image) VALUES (?,?,?,?) ON CONFLICT(sku) DO NOTHING');
  connection.exec('BEGIN IMMEDIATE');
  try {
    if (!connection.prepare('PRAGMA table_info(storefront_events)').all().some(column => column.name === 'visitor')) {
      connection.exec('ALTER TABLE storefront_events ADD COLUMN visitor TEXT');
    }
    for (const product of commerceCatalog) {
      seed.run(product.sku, product.name, product.price, product.online ? openingStock : 0, Number(product.online));
      seedCatalogue.run(product.sku, product.category, product.description, product.image);
    }
    const seedSize = connection.prepare(seedSizeSql);
    for (const size of seededOilSizes) {
      seed.run(size.sku, size.name, size.price, openingStock, 1);
      seedCatalogue.run(size.sku, size.category, size.description, size.image);
      seedSize.run(size.sku, size.parent, size.grams);
    }
    if (connection.prepare(catalogueUpdate).run().changes) connection.exec(openCatalogueSql);
    if (connection.prepare(gstUpdate).run().changes) connection.exec(applyGst);
    if (connection.prepare(equipmentUpdate).run().changes) connection.exec(updateEquipment);
    if (connection.prepare(packPriceUpdate).run().changes) connection.exec(recalculateOilPackPrices);
    if (connection.prepare(amberValleyUpdate).run().changes) connection.exec(renameAmberValley);
    connection.exec('COMMIT');
  } catch (error) {
    connection.exec('ROLLBACK');
    connection.close();
    throw error;
  }
  sqlite = connection;
  return connection;
}

function serializeSqlite<T>(work: () => T | Promise<T>) {
  const next = sqliteTail.then(work);
  sqliteTail = next.catch(() => undefined);
  return next;
}

const namespace = 'hume_commerce';
const lockSql = 'SELECT pg_advisory_xact_lock(142903, 118003)';

function postgresPool(connectionString: string) {
  if (pool) return pool;
  const url = new URL(connectionString);
  if (url.port === '6543') throw new Error('Use the Supabase Session pooler connection on port 5432.');
  for (const key of ['sslmode', 'sslrootcert', 'sslcert', 'sslkey', 'uselibpqcompat']) url.searchParams.delete(key);
  pool = new Pool({
    connectionString: url.href,
    ssl: { rejectUnauthorized: true, ca: supabaseCa },
    connectionTimeoutMillis: 8000,
    max: 3,
    types: { getTypeParser: (oid, format) => oid === 20 && format !== 'binary' ? Number : types.getTypeParser(oid, format) },
  });
  pool.on('error', () => console.error('Idle commerce database connection lost.'));
  return pool;
}

async function postgresClient(connectionString: string) {
  const activePool = postgresPool(connectionString);
  schemaReady ??= initializePostgres(activePool).catch(error => {
    schemaReady = undefined;
    throw error;
  });
  await schemaReady;
  const client = await activePool.connect();
  try {
    if (!scopedClients.has(client)) {
      await client.query('SET search_path TO ' + namespace + ', pg_catalog');
      scopedClients.add(client);
    }
    return client;
  } catch (error) {
    client.release(true);
    throw error;
  }
}

async function initializePostgres(activePool: Pool) {
  const client = await activePool.connect();
  try {
    await client.query('BEGIN');
    await client.query(lockSql);
    await client.query('CREATE SCHEMA IF NOT EXISTS ' + namespace);
    await client.query('REVOKE ALL ON SCHEMA ' + namespace + ' FROM PUBLIC');
    await client.query('SET LOCAL search_path TO ' + namespace + ', pg_catalog');
    await client.query(commerceSchema);
    await client.query('ALTER TABLE storefront_events ADD COLUMN IF NOT EXISTS visitor TEXT');
    async function seedRows(table: string, columns: string, rows: (string | number)[][]) {
      const width = rows[0].length;
      const placeholders = rows.map((_, index) => '(' + Array.from({ length: width }, (_, offset) => '$' + (index * width + offset + 1)).join(',') + ')');
      await client.query(`INSERT INTO ${table} (${columns}) VALUES ${placeholders.join(',')} ON CONFLICT(sku) DO NOTHING`, rows.flat());
    }
    await seedRows('sku', 'sku,name,price,stock,online,tax', [
      ...commerceCatalog.map(item => [item.sku, item.name, item.price, item.online ? openingStock : 0, Number(item.online), defaultGstRate]),
      ...seededOilSizes.map(size => [size.sku, size.name, size.price, openingStock, 1, defaultGstRate]),
    ]);
    await seedRows('catalogue', 'sku,category,description,image', [...commerceCatalog, ...seededOilSizes].map(item => [item.sku, item.category, item.description, item.image]));
    await seedRows('oil_sizes', 'sku,parent_sku,grams', seededOilSizes.map(size => [size.sku, size.parent, size.grams]));
    if ((await client.query(catalogueUpdate)).rowCount) await client.query(openCatalogueSql);
    if ((await client.query(gstUpdate)).rowCount) await client.query(applyGst);
    if ((await client.query(equipmentUpdate)).rowCount) await client.query(updateEquipment);
    if ((await client.query(packPriceUpdate)).rowCount) await client.query(recalculateOilPackPrices);
    if ((await client.query(amberValleyUpdate)).rowCount) await client.query(renameAmberValley);
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => undefined);
    throw error;
  } finally {
    client.release();
  }
}

async function execute(sql: string, values: SQLInputValue[], mode: 'all' | 'get' | 'run') {
  const url = postgresUrl();
  if (url) {
    const active = postgresTransactions.getStore();
    const client = active ?? await postgresClient(url);
    try {
      let index = 0;
      const result = await client.query(sql.replace(/\?/g, () => '$' + ++index), values);
      if (mode === 'run') return { changes: result.rowCount ?? 0 };
      return mode === 'all' ? result.rows : result.rows[0];
    } finally {
      if (!active) client.release();
    }
  }
  const active = sqliteTransactions.getStore();
  const work = (connection: DatabaseSync) => connection.prepare(sql)[mode](...values);
  return active ? work(active) : serializeSqlite(() => work(localDatabase()));
}

export function db() {
  return {
    prepare: (sql: string) => ({
      all: async <T>(...values: SQLInputValue[]) => await execute(sql, values, 'all') as T[],
      get: async <T>(...values: SQLInputValue[]) => await execute(sql, values, 'get') as T | undefined,
      run: async (...values: SQLInputValue[]) => await execute(sql, values, 'run') as { changes: number },
    }),
  };
}

export async function transaction<T>(work: () => Promise<T>): Promise<T> {
  const url = postgresUrl();
  if (url) {
    const client = await postgresClient(url);
    try {
      await client.query('BEGIN');
      await client.query(lockSql);
      const result = await postgresTransactions.run(client, work);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK').catch(() => undefined);
      throw error;
    } finally {
      client.release();
    }
  }
  return serializeSqlite(async () => {
    const connection = localDatabase();
    connection.exec('BEGIN IMMEDIATE');
    try {
      const result = await sqliteTransactions.run(connection, work);
      connection.exec('COMMIT');
      return result;
    } catch (error) {
      connection.exec('ROLLBACK');
      throw error;
    }
  });
}

export async function closeCommerceStorage() {
  await pool?.end();
  sqlite?.close();
  sqlite = undefined;
  pool = undefined;
  schemaReady = undefined;
}
