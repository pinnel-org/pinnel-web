import styles from './ProfilePage.module.css'
import { useCurrentUser, useMyTrips } from '@/hooks/useUser'
import { ProfileNav } from './ProfileNav'
import { ProfileSidebar } from './ProfileSidebar'
import { ProfileTripsSection } from './ProfileTripsSection'

export const ProfilePage = () => {
  const { data: user, isLoading } = useCurrentUser()
  const { data: tripsData } = useMyTrips()
  const trips = Array.isArray(tripsData) ? tripsData : []

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const pinsCount = trips.reduce((sum, t) => sum + (t.pinIds?.length ?? 0), 0)
  const citiesCount = new Set(trips.flatMap((t) => t.cityIds ?? [])).size

  return (
    <div className={styles.wrapper}>
      <ProfileNav />
      <div className={styles.layout}>
        <ProfileSidebar user={user} trips={trips} />
        <main className={styles.main}>
          <div className={styles.mapWidget}>
            <div className={styles.mapStatsBadge}>
              {pinsCount} PINS · {citiesCount} CITIES
            </div>
            <div className={styles.mapCanvas}>
              <div className={styles.mapDots}>
                {Array.from({ length: Math.min(citiesCount, 12) }).map((_, i) => (
                  <span key={i} className={styles.mapDot} style={{
                    left: `${15 + (i * 67) % 72}%`,
                    top: `${20 + (i * 43) % 55}%`,
                  }} />
                ))}
              </div>
            </div>
          </div>
          <ProfileTripsSection trips={trips} />
        </main>
      </div>
    </div>
  )
}
