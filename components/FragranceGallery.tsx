'use client';

import Image from 'next/image';
import { useGalleryRotation } from './useGalleryRotation';

const collectionImages = [
  { image: '800ml-diffuser-fragrance-manufacturing.png', label: 'HUME Spaces fragrance manufacturing' },
  { image: '800ml-diffuser-fragrance-collection.png', label: 'HUME Spaces fragrance collection' },
];

export default function FragranceGallery({ name, images: productImages }: { name: string; images: { image: string; label: string }[] }) {
  const images = [
    ...productImages.filter(({ image }) => !collectionImages.some(shared => shared.image === image)),
    ...collectionImages,
  ];
  const { active, playing, select } = useGalleryRotation(images.length);
  const current = images[active];
  return <div>
    <div className="fragrance-detail-image">
      <Image src={'/images/spaces/' + current.image} alt={name + ' — ' + current.label.toLowerCase()}
        style={collectionImages.includes(current) ? { objectFit: 'contain' } : undefined}
        fill priority={active === 0} sizes="(max-width: 750px) 90vw, 50vw" />
    </div>
    <p className="fragrance-photo-note" aria-live={playing ? 'off' : 'polite'}>{current.label}</p>
    {images.length > 1 &&
      <div className="fragrance-thumbnails" role="group" aria-label={name + ' images'}>
        {images.map(({ image, label }, index) => <button key={image} type="button"
          aria-label={`View ${label.toLowerCase()} for ${name}`} aria-pressed={active === index} onClick={() => select(index)}>
          <Image src={'/images/spaces/' + image} alt="" fill sizes="80px" />
        </button>)}
      </div>
    }
  </div>;
}
