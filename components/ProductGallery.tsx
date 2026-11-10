'use client';

import Image from 'next/image';
import { useGalleryRotation } from './useGalleryRotation';

export default function ProductGallery({ name, images }: { name: string; images: string[] }) {
  const { active, select } = useGalleryRotation(images.length);
  const current = images[active];
  return <div className="product-gallery">
    <div className="detail-image">
      <Image src={`/images/spaces/${current}`} alt={active === 0 ? name : `${name} photo ${active + 1}`}
        fill priority={active === 0} unoptimized={current.startsWith('800ml-')} sizes="(max-width: 750px) 95vw, 45vw" />
    </div>
    {images.length > 1 &&
      <div className="product-thumbnails" role="group" aria-label={`${name} photos`}>
        {images.map((src, index) => <button key={src} type="button" aria-label={`View photo ${index + 1} of ${name}`}
          aria-pressed={active === index} onClick={() => select(index)}>
          <Image src={`/images/spaces/${src}`} alt="" fill unoptimized={src.startsWith('800ml-')} sizes="72px" />
        </button>)}
      </div>
    }
  </div>;
}
