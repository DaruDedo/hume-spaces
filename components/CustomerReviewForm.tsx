'use client';

import {useState, type FormEvent} from 'react';
import {whatsappMessageUrl} from '@/lib/whatsapp';
import ArrowUpRight from './ArrowUpRight';
import styles from './CustomerReviews.module.css';

export default function CustomerReviewForm({product}: {product?: {sku: string; name: string}}) {
  const [status, setStatus] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const rating = data.get('rating');
    const review = String(data.get('review') ?? '').trim();

    if (review.length < 10) {
      setStatus('Please write at least 10 characters about your experience.');
      return;
    }

    const message = [
      'Hi HUME Spaces, I’d like to share a review.',
      product ? `Product: ${product.name} (${product.sku})` : 'Review for: HUME Spaces',
      `Rating: ${rating}/5`,
      '',
      review,
    ].join('\n');
    window.open(whatsappMessageUrl(message), '_blank', 'noopener,noreferrer');
    setStatus('Tap Send in WhatsApp to share your review.');
  }

  return (
    <details className={styles.formDisclosure}>
      <summary>Write a review <span aria-hidden="true" /></summary>
      <form className={styles.form} method="post" onSubmit={submit}>
        <label>
          Your rating
          <select name="rating" defaultValue="" required>
            <option value="" disabled>Select a rating</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </label>
        <label>
          Your review
          <textarea name="review" rows={4} minLength={10} maxLength={1200} required />
        </label>
        <button type="submit" className="button">Continue to WhatsApp <ArrowUpRight /></button>
        <p className={styles.status} role="status">{status}</p>
      </form>
    </details>
  );
}
