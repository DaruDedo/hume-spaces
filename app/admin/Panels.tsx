import Link from '@/components/PageProgress';
import { db, getStockBatch, shippingFee } from '@/lib/commerce/store';
import { deliveryJsonField } from '@/lib/commerce/database';
import { commerceEmailConfigured } from '@/lib/commerce/notifications';
import { deliveryMessage } from '@/lib/commerce/preferences';
import { itemTotals, rupees, unitPrice, type Cart, type Delivery, type Line } from '@/lib/commerce/shared';
import { paymentReady } from '@/lib/commerce/payments';
import { maintain, updateShipping } from './actions';
import CopyCheckoutLink from './CopyCheckoutLink';
import { periodCutoff } from './periods';
import { date, day, Filters, label, pageNumber, Pager, ProductLines, RecordSummary, type Query } from './views';

const inactiveWindow = 24 * 60 * 60 * 1000;
type Count = { name: string; count: number };
type ActivityRow = { id: string; action: string; subject: string; created: number };

function RankedList({ title, rows }: { title: string; rows: Count[] }) {
  const max = Math.max(1, ...rows.map(row => Number(row.count)));
  return <section className="admin-card">
    <h2>{title}</h2>
    {rows.length ? <ul className="admin-ranking">{rows.map(row => <li key={row.name}>
      <span>{row.name}</span><strong>{row.count}</strong>
      <meter min={0} max={max} value={row.count} aria-label={row.name} />
    </li>)}</ul> : <p>No activity in this period.</p>}
  </section>;
}

export async function Dashboard({ query, analyticsPeriod }: { query: Query; analyticsPeriod?: string }) {
  const days = [7, 30, 90].includes(Number(query.days)) ? Number(query.days) : 30;
  const now = Date.now();
  const start = analyticsPeriod ? periodCutoff(analyticsPeriod, now) : now - days * day;
  const previousStart = start === 0 ? null : start - (now - start);
  const store = db();
  const [traffic, checkouts, orders, active, attention] = await Promise.all([
    store.prepare(`SELECT COUNT(DISTINCT CASE WHEN kind='page_view' THEN visit END) AS visits,
      COUNT(DISTINCT CASE WHEN kind='page_view' THEN visitor END) AS visitors,
      SUM(CASE WHEN kind='click' THEN 1 ELSE 0 END) AS clicks,
      (SELECT MIN(created) FROM storefront_events WHERE kind='page_view') AS first_view,
      SUM(CASE WHEN kind='page_view' THEN 1 ELSE 0 END) AS views,
      COUNT(DISTINCT CASE WHEN kind='cart_update' THEN visit END) AS cart_visits,
      SUM(CASE WHEN kind='planner_result' THEN 1 ELSE 0 END) AS plans FROM storefront_events WHERE created>=?`)
      .get<{ visits: number; visitors: number; clicks: number; views: number; cart_visits: number; plans: number; first_view: number | null }>(start),
    store.prepare('SELECT COUNT(*) AS count FROM checkout WHERE created>=?').get<{ count: number }>(start),
    store.prepare(`SELECT COUNT(*) AS count, SUM(CASE WHEN state IN ('paid','packed','shipped') THEN total ELSE 0 END) AS revenue
      FROM orders WHERE created>=?`).get<{ count: number; revenue: number }>(start),
    store.prepare('SELECT COUNT(*) AS count FROM cart_leads WHERE updated>=?').get<{ count: number }>(now - inactiveWindow),
    store.prepare(`SELECT
      (SELECT COUNT(*) FROM orders WHERE state='paid') AS pack,
      (SELECT COUNT(*) FROM orders WHERE state='packed') AS ship,
      (SELECT COUNT(*) FROM sku JOIN catalogue USING(sku) WHERE online=1 AND archived=0 AND stock<=3) AS low,
      (SELECT COUNT(*) FROM notifications WHERE sent IS NULL AND due<=?) AS emails`)
      .get<{ pack: number; ship: number; low: number; emails: number }>(now),
  ]);
  const metrics = [
    ...(analyticsPeriod ? [['Unique browsers', traffic?.visitors ?? 0], ['Storefront clicks', traffic?.clicks ?? 0]] : []),
    ['Visits', traffic?.visits ?? 0], ['Page views', traffic?.views ?? 0],
    ['Active carts · last 24 hours', active?.count ?? 0], ['Checkouts started', checkouts?.count ?? 0],
    ['Confirmed orders', orders?.count ?? 0], ['Paid order value', rupees(Number(orders?.revenue ?? 0))],
  ];
  return <>
    {!analyticsPeriod && <nav className="admin-ranges" aria-label="Reporting period">{[7, 30, 90].map(range =>
      <Link key={range} aria-current={range === days ? 'true' : undefined} href={'?days=' + range}>Last {range} days</Link>)}</nav>}
    <div className="admin-metrics">{metrics.map(([name, value]) => <div className="admin-card" key={name}>
      <span>{name}</span><strong>{value}</strong>
    </div>)}</div>
    <p className="admin-note">{traffic?.first_view ? 'Earliest tracked visit: ' + date(traffic.first_view) + '. ' : 'No visits recorded yet. '}
      Traffic and carts reflect shoppers who allow analytics. Checkout and order totals come from store records. Paid order value excludes refunded orders and refunds in progress.</p>
    {analyticsPeriod ? <AnalyticsDetails start={start} previousStart={previousStart} traffic={traffic} /> : <section className="admin-card">
      <h2>Needs attention</h2>
      <div className="admin-task-list">
        <Link href="/admin/orders?status=paid"><strong>{attention?.pack ?? 0}</strong> to pack</Link>
        <Link href="/admin/orders?status=packed"><strong>{attention?.ship ?? 0}</strong> to ship</Link>
        <Link href="/admin/catalogue?status=low_stock"><strong>{attention?.low ?? 0}</strong> low-stock SKUs</Link>
        <Link href="/admin/activity"><strong>{attention?.emails ?? 0}</strong> emails due</Link>
      </div>
      <Link href="/admin/analytics">Open traffic reports</Link>
    </section>}
  </>;
}

