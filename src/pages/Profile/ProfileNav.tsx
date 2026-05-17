import { useNavigate, useLocation } from 'react-router-dom'
import styles from './ProfileNav.module.css'
import { useCurrentUser } from '@/hooks/useUser'
import { useAuthStore } from '@/store/authStore'
import { User } from '@/types'

const LOGO_URL = 'https://github.com/user-attachments/assets/931c515e-e748-4413-987a-ea5bb1f2343f'

const getInitials = (user: User): string => {
  if (user.displayName) {
    return user.displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }
  const fallback = user.username ?? user.email
  if (!fallback) return '?'
  return fallback.slice(0, 2).toUpperCase()
}

export const ProfileNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data: user } = useCurrentUser()
  const logout = useAuthStore((s) => s.logout)

  const isActive = (path: string) => location.pathname === path

  return (
    <header className={styles.nav}>
      <div className={styles.logo} onClick={() => navigate('/')}>
        <img src={LOGO_URL} alt="Pinnel" className={styles.logoImg} />
        <div className={styles.logoText}>
          <span className={styles.brand}>pinnel</span>
          <span className={styles.tagline}>PLAN · TRAVEL · SHARE</span>
        </div>
      </div>

      <nav className={styles.links}>
        <button
          className={`${styles.link} ${isActive('/') ? styles.active : ''}`}
          onClick={() => navigate('/')}
        >
          HOME
        </button>
        <button
          className={`${styles.link} ${isActive('/explore') ? styles.active : ''}`}
          onClick={() => navigate('/explore')}
        >
          EXPLORE
        </button>
        <button
          className={`${styles.link} ${isActive('/dashboard') ? styles.active : ''}`}
          onClick={() => navigate('/dashboard')}
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
        <button className={styles.planBtn} onClick={() => navigate('/dashboard')}>
          + PLAN A TRIP
        </button>
        {user && (
          <div className={styles.avatar} onClick={() => navigate('/profile')}>
            {getInitials(user)}
          </div>
        )}
        {user && (
          <button className={styles.logoutBtn} onClick={logout}>
            LOG OUT
          </button>
        )}
      </div>
    </header>
  )
}
