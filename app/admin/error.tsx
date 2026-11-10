'use client';

import Link from 'next/link';

export default function AdminError({ reset }: { reset: () => void }) {
  return <div className="admin-login">
    <section className="admin-card">
      <h1>Admin is temporarily unavailable</h1>
      <p>Refresh this panel. If the problem continues, check the store database connection.</p>
      <button type="button" className="button" onClick={reset}>Try again</button>
      <p><Link href="/admin">Back to overview</Link></p>
    </section>
  </div>;
}
