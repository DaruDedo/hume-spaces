'use client';

import { useState } from 'react';

export default function CopyCheckoutLink({ path }: { path: string }) {
  const [status, setStatus] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(new URL(path, location.origin).href);
      setStatus('Link copied');
    } catch {
      setStatus('Open the checkout to copy its address');
    }
  }
  return <span className="admin-copy">
    <button type="button" onClick={copy}>Copy private link</button>
    <span aria-live="polite">{status}</span>
  </span>;
}
