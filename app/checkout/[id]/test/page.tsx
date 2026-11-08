import { notFound, redirect } from 'next/navigation';
import { confirmPayment, getCheckout, mockPayments, validId } from '@/lib/commerce/store';
import { rupees } from '@/lib/commerce/shared';

export const dynamic = 'force-dynamic';
export const metadata = { robots: { index: false, follow: false } };

export default async function TestPaymentPage({ params, searchParams }: {
  params: Promise<{ id: string }>; searchParams: Promise<{ failed?: string }>;
}) {
  const { id } = await params;
  if (!mockPayments() || !validId(id)) notFound();
  const checkout = await getCheckout(id);
  if (!checkout?.provider?.startsWith('mock_') || checkout.total === null) notFound();
  if (checkout.order_id) redirect('/orders/' + checkout.order_id);

  async function simulate(form: FormData) {
    'use server';
    if (!mockPayments()) notFound();
    const current = await getCheckout(id);
    if (!current?.provider?.startsWith('mock_') || current.total === null || !current.expires || current.expires <= Date.now() / 1000) redirect('/checkout/' + id);
    if (form.get('outcome') === 'fail') redirect('/checkout/' + id + '/test?failed=1');
    const order = await confirmPayment(current.provider, 'mock_payment_' + current.attempt, current.total, 'INR');
    redirect('/orders/' + order.id);
  }

  return <section className="wrap commerce-page">
    <h1>Test payment</h1><p>Simulation only. Total {rupees(checkout.total)}.</p>
    {(await searchParams).failed && <p role="status">Test payment failed. You can try again.</p>}
    <form action={simulate} className="commerce-actions">
      <button className="button" name="outcome" value="success">Simulate success</button>
      <button className="button" name="outcome" value="fail">Simulate failure</button>
    </form>
  </section>;
}
