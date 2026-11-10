'use client';

import Link from 'next/link';
import { useEffect, useId, useRef } from 'react';

export default function FragranceCartPrompt({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useId();

  useEffect(() => {
    const element = dialog.current;
    if (element && !element.open) element.showModal();
  }, []);

  return <dialog ref={dialog} className="fragrance-cart-prompt" aria-labelledby={title}
    onClose={onClose} onClick={event => {
      if (event.target === event.currentTarget) event.currentTarget.close();
    }}>
    <div className="commerce-panel">
      <p className="eyebrow">DIFFUSER ADDED TO CART</p>
      <h2 id={title}>Add fragrance oil</h2>
      <p>Choose a scent and pack size for your diffuser.</p>
      <div className="commerce-actions">
        <Link className="button" href="/fragrance-oils" onNavigate={() => dialog.current?.close()}>Add fragrance oil</Link>
        <button type="button" className="button outline" onClick={() => dialog.current?.close()}>Continue shopping</button>
      </div>
    </div>
  </dialog>;
}
