'use client';

import { useState, type FormEvent } from 'react';
import { checkPayment, startPayment } from '@/app/commerce-actions';
import RowSelect from './RowSelect';
import { deliveryCities, deliveryRegions, type DeliveryRegion } from '@/lib/commerce/india-delivery';
import { rupees } from '@/lib/commerce/shared';

export default function CheckoutForm({ id, total, pending, ready }: { id: string; total: number; pending: boolean; ready: boolean }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [gstBilling, setGstBilling] = useState(false);
  const [region, setRegion] = useState<DeliveryRegion | ''>('');
  const [city, setCity] = useState('');
  const [addedCity, setAddedCity] = useState('');
  const cities = region ? [...deliveryCities[region], ...(addedCity ? [addedCity] : [])].sort((a, b) => a.localeCompare(b, 'en')) : [];

  async function run(action: () => Promise<{ url?: string; error?: string }>) {
    setBusy(true);
    setMessage('');
    try {
      const result = await action();
      if (result.url) window.location.assign(result.url);
      else setMessage(result.error ?? 'Please try again.');
    } catch {
      setMessage('Please try again.');
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(() => startPayment(id, form));
  }

  return <>
    <form className="commerce-form checkout-form" onSubmit={submit}>
      <input type="hidden" name="total" value={total} />
      {!pending && <fieldset className="checkout-delivery">
        <legend><span aria-hidden="true">01</span> Contact and delivery</legend>
        <p className="checkout-form-note">Enter the recipient’s details and where we should deliver the order.</p>
        <div className="commerce-fields">
          <label className="checkout-wide">Full name
            <input name="name" autoComplete="name" placeholder="Name of the recipient" minLength={2} maxLength={100} required />
          </label>
          <label>Email
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={200} required />
          </label>
          <label>Phone number
            <input name="phone" type="tel" autoComplete="tel" placeholder="+91 98765 43210" maxLength={18} required />
          </label>
          <label className="checkout-wide checkout-address">Delivery address
            <textarea name="address" autoComplete="street-address" placeholder="House or flat number, street and locality" rows={2}
              minLength={5} maxLength={250} required />
          </label>
          <label className="checkout-wide">State or union territory
            <RowSelect name="state" required value={region} searchPlaceholder="Search states and union territories" onValueChange={value => {
              setRegion(value as DeliveryRegion);
              setCity('');
              setAddedCity('');
            }}>
              <option value="">Choose a state or union territory</option>
              {deliveryRegions.map(state => <option key={state} value={state}>{state}</option>)}
            </RowSelect>
          </label>
          <label>City or district
            <RowSelect key={region} name="city" required disabled={!region} value={city} onValueChange={setCity} resultLimit={60}
              searchPlaceholder="Search or type your city" onAddOption={value => {
                setAddedCity(value);
                setCity(value);
              }}>
              <option value="">{region ? 'Choose or add your city' : 'Choose your state first'}</option>
              {cities.map(place => <option key={place} value={place}>{place}</option>)}
            </RowSelect>
          </label>
          <label>PIN code
            <input name="pin" inputMode="numeric" autoComplete="postal-code" placeholder="6-digit PIN code"
              pattern="[1-9][0-9]{5}" maxLength={6} required />
          </label>
        </div>
      </fieldset>}
      {!pending && <>
        <button type="button" className="checkout-gst-toggle" aria-expanded={gstBilling} aria-controls="gst-billing-fields" onClick={() => setGstBilling(!gstBilling)}>
          <span>{gstBilling ? 'Remove GST billing details' : 'Add GST billing details'} <small>Optional</small></span>
          <span aria-hidden="true">{gstBilling ? '−' : '+'}</span>
        </button>
        {gstBilling && <fieldset id="gst-billing-fields" className="commerce-panel">
          <legend>GST billing details</legend>
          <input type="hidden" name="gstBillingRequested" value="yes" />
          <div className="commerce-fields">
            <label>GSTIN<input name="gstin" minLength={15} maxLength={15} autoCapitalize="characters" required /></label>
            <label>Registered business name<input name="businessName" autoComplete="organization" maxLength={150} required /></label>
            <label>Registered billing address<input name="billingAddress" maxLength={250} required /></label>
          </div>
          <p>After payment is confirmed, you can download your GST invoice from the order page when it’s ready.</p>
        </fieldset>}
      </>}
      {pending && <p>If you requested GST billing, your invoice will be available from the confirmed order page when it’s ready.</p>}
      <section className="checkout-payment" aria-label="Payment">
        <div>
          <strong>{!pending && <span aria-hidden="true">02</span>} Secure payment</strong>
          <p className="checkout-form-note">{ready ? 'Pay online to confirm your order. Cash on delivery is unavailable.' : 'Online payment is currently unavailable.'}</p>
        </div>
        <div className="commerce-actions">
          <button className="button" disabled={busy || !ready}>{pending ? 'Resume payment' : 'Continue to payment'}
            {ready && <span>{rupees(total)}</span>}
          </button>
          {pending && <button type="button" className="text-link dark" disabled={busy} onClick={() => run(() => checkPayment(id))}>Check payment status</button>}
        </div>
      </section>
    </form>
    <p role="status">{message}</p>
  </>;
}
