import { useNavigate } from 'react-router-dom'
import styles from './ExplorePage.module.css'

export const ExplorePage = () => {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <div className={styles.page}>
        <header className={styles.header}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            ← Back
          </button>
          <div className={styles.logoRow}>
            <svg width="18" height="23" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 0C6.268 0 0 6.268 0 14c0 9.941 14 22 14 22S28 23.941 28 14C28 6.268 21.732 0 14 0z"
                fill="#c8ff57"
              />
              <circle cx="14" cy="14" r="5" fill="#0f0f0f" />
            </svg>
            <span className={styles.logoName}>pinnel</span>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.badge}>COMING SOON</div>
          <h1 className={styles.title}>Explore Trips</h1>
          <p className={styles.desc}>
            Discover trips planned by other travellers — ready to clone in one tap
            and make your own.
          </p>
          <div className={styles.features}>
            <div className={styles.feature}>
              <span className={styles.featureNum}>01</span>
              <span>Browse by city or mood</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureNum}>02</span>
              <span>See full routes before you clone</span>
            </div>
            <div className={styles.feature}>
              <span className={styles.featureNum}>03</span>
              <span>Clone and personalise in seconds</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
