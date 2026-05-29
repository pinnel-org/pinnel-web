import { useMemo, useState } from 'react'
import { usePins } from '@/hooks/usePins'
import { PinCard } from '@/components/PinCard/PinCard'
import { Pin } from '@/types'
import styles from './BrowsePanel.module.css'

interface BrowsePanelProps {
  cityId: number
  cityName: string
  addedPinIds: number[]
  onAdd: (pin: Pin) => void
  onClose: () => void
  onViewPin: (pin: Pin) => void
}

export const BrowsePanel = ({ cityId, cityName, addedPinIds, onAdd, onClose, onViewPin }: BrowsePanelProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: pins, isLoading } = usePins(cityId)

  const filtered = useMemo(() => {
    if (!pins) return []
    if (!searchQuery.trim()) return pins
    const q = searchQuery.toLowerCase()
    return pins.filter(
      p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    )
  }, [pins, searchQuery])

  const addedCount = addedPinIds.length

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <span className={styles.headerLabel}>
            ADD PLACES · <span className={styles.headerCity}>{cityName.toUpperCase()}</span>
          </span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className={styles.searchRow}>
          <div className={styles.searchInner}>
            <svg className={styles.searchIcon} viewBox="0 0 16 16" fill="none" width="14" height="14">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder={`Search places in ${cityName}...`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className={styles.list}>
          {isLoading ? (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeleton} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <p className={styles.empty}>
              {searchQuery ? 'No places match your search.' : 'No places found for this city.'}
            </p>
          ) : (
            <div className={styles.grid}>
              {filtered.map(pin => (
                <PinCard
                  key={pin.id}
                  pin={pin}
                  isAdded={addedPinIds.includes(pin.id)}
                  onAdd={onAdd}
                  onView={onViewPin}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <span className={styles.footerCount}>
            {addedCount} ADDED TO {cityName.toUpperCase()}
          </span>
          <button className={styles.doneBtn} onClick={onClose}>DONE →</button>
        </div>
      </div>
    </div>
  )
}
