import styles from './CityRow.module.css'
import { DayCityEntry } from '../types'

const DragHandleIcon = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor">
    <circle cx="2" cy="2" r="1.2"/><circle cx="6" cy="2" r="1.2"/>
    <circle cx="2" cy="6" r="1.2"/><circle cx="6" cy="6" r="1.2"/>
    <circle cx="2" cy="10" r="1.2"/><circle cx="6" cy="10" r="1.2"/>
  </svg>
)

interface CityRowProps {
  entry: DayCityEntry
  isDragging: boolean
  onToggle: () => void
  onRemove: () => void
  onBrowse: () => void
  onDragHandleDown: (e: React.MouseEvent) => void
}

export const CityRow = ({ entry, isDragging, onToggle, onRemove, onBrowse, onDragHandleDown }: CityRowProps) => {
  const count = entry.addedPinIds.length

  return (
    <div className={`${styles.row} ${isDragging ? styles.dragging : ''}`}>
      <div className={styles.header} onClick={onToggle}>
        <span
          className={styles.dragHandle}
          onMouseDown={onDragHandleDown}
          onClick={(e) => e.stopPropagation()}
        >
          <DragHandleIcon />
        </span>

        <span className={`${styles.chevron} ${entry.expanded ? styles.chevronOpen : ''}`}>›</span>

        <span className={styles.cityName}>{entry.cityName}</span>

        <span className={styles.places}>· {count} PLACE{count !== 1 ? 'S' : ''}</span>

        <button
          className={styles.removeBtn}
          onClick={(e) => { e.stopPropagation(); onRemove() }}
        >×</button>
      </div>

      {entry.expanded && (
        <div className={styles.content}>
          <div className={styles.noPins}>
            <span className={styles.noPinsText}>No places yet.</span>
            <button className={styles.browseBtn} onClick={(e) => { e.stopPropagation(); onBrowse() }}>
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              BROWSE
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
