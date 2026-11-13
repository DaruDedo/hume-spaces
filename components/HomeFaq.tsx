import {brandFaqs} from '@/lib/brand';
import {faqs as productFaqs} from '@/lib/content';
import ArrowUpRight from './ArrowUpRight';
import Link from './PageProgress';
import styles from './HomeFaq.module.css';

const featuredQuestions = [
  'Which machine suits my space?',
  'Which fragrance suits my space?',
  'Are fragrance samples available?',
  'Can HUME Spaces create a private fragrance for my business?',
  'Can I use any fragrance oil?',
  'How do I start a signature scent project?',
];

const faqAnswers = new Map([...productFaqs, ...brandFaqs].map(([question, answer]) => [question, answer] as const));

export default function HomeFaq() {
  return (
    <section id="home-faq" className="wrap simple-section" aria-labelledby="home-faq-title">
      <div className={styles.panel}>
        <div className={`section-heading ${styles.heading}`}>
          <h2 id="home-faq-title">Frequently asked questions</h2>
          <Link href="/faq">View all FAQs <ArrowUpRight /></Link>
        </div>
        <div className={styles.questions}>
          {featuredQuestions.map((question) => (
            <details key={question} name="home-faq" className={styles.question}>
              <summary>{question}<span aria-hidden="true" /></summary>
              <p>{faqAnswers.get(question)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
