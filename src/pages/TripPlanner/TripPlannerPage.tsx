import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTrip, useCity, useAddPinToTrip } from '@/hooks/useUser'
import { useWeather } from '@/hooks/useWeather'
import { WeatherStrip } from '@/components/WeatherStrip/WeatherStrip'
import { BrowsePanel } from './BrowsePanel/BrowsePanel'
import { PinDetail } from './BrowsePanel/PinDetail'
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

  const [view, setView] = useState<ViewMode>('map')
  const [activeDay, setActiveDay] = useState(1)
  const [dayDates, setDayDates] = useState<Date[]>([])
  const [dayCities, setDayCities] = useState<Record<number, DayCityEntry[]>>({})
  const [browseCityId, setBrowseCityId] = useState<number | undefined>()
  const [browseCityName, setBrowseCityName] = useState('')
  const [viewingPin, setViewingPin] = useState<Pin | null>(null)
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>()

  const mapCityId = selectedCityId ?? firstCityId
  const { data: mapCity } = useCity(mapCityId)
  const { data: weather } = useWeather(mapCity?.latitude, mapCity?.longitude)

  const addPinToTrip = useAddPinToTrip(tripId)

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

  useEffect(() => {
    if (!firstCityId || !mapCity || mapCity.id !== firstCityId) return
    setDayCities(prev => {
      if ((prev[1] ?? []).length > 0) return prev
      return { ...prev, 1: [{ cityId: mapCity.id, cityName: mapCity.name, expanded: true, addedPins: [] }] }
    })
  }, [firstCityId, mapCity?.id])

  useEffect(() => {
    const cities = dayCities[activeDay] ?? []
    if (cities.length === 0) return
    setSelectedCityId(prev => {
      if (prev != null && cities.some(c => c.cityId === prev)) return prev
      return cities[0].cityId
    })
  }, [activeDay, dayCities])

  const handleAddPin = (pin: Pin) => {
    if (!trip) return
    addPinToTrip.mutate({ trip, pinId: pin.id })
    if (browseCityId != null) {
      setDayCities(prev => ({
        ...prev,
        [activeDay]: (prev[activeDay] ?? []).map(c =>
          c.cityId === browseCityId && !c.addedPins.some(p => p.id === pin.id)
            ? { ...c, addedPins: [...c.addedPins, pin] }
            : c
        ),
      }))
    }
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

  const handleBrowse = (cityId: number, cityName: string) => {
    setBrowseCityId(cityId)
    setBrowseCityName(cityName)
    setView('browse')
  }

  const handleBrowseClose = () => {
    setBrowseCityId(undefined)
    setViewingPin(null)
    setView('map')
  }

  if (tripLoading) {
    return (
      <div className={styles.loading}>
        <span className={styles.loadingDot} />
      </div>
    )
  }

  if (!trip) return <div className={styles.loading}>Trip not found.</div>

  const placeCount = new Set(
    Object.values(dayCities).flat().flatMap(c => c.addedPins.map(p => p.id))
  ).size
  const dayCount = dayDates.length || Math.max(trip.cityIds?.length ?? 1, 1)
  const activeBrowseCityId = browseCityId ?? firstCityId

  const browseCityAddedPinIds = browseCityId != null
    ? ((dayCities[activeDay] ?? []).find(c => c.cityId === browseCityId)?.addedPins ?? []).map(p => p.id)
    : []

  const mapSrc = mapCity
    ? `https://maps.google.com/maps?ll=${mapCity.latitude},${mapCity.longitude}&output=embed&hl=en&z=13`
    : 'https://maps.google.com/maps?ll=48.8,10.0&output=embed&hl=en&z=5'

  return (
    <div className={styles.wrapper}>
      <ProfileNav homePath="/profile" />
      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.breadcrumb}>
              <span>My Trips</span>
              <span className={styles.breadcrumbSep}>/</span>
              <span className={styles.breadcrumbHere}>{trip.name}</span>
            </div>
            <h1 className={styles.tripName}>
              {(() => {
                const words = trip.name.split(' ')
                const last = words[words.length - 1]
                const rest = words.slice(0, -1).join(' ')
                return <>{rest}{rest ? ' ' : ''}<em className={styles.tripNameAccent}>{last}.</em></>
              })()}
            </h1>
            <p className={styles.tripMeta}>
              {dayCount} DAY{dayCount !== 1 ? 'S' : ''} · {placeCount} PLACE{placeCount !== 1 ? 'S' : ''}
              {trip.budget != null ? ` · €${trip.budget}` : ''}
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
            selectedCityId={selectedCityId}
            onSelectCity={setSelectedCityId}
          />
        </aside>

        <main className={styles.panel}>
          {weather && weather.length > 0 && (
            <WeatherStrip days={weather} />
          )}

          <iframe
            className={styles.mapFrame}
            src={mapSrc}
            title="Map"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />

          {view === 'browse' && activeBrowseCityId && (
            <BrowsePanel
              cityId={activeBrowseCityId}
              cityName={browseCityName}
              addedPinIds={browseCityAddedPinIds}
              onAdd={handleAddPin}
              onClose={handleBrowseClose}
              onViewPin={setViewingPin}
            />
          )}

          {viewingPin && (
            <PinDetail
              pin={viewingPin}
              cityName={browseCityName}
              isAdded={browseCityAddedPinIds.includes(viewingPin.id)}
              onAdd={handleAddPin}
              onClose={() => setViewingPin(null)}
            />
          )}
        </main>
      </div>
    </div>
  )
}
