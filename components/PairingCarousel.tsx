'use client';

import Image from 'next/image';
import Link from '@/components/PageProgress';
import { useEffect, useId, useRef, useState } from 'react';
import { rupees } from '@/lib/commerce/shared';
import ArrowUpRight from './ArrowUpRight';

type Product = { sku: string; name: string; image: string; href: string; description: string; price?: number };

function move(rail: HTMLDivElement | null, direction: number) {
  const first = rail?.children[0] as HTMLElement | undefined;
  const second = rail?.children[1] as HTMLElement | undefined;
  if (!rail || !first || !second) return;
  rail.scrollBy({
    left: (second.offsetLeft - first.offsetLeft) * direction,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
  });
}

export default function PairingCarousel({ products, category }: { products: Product[]; category: 'oil' | 'equipment' }) {
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(0);
  const trackId = useId();
  const equipment = category === 'equipment';
  const columns = equipment ? 3 : 4;
  const buffer = products.length >= columns ? columns : 0;
  const slides = buffer
    ? [...products.slice(-buffer), ...products, ...products.slice(0, buffer)]
    : products;

  useEffect(() => {
    const rail = track.current;
    if (!rail || !buffer) return;
    const first = rail.children[buffer] as HTMLElement;
    const repeated = rail.children[buffer + products.length] as HTMLElement;
    rail.scrollLeft = first.offsetLeft;
    let settle: ReturnType<typeof setTimeout>;
    let lastScroll = 0;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const hover = matchMedia('(hover: hover)');
    function wrap() {
      if (!rail) return;
      const cycle = repeated.offsetLeft - first.offsetLeft;
      if (!cycle) return;
      if (rail.scrollLeft < first.offsetLeft - 1) rail.scrollLeft += cycle;
      else if (rail.scrollLeft >= repeated.offsetLeft - 1) rail.scrollLeft -= cycle;
    }
    function onScroll() {
      lastScroll = Date.now();
      clearTimeout(settle);
      settle = setTimeout(wrap, 150);
    }
    rail.addEventListener('scroll', onScroll, { passive: true });
    const rotation = window.setInterval(() => {
      if (document.hidden || reducedMotion.matches || Date.now() - lastScroll < 500) return;
      if (rail.matches(':focus-within') || (hover.matches && rail.matches(':hover'))) return;
      const { top, bottom } = rail.getBoundingClientRect();
      if (top < window.innerHeight && bottom > 0) move(rail, 1);
    }, 3000);
    return () => {
      clearTimeout(settle);
      window.clearInterval(rotation);
      rail.removeEventListener('scroll', onScroll);
    };
  }, [buffer, products.length]);

  return <section className="simple-section">
    <div className="section-heading fragrance-pairing-heading">
      <h2>{equipment ? 'Diffusers to pair with your fragrance oil' : 'Fragrance oils to pair with your diffuser'}</h2>
      {products.length > 1 && <div className="fragrance-pairing-controls">
        <button type="button" aria-label={equipment ? 'Previous diffuser' : 'Previous fragrance'} aria-controls={trackId} onClick={() => move(track.current, -1)}>←</button>
        <button type="button" aria-label={equipment ? 'Next diffuser' : 'Next fragrance'} aria-controls={trackId} onClick={() => move(track.current, 1)}>→</button>
      </div>}
    </div>
    <div className="fragrance-pairing-track" data-equipment={equipment || undefined} id={trackId} ref={track}
      onScroll={event => {
        const rail = event.currentTarget;
        const first = rail.children[buffer] as HTMLElement | undefined;
        const next = rail.children[buffer + 1] as HTMLElement | undefined;
        if (!first || !next) return;
        const step = next.offsetLeft - first.offsetLeft;
        if (!step) return;
        const index = Math.round((rail.scrollLeft - first.offsetLeft) / step);
        setPosition((index + products.length) % products.length);
      }}>
      {slides.map((product, index) => {
        const duplicate = index < buffer || index >= buffer + products.length;
        return <article key={index + ':' + product.sku} className="product-card" aria-hidden={duplicate || undefined}>
          <Link href={product.href} tabIndex={duplicate ? -1 : undefined}>
            <div className="product-image">
              <Image src={product.image} alt="" fill sizes={equipment ? '(max-width: 750px) 50vw, 33vw' : '(max-width: 750px) 50vw, 25vw'} />
            </div>
            <div className="fragrance-pairing-card-title">
              <h3>{product.name}</h3>
              <span aria-hidden="true"><ArrowUpRight /></span>
            </div>
            <p className="store-card-description">{product.description}</p>
            {product.price !== undefined && <strong>{equipment ? rupees(product.price) : <>From {rupees(product.price)} <small>· 50 g</small></>}</strong>}
          </Link>
        </article>;
      })}
    </div>
    {products.length > 1 && <div className="pairing-progress" role="progressbar"
      aria-label={equipment ? 'Diffuser carousel position' : 'Fragrance carousel position'}
      aria-valuemin={1} aria-valuemax={products.length} aria-valuenow={position + 1}>
      <span style={{ width: `${(position + 1) / products.length * 100}%` }} />
    </div>}
  </section>;
}
