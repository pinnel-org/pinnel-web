import { useState } from 'react'
import { TripSummary } from '@/types'
import { ProfileTripCard } from './ProfileTripCard'
import styles from './ProfileTripsSection.module.css'

type TabId = 'all'

interface Props {
  trips: TripSummary[]
}

export const ProfileTripsSection = ({ trips }: Props) => {
  const [tab] = useState<TabId>('all')

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'all', label: 'ALL', count: trips.length },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          My <em className={styles.em}>trips.</em>
        </h2>
        <div className={styles.tabs}>
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`${styles.tab} ${tab === t.id ? styles.activeTab : ''}`}
            >
              {t.label}
              <span className={styles.tabCount}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {trips.length === 0 ? (
        <p className={styles.empty}>No trips here yet.</p>
      ) : (
        <div className={styles.grid}>
          {trips.map((trip, i) => (
            <ProfileTripCard key={trip.id} trip={trip} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
