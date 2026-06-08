import { useState } from 'react'
import styles from './ProfileSidebar.module.css'
import { User, TripSummary } from '@/types'
import { EditProfileModal } from '@/components/EditProfileModal/EditProfileModal'
import { useAvatar } from '@/hooks/useAvatar'

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

const formatYearShort = (dateStr: string | null): string | null => {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return isNaN(d.getTime()) ? null : `'${String(d.getFullYear()).slice(-2)}`
}

interface ProfileSidebarProps {
  user: User
  trips: TripSummary[]
}

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.757l8.61-8.61ZM12.073 2.48a.25.25 0 0 0-.354 0L10.62 3.579l1.802 1.8 1.099-1.098a.25.25 0 0 0 0-.353L12.073 2.48Zm-1.55 4.001-1.802-1.8L3.44 9.913a.25.25 0 0 0-.065.108l-.647 2.261 2.261-.647a.25.25 0 0 0 .108-.065l5.427-5.09Z"
      fill="currentColor"
    />
  </svg>
)

export const ProfileSidebar = ({ user, trips }: ProfileSidebarProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [firstName, lastName] = splitName(user.displayName, user.username ?? user.email ?? '')
  const { url: avatarUrl } = useAvatar()

  const pinsCount = 0
  const citiesCount = 0

  return (
    <aside className={styles.sidebar}>
      <div className={styles.avatarWrapper}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className={styles.avatarImg} />
          ) : (
            getInitials(user)
          )}
        </div>
        <div className={styles.polaroidCaption}>
          {user.username && <span className={styles.captionName}>@{user.username}</span>}
          {formatYearShort(user.createdAt) && (
            <span className={styles.captionYear}>{formatYearShort(user.createdAt)}</span>
          )}
        </div>
      </div>

      <div className={styles.nameRow}>
        <div className={styles.nameBlock}>
          <span className={styles.firstName}>{firstName}</span>
          {lastName && <em className={styles.lastName}>{lastName}.</em>}
        </div>
      </div>

      {user.bio && <p className={styles.bio}>{user.bio}</p>}

      <button
        className={styles.editProfileBtn}
        onClick={() => setIsEditOpen(true)}
        aria-label="Edit profile"
      >
        <PencilIcon />
        <span>Edit profile</span>
      </button>

      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        currentUsername={user.username}
        currentDisplayName={user.displayName}
        currentBio={user.bio}
      />

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
