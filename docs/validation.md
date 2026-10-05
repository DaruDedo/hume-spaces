# Local validation — 1 October 2026

- Next.js production build and TypeScript compilation passed. The final production rebuild includes the public-Host origin fix, mobile-menu closing behavior, text arrows and smooth-scroll route attribute.
- Five Node tests passed: contact/area/consent validation, preliminary selector guidance, invalid and unconnected API states, public Host vs internal Next hostname, and explicit webhook acknowledgement/rejection/failure behavior.
- All 22 content routes plus robots and sitemap returned HTTP 200. Unknown equipment returned 404. Titles were checked for all content routes, including two representative products and two guides; Open Graph/Twitter values are generated from the same record descriptions in `lib/site.ts`.
- Browser journey: gym application selected; 1,800 sq ft, separate rooms and central HVAC produce zoning/compatibility guidance; the resulting brief, application and area carry into the consultation form.
- Browser submission reaches 503 and displays that delivery is unconnected; no success state is shown. The initial 403 origin issue was corrected and covered by a regression test. Receiving-service acceptance and rejection were tested with mocked responses, not a real external inbox.
- At a 390 px viewport, homepage, two equipment details, hotels, gyms, two guides, oils, selector and consultation all had document width equal to viewport width (no horizontal overflow).
- Homepage desktop (1440 × 1000) and mobile (390 × 844) screenshots were reviewed. Screenshots are in ignored `output/playwright/`. Next image optimization is used; application pictures are illustrative rather than client evidence.
- Local indexing is disabled while `SITE_ORIGIN` is empty. No deployment, live redirect or modification to HUME Fragrance was performed.
- Final production server at `http://127.0.0.1:3100` returned HTTP 200 for the homepage and the expected 503/`accepted: false` for an unconnected enquiry. Production mobile navigation closes after selecting a route. Desktop document width was 1440 px at a 1440 px viewport. Final screenshots were captured against this production server.

These checks validate the software. They do not verify supplier specifications, approved pricing, scent inventory, service promises or business contacts. A real receiving endpoint and final privacy terms remain unconnected.

## Launch readiness update
Production build and six tests passed. Production robots allows crawling, canonical uses humespaces.in, sitemap contains 32 URLs. Browser checks confirmed fragrance selection persistence across navigation/reload, clearing, enquiry attribution and no mobile overflow. Analytics stays disabled without an ID; live GA reporting requires owner configuration and validation.
