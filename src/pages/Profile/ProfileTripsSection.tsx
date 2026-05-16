import { useState } from 'react'
import { TripSummary } from '@/types'
import { ProfileTripCard } from './ProfileTripCard'
import styles from './ProfileTripsSection.module.css'

type TabId = 'all' | 'planned' | 'drafts' | 'past'

interface TabCounts {
  all: number
  planned: number
  drafts: number
  past: number
}

interface Props {
  trips: TripSummary[]
  counts?: Partial<TabCounts>
}

export const ProfileTripsSection = ({ trips, counts }: Props) => {
  const [tab, setTab] = useState<TabId>('all')

  // TODO: counts for planned/drafts/past will be filled from backend
  const tabCounts: TabCounts = {
    all: counts?.all ?? trips.length,
    planned: counts?.planned ?? 0,
    drafts: counts?.drafts ?? 0,
    past: counts?.past ?? 0,
  }

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'all', label: 'ALL', count: tabCounts.all },
    { id: 'planned', label: 'PLANNED', count: tabCounts.planned },
    { id: 'drafts', label: 'DRAFTS', count: tabCounts.drafts },
    { id: 'past', label: 'PAST', count: tabCounts.past },
  ]

  // TODO: filter trips by status once backend provides status field
  const visibleTrips = tab === 'all' ? trips : []

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
              onClick={() => setTab(t.id)}
            >
              {t.label}
              <span className={styles.tabCount}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {visibleTrips.length === 0 ? (
        <p className={styles.empty}>No trips here yet.</p>
      ) : (
        <div className={styles.grid}>
          {visibleTrips.map((trip, i) => (
            <ProfileTripCard key={trip.id} trip={trip} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
