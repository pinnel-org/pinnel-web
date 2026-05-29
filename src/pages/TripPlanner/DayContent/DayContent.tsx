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
  onBrowse: (cityId: number) => void
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
      onCitiesChange([...cities, { cityId: city.id, cityName: city.name, expanded: true, addedPinIds: [] }])
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
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.4"/>
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
            </svg>
          </div>
          <p className={styles.emptyTitle}>No cities yet.</p>
          <p className={styles.emptyHint}>Add a city to start planning Day {dayNumber}.</p>
        </div>
      ) : (
        <div className={styles.body}>
          <div ref={listRef} className={styles.list}>
            {cities.map((entry, idx) => (
              <CityRow
                key={entry.cityId}
                entry={entry}
                isDragging={draggingIdx === idx}
                onToggle={() => toggle(entry.cityId)}
                onRemove={() => setConfirmRemove(entry)}
                onBrowse={() => onBrowse(entry.cityId)}
                onDragHandleDown={() => startDrag(idx)}
              />
            ))}
          </div>
        </div>
      )}

      <button className={styles.addCityBtn} onClick={() => setShowSearch(true)}>
        + ADD CITY
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
