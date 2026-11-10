import { commerceStorageConfigured, db } from './database';
import { deliveryEstimate } from './catalogue';

export async function deliveryMessage() {
  if (!commerceStorageConfigured()) return deliveryEstimate;
  const row = await db().prepare("SELECT value FROM store_preferences WHERE key='delivery_message'").get<{ value: string }>();
  return row?.value ?? deliveryEstimate;
}
