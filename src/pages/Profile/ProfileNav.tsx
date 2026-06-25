import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './ProfileNav.module.css'
import { useCurrentUser } from '@/hooks/useUser'
import { useAuthStore } from '@/store/authStore'
import { ComingSoonModal } from '@/components/ComingSoonModal/ComingSoonModal'
import { PlanTripModal } from '@/components/PlanTripModal/PlanTripModal'

const LOGO_URL = 'https://github.com/user-attachments/assets/931c515e-e748-4413-987a-ea5bb1f2343f'

interface ProfileNavProps {
  homePath?: string
}

export const ProfileNav = ({ homePath = '/' }: ProfileNavProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  const logout = useAuthStore((s) => s.logout)
  const [comingSoonFeature, setComingSoonFeature] = useState<string | null>(null)
  const [planModalOpen, setPlanModalOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <header className={styles.nav}>
        <div className={styles.logo} onClick={() => navigate(homePath)}>
          <img src={LOGO_URL} alt="Pinnel" className={styles.logoImg} />
          <div className={styles.logoText}>
            <span className={styles.brand}>pinnel</span>
            <span className={styles.tagline}>PLAN · TRAVEL · SHARE</span>
          </div>
        </div>

        <nav className={styles.links}>
          <button
            className={`${styles.link} ${isActive(homePath) ? styles.active : ''}`}
            onClick={() => navigate(homePath)}
          >
            HOME
          </button>
          <button
            className={`${styles.link} ${isActive('/explore') ? styles.active : ''}`}
            onClick={() => setComingSoonFeature('Explore')}
          >
            EXPLORE
          </button>
          <button
            className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}
            onClick={() => setComingSoonFeature('My Trips')}
          >
            MY TRIPS
          </button>
        </nav>

        <div className={styles.right}>
          <button className={styles.iconBtn} aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button className={styles.iconBtn} aria-label="Notifications">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2a4 4 0 0 0-4 4v3l-1 1v1h10v-1l-1-1V6a4 4 0 0 0-4-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M6.5 13a1.5 1.5 0 0 0 3 0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button className={styles.planBtn} onClick={() => setPlanModalOpen(true)}>
            + PLAN A TRIP
          </button>
          {user && (
            <button className={styles.logoutBtn} onClick={logout}>
              LOG OUT
            </button>
          )}
          <button
            className={`${styles.iconBtn} ${styles.burgerBtn}`}
            aria-label="Menu"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <>
            <div className={styles.mobileMenuBackdrop} onClick={() => setMenuOpen(false)} />
            <nav className={styles.mobileMenu}>
              <button
                className={styles.mobileMenuItem}
                onClick={() => { setPlanModalOpen(true); setMenuOpen(false) }}
              >
                + PLAN A TRIP
              </button>
              {user && (
                <button
                  className={`${styles.mobileMenuItem} ${styles.mobileMenuItemDanger}`}
                  onClick={() => { logout(); setMenuOpen(false) }}
                >
                  LOG OUT
                </button>
              )}
            </nav>
          </>
        )}
      </header>

      {comingSoonFeature && (
        <ComingSoonModal
          featureName={comingSoonFeature}
          onClose={() => setComingSoonFeature(null)}
        />
      )}

      <PlanTripModal isOpen={planModalOpen} onClose={() => setPlanModalOpen(false)} />
    </>
  )
}
