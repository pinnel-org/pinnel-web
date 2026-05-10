import styles from './CtaSection.module.css'

export const CtaSection = () => (
  <section className={styles.cta}>
    <div className={styles.content}>
      <h2 className={styles.h2}>Stop <em>winging it.</em></h2>
      <p>Pinnel is in private beta. If you'd rather show up to a city with a plan than a stack of browser tabs, come try it.</p>
    </div>
    <div className={styles.action}>
      <a href="mailto:hello@pinnel.app" className={styles.btn}>
        Request access<span className={styles.arrow}>→</span>
      </a>
      <div className={styles.sub}>hello@pinnel.app</div>
    </div>
  </section>
)