async function AnalyticsDetails({ start, previousStart, traffic }: { start: number; previousStart: number | null; traffic?: { cart_visits: number; plans: number } }) {
  const store = db();
  const [pages, sources, devices, entrances, paths, properties, previous, funnel, productPages, clickedPages, recentVisitors] = await Promise.all([
    store.prepare(`SELECT path AS name,COUNT(*) AS count FROM storefront_events
      WHERE created>=? AND kind='page_view' GROUP BY path ORDER BY count DESC,path LIMIT 12`).all<Count>(start),
    store.prepare(`SELECT source AS name,COUNT(DISTINCT visit) AS count FROM storefront_events
      WHERE created>=? AND kind='page_view' GROUP BY source ORDER BY count DESC,source LIMIT 10`).all<Count>(start),
    store.prepare(`SELECT device AS name,COUNT(DISTINCT visit) AS count FROM storefront_events
      WHERE created>=? AND kind='page_view' GROUP BY device ORDER BY count DESC,device`).all<Count>(start),
    store.prepare(`SELECT path AS name,COUNT(*) AS count FROM (
      SELECT path, ROW_NUMBER() OVER (PARTITION BY visit ORDER BY created,id) AS position
      FROM storefront_events WHERE kind='page_view' AND created>=?
    ) AS entries WHERE position=1 GROUP BY path ORDER BY count DESC,path LIMIT 10`).all<Count>(start),
    store.prepare(`SELECT previous || ' → ' || path AS name,COUNT(*) AS count FROM (
      SELECT path, LAG(path) OVER (PARTITION BY visit ORDER BY created,id) AS previous
      FROM storefront_events WHERE kind='page_view' AND created>=?
    ) AS steps WHERE previous IS NOT NULL AND previous<>path GROUP BY previous,path ORDER BY count DESC LIMIT 10`).all<Count>(start),
    store.prepare('SELECT term AS name,requests AS count FROM property_type_requests ORDER BY requests DESC,term LIMIT 12').all<Count>(),
    previousStart === null ? undefined : store.prepare(`SELECT COUNT(DISTINCT visit) AS visits, COUNT(*) AS views
      FROM storefront_events WHERE kind='page_view' AND created>=? AND created<?`)
      .get<{ visits: number; views: number }>(previousStart, start),
    store.prepare(`SELECT
      (SELECT COUNT(DISTINCT visit) FROM storefront_events WHERE created>=? AND kind='page_view'
        AND (path LIKE '/equipment/%' OR path LIKE '/fragrance-oils/%')) AS product_visits,
      (SELECT COUNT(DISTINCT visit) FROM checkout_attribution JOIN checkout ON checkout.id=checkout_attribution.checkout_id
        WHERE checkout.created>=?) AS checkout_visits,
      (SELECT COUNT(DISTINCT visit) FROM checkout_attribution JOIN orders ON orders.checkout_id=checkout_attribution.checkout_id
        WHERE orders.created>=?) AS order_visits`)
      .get<{ product_visits: number; checkout_visits: number; order_visits: number }>(start, start, start),
    store.prepare(`SELECT path AS name,COUNT(*) AS count FROM storefront_events
      WHERE created>=? AND kind='page_view' AND (path LIKE '/equipment/%' OR path LIKE '/fragrance-oils/%')
      GROUP BY path ORDER BY count DESC,path LIMIT 10`).all<Count>(start),
    store.prepare(`SELECT path AS name,COUNT(*) AS count FROM storefront_events
      WHERE created>=? AND kind='click' GROUP BY path ORDER BY count DESC,path LIMIT 12`).all<Count>(start),
    store.prepare(`SELECT visitor, COUNT(DISTINCT visit) AS visits,
      SUM(CASE WHEN kind='page_view' THEN 1 ELSE 0 END) AS views,
      SUM(CASE WHEN kind='click' THEN 1 ELSE 0 END) AS clicks, MAX(created) AS last_seen
      FROM storefront_events WHERE visitor IS NOT NULL AND created>=?
      GROUP BY visitor ORDER BY last_seen DESC,visitor LIMIT 20`)
      .all<{ visitor: string; visits: number; views: number; clicks: number; last_seen: number }>(start),
  ]);
  return <>
    <section className="admin-card">
      <h2>Shopping activity</h2>
      <p>{traffic?.cart_visits ?? 0} tracked visits with cart changes · {traffic?.plans ?? 0} property plans generated</p>
      {previousStart !== null && <p>Previous period: {previous?.visits ?? 0} tracked visits and {previous?.views ?? 0} page views.</p>}
      <ol className="admin-lines">
        <li><span>Viewed a product</span><strong>{funnel?.product_visits ?? 0}</strong></li>
        <li><span>Changed their cart</span><strong>{traffic?.cart_visits ?? 0}</strong></li>
        <li><span>Started checkout</span><strong>{funnel?.checkout_visits ?? 0}</strong></li>
        <li><span>Placed a confirmed order</span><strong>{funnel?.order_visits ?? 0}</strong></li>
      </ol>
    </section>
    <div className="admin-report-grid">
      <RankedList title="Top pages" rows={pages} /><RankedList title="Landing pages" rows={entrances} />
      <RankedList title="Common page-to-page paths" rows={paths} /><RankedList title="Traffic sources" rows={sources} />
      <RankedList title="Screen sizes" rows={devices} /><RankedList title="Requested property types · all time" rows={properties} />
      <RankedList title="Popular product pages" rows={productPages} />
      <RankedList title="Clicks by page" rows={clickedPages} />
    </div>
    <section className="admin-card">
      <h2>Recent anonymous visitors</h2>
      <p className="admin-note">Each ID represents a browser. Signed-in admin activity is excluded from visitor and click tracking. These counts use data collected after the tracking update.</p>
      {recentVisitors.length ? <ul className="admin-lines">{recentVisitors.map(visitor => <li key={visitor.visitor}>
        <span>{visitor.visitor.slice(0, 8)} · {date(visitor.last_seen)}</span>
        <strong>{visitor.visits} visits · {visitor.views} views · {visitor.clicks} clicks</strong>
      </li>)}</ul> : <p>No anonymous visitors in this period.</p>}
    </section>
  </>;
}

