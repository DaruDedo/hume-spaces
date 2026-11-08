'use client';

import { useState } from 'react';

export default function CommercePrivateLink({ label }: { label: string }) {
  const [message, setMessage] = useState('');
  async function copy() {
    try {
      await navigator.clipboard.writeText(location.origin + location.pathname);
      setMessage('Link copied.');
    } catch {
      setMessage('Copy the link from your address bar.');
    }
  }
  return <div className="commerce-actions">
    <button type="button" className="text-link dark" onClick={copy}>{label}</button>
    <span role="status">{message}</span>
  </div>;
}
