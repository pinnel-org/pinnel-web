import { Pin } from '@/types'
import { DayCityEntry } from '../types'
import { PinList } from './PinList'
import styles from './CityRow.module.css'

const DragHandleIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="13" height="13">
    <circle cx="5" cy="3.5" r="1.4"/><circle cx="11" cy="3.5" r="1.4"/>
    <circle cx="5" cy="8" r="1.4"/><circle cx="11" cy="8" r="1.4"/>
    <circle cx="5" cy="12.5" r="1.4"/><circle cx="11" cy="12.5" r="1.4"/>
  </svg>
)

const ChevronIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
    <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
    <path d="M3 4.5h10M6.5 4V3h3v1M5 4.5l.5 8.5h5l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface CityRowProps {
  entry: DayCityEntry
  isDragging: boolean
  isSelected: boolean
  onToggle: () => void
  onSelect: () => void
  onRemove: () => void
  onBrowse: () => void
  onDragHandleDown: (e: React.MouseEvent) => void
  onPinsChange: (pins: Pin[]) => void
  onPinReorderComplete?: (pinId: number, newOrder: number) => void
  onViewPin?: (pin: Pin) => void
  onFocusPin?: (pin: Pin) => void
}

export const CityRow = ({
  entry,
  isDragging,
  isSelected,
  onToggle,
  onSelect,
  onRemove,
  onBrowse,
  onDragHandleDown,
  onPinsChange,
  onPinReorderComplete,
  onViewPin,
  onFocusPin,
}: CityRowProps) => {
  const count = entry.addedPins.length

  const handlePinRemove = (pinId: number) => {
    onPinsChange(entry.addedPins.filter(p => p.id !== pinId))
  }

  return (
    <div className={`${styles.row} ${isDragging ? styles.dragging : ''} ${isSelected ? styles.selected : ''}`}>
      <div className={styles.header} onClick={onToggle}>
        <span
          className={styles.dragHandle}
          onMouseDown={onDragHandleDown}
          onClick={(e) => e.stopPropagation()}
          title="Drag to reorder"
        >
          <DragHandleIcon />
        </span>

        <span className={`${styles.chevron} ${entry.expanded ? styles.chevronOpen : ''}`}>
          <ChevronIcon />
        </span>

        <span
          className={styles.cityName}
          onClick={(e) => { e.stopPropagation(); onSelect() }}
          title="Show on map"
        >
          {entry.cityName}
        </span>

        <span className={styles.places}>· {count} {count === 1 ? 'place' : 'places'}</span>

        <button
          className={styles.removeBtn}
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          title="Remove city"
        >
          <TrashIcon />
        </button>
      </div>

      {entry.expanded && (
        <div className={styles.content}>
          {count === 0 ? (
            <div className={styles.noPins}>
              <span className={styles.noPinsText}>No places yet.</span>
              <button className={styles.browseBtn} onClick={(e) => { e.stopPropagation(); onBrowse() }}>
                <SearchIcon />
                Browse
              </button>
            </div>
          ) : (
            <>
              <PinList
                pins={entry.addedPins}
                onReorder={onPinsChange}
                onRemove={handlePinRemove}
                onPinReorderComplete={onPinReorderComplete}
                onViewPin={onViewPin}
                onFocusPin={onFocusPin}
              />
              <button className={styles.addMoreBtn} onClick={(e) => { e.stopPropagation(); onBrowse() }}>
                <SearchIcon />
                Add more
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
