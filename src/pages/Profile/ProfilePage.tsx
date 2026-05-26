import styles from './ProfilePage.module.css'
import { useCurrentUser, useMyTrips } from '@/hooks/useUser'
import { useVisitedCountries } from '@/hooks/useVisitedCountries'
import { ProfileNav } from './ProfileNav'
import { ProfileSidebar } from './ProfileSidebar'
import { ProfileTripsSection } from './ProfileTripsSection'
import { WorldMap } from '@/components/WorldMap/WorldMap'

export const ProfilePage = () => {
  const { data: user, isLoading } = useCurrentUser()
  const { data: tripsData } = useMyTrips()
  const { data: visited, isLoading: isVisitedLoading } = useVisitedCountries()
  const trips = Array.isArray(tripsData) ? tripsData : []

  if (isLoading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.loading}>Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className={styles.wrapper}>
      <ProfileNav />
      <div className={styles.layout}>
        <ProfileSidebar user={user} trips={trips} />
        <main className={styles.main}>
          <div className={styles.mapWidget}>
            <WorldMap visited={visited ?? []} isLoading={isVisitedLoading} />
          </div>
          <ProfileTripsSection trips={trips} />
        </main>
      </div>
    </div>
  )
}
