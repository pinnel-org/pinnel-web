import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { MapIcon, LayoutGrid } from 'lucide-react'
import { useTrip, useCity, useAddPinToTrip, useRemovePinFromTrip } from '@/hooks/useUser'
import { useWeather } from '@/hooks/useWeather'
import { WeatherStrip } from '@/components/WeatherStrip/WeatherStrip'
import { BrowsePanel } from './BrowsePanel/BrowsePanel'
import { ProfileNav } from '@/pages/Profile/ProfileNav'
import { DaySelector } from './DaySelector/DaySelector'
import { DayContent } from './DayContent/DayContent'
import { DayCityEntry } from './types'
import { Pin } from '@/types'
import styles from './TripPlannerPage.module.css'

type ViewMode = 'map' | 'browse'

export const TripPlannerPage = () => {
  const { id } = useParams<{ id: string }>()
  const tripId = Number(id)

  const { data: trip, isLoading: tripLoading } = useTrip(tripId)
  const firstCityId = trip?.cityIds?.[0]
  const { data: city } = useCity(firstCityId)
  const { data: weather } = useWeather(city?.latitude, city?.longitude)

  const [view, setView] = useState<ViewMode>('map')
  const [activeDay, setActiveDay] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [pendingPinIds, setPendingPinIds] = useState<number[]>([])
  const [pendingRemoveIds, setPendingRemoveIds] = useState<number[]>([])
  const [dayDates, setDayDates] = useState<Date[]>([])
  const [dayCities, setDayCities] = useState<Record<number, DayCityEntry[]>>({})
  const [browseCityId, setBrowseCityId] = useState<number | undefined>()

  const addPinToTrip = useAddPinToTrip(tripId)
  const removePinFromTrip = useRemovePinFromTrip(tripId)

  useEffect(() => {
    if (!trip?.id) return
    const count = Math.max(trip.cityIds?.length ?? 1, 1)
    const today = new Date()
    setDayDates(prev => {
      if (prev.length > 0) return prev
      return Array.from({ length: count }, (_, i) => {
        const d = new Date(today)
        d.setDate(today.getDate() + i)
        return d
      })
    })
  }, [trip?.id, trip?.cityIds?.length])

  const handleAddPin = (pin: Pin) => {
    if (!trip) return
    setPendingPinIds((prev) => [...prev, pin.id])
    addPinToTrip.mutate({ trip, pinId: pin.id }, { onSuccess: () => setPendingPinIds([]) })
    if (browseCityId != null) {
      setDayCities(prev => ({
        ...prev,
        [activeDay]: (prev[activeDay] ?? []).map(c =>
          c.cityId === browseCityId && !c.addedPinIds.includes(pin.id)
            ? { ...c, addedPinIds: [...c.addedPinIds, pin.id] }
            : c
        ),
      }))
    }
  }

  const handleRemovePin = (pinId: number) => {
    if (!trip) return
    setPendingRemoveIds((prev) => [...prev, pinId])
    removePinFromTrip.mutate({ trip, pinId }, { onSuccess: () => setPendingRemoveIds([]) })
    setDayCities(prev => {
      const next: Record<number, DayCityEntry[]> = {}
      for (const [day, cities] of Object.entries(prev)) {
        next[Number(day)] = cities.map(c => ({
          ...c,
          addedPinIds: c.addedPinIds.filter(pid => pid !== pinId),
        }))
      }
      return next
    })
  }

  const handleDayAdd = (date: Date) => {
    const sorted = [...dayDates, date].sort((a, b) => a.getTime() - b.getTime())
    const newDayNum = sorted.findIndex(d => d.getTime() === date.getTime()) + 1
    setDayDates(sorted)
    setDayCities(prev => {
      const next: Record<number, DayCityEntry[]> = {}
      for (let d = 1; d <= dayDates.length; d++) {
        next[d < newDayNum ? d : d + 1] = prev[d] ?? []
      }
      next[newDayNum] = []
      return next
    })
    setActiveDay(newDayNum)
  }

  const handleDayRemove = (day: number) => {
    const newCount = dayDates.length - 1
    setDayDates(prev => prev.filter((_, i) => i !== day - 1))
    setDayCities(prev => {
      const next: Record<number, DayCityEntry[]> = {}
      for (let d = 1; d <= dayDates.length; d++) {
        if (d === day) continue
        next[d < day ? d : d - 1] = prev[d] ?? []
      }
      return next
    })
    setActiveDay(prev => {
      if (prev === day) return Math.max(1, Math.min(day, newCount))
      return prev > day ? prev - 1 : prev
    })
  }

  const handleDayEdit = (day: number, date: Date) => {
    const updated = dayDates.map((d, i) => (i === day - 1 ? date : d))
    const sorted = [...updated].sort((a, b) => a.getTime() - b.getTime())
    const newDayNum = sorted.findIndex(d => d.getTime() === date.getTime()) + 1
    setDayDates(sorted)
    setDayCities(prev => {
      const next: Record<number, DayCityEntry[]> = {}
      for (let d = 1; d <= dayDates.length; d++) {
        const ni = sorted.findIndex(s => s.getTime() === updated[d - 1].getTime()) + 1
        next[ni] = prev[d] ?? []
      }
      return next
    })
    setActiveDay(newDayNum)
  }

  const handleBrowse = (cityId: number) => {
    setBrowseCityId(cityId)
    setView('browse')
  }

  if (tripLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingDot} />
      </div>
    )
  }

  if (!trip) return <div className={styles.loading}>Trip not found.</div>

  const addedPinIds = [...new Set([...(trip.pinIds ?? []), ...pendingPinIds])].filter(
    (id) => !pendingRemoveIds.includes(id),
  )
  const placeCount = addedPinIds.length
  const dayCount = dayDates.length || Math.max(trip.cityIds?.length ?? 1, 1)
  const activeBrowseCityId = browseCityId ?? firstCityId

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

          {dayDates.length > 0 && (
            <DaySelector
              days={dayDates}
              activeDay={activeDay}
              onDaySelect={setActiveDay}
              onDayAdd={handleDayAdd}
              onDayRemove={handleDayRemove}
              onDayEdit={handleDayEdit}
            />
          )}

          <DayContent
            dayNumber={activeDay}
            cities={dayCities[activeDay] ?? []}
            onCitiesChange={(cities) => setDayCities(prev => ({ ...prev, [activeDay]: cities }))}
            onBrowse={handleBrowse}
          />
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

            {view === 'browse' && (
              <div className={styles.searchWrap}>
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
              </div>
            )}
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
          ) : activeBrowseCityId ? (
            <BrowsePanel
              cityId={activeBrowseCityId}
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
