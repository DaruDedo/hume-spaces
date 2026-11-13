'use client';

import Image from 'next/image';
import {useEffect, useRef, useState} from 'react';
import Link from '@/components/PageProgress';

const replayThreshold = 0.22;

export default function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) setInView(false);
      else if (entry.intersectionRatio >= replayThreshold) setInView(true);
    }, {threshold: [0, replayThreshold]});
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className="simple-hero wrap"
      ref={heroRef}
      data-hero-offscreen={inView ? undefined : ''}
      data-hero-ready={imageReady ? '' : undefined}
    >
      <div className="simple-hero-copy">
        <p className="eyebrow">HUME SPACES</p>
        <h1>
          <span className="simple-hero-title-line"><span>Make your space</span></span>{' '}
          <span className="simple-hero-title-line"><span>unforgettable.</span></span>
        </h1>
        <p className="lede">Commercial scenting and signature fragrances for hotels, malls, gyms, cafés, restaurants and businesses across India.</p>
        <div className="fresh-actions">
          <Link href="/shop" className="button">Products <span aria-hidden="true">→</span></Link>
          <Link href="/fragrance-oils" className="button outline">Fragrances <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <div className="simple-hero-image">
        <Image
          src="/images/spaces/hume-spaces-hero.png"
          alt="Warm interior with a fragrance vessel"
          fill
          priority
          sizes="(max-width: 750px) 90vw, 50vw"
          onLoad={() => setImageReady(true)}
        />
        <div className="simple-hero-trail" aria-hidden="true"><span /><span /><span /></div>
      </div>
    </section>
  );
}
