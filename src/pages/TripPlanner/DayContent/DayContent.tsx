import { useState, useRef, useCallback } from 'react'
import styles from './DayContent.module.css'
import { CityRow } from './CityRow'
import { CitySearch } from '../CitySearch/CitySearch'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog'
import { DayCityEntry } from '../types'
import { CityDto } from '@/types'

interface DayContentProps {
  dayNumber: number
  cities: DayCityEntry[]
  onCitiesChange: (cities: DayCityEntry[]) => void
  onBrowse: (cityId: number, cityName: string) => void
}

export const DayContent = ({ dayNumber, cities, onCitiesChange, onBrowse }: DayContentProps) => {
  const [showSearch, setShowSearch] = useState(false)
  const [confirmRemove, setConfirmRemove] = useState<DayCityEntry | null>(null)
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const citiesRef = useRef(cities)
  citiesRef.current = cities
  const dragRef = useRef<{ fromIdx: number } | null>(null)

  const handleAdd = (city: CityDto) => {
    if (!cities.find(c => c.cityId === city.id)) {
      onCitiesChange([...cities, { cityId: city.id, cityName: city.name, expanded: true, addedPins: [] }])
    }
    setShowSearch(false)
  }

  const handleConfirmRemove = () => {
    if (!confirmRemove) return
    onCitiesChange(cities.filter(c => c.cityId !== confirmRemove.cityId))
    setConfirmRemove(null)
  }

  const toggle = (cityId: number) =>
    onCitiesChange(cities.map(c => c.cityId === cityId ? { ...c, expanded: !c.expanded } : c))

  const onDocMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current || !listRef.current) return
    const rows = Array.from(listRef.current.children) as HTMLElement[]
    let toIdx = rows.length - 1
    for (let i = 0; i < rows.length; i++) {
      const { top, height } = rows[i].getBoundingClientRect()
      if (e.clientY < top + height / 2) { toIdx = i; break }
    }
    const fromIdx = dragRef.current.fromIdx
    if (toIdx !== fromIdx) {
      const reordered = [...citiesRef.current]
      const [moved] = reordered.splice(fromIdx, 1)
      reordered.splice(toIdx, 0, moved)
      onCitiesChange(reordered)
      dragRef.current.fromIdx = toIdx
      setDraggingIdx(toIdx)
    }
  }, [onCitiesChange])

  const onDocMouseUp = useCallback(() => {
    dragRef.current = null
    setDraggingIdx(null)
    document.removeEventListener('mousemove', onDocMouseMove)
    document.removeEventListener('mouseup', onDocMouseUp)
  }, [onDocMouseMove])

  const startDrag = useCallback((idx: number) => {
    dragRef.current = { fromIdx: idx }
    setDraggingIdx(idx)
    document.addEventListener('mousemove', onDocMouseMove)
    document.addEventListener('mouseup', onDocMouseUp)
  }, [onDocMouseMove, onDocMouseUp])

  return (
    <div className={styles.root}>
      {cities.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg viewBox="0 0 32 32" fill="none" width="28" height="28">
              <path d="M16 4c4.4 0 8 3.4 8 7.6 0 5.6-8 16.4-8 16.4S8 17.2 8 11.6C8 7.4 11.6 4 16 4z" stroke="currentColor" strokeWidth="1.6"/>
              <circle cx="16" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
            </svg>
          </div>
          <p className={styles.emptyTitle}>No cities yet.</p>
          <p className={styles.emptyHint}>Add a city to start planning Day {dayNumber}.</p>
        </div>
      ) : (
        <div ref={listRef} className={styles.list}>
          {cities.map((entry, idx) => (
            <CityRow
              key={entry.cityId}
              entry={entry}
              isDragging={draggingIdx === idx}
              onToggle={() => toggle(entry.cityId)}
              onRemove={() => setConfirmRemove(entry)}
              onBrowse={() => onBrowse(entry.cityId, entry.cityName)}
              onDragHandleDown={() => startDrag(idx)}
              onPinsChange={(pins) => onCitiesChange(
                cities.map(c => c.cityId === entry.cityId ? { ...c, addedPins: pins } : c)
              )}
            />
          ))}
        </div>
      )}

      <button className={styles.addCityBtn} onClick={() => setShowSearch(true)}>
        <svg viewBox="0 0 16 16" fill="none" width="12" height="12"><path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        Add city
      </button>

      {showSearch && <CitySearch onSelect={handleAdd} onClose={() => setShowSearch(false)} />}

      {confirmRemove && (
        <ConfirmDialog
          title={`Remove ${confirmRemove.cityName}?`}
          message="This will also remove all places added for this city."
          confirmLabel="Remove"
          onConfirm={handleConfirmRemove}
          onCancel={() => setConfirmRemove(null)}
        />
      )}
    </div>
  )
}
