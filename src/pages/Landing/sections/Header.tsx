import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import { SignInModal } from '@/components/SignInModal/SignInModal'

export const Header = () => {
  const navigate = useNavigate()
  const [showSignIn, setShowSignIn] = useState(false)

  const scrollToHowItWorks = () => {
    const el = document.getElementById('how-it-works')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 0C6.268 0 0 6.268 0 14c0 9.941 14 22 14 22S28 23.941 28 14C28 6.268 21.732 0 14 0z"
                fill="#e8471c"
              />
              <circle cx="14" cy="14" r="5" fill="#f4ede1" />
            </svg>
          </div>
          <div className={styles.logoText}>
            <span className={styles.brand}>pinnel</span>
            <span className={styles.tagline}>PLAN · TRAVEL · SHARE</span>
          </div>
        </div>

        <nav className={styles.nav}>
          <button className={styles.navBtn} onClick={scrollToHowItWorks}>
            HOW IT WORKS
          </button>
          <button className={styles.navBtn} onClick={() => navigate('/explore')}>
            EXPLORE TRIPS
          </button>
          <button className={styles.navBtn} onClick={() => setShowSignIn(true)}>
            SIGN IN
          </button>
        </nav>
      </header>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  )
}
