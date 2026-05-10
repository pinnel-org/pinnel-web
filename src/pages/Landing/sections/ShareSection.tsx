import styles from './ShareSection.module.css'

export const ShareSection = () => (
  <section className={styles.section}>
    <div className={styles.inner}>
      <div className={styles.text}>
        <div className={styles.label}>The big one</div>
        <h2 className={styles.h2}>
          Share the <em>whole trip.</em> Let anyone <span className={styles.amb}>duplicate</span> it.
        </h2>
        <p className={styles.body}>
          Finished a weekend in Milan you loved? Make it public. A friend — or a stranger — can clone
          the whole thing in one tap: cards, route, schedule, your notes. Travel plans that actually
          get passed around.
        </p>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <div>
            <div className={styles.cardLabel}>Shared trip</div>
            <div className={styles.cardTitle}>Milan in 48 hours</div>
          </div>
          <div className={styles.cardAuthor}>by<br /><strong>@ana.r</strong></div>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNum}>12</div>
            <div className={styles.statLabel}>Places</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>2</div>
            <div className={styles.statLabel}>Days</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>340</div>
            <div className={styles.statLabel}>Clones</div>
          </div>
        </div>
        <div className={styles.pins}>
          {['Duomo', 'Navigli', 'Brera', 'Luini', '+ 8 more'].map((p) => (
            <span key={p} className={styles.miniPin}>{p}</span>
          ))}
        </div>
        <div className={styles.cta}>
          <div className={styles.miniBtn}>Duplicate</div>
          <div className={`${styles.miniBtn} ${styles.ghost}`}>Preview</div>
        </div>
      </div>
    </div>
  </section>
)
