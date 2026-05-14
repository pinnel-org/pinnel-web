import { useState } from 'react'
import { Trip } from '@/types'
import { ProfileTripCard } from './ProfileTripCard'
import styles from './ProfileTripsSection.module.css'

type TabId = 'all' | 'planned' | 'drafts' | 'past'

interface Props {
  trips: Trip[]
}

export const ProfileTripsSection = ({ trips }: Props) => {
  const [tab, setTab] = useState<TabId>('all')

  const planned = trips.filter((t) => t.isPublic)
  const drafts = trips.filter((t) => !t.isPublic)

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: 'all', label: 'ALL', count: trips.length },
    { id: 'planned', label: 'PLANNED', count: planned.length },
    { id: 'drafts', label: 'DRAFTS', count: drafts.length },
    { id: 'past', label: 'PAST', count: 0 },
  ]

  const filtered: Trip[] =
    tab === 'all' ? trips :
    tab === 'planned' ? planned :
    tab === 'drafts' ? drafts :
    []

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

      {filtered.length === 0 ? (
        <p className={styles.empty}>No trips here yet.</p>
      ) : (
        <div className={styles.grid}>
          {filtered.map((trip, i) => (
            <ProfileTripCard key={trip.id} trip={trip} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