type QueueRow = {
  id: string; cart: string; updated: number; status: string; source: string; order_id: string | null;
  delivery: string | null; lines: string | null; shipping: number | null; total: number | null; expires: number | null;
};

export async function Queue({ query, carts, period }: { query: Query; carts: boolean; period: string }) {
  const statuses = carts ? ['active', 'inactive'] : ['started', 'awaiting_payment', 'payment_expired', 'inactive', 'completed'];
  const status = statuses.includes(query.status ?? '') ? query.status! : '';
  const search = '%' + (query.q ?? '').toLowerCase().slice(0, 120) + '%';
  const page = pageNumber(query);
  const now = Date.now();
  const cutoff = now - inactiveWindow;
  const select = carts
    ? `SELECT id, cart, updated, CASE WHEN updated>=? THEN 'active' ELSE 'inactive' END AS status,
      '' AS source, NULL AS order_id, NULL AS delivery, NULL AS lines, NULL AS shipping, NULL AS total, NULL AS expires FROM cart_leads`
    : `SELECT id,cart,created AS updated,CASE WHEN order_id IS NOT NULL THEN 'completed'
      WHEN attempt IS NOT NULL AND expires>? THEN 'awaiting_payment'
      WHEN attempt IS NOT NULL AND expires<=? THEN 'payment_expired'
      WHEN created>=? THEN 'started' ELSE 'inactive' END AS status,source,order_id,delivery,lines,shipping,total,expires FROM checkout`;
  const nowSeconds = Math.floor(now / 1000);
  const rows = await db().prepare(`SELECT * FROM (${select}) AS queue WHERE updated>=? AND (?='' OR status=?)
    AND (LOWER(id) LIKE ? OR LOWER(cart) LIKE ? OR LOWER(delivery) LIKE ?) ORDER BY updated DESC LIMIT 51 OFFSET ?`)
    .all<QueueRow>(...(carts ? [cutoff] : [nowSeconds, nowSeconds, cutoff]), periodCutoff(period, now), status, status, search, search, search, (page - 1) * 50);
  const decoded = rows.slice(0, 50).map(row => ({ ...row, items: JSON.parse(row.cart) as Cart }));
  const skus = [...new Set(decoded.flatMap(row => row.items.map(item => item.sku)))];
  const stock = await getStockBatch(skus);
  return <>
    <Filters query={query} statuses={statuses} placeholder={carts ? 'Cart ID or product SKU' : 'Checkout ID, product SKU or email'} />
    {!rows.length && <p className="admin-card">No matching {carts ? 'carts' : 'checkouts'}.</p>}
    {decoded.map(row => {
      const savedLines = row.lines ? JSON.parse(row.lines) as Line[] : null;
      const delivery = row.delivery ? JSON.parse(row.delivery) as Delivery : null;
      const lines = savedLines ?? row.items.map(item => {
        const product = stock.get(item.sku);
        return { ...item, name: product?.name, price: product ? unitPrice(product, item.quantity) : undefined };
      });
      const value = lines.every(line => line.price !== undefined)
        ? rupees(savedLines ? itemTotals(savedLines).subtotal : lines.reduce((total, line) => total + line.price! * line.quantity, 0))
        : 'Price unavailable';
      const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);
      const firstItem = lines[0]?.name ?? lines[0]?.sku ?? (carts ? 'Cart' : 'Checkout');
      return <details className="commerce-panel" key={row.id}>
        <RecordSummary title={delivery?.name ?? firstItem} detail={`${date(row.updated)} · ${quantity} units`}
          status={row.status} value={row.total === null ? value : rupees(row.total)} />
        <ProductLines lines={lines} />
        <p>{savedLines ? 'Items at checkout' : 'Estimated item value at current prices'} · {value}</p>
        {savedLines && <p>GST included · {rupees(itemTotals(savedLines).tax)} · Shipping · {rupees(row.shipping ?? 0)}</p>}
        {carts ? <p>Cart ID · {row.id}</p> : <>
          <p>Checkout ID · {row.id}</p>
          <p>Source · {row.source === 'buy' ? 'Buy Now' : label(row.source)}</p>
          {delivery ? <p>{delivery.email} · {delivery.phone}<br />{delivery.address}, {delivery.city}, {delivery.state} {delivery.pin}</p>
            : <p>Delivery details pending.</p>}
          {row.expires && !row.order_id && <p>Payment window ends · {date(row.expires * 1000)}</p>}
          <Link href={'/checkout/' + row.id}>Open customer checkout</Link>
          <CopyCheckoutLink path={'/checkout/' + row.id} />
          {row.order_id && <p><Link href={'/admin/orders?q=' + row.order_id}>Find the order</Link></p>}
        </>}
      </details>;
    })}
    <Pager query={query} page={page} more={rows.length > 50} />
  </>;
}

