import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import { SignInModal } from '@/components/SignInModal/SignInModal'

// Logo image — replace with local asset path once downloaded
const LOGO_URL = 'https://github.com/user-attachments/assets/6544a9c4-1e13-48fd-83fd-da8106bb09ae'

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
          <img
            src={LOGO_URL}
            alt="Pinnel logo"
            className={styles.logoImage}
          />
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
