# Deployment: humespaces.in

Production domain: https://humespaces.in
Set SITE_ORIGIN=https://humespaces.in in the hosting provider environment before building. This enables production canonical URLs, sitemap entries and indexable robots metadata. Do not commit private environment files.

The website requires a Next.js-compatible host. Configure the root directory as this repository root, install with npm ci and build with npm run build. The existing npm start script binds to localhost:3100 for local preview; a self-managed production server should invoke Next with the host and port required by its platform.

Attach humespaces.in and optionally www.humespaces.in through the chosen host. Apply only the DNS records supplied by that host, preserve existing email MX/TXT records, and redirect the secondary hostname to the primary. Verify HTTPS before launch.

After deployment, verify /robots.txt, /sitemap.xml, /llms.txt, product canonical URLs, WhatsApp links and mobile navigation. Add the domain to Google Search Console and submit its sitemap. Current enquiries open WhatsApp; the legacy API webhook is optional and is not required for the WhatsApp flow.

Repository destination, hosting provider and registrar are still to be confirmed. No remote push or public deployment has been performed.
