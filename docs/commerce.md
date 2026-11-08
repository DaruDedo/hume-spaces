# HUME Spaces store

The catalogue includes the 400 mL and 800 mL commercial diffusers, the Tower Commercial Diffuser, the Car & Room Diffuser and fragrance oils in 50 g, 100 g, 250 g, 500 g and 1 kg packs. Mini Reed and Car & Room are initially enquiry products. In admin, staff can add, edit, remove and restore listings. Each oil pack has its own price, stock and purchase mode. Prices are tax-inclusive, and checkout shows the configured tax component and flat shipping separately. Estimated delivery is 5–7 days, depending on location.

## Local review

Use Node 22.17 or later. Set `COMMERCE_PAYMENT_MODE=mock` in the local process and set `COMMERCE_ADMIN_PASSWORD` (at least 24 characters) and `COMMERCE_SESSION_SECRET` (at least 32 characters) in `.env`. Mock mode uses local SQLite even when `DATABASE_URL` is set. A fresh mock database seeds ten units per online SKU. Shop at `/shop`, manage the store at `/admin`, and test both success and failure from the mock payment page.

## Production configuration

Set `DATABASE_URL` to the Supabase PostgreSQL Session pooler URL and `DATABASE_CA_PATH` to the CA certificate downloaded from the Supabase database settings. The app verifies the certificate and hostname. On first connection it creates and seeds the private `hume_commerce` schema. The opening catalogue gives eligible equipment and oil packs a stock count of 10 when no stock is recorded. Staff can update these counts in admin. Initial oil pack prices scale from each fragrance’s catalogue price, using it as the 100 g reference. Use the **Catalogue, stock and taxes** panel for tax-inclusive prices and GST rates and **Shipping settings** for the flat shipping fee. Set the fee to zero for free shipping. Checkouts with payment already in progress keep their recorded totals. Verify that your fulfilment team can serve the India PIN codes accepted at checkout.

Set the public HTTPS origin, Razorpay API keys and webhook secret. Subscribe the Razorpay webhook to `payment_link.paid` at `/api/commerce/razorpay`. First use Razorpay test keys and a separate database. Enable capture, then exercise a payment, a decline, redelivery of a signed paid event, a checkout with insufficient stock and a full pre-shipment refund. Use separate production keys after verification. The checkout creates expiring Razorpay payment links with partial payments disabled. A failed attempt can retry from the same saved checkout. The order page is created after the captured amount is verified.

Set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` to send order confirmations, shipping updates and refill reminders. Run an authenticated periodic POST to `/api/commerce/maintenance` using `Authorization: Bearer <COMMERCE_MAINTENANCE_TOKEN>` to reconcile reservations and retry pending emails. Staff can trigger maintenance manually from admin.

Checkout accepts online payment only. Customers can add GST billing details at checkout. After payment confirmation, staff can upload the issued GST invoice PDF to the order in admin. The customer can download it from the private order page. Anyone with the order or checkout link can use it, so send it only to the customer.

The admin can process full refunds before dispatch. Handle post-dispatch returns through the existing support process. Wholesale prices apply per SKU when the quantity in the cart meets the configured minimum.
