import CheckoutHistory from '@/components/CheckoutHistory';

export const metadata = {
  title: 'My account',
  robots: { index: false, follow: false },
  referrer: 'no-referrer' as const,
};

export default function AccountPage() {
  return <section className="wrap commerce-page">
    <h1>My account</h1>
    <p>Resume a checkout or view orders you started on this browser.</p>
    <CheckoutHistory />
  </section>;
}
