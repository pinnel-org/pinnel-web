import styles from './HeroSection.module.css'

export const HeroSection = () => (
  <section className={styles.hero}>
    <div className={styles.brandmark}>PINNEL — PLAN · ROUTE · SHARE</div>
    <div className={styles.left}>
      <div className={styles.eyebrow}>A trip planner worth keeping</div>
      <h1 className={styles.title}>
        <span className={styles.titleLine}>
          <span>Plan the <em className={styles.accentSun}>trip.</em></span>
        </span>
        <span className={styles.titleLine}>
          <span>Fix the <em className={styles.accentTeal}>chaos.</em></span>
        </span>
        <span className={styles.titleLine}>
          <span>Share the whole thing.</span>
        </span>
      </h1>
    </div>
    <div className={styles.right}>
      <p className={styles.lede}>
        Pinnel turns a blank map into a <em>finished trip</em> — pin the places,
        drop notes on each one, and let Pinnel sort the route and schedule.
        When it's done, share it. Anyone can duplicate it in one tap.
      </p>
      <div className={styles.coords}>
        Today's demo · Milan, IT<br />
        45.4642° N &nbsp;/&nbsp; 9.1900° E
      </div>
    </div>
  </section>
)
