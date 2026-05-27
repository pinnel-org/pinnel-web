import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapIcon, LayoutGrid } from 'lucide-react'
import { useTrip, useCity, useAddPinToTrip, useRemovePinFromTrip } from '@/hooks/useUser'
import { useWeather } from '@/hooks/useWeather'
import { usePins } from '@/hooks/usePins'
import { WeatherStrip } from '@/components/WeatherStrip/WeatherStrip'
import { BrowsePanel } from './BrowsePanel/BrowsePanel'
import { PlaceCard } from '@/components/PlaceCard/PlaceCard'
import { ProfileNav } from '@/pages/Profile/ProfileNav'
import { Pin } from '@/types'
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
  const { data: cityPins } = usePins(firstCityId)

  const [view, setView] = useState<ViewMode>('map')
  const [contentTab, setContentTab] = useState<ContentTab>('cards')
  const [activeDay, setActiveDay] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [pendingPinIds, setPendingPinIds] = useState<number[]>([])
  const [pendingRemoveIds, setPendingRemoveIds] = useState<number[]>([])
  const addPinToTrip = useAddPinToTrip(tripId)
  const removePinFromTrip = useRemovePinFromTrip(tripId)

  const handleAddPin = (pin: Pin) => {
    if (!trip) return
    setPendingPinIds((prev) => [...prev, pin.id])
    addPinToTrip.mutate(
      { trip, pinId: pin.id },
      { onSuccess: () => setPendingPinIds([]) },
    )
  }

  const handleRemovePin = (pinId: number) => {
    if (!trip) return
    setPendingRemoveIds((prev) => [...prev, pinId])
    removePinFromTrip.mutate(
      { trip, pinId },
      { onSuccess: () => setPendingRemoveIds([]) },
    )
  }

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

  const addedPinIds = [...new Set([...(trip.pinIds ?? []), ...pendingPinIds])].filter(
    (id) => !pendingRemoveIds.includes(id),
  )
  const placeCount = addedPinIds.length

  // Full Pin objects for the sidebar — resolved from the city pins cache
  const sidebarPins = (cityPins ?? []).filter((p) => addedPinIds.includes(p.id))
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
          {sidebarPins.length === 0 ? (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>No places yet.</p>
              <p className={styles.emptyHint}>Browse and add places to your trip.</p>
            </div>
          ) : (
            <div className={styles.placesList}>
              {sidebarPins.map((pin, i) => (
                <PlaceCard
                  key={pin.id}
                  pin={pin}
                  index={i + 1}
                  onRemove={handleRemovePin}
                />
              ))}
            </div>
          )}
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

        {view === 'map' && weather && weather.length > 0 && (
          <WeatherStrip days={weather} />
        )}

        {view === 'map' ? (
          <iframe
            className={styles.mapFrame}
            src={mapSrc}
            title="Map"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : firstCityId ? (
          <BrowsePanel
            cityId={firstCityId}
            addedPinIds={addedPinIds}
            searchQuery={searchQuery}
            onAdd={handleAddPin}
          />
        ) : (
          <div className={styles.browsePlaceholder}>
            <p className={styles.browseText}>No city set for this trip.</p>
          </div>
        )}
      </main>
      </div>
    </div>
  )
}
