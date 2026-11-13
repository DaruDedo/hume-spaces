'use client';

import NextLink, { useLinkStatus } from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type ComponentProps } from 'react';
import { createPortal } from 'react-dom';
import styles from './PageProgress.module.css';

const destinations: Readonly<Record<string, string>> = {
  '/': 'Opening home page',
  '/admin': 'Opening admin overview',
  '/admin/carts': 'Opening cart leads',
  '/admin/checkouts': 'Opening checkouts',
  '/admin/orders': 'Opening orders',
  '/admin/catalogue': 'Opening catalogue and inventory',
  '/admin/promotions': 'Opening promotions',
  '/admin/customers': 'Opening customers',
  '/admin/analytics': 'Opening analytics',
  '/admin/settings': 'Opening settings',
  '/admin/activity': 'Opening activity',
  '/account': 'Opening your account',
  '/cart': 'Opening cart',
  '/checkout': 'Opening checkout',
  '/orders': 'Opening your order',
  '/shop': 'Opening shop',
  '/equipment': 'Opening diffusers',
  '/fragrance-oils': 'Opening fragrance oils',
  '/industries': 'Opening solutions by space',
  '/search': 'Opening search',
  '/offers': 'Opening offers',
};

function destinationLabel(href: ComponentProps<typeof NextLink>['href']) {
  const path = (typeof href === 'string' ? href : href.pathname ?? '').split(/[?#]/)[0].replace(/\/$/, '') || '/';
  if (destinations[path]) return destinations[path];
  const section = path.split('/')[1];
  if (section === 'checkout' || section === 'orders') return destinations['/' + section];
  if (section === 'equipment' || section === 'shop') return 'Opening product details';
  if (section === 'fragrance-oils') return 'Opening fragrance details';
  return 'Opening page';
}

function ProgressBar({ label }: { label: string }) {
  return <div className={styles.indicator} role="status" aria-atomic="true">
      <div className={styles.track} aria-hidden="true"><div /></div>
      <span>{label}…</span>
    </div>;
}

function Indicator({ label }: { label: string }) {
  return createPortal(<ProgressBar label={label} />, document.body);
}

export function LoadingPageProgress() {
  const pathname = usePathname();
  return <ProgressBar label={destinationLabel(pathname ?? '')} />;
}

function LinkProgress({ label }: { label: string }) {
  const { pending } = useLinkStatus();
  return pending ? <Indicator label={label} /> : null;
}

export default function Link({ children, href, ...props }: ComponentProps<typeof NextLink>) {
  return <NextLink {...props} href={href}>
    {children}
    <LinkProgress label={destinationLabel(href)} />
  </NextLink>;
}

const progressEvent = 'hume-page-progress';

export function startPageProgress(label: string) {
  const id = Symbol();
  window.dispatchEvent(new CustomEvent(progressEvent, { detail: { id, label } }));
  return () => window.dispatchEvent(new CustomEvent(progressEvent, { detail: { id } }));
}

export function PageProgress() {
  const [active, setActive] = useState<{ id: symbol; label: string } | null>(null);
  useEffect(() => {
    function update(event: Event) {
      const { id, label } = (event as CustomEvent<{ id: symbol; label?: string }>).detail;
      setActive(previous => label ? { id, label } : previous?.id === id ? null : previous);
    }
    function reset() { setActive(null); }
    window.addEventListener(progressEvent, update);
    window.addEventListener('pageshow', reset);
    return () => {
      window.removeEventListener(progressEvent, update);
      window.removeEventListener('pageshow', reset);
    };
  }, []);
  return active ? <Indicator key={active.label} label={active.label} /> : null;
}
