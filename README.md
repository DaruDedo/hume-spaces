# HUME Spaces

Independent commercial scenting website built locally with Next.js 16, React 19, TypeScript and Tailwind 4. The HUME Fragrance project was read only as a reference; it has not been changed. No secrets, perfume checkout logic, promotions or analytics were copied.

## Local setup

Requires Node.js 20.9 or later. Run `npm install`, then `npm run dev`. Review at http://127.0.0.1:3100. Run `npm run build` and `npm start` for production locally. Run `npm run typecheck` and `npm test` for checks.

Copy `.env.example` to `.env.local` only when values are confirmed. Every placeholder is intentionally empty. Restart the server after changing values; public variables and static SEO configuration also require a rebuild.

## Implemented

The latest visual and interactive redesign is documented in [design refresh](docs/design-refresh.md). It adds application/equipment/scent explorers, quick-answer buttons, equipment filters and a three-step space planner, with a new shared visual style.

- Homepage, equipment catalog, four equipment detail pages and comparison table.
- Distinct hotel, gym, office, retail and spa application pages.
- Six reference scent concepts with compatibility guidance.
- Space selector carrying a brief into the enquiry form.
- Validated consultation/quotation form and receiving-webhook integration.
- Three practical guides, FAQs, about, contact and enquiry privacy notice.
- Responsive navigation, skip link, visible keyboard focus, reduced-motion handling, locally optimized Next images and favicon.
- Descriptive route metadata, product JSON-LD without invented offers, configurable canonicals, robots and sitemap.

## Configuration

`SITE_ORIGIN`: approved absolute website origin. Leave empty for review; indexing is disabled and sitemap has no URLs. Set and rebuild before launch.

`NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`: confirmed public business contacts. `NEXT_PUBLIC_WHATSAPP_NUMBER`: confirmed international number including country code. `NEXT_PUBLIC_HUME_FRAGRANCE_URL`: approved brand website link. Empty values hide their links.

`LEAD_WEBHOOK_URL`: server-only HTTPS receiving endpoint. `LEAD_WEBHOOK_TOKEN`: optional server-only bearer token. The endpoint receives `{ source, submittedAt, lead }` and must respond with a successful HTTP status and JSON `{ "accepted": true }` **only after it has accepted the enquiry**. A 2xx response alone does not show success. No configured receiver returns 503; malformed input returns 400/422; delivery failure or missing acknowledgement returns 502. The API rejects cross-origin browser submissions and non-JSON input, has a payload limit, a honeypot and a delivery timeout. It does not log or persist contact details.

Before public launch, add receiver-level abuse/rate protection, verify real delivery and failure cases, specify retention and privacy handling, and ensure the chosen host preserves the correct request origin. The in-memory browser form is not a durable inbox. Ambiguous upstream failures can have delivered an enquiry; the error message reflects that uncertainty. No payment or order flow is present.

## Architecture and provenance

App Router routes live under `app/`; reusable shell, cards and client forms under `components/`. `lib/content.ts` holds the adapted catalog and editorial content; `lib/lead.ts` shares input validation and selector guidance; `lib/site.ts` centralizes SEO origin handling. `app/api/leads/route.ts` is the only delivery boundary. Normal Next.js Node hosting is suitable; no hosting provider is configured or publication performed.

Reference products, six profiles and images came from HUME Fragrance `lib/spaces.ts` and `public/images/spaces`. The former shell depended on perfume-specific header/footer and was not copied. Original guide topics were reviewed; unsupported certifications, health claims, quantified performance, consumption estimates and service promises were removed. Photographs depict applications, not verified client projects. Existing listed prices are retained only in the private business review document and not exposed as offers.

See [business review](docs/business-review.md), [migration map](docs/migration-map.csv) and [launch checklist](docs/launch.md). No redirects have been activated.
