'use client';

import { useState, type FormEvent } from 'react';
import { changeCheckoutCoupon } from '@/app/commerce-actions';
import Link from './PageProgress';

export default function CheckoutCoupon({ id, code }: { id: string; code: string | null }) {
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function update(value: string | null) {
    setBusy(true);
    setMessage('');
    try {
      const error = await changeCheckoutCoupon(id, value);
      setMessage(error ?? (value === null ? 'Coupon removed.' : 'Coupon checked. See your updated summary.'));
      if (!error) setInput('');
    } catch {
      setMessage('Could not update the coupon. Try again.');
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void update(input);
  }

  return <div className="checkout-coupon">
    {code && <div className="commerce-total"><strong>{code}</strong><button type="button" className="text-link dark" disabled={busy} onClick={() => void update(null)}>Remove coupon</button></div>}
    <form className="checkout-coupon-form" onSubmit={submit}>
      <label>Coupon code<input value={input} onChange={event => setInput(event.target.value)} maxLength={32}
        autoCapitalize="characters" autoComplete="off" spellCheck={false} placeholder="Enter code" required /></label>
      <button className="button outline" disabled={busy}>{busy ? 'Checking…' : 'Apply'}</button>
    </form>
    <Link className="text-link dark" href="/offers" target="_blank" rel="noopener">Browse current offers</Link>
    <div role="status">{message}</div>
  </div>;
}
