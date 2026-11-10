'use client';

import { useEffect, useState } from 'react';
import { analyticsConsentKey, analyticsEnabled } from '@/lib/commerce/activity-session';

export default function AnalyticsPreferences() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  useEffect(() => {
    try { setEnabled(analyticsEnabled()); } catch { /* Storage is unavailable. */ }
  }, []);

  return <label>
    <input type="checkbox" checked={enabled === true} disabled={enabled === null} onChange={event => {
      const checked = event.currentTarget.checked;
      const choice = checked ? 'accepted' : 'declined';
      localStorage.setItem(analyticsConsentKey, choice);
      setEnabled(checked);
      window.dispatchEvent(new CustomEvent('hume-analytics-choice', { detail: choice }));
      if (!checked && 'gtag' in window) location.reload();
    }} /> Enable analytics on this device
  </label>;
}
