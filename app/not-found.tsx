import Link from 'next/link';
import {PageIntro} from '@/components/Shell';
export default function NotFound(){return <><PageIntro eyebrow="404 / PAGE NOT FOUND" title="Page not found" description="This page is not part of the HUME Spaces collection."/><div className="wrap section-bottom"><Link className="button" href="/equipment">Explore equipment →</Link></div></>}
