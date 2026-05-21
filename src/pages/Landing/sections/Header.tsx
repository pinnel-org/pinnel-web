import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Header.module.css'
import { SignInModal } from '@/components/SignInModal/SignInModal'
import { useAuthStore } from '@/store/authStore'
import { useCurrentUser } from '@/hooks/useUser'

const LOGO_URL = 'https://github.com/user-attachments/assets/931c515e-e748-4413-987a-ea5bb1f2343f'

export const Header = () => {
  const navigate = useNavigate()
  const [showSignIn, setShowSignIn] = useState(false)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const syncFromStorage = useAuthStore((s) => s.syncFromStorage)
  const { data: currentUser } = useCurrentUser()

  // When browser restores page from bfcache (back button after SSO redirect),
  // close any open modal and re-sync auth state from localStorage.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setShowSignIn(false)
        syncFromStorage()
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [syncFromStorage])

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
          {isAuthenticated ? (
            <button className={styles.profileBtn} onClick={() => navigate('/profile')} aria-label="Go to profile">
              {currentUser?.photoUrl ? (
                <img
                  src={currentUser.photoUrl}
                  alt="Profile"
                  className={styles.profilePhoto}
                />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
              )}
            </button>
          ) : (
            <button className={styles.navBtn} onClick={() => setShowSignIn(true)}>
              SIGN IN
            </button>
          )}
        </nav>
      </header>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} />}
    </>
  )
}
