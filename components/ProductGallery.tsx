'use client';
import {useState} from 'react';
import Image from 'next/image';
export default function ProductGallery({name,images}:{name:string;images:string[]}){const [active,setActive]=useState(0);return <div className="product-gallery"><div className="detail-image"><Image src={`/images/spaces/${images[active]}`} alt={`${name}${active?' — close-up':''}`} fill priority unoptimized={images[active].startsWith("800ml-")} sizes="(max-width: 750px) 95vw, 45vw"/></div>{images.length>1&&<div className="product-thumbnails" role="group" aria-label={`${name} photos`}>{images.map((src,n)=><button key={src} type="button" aria-label={`View ${n===0?'main photo':'close-up'} of ${name}`} aria-pressed={active===n} onClick={()=>setActive(n)}><Image src={`/images/spaces/${src}`} alt="" fill unoptimized={src.startsWith("800ml-")} sizes="72px"/></button>)}<p aria-live="polite">{active+1} / {images.length}</p></div>}</div>}

