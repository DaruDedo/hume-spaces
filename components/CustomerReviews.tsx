import {publishedReviews} from '@/lib/customer-reviews';
import CustomerReviewForm from './CustomerReviewForm';
import styles from './CustomerReviews.module.css';

export default function CustomerReviews({product}: {product?: {sku: string; name: string}}) {
  const reviews = product
    ? publishedReviews.filter(review => review.productSku === product.sku)
    : publishedReviews.slice(0, 3);

  return (
    <section id="customer-reviews" className={product ? 'simple-section' : 'wrap simple-section'} aria-labelledby="customer-reviews-title">
      <div className={styles.panel}>
        <div className={`section-heading ${styles.heading}`}>
          <h2 id="customer-reviews-title">Customer reviews</h2>
        </div>
        {reviews.length ? (
          <ul className={styles.reviews} role="list">
            {reviews.map(({id, author, rating, comment}) => (
              <li key={id} className={styles.review} data-reveal-card="">
                <span className={styles.rating} role="img" aria-label={`${rating} out of 5 stars`}>
                  {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                </span>
                <blockquote>{comment}</blockquote>
                <p>{author}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p data-reveal-copy="">{product ? `No reviews for ${product.name} yet.` : 'No customer reviews have been published yet.'}</p>
        )}
        <CustomerReviewForm product={product} />
      </div>
    </section>
  );
}
