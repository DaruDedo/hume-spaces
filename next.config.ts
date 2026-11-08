import type { NextConfig } from 'next';
const config: NextConfig = {
  poweredByHeader: false,
  ...(process.env.COMMERCE_DEV_DIST && process.env.NODE_ENV === 'development' ? { distDir: process.env.COMMERCE_DEV_DIST } : {}),
  experimental: { cpus: 2 },
  async headers() {
    return ['/checkout/:path*', '/orders/:path*', '/admin/:path*'].map(source => ({
      source,
      headers: [
        { key: 'Cache-Control', value: 'private, no-store' },
        { key: 'Referrer-Policy', value: 'no-referrer' },
        { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
      ],
    }));
  },
};
export default config;