type Customer = { email: string; name: string; orders: number; checkouts: number; last_seen: number };

export async function Customers({ query }: { query: Query }) {
  const page = pageNumber(query);
  const search = '%' + (query.q ?? '').toLowerCase().slice(0, 120) + '%';
  const email = deliveryJsonField('email');
  const name = deliveryJsonField('name');
  const rows = await db().prepare(`SELECT LOWER(${email}) AS email, MAX(${name}) AS name,
    SUM(CASE WHEN order_id IS NULL THEN 0 ELSE 1 END) AS orders,
    SUM(CASE WHEN order_id IS NULL THEN 1 ELSE 0 END) AS checkouts, MAX(created) AS last_seen
    FROM checkout WHERE delivery IS NOT NULL AND (LOWER(${email}) LIKE ? OR LOWER(${name}) LIKE ?)
    GROUP BY LOWER(${email}) ORDER BY last_seen DESC,email LIMIT 51 OFFSET ?`)
    .all<Customer>(search, search, (page - 1) * 50);
  return <>
    <Filters query={query} placeholder="Customer name or email" />
    {!rows.length && <p className="admin-card">No matching customers.</p>}
    {rows.slice(0, 50).map(row => <section className="admin-card admin-customer" key={row.email}>
      <h2>{row.name}</h2><p>{row.email} · Last checkout {date(row.last_seen)}</p>
      <div className="admin-pages">
        <Link href={'/admin/orders?q=' + encodeURIComponent(row.email)}>{row.orders} orders</Link>
        <Link href={'/admin/checkouts?q=' + encodeURIComponent(row.email)}>{row.checkouts} open checkouts</Link>
      </div>
    </section>)}
    <Pager query={query} page={page} more={rows.length > 50} />
  </>;
}

