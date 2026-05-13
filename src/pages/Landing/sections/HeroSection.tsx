import styles from './HeroSection.module.css'

export const HeroSection = () => (
  <section className={styles.hero}>
    <div className={styles.eyebrow}>PLAN SMARTER TRIPS</div>
    <h1 className={styles.title}>
      <span className={styles.titleLine}>
        <span>Plan the <em className={styles.accentSun}>trip.</em></span>
      </span>
      <span className={styles.titleLine}>
        <span>Fix the <em className={styles.accentTeal}>chaos.</em></span>
      </span>
    </h1>
    <p className={styles.lede}>
      Pin places, drop notes, and let Pinnel build the <em>route and schedule</em>.<br />
      Finished trips are sharable — anyone can duplicate yours in one tap.
    </p>
    <div className={styles.actions}>
      <a href="/dashboard" className={styles.btnPrimary}>START PLANNING →</a>
      <a href="#how-it-works" className={styles.btnSecondary}>SEE HOW IT WORKS</a>
      <span className={styles.socialProof}>★ 2,400+ travelers</span>
    </div>
  </section>
)
