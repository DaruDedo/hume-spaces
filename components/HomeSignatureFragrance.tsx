import Image from 'next/image';
import {brandDescription} from '@/lib/brand';
import ArrowUpRight from './ArrowUpRight';
import Link from './PageProgress';
import WhatsAppButton from './WhatsAppButton';
import styles from './HomeSignatureFragrance.module.css';

export default function HomeSignatureFragrance() {
  return (
    <section id="signature-fragrance" className={`wrap simple-section ${styles.section}`} aria-labelledby="signature-fragrance-title">
      <div className={styles.feature}>
        <div className={styles.photo} data-reveal-image="">
          <Image
            src="/images/spaces/fragrances/oud-bergamot-atmosphere-v1.png"
            alt="Oud wood and cut bergamot on a stone ledge"
            fill
            sizes="(max-width: 780px) 94vw, (max-width: 1400px) 46vw, 600px"
          />
        </div>
        <div className={styles.copy}>
          <header className={`section-heading ${styles.heading}`}>
            <h2 id="signature-fragrance-title">A fragrance that belongs to your business</h2>
          </header>
          <div className={styles.description} data-reveal-copy="">
            <p>{brandDescription}</p>
            <p>Our perfumers have created private blends for gyms, hotels and malls. Develop an original signature or work from a fragrance reference to shape your own scent identity.</p>
          </div>
          <div className={styles.actions}>
            <WhatsAppButton className="button" topic="custom fragrance development" label="Create your signature fragrance" />
            <Link href="/about" className={styles.approach}>Discover our approach <ArrowUpRight /></Link>
          </div>
        </div>
      </div>
    </section>
  );
}
