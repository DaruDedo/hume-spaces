import Image from 'next/image';
import type { ReactNode } from 'react';
import Link from './PageProgress';

export default function CatalogueCard({ name, href, image, detail, label, price, footer, fragrance = false }: {
  name: string;
  href: string;
  image: string;
  detail: string;
  label?: string;
  price?: ReactNode;
  footer?: ReactNode;
  fragrance?: boolean;
}) {
  return <article className={fragrance ? 'product-card fragrance-product-card' : 'product-card'}>
    <div className="product-image">
      <Image src={image} alt={name} fill sizes="(max-width: 750px) 45vw, 30vw" />
    </div>
    {label && <p className="eyebrow">{label}</p>}
    <h3><Link className="product-card-link" href={href}>{name}</Link></h3>
    {price}
    <div className="spec-line"><span>{detail}</span></div>
    <div className="simple-card-actions">{footer}</div>
  </article>;
}
