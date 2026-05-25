import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapIcon, LayoutGrid } from 'lucide-react'
import { useTrip, useCity } from '@/hooks/useUser'
import { useWeather } from '@/hooks/useWeather'
import { WeatherStrip } from '@/components/WeatherStrip/WeatherStrip'
import { ProfileNav } from '@/pages/Profile/ProfileNav'
import styles from './TripPlannerPage.module.css'

type ViewMode = 'map' | 'browse'
type ContentTab = 'cards' | 'schedule' | 'route'

export const TripPlannerPage = () => {
  const { id } = useParams<{ id: string }>()
  const tripId = Number(id)

  const { data: trip, isLoading: tripLoading } = useTrip(tripId)
  const firstCityId = trip?.cityIds?.[0]
  const { data: city } = useCity(firstCityId)
  const { data: weather } = useWeather(city?.latitude, city?.longitude)

  const [view, setView] = useState<ViewMode>('map')
  const [contentTab, setContentTab] = useState<ContentTab>('cards')
  const [activeDay, setActiveDay] = useState(1)
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

  const placeCount = trip.pinIds?.length ?? 0
  const dayCount = Math.max(trip.cityIds?.length ?? 1, 1)

  const mapSrc = city
    ? `https://maps.google.com/maps?ll=${city.latitude},${city.longitude}&output=embed&hl=en&z=13`
    : 'https://maps.google.com/maps?ll=48.8,10.0&output=embed&hl=en&z=5'

  return (
    <div className={styles.wrapper}>
      <ProfileNav homePath="/profile" />
      <div className={styles.body}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <h1 className={styles.tripName}>{trip.name}</h1>
          <p className={styles.tripMeta}>
            {dayCount} DAY{dayCount !== 1 ? 'S' : ''} · {placeCount} PLACE{placeCount !== 1 ? 'S' : ''}
            {trip.budget != null ? ` · EST €${trip.budget}` : ''}
          </p>
        </div>

        {weather && weather.length > 0 && (
          <WeatherStrip days={weather} />
        )}

        <div className={styles.contentTabs}>
          {(['cards', 'schedule', 'route'] as ContentTab[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.contentTab} ${contentTab === tab ? styles.contentTabActive : ''}`}
              onClick={() => setContentTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className={styles.dayTabs}>
          {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
            <button
              key={day}
              className={`${styles.dayTab} ${activeDay === day ? styles.dayTabActive : ''}`}
              onClick={() => setActiveDay(day)}
            >
              DAY {day}
            </button>
          ))}
        </div>

        <div className={styles.cardsList}>
          <div className={styles.emptyState}>
            <p className={styles.emptyText}>No places yet.</p>
            <p className={styles.emptyHint}>Search and add places to your trip.</p>
          </div>
        </div>
      </aside>

      <main className={styles.panel}>
        <div className={styles.panelTopBar}>
          <div className={styles.toggleGroup}>
            <button
              className={`${styles.toggleBtn} ${view === 'map' ? styles.toggleActive : ''}`}
              onClick={() => setView('map')}
            >
              <MapIcon size={13} strokeWidth={1.8} />
              MAP
            </button>
            <button
              className={`${styles.toggleBtn} ${view === 'browse' ? styles.toggleActive : ''}`}
              onClick={() => setView('browse')}
            >
              <LayoutGrid size={13} strokeWidth={1.8} />
              BROWSE
            </button>
          </div>

          {view === 'browse' && <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Find food, museums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>}
        </div>

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
            <p className={styles.browseText}>Browse mode — coming soon.</p>
          </div>
        )}
      </main>
      </div>
    </div>
  )
}
