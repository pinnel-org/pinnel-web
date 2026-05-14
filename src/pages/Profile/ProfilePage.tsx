import styles from './ProfilePage.module.css'
import { useCurrentUser, useMyTrips } from '@/hooks/useUser'
import { Trip } from '@/types'

const getInitials = (displayName: string | null, username: string): string => {
  if (displayName) {
    return displayName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }
  return username.slice(0, 2).toUpperCase()
}

const formatMemberSince = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

const TripRow = ({ trip }: { trip: Trip }) => (
  <div className={styles.tripRow}>
    <div className={styles.tripName}>{trip.title}</div>
    <div className={styles.tripMeta}>
      <span>{trip.city}, {trip.country}</span>
      <span>{trip.days}d</span>
      {trip.budgetPerDay != null && (
        <span>{trip.budgetPerDay} {trip.currency}/day</span>
      )}
    </div>
  </div>
)

export const ProfilePage = () => {
  const { data: user, isLoading } = useCurrentUser()
  const { data: trips = [] } = useMyTrips()

  if (isLoading) return <div className={styles.loading}>Loading...</div>
  if (!user) return null

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.avatar}>
          {getInitials(user.displayName, user.username)}
        </div>

        <h1 className={styles.displayName}>
          {user.displayName ?? user.username}
        </h1>
        <p className={styles.username}>@{user.username}</p>

        {user.bio && <p className={styles.bio}>{user.bio}</p>}

        <div className={styles.divider} />

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>TRIPS</span>
            <span className={styles.statValue}>{trips.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>MEMBER SINCE</span>
            <span className={styles.statValue}>{formatMemberSince(user.createdAt)}</span>
          </div>
        </div>

        <p className={styles.email}>{user.email}</p>
      </aside>

      <main className={styles.main}>
        <h2 className={styles.sectionTitle}>My trips.</h2>

        {trips.length === 0 ? (
          <p className={styles.empty}>No trips yet.</p>
        ) : (
          <div className={styles.tripList}>
            {trips.map((trip) => (
              <TripRow key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
