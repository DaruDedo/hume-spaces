import { commerceStorageConfigured } from '@/lib/commerce/database';
import { connection } from 'next/server';
import { db } from './store';

export async function catalogPrices() {
  await connection();
  if (!commerceStorageConfigured()) return {};
  const rows = await db().prepare('SELECT sku, price FROM sku').all() as { sku: string; price: number }[];
  return Object.fromEntries(rows.map(row => [row.sku, row.price / 100])) as Record<string, number>;
}
