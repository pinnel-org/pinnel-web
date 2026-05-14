import styles from './ProfileSidebar.module.css'
import { User, Trip, TripMood } from '@/types'

const MOOD_LABELS: Record<TripMood, string> = {
  foodie: 'FOOD-FOCUSED',
  budget: 'BUDGET',
  luxury: 'LUXURY',
  architecture: 'ARCHITECTURE',
  'hidden-gems': 'HIDDEN GEMS',
  'slow-travel': 'SLOW TRAVEL',
}

const formatJoined = (dateStr: string): string => {
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
  trips: Trip[]
}

export const ProfileSidebar = ({ user, trips }: ProfileSidebarProps) => {
  const [firstName, lastName] = splitName(user.displayName, user.username ?? user.email)

  const placesCount = trips.reduce((sum, t) => sum + (t.places?.length ?? 0), 0)
  const countriesCount = new Set(trips.map((t) => t.country).filter(Boolean)).size

  const moodTags = Array.from(new Set(trips.flatMap((t) => t.mood ?? []))).slice(0, 4) as TripMood[]

  const uniqueCities = new Set(trips.map((t) => t.city).filter(Boolean)).size
  const notesCount = trips.flatMap((t) => t.places ?? []).filter((p) => p.note).length
  const sharesCount = trips.reduce((sum, t) => sum + (t.cloneCount ?? 0), 0)

  return (
    <aside className={styles.sidebar}>
      <div className={styles.avatar}>{getInitials(user)}</div>

      <div className={styles.nameBlock}>
        <span className={styles.firstName}>{firstName}</span>
        {lastName && <em className={styles.lastName}>{lastName}.</em>}
      </div>

      {user.username && <p className={styles.handle}>@{user.username}</p>}
      {user.bio && <p className={styles.bio}>{user.bio}</p>}

      {moodTags.length > 0 && (
        <div className={styles.tags}>
          {moodTags.map((m) => (
            <span key={m} className={styles.tag}>{MOOD_LABELS[m]}</span>
          ))}
        </div>
      )}

      <div className={styles.divider} />

      <div className={styles.stats}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>PLACES PINNED</span>
          <span className={styles.statNum}>{placesCount}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>TRIPS</span>
          <span className={styles.statNum}>{trips.length}</span>
        </div>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>COUNTRIES</span>
          <span className={styles.statNum}>{countriesCount}</span>
        </div>
      </div>

      <div className={styles.achievements}>
        <p className={styles.achTitle}>ACHIEVEMENTS</p>
        {uniqueCities > 0 && (
          <div className={styles.achRow}>
            <span className={`${styles.achDot} ${styles.star}`}>★</span>
            <span>{uniqueCities} cities · visited</span>
          </div>
        )}
        {placesCount > 0 && (
          <div className={styles.achRow}>
            <span className={`${styles.achDot} ${styles.red}`}>●</span>
            <span>{placesCount} places · pinned</span>
          </div>
        )}
        {notesCount > 0 && (
          <div className={styles.achRow}>
            <span className={`${styles.achDot} ${styles.amber}`}>●</span>
            <span>{notesCount} notes · written</span>
          </div>
        )}
        {sharesCount > 0 && (
          <div className={styles.achRow}>
            <span className={`${styles.achDot} ${styles.share}`}>↑</span>
            <span>{sharesCount} shares · duplicated</span>
          </div>
        )}
      </div>

      <p className={styles.joinedDate}>{formatJoined(user.createdAt)}</p>
    </aside>
  )
}
