import { closeCommerceStorage } from '../lib/commerce/database';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { createHmac } from 'node:crypto';
import { confirmPayment, createCheckout, db, getCheckout, getOrder, getStock, reserve } from '../lib/commerce/store';
import { openPayment, reconcile, refund, signed } from '../lib/commerce/payments';

const directory = mkdtempSync(join(tmpdir(), 'hume-commerce-'));
process.env.COMMERCE_DB_PATH = join(directory, 'test.sqlite');
process.env.COMMERCE_PAYMENT_MODE = 'mock';
process.env.COMMERCE_SHIPPING_PAISE = '7500';

after(async () => {
  await closeCommerceStorage();
  rmSync(directory, { recursive: true, force: true });
});

const sku = '800ml-commercial-diffuser';
const delivery = { name: 'Test Customer', email: 'customer@example.test', phone: '9999999999',
  address: '10 Example Street', city: 'Mumbai', state: 'Maharashtra', pin: '400001' };

test('saved checkout can retry payment and duplicate capture yields exactly one order', async () => {
  const checkoutId = await createCheckout([{ sku, quantity: 2 }], 'buy');
  const before = (await getStock(sku))!;
  const amount = 2 * before.price + 7500;
  await assert.rejects(() => reserve(checkoutId, delivery, amount - 1), /total changed/);
  const reservation = await reserve(checkoutId, delivery, amount);
  const url = await openPayment(reservation);
  assert.equal(url, '/checkout/' + checkoutId + '/test');
  const pending = (await getCheckout(checkoutId))!;
  assert.equal(await reconcile(pending), undefined);
  assert.equal((await getCheckout(checkoutId))!.order_id, null);
  assert.equal(await openPayment(pending), url);
  assert.equal((await getStock(sku))!.stock, before.stock - 2);
  await assert.rejects(() => confirmPayment(pending.provider!, 'mock_test', amount - 1, 'INR'), /does not match/);
  const order = await confirmPayment(pending.provider!, 'mock_test', amount, 'INR');
  assert.equal((await confirmPayment(pending.provider!, 'mock_test', amount, 'INR')).id, order.id);
  assert.notEqual(order.id, checkoutId);
  assert.equal((await getCheckout(checkoutId))!.order_id, order.id);
  assert.equal((await getOrder(order.id))!.state, 'paid');
  assert.equal((await db().prepare('SELECT COUNT(*) AS total FROM notifications WHERE order_id=?').get<{ total: number }>(order.id))?.total, 1);
  await db().prepare("UPDATE orders SET state='refund_pending' WHERE id=?").run(order.id);
  await refund(order.id);
  await refund(order.id);
  assert.equal((await getOrder(order.id))!.state, 'refunded');
  assert.equal((await getStock(sku))!.stock, before.stock);
});

test('expired payment restores inventory and insufficient stock cannot be reserved', async () => {
  const stock = (await getStock(sku))!;
  const id = await createCheckout([{ sku, quantity: stock.stock }], 'cart');
  const rival = await createCheckout([{ sku, quantity: 1 }], 'buy');
  await reserve(id, delivery, stock.stock * stock.price + 7500);
  await assert.rejects(() => reserve(rival, delivery, stock.price + 7500), /unavailable/);
  await db().prepare('UPDATE checkout SET expires=0 WHERE id=?').run(id);
  await reconcile((await getCheckout(id))!);
  assert.equal((await getStock(sku))!.stock, stock.stock);
  assert.equal((await getCheckout(id))!.attempt, null);
});

test('wholesale price applies only after the configured threshold', async () => {
  const stock = (await getStock(sku))!;
  await db().prepare('UPDATE sku SET wholesale_min=3,wholesale_price=? WHERE sku=?').run(stock.price - 100, sku);
  const id = await createCheckout([{ sku, quantity: 3 }], 'cart');
  assert.equal((await reserve(id, delivery, 3 * (stock.price - 100) + 7500)).total, 3 * (stock.price - 100) + 7500);
});

test('payment signatures reject modified payloads and incorrect secrets', () => {
  const raw = Buffer.from('{"event":"payment_link.paid"}');
  const signature = createHmac('sha256', 'test-secret').update(raw).digest('hex');
  assert.ok(signed(raw, signature, 'test-secret'));
  assert.ok(!signed(Buffer.from('{}'), signature, 'test-secret'));
  assert.ok(!signed(raw, signature, 'wrong'));
});
