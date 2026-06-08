import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useTrip, useCity } from '@/hooks/useUser'
import { useWeather } from '@/hooks/useWeather'
import { WeatherStrip } from '@/components/WeatherStrip/WeatherStrip'
import { BrowsePanel } from './BrowsePanel/BrowsePanel'
import { PinDetail } from './BrowsePanel/PinDetail'
import { ProfileNav } from '@/pages/Profile/ProfileNav'
import { DaySelector } from './DaySelector/DaySelector'
import { DayContent } from './DayContent/DayContent'
import { DayCityEntry } from './types'
import { Pin, CityDto, TripDayDto, TripDayCityDto } from '@/types'
import { apiClient } from '@/api/client'
import { pinsApi } from '@/api/pins'
import { tripsApi } from '@/api/trips'
import styles from './TripPlannerPage.module.css'

type ViewMode = 'map' | 'browse'
type SaveStatus = 'idle' | 'saving' | 'saved'

const buildDaysPayload = (
  dayCities: Record<number, DayCityEntry[]>,
  dayDates: Date[]
): TripDayDto[] =>
  dayDates.map((date, i) => ({
    visitDate: date.toISOString().split('T')[0],
    cities: (dayCities[i + 1] ?? []).map(c => ({
      cityId: c.cityId,
      pinIds: c.addedPins.map(p => p.id),
    })),
  }))

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
  const [isDirty, setIsDirty] = useState(false)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')
  const saveStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mapCityId = selectedCityId ?? firstCityId
  const { data: mapCity } = useCity(mapCityId)
  const { data: weather } = useWeather(mapCity?.latitude, mapCity?.longitude)

  // Restore saved days from backend — runs once when trip loads with saved days
  useEffect(() => {
    if (!trip?.id || !trip.days?.length) return
    if (dayDates.length > 0) return // already initialized

    const restore = async () => {
      const savedDays = trip.days ?? []
      const allCityIds = [...new Set(savedDays.flatMap(d => d.cities.map(c => c.cityId)))]

      const [cities, pinsByCityId] = await Promise.all([
        Promise.all(allCityIds.map(cid =>
          apiClient.get<CityDto>(`/cities/${cid}`).then(r => r.data)
        )),
        Promise.all(allCityIds.map(cid =>
          pinsApi.getPinsByCity(cid).then(pins => [cid, pins] as const)
        )),
      ])

      const cityNameMap = Object.fromEntries(cities.map(c => [c.id, c.name]))
      const pinsMap = Object.fromEntries(pinsByCityId) as Record<number, Pin[]>

      const sortedDays = [...savedDays].sort((a, b) => a.visitDate.localeCompare(b.visitDate))

      setDayDates(sortedDays.map(d => new Date(d.visitDate)))

      const restored: Record<number, DayCityEntry[]> = {}
      sortedDays.forEach((day, i) => {
        restored[i + 1] = day.cities.map((c: TripDayCityDto) => ({
          cityId: c.cityId,
          cityName: cityNameMap[c.cityId] ?? String(c.cityId),
          expanded: true,
          addedPins: c.pinIds
              .map((id: number) => (pinsMap[c.cityId] ?? []).find((p: Pin) => p.id === id))
              .filter((p): p is Pin => p != null),
        }))
      })
      setDayCities(restored)
    }

    restore()
  }, [trip?.id, trip?.days?.length])

  // Default init — only when no saved days exist
  useEffect(() => {
    if (!trip?.id) return
    if (trip.days?.length) return // will be restored above
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

  // Auto-populate Day 1 with first city — only when no saved days
  useEffect(() => {
    if (!firstCityId || !mapCity || mapCity.id !== firstCityId) return
    if (trip?.days?.length) return // already restored
    setDayCities(prev => {
      if ((prev[1] ?? []).length > 0) return prev
      return { ...prev, 1: [{ cityId: mapCity.id, cityName: mapCity.name, expanded: true, addedPins: [] }] }
    })
  }, [firstCityId, mapCity?.id, trip?.days?.length])

  // Auto-select city when active day changes
  useEffect(() => {
    const cities = dayCities[activeDay] ?? []
    if (cities.length === 0) return
    setSelectedCityId(prev => {
      if (prev != null && cities.some(c => c.cityId === prev)) return prev
      return cities[0].cityId
    })
  }, [activeDay, dayCities])

  // Autosave — debounced 1.5s after any user change
  useEffect(() => {
    if (!isDirty || !trip || dayDates.length === 0) return

    const timer = setTimeout(async () => {
      setSaveStatus('saving')
      const derivedPinIds = [...new Set(
        Object.values(dayCities).flat().flatMap(c => c.addedPins.map(p => p.id))
      )]
      try {
        await tripsApi.updateTrip(trip.id, {
          name: trip.name,
          budget: trip.budget ?? undefined,
          cityIds: trip.cityIds,
          pinIds: derivedPinIds,
          days: buildDaysPayload(dayCities, dayDates),
        })
        setIsDirty(false)
        setSaveStatus('saved')
        if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current)
        saveStatusTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
      } catch {
        setSaveStatus('idle')
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [isDirty, dayCities, dayDates])

  const handleAddPin = (pin: Pin) => {
    if (!trip || browseCityId == null) return
    setDayCities(prev => ({
      ...prev,
      [activeDay]: (prev[activeDay] ?? []).map(c =>
        c.cityId === browseCityId && !c.addedPins.some(p => p.id === pin.id)
          ? { ...c, addedPins: [...c.addedPins, pin] }
          : c
      ),
    }))
    setIsDirty(true)
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
    setIsDirty(true)
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
    setIsDirty(true)
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
    setIsDirty(true)
  }

  const handleBrowse = (cityId: number, cityName: string) => {
    setBrowseCityId(cityId)
    setBrowseCityName(cityName)
    setSelectedCityId(cityId)
    setViewingPin(null)
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
              {saveStatus === 'saving' && <span className={styles.saveStatus}>· Saving...</span>}
              {saveStatus === 'saved' && <span className={styles.saveStatusSaved}>· Saved</span>}
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
              onOpenPicker={handleBrowseClose}
            />
          )}

          <DayContent
            dayNumber={activeDay}
            cities={dayCities[activeDay] ?? []}
            onCitiesChange={(cities) => {
              setDayCities(prev => ({ ...prev, [activeDay]: cities }))
              setIsDirty(true)
              if (browseCityId != null && !cities.some(c => c.cityId === browseCityId)) {
                handleBrowseClose()
              }
            }}
            onBrowse={handleBrowse}
            selectedCityId={selectedCityId}
            onSelectCity={(cityId) => { setSelectedCityId(cityId); setBrowseCityId(undefined); setViewingPin(null); setView('map') }}
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
