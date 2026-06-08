import { useState, useEffect, useRef, useCallback } from 'react'
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
import { Pin, CityDto, TripDetailPin } from '@/types'
import { apiClient } from '@/api/client'
import { pinsApi } from '@/api/pins'
import { tripDetailsApi } from '@/api/tripDetails'
import { tripDetailPinsApi } from '@/api/tripDetailPins'
import styles from './TripPlannerPage.module.css'

type ViewMode = 'map' | 'browse'
type SaveStatus = 'idle' | 'saving' | 'saved'

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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle')

  // "dateStr-cityId" → TripDetail.id
  const detailIdsRef = useRef<Record<string, number>>({})
  // Pin.id → TripDetailPin.id
  const pinEntryIdsRef = useRef<Record<number, number>>({})
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const mapCityId = selectedCityId ?? firstCityId
  const { data: mapCity } = useCity(mapCityId)
  const { data: weather } = useWeather(mapCity?.latitude, mapCity?.longitude)

  const showSaved = useCallback(() => {
    setSaveStatus('saved')
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2000)
  }, [])

  // Load saved trip state from V2 trip-details API; fall back to default init if empty or unavailable
  useEffect(() => {
    if (!trip?.id || dayDates.length > 0) return

    const init = async () => {
      let loadedFromBackend = false

      try {
        const details = await tripDetailsApi.listAll(tripId)

        if (details.length > 0) {
          const allCityIds = [...new Set(details.map(d => d.cityId))]

          const [cities, pinsByCityId, pinEntriesByDetail] = await Promise.all([
            Promise.all(allCityIds.map(cid =>
              apiClient.get<CityDto>(`/cities/${cid}`).then(r => r.data)
            )),
            Promise.all(allCityIds.map(cid =>
              pinsApi.getPinsByCity(cid).then(pins => [cid, pins] as const)
            )),
            Promise.all(details.map(d =>
              tripDetailPinsApi.list(d.id).then(entries => [d.id, entries] as const)
            )),
          ])

          const cityNameMap = Object.fromEntries(cities.map(c => [c.id, c.name]))
          const pinsMap = Object.fromEntries(pinsByCityId) as Record<number, Pin[]>
          const pinEntriesMap = Object.fromEntries(pinEntriesByDetail) as Record<number, TripDetailPin[]>

          const byDate = new Map<string, typeof details>()
          for (const d of [...details].sort((a, b) => a.cityOrder - b.cityOrder)) {
            if (!byDate.has(d.visitDate)) byDate.set(d.visitDate, [])
            byDate.get(d.visitDate)!.push(d)
          }
          const sortedDates = [...byDate.keys()].sort()

          const restored: Record<number, DayCityEntry[]> = {}
          sortedDates.forEach((dateStr, i) => {
            const dayDetails = byDate.get(dateStr) ?? []
            restored[i + 1] = dayDetails.map(d => {
              const entries = (pinEntriesMap[d.id] ?? []).sort((a, b) => a.pinOrder - b.pinOrder)
              return {
                cityId: d.cityId,
                cityName: cityNameMap[d.cityId] ?? String(d.cityId),
                expanded: true,
                addedPins: entries
                  .map(e => (pinsMap[d.cityId] ?? []).find(p => p.id === e.pinId))
                  .filter((p): p is Pin => p != null),
              }
            })
            for (const d of dayDetails) {
              detailIdsRef.current[`${dateStr}-${d.cityId}`] = d.id
            }
            for (const d of dayDetails) {
              for (const e of pinEntriesMap[d.id] ?? []) {
                pinEntryIdsRef.current[e.pinId] = e.id
              }
            }
          })

          setDayDates(sortedDates.map(ds => new Date(ds + 'T00:00:00')))
          setDayCities(restored)
          loadedFromBackend = true
        }
      } catch {
        // Backend #52 (optional date param) not yet merged — fall through to default init
      }

      if (!loadedFromBackend) {
        const count = Math.max(trip.cityIds?.length ?? 1, 1)
        const today = new Date()
        setDayDates(
          Array.from({ length: count }, (_, i) => {
            const d = new Date(today)
            d.setDate(today.getDate() + i)
            return d
          })
        )
      }
    }

    init()
  }, [trip?.id])

  // Auto-populate Day 1 with first city for new/empty trips
  useEffect(() => {
    if (!firstCityId || !mapCity || mapCity.id !== firstCityId) return
    if (Object.keys(detailIdsRef.current).length > 0) return
    setDayCities(prev => {
      if ((prev[1] ?? []).length > 0) return prev
      return { ...prev, 1: [{ cityId: mapCity.id, cityName: mapCity.name, expanded: true, addedPins: [] }] }
    })
  }, [firstCityId, mapCity?.id])

  // Auto-select city when active day changes
  useEffect(() => {
    const cities = dayCities[activeDay] ?? []
    if (cities.length === 0) return
    setSelectedCityId(prev => {
      if (prev != null && cities.some(c => c.cityId === prev)) return prev
      return cities[0].cityId
    })
  }, [activeDay, dayCities])

  const getDateStr = (day: number) =>
    dayDates[day - 1]?.toISOString().split('T')[0]

  // Handles city add/remove and pin remove — diffs old vs new to trigger the right API calls
  const handleCitiesChange = async (newCities: DayCityEntry[]) => {
    const dateStr = getDateStr(activeDay)
    const oldCities = dayCities[activeDay] ?? []

    // City added
    const addedCity = newCities.find(nc => !oldCities.some(oc => oc.cityId === nc.cityId))
    if (addedCity && dateStr) {
      setSaveStatus('saving')
      try {
        const detail = await tripDetailsApi.create(tripId, { visitDate: dateStr, cityId: addedCity.cityId })
        detailIdsRef.current[`${dateStr}-${addedCity.cityId}`] = detail.id
        showSaved()
      } catch {
        setSaveStatus('idle')
      }
    }

    // City removed
    const removedCity = oldCities.find(oc => !newCities.some(nc => nc.cityId === oc.cityId))
    if (removedCity && dateStr) {
      const detailId = detailIdsRef.current[`${dateStr}-${removedCity.cityId}`]
      if (detailId) {
        setSaveStatus('saving')
        try {
          await tripDetailsApi.delete(detailId)
          delete detailIdsRef.current[`${dateStr}-${removedCity.cityId}`]
          showSaved()
        } catch {
          setSaveStatus('idle')
        }
      }
    }

    // Pin removed (per city that exists in both old and new)
    for (const newCity of newCities) {
      const oldCity = oldCities.find(oc => oc.cityId === newCity.cityId)
      if (!oldCity) continue
      const removedPin = oldCity.addedPins.find(op => !newCity.addedPins.some(np => np.id === op.id))
      if (removedPin) {
        const pinEntryId = pinEntryIdsRef.current[removedPin.id]
        if (pinEntryId) {
          setSaveStatus('saving')
          try {
            await tripDetailPinsApi.delete(pinEntryId)
            delete pinEntryIdsRef.current[removedPin.id]
            showSaved()
          } catch {
            setSaveStatus('idle')
          }
        }
      }
    }

    setDayCities(prev => ({ ...prev, [activeDay]: newCities }))
    if (browseCityId != null && !newCities.some(c => c.cityId === browseCityId)) {
      handleBrowseClose()
    }
  }

  const handleAddPin = async (pin: Pin) => {
    if (browseCityId == null) return
    const cityEntry = (dayCities[activeDay] ?? []).find(c => c.cityId === browseCityId)
    if (cityEntry?.addedPins.some(p => p.id === pin.id)) return

    setDayCities(prev => ({
      ...prev,
      [activeDay]: (prev[activeDay] ?? []).map(c =>
        c.cityId === browseCityId ? { ...c, addedPins: [...c.addedPins, pin] } : c
      ),
    }))

    const dateStr = getDateStr(activeDay)
    const detailId = dateStr ? detailIdsRef.current[`${dateStr}-${browseCityId}`] : undefined
    if (detailId) {
      setSaveStatus('saving')
      try {
        const pinEntry = await tripDetailPinsApi.add(detailId, { pinId: pin.id })
        pinEntryIdsRef.current[pin.id] = pinEntry.id
        showSaved()
      } catch {
        setSaveStatus('idle')
      }
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

  const handleDayRemove = async (day: number) => {
    const dateStr = getDateStr(day)
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
    if (dateStr) {
      try { await tripDetailsApi.deleteByDate(tripId, dateStr) } catch { /* continue */ }
    }
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
            onCitiesChange={handleCitiesChange}
            onBrowse={handleBrowse}
            selectedCityId={selectedCityId}
            onSelectCity={(cityId) => {
              setSelectedCityId(cityId)
              setBrowseCityId(undefined)
              setViewingPin(null)
              setView('map')
            }}
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
