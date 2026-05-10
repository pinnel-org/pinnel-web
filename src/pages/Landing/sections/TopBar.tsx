import styles from './TopBar.module.css'

export const TopBar = () => (
  <div className={styles.topbar}>
    <div className={styles.left}>
      <span><span className={styles.dot} />Pinnel / v0.1</span>
      <span>Private Beta</span>
    </div>
    <div>Trip planning · Est. 2026</div>
  </div>
)
