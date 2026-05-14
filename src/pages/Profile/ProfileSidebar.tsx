import styles from './ProfileSidebar.module.css'
import { User, TripSummary } from '@/types'

const formatJoined = (dateStr: string | null): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return isNaN(d.getTime())
    ? ''
    : `JOINED ${d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}`
}

const getInitials = (user: User): string => {
  if (user.displayName) {
    return user.displayName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  }
  const fallback = user.username ?? user.email
  if (!fallback) return '?'
  return fallback.slice(0, 2).toUpperCase()
}

const splitName = (displayName: string | null, fallback: string): [string, string] => {
  if (!displayName) return [fallback, '']
  const parts = displayName.trim().split(' ')
  return [parts[0], parts.slice(1).join(' ')]
}

interface ProfileSidebarProps {
  user: User
  trips: TripSummary[]
}

export const ProfileSidebar = ({ user, trips }: ProfileSidebarProps) => {
  const [firstName, lastName] = splitName(user.displayName, user.username ?? user.email ?? '')

  const pinsCount = trips.reduce((sum, t) => sum + (t.pinIds?.length ?? 0), 0)
  const citiesCount = new Set(trips.flatMap((t) => t.cityIds ?? [])).size

  return (
    <aside className={styles.sidebar}>
      <div className={styles.avatar}>{getInitials(user)}</div>

      <div className={styles.nameBlock}>
        <span className={styles.firstName}>{firstName}</span>
        {lastName && <em className={styles.lastName}>{lastName}.</em>}
      </div>

      {user.username && <p className={styles.handle}>@{user.username}</p>}
      {user.bio && <p className={styles.bio}>{user.bio}</p>}

      <div className={styles.divider} />

      <div className={styles.stats}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>PLACES PINNED</span>
          <span className={styles.statNum}>{pinsCount}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>TRIPS</span>
          <span className={styles.statNum}>{trips.length}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>CITIES</span>
          <span className={styles.statNum}>{citiesCount}</span>
        </div>
      </div>

      <p className={styles.joinedDate}>{formatJoined(user.createdAt)}</p>
    </aside>
  )
}
