import {servedCities, servedCityGroups} from '@/lib/brand';
import styles from './HomeServiceAreas.module.css';

export default function HomeServiceAreas() {
  return (
    <section id="service-areas" className="wrap simple-section" aria-labelledby="service-areas-title">
      <div className={styles.panel}>
        <header className={`section-heading ${styles.heading}`}>
          <h2 id="service-areas-title">Serving businesses across India</h2>
          <p>{servedCities.length} cities served</p>
        </header>
        <div className={styles.regions}>
          {servedCityGroups.map(({id, name, cities}) => (
            <section key={id} className={styles.region} aria-labelledby={`service-area-${id}`} data-reveal-card="">
              <h3 id={`service-area-${id}`}>{name}</h3>
              <ul className={styles.locations} role="list" aria-label="Cities served">
                {cities.map((city) => <li key={city}>{city}</li>)}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
