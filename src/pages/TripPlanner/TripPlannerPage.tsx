import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTrip, useCity } from '@/hooks/useUser'
import styles from './TripPlannerPage.module.css'

type ViewMode = 'map' | 'browse'

export const TripPlannerPage = () => {
  const { id } = useParams<{ id: string }>()
  const tripId = Number(id)

  const { data: trip, isLoading: tripLoading } = useTrip(tripId)
  const firstCityId = trip?.cityIds?.[0]
  const { data: city } = useCity(firstCityId)

  const [view, setView] = useState<ViewMode>('map')
  const [searchQuery, setSearchQuery] = useState('')

  if (tripLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingDot} />
      </div>
    )
  }

  if (!trip) {
    return <div className={styles.loading}>Trip not found.</div>
  }

  const mapSrc = city
    ? `https://maps.google.com/maps?q=${encodeURIComponent(`${city.name}, ${city.country}`)}&output=embed&hl=en&z=13`
    : 'https://maps.google.com/maps?q=Europe&output=embed&hl=en&z=5'

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <span className={styles.tripName}>{trip.name}</span>

        <div className={styles.toggleGroup}>
          <button
            className={`${styles.toggleBtn} ${view === 'map' ? styles.toggleActive : ''}`}
            onClick={() => setView('map')}
          >
            MAP
          </button>
          <button
            className={`${styles.toggleBtn} ${view === 'browse' ? styles.toggleActive : ''}`}
            onClick={() => setView('browse')}
          >
            BROWSE
          </button>
        </div>

        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search places..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className={styles.finalizeBtn}>Finalize Trip</button>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.tabBar}>
            <button className={`${styles.sideTab} ${styles.sideTabActive}`}>CARDS</button>
          </div>

          <div className={styles.daySection}>
            <div className={styles.dayLabel}>DAY 1</div>
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No places yet.</p>
              <p className={styles.emptyHint}>Use the search bar to add places.</p>
            </div>
          </div>
        </aside>

        <main className={styles.panel}>
          {view === 'map' ? (
            <iframe
              className={styles.mapFrame}
              src={mapSrc}
              title="Map"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className={styles.browsePlaceholder}>
              <p className={styles.browseText}>Browse mode coming soon.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
