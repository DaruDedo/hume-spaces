import styles from './StorefrontSkeleton.module.css';

export default function StorefrontSkeleton({ product = false }: { product?: boolean }) {
  return <div className={`wrap ${styles.loading}`} role="status" aria-label="Loading page">
    <div className={`${styles.preview} ${product ? styles.product : ''}`} aria-hidden="true">
      <div className={`${styles.block} ${styles.image}`} />
      <div className={styles.copy}>
        <div className={`${styles.block} ${styles.label}`} />
        <div className={`${styles.block} ${styles.title}`} />
        <div className={`${styles.block} ${styles.line}`} />
        <div className={`${styles.block} ${styles.shortLine}`} />
        {product && <div className={styles.actions}>
          <div className={styles.block} />
          <div className={styles.block} />
        </div>}
      </div>
    </div>
  </div>;
}
