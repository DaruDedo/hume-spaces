'use client';

import { useEffect, useState } from 'react';
import Link from '@/components/PageProgress';
import { savedCheckoutSummaries } from '@/app/commerce-actions';

const storageKey = 'hume-checkout-history';
type Summary = Awaited<ReturnType<typeof savedCheckoutSummaries>>[number];

function readHistory(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string').slice(0, 20) : [];
  } catch {
    return [];
  }
}

export function RememberCheckout({ id }: { id: string }) {
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify([id, ...readHistory().filter(saved => saved !== id)].slice(0, 20)));
    } catch {
      // Checkout remains usable when browser storage is disabled.
    }
  }, [id]);
  return null;
}

export default function CheckoutHistory() {
  const [entries, setEntries] = useState<Summary[]>();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const ids = readHistory();
    if (!ids.length) setEntries([]);
    else void savedCheckoutSummaries(ids).then(result => {
      if (active) setEntries(result);
    }, () => {
      if (active) setFailed(true);
    });
    return () => { active = false; };
  }, []);

  if (failed) return <p role="status">Couldn’t load your checkout history. Reload the page to try again.</p>;
  if (!entries) return <p role="status">Loading your checkout history…</p>;

  const unfinished = entries.filter(entry => !entry.orderId);
  const completed = entries.filter(entry => entry.orderId);
  const groups = [
    { title: 'Unfinished checkouts', entries: unfinished, empty: 'You have no unfinished checkouts on this browser.' },
    { title: 'Orders', entries: completed, empty: 'You have no completed orders on this browser.' },
  ];

  return <>
    {groups.map(group => <section key={group.title}>
      <h2>{group.title}</h2>
      {group.entries.length === 0 && <p>{group.empty}</p>}
      {group.entries.map(entry => <div className="commerce-row account-checkout" key={entry.id}>
        <div>
          <strong>{entry.title}{entry.additionalProducts > 0 && ` + ${entry.additionalProducts} more`}</strong>
          <p>{entry.quantity} {entry.quantity === 1 ? 'item' : 'items'} · {new Intl.DateTimeFormat('en-IN', {
            dateStyle: 'medium', timeZone: 'Asia/Kolkata',
          }).format(entry.created)}</p>
          {!entry.orderId && entry.paymentStarted && <p>Payment started</p>}
        </div>
        <Link className="button outline" href={entry.orderId ? '/orders/' + entry.orderId : '/checkout/' + entry.id}>
          {entry.orderId ? 'View order' : 'Resume checkout'}
        </Link>
      </div>)}
    </section>)}
    <Link className="text-link dark" href="/shop">Continue shopping →</Link>
  </>;
}