export async function Settings() {
  const [fee, message] = await Promise.all([shippingFee(), deliveryMessage()]);
  return <div className="admin-report-grid">
    <section className="admin-card">
      <h2>Shipping and delivery</h2>
      <form action={updateShipping} className="commerce-form">
        <label>Flat shipping fee per order (₹)
          <input name="fee" type="number" min="0" max="9999999.99" step="0.01" defaultValue={Number.isFinite(fee) ? fee / 100 : undefined} required />
        </label>
        <label>Checkout delivery message<input name="message" defaultValue={message} maxLength={180} required /></label>
        <p>Enter 0 for free shipping. Fee changes apply to new payment attempts.</p>
        <button className="button">Save shipping settings</button>
      </form>
    </section>
    <section className="admin-card">
      <h2>Checkout readiness</h2>
      <p>Online payments · {paymentReady() ? 'Configured' : 'Setup pending'}</p>
      <p>Shipping fee · {Number.isFinite(fee) ? rupees(fee) : 'Setup pending'}</p>
    </section>
    <section className="admin-card">
      <h2>Email delivery</h2>
      <p>Resend · {commerceEmailConfigured() ? 'Configured' : 'Setup pending'}</p>
      <p>Email credentials are managed in the server environment.</p>
      <Link href="/admin/activity">Open email queue</Link>
    </section>
  </div>;
}

export async function Activity() {
  const [changes, notifications] = await Promise.all([
    db().prepare('SELECT * FROM staff_activity ORDER BY created DESC LIMIT 50').all<ActivityRow>(),
    db().prepare(`SELECT notifications.order_id, notifications.kind, sent, due, reason FROM notifications
      LEFT JOIN notification_failures USING(order_id,kind)
      ORDER BY CASE WHEN sent IS NULL THEN 0 ELSE 1 END,due DESC LIMIT 50`)
      .all<{ order_id: string; kind: string; sent: number | null; due: number; reason: string | null }>(),
  ]);
  return <div className="admin-report-grid">
    <section className="admin-card">
      <h2>Staff changes</h2>
      {changes.length ? <ul className="admin-lines">{changes.map(row => <li key={row.id}>
        <span>{row.action} · {row.subject}</span><time>{date(row.created)}</time>
      </li>)}</ul> : <p>No staff changes recorded yet.</p>}
    </section>
    <section className="admin-card">
      <h2>Email queue</h2>
      <form action={maintain}><button className="button">Check reservations and retry emails</button></form>
      {notifications.length ? <ul className="admin-lines">{notifications.map(row => <li key={row.order_id + row.kind}>
        <Link href={'/admin/orders?q=' + row.order_id}>{label(row.kind)} · {row.order_id.slice(0, 8)}</Link>
        <span>{row.sent ? 'Sent · ' + date(row.sent) : row.reason ? 'Retry needed · ' + row.reason
          : row.due > Date.now() ? 'Scheduled · ' + date(row.due) : 'Queued'}</span>
      </li>)}</ul> : <p>No order emails in the queue.</p>}
    </section>
  </div>;
}
