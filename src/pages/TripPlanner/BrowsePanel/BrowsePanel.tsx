import { useMemo } from 'react'
import { LayoutGrid } from 'lucide-react'
import { usePins } from '@/hooks/usePins'
import { PinCard } from '@/components/PinCard/PinCard'
import { Pin } from '@/types'
import styles from './BrowsePanel.module.css'

interface BrowsePanelProps {
  cityId: number
  addedPinIds: number[]
  searchQuery: string
  onAdd: (pin: Pin) => void
}

export const BrowsePanel = ({ cityId, addedPinIds, searchQuery, onAdd }: BrowsePanelProps) => {
  const { data: pins, isLoading, isError } = usePins(cityId)

  const filtered = useMemo(() => {
    if (!pins) return []
    if (!searchQuery.trim()) return pins
    const q = searchQuery.toLowerCase()
    return pins.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    )
  }, [pins, searchQuery])

  if (isLoading) {
    return (
      <div className={styles.panel}>
        <div className={styles.skeletonGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>
          <p className={styles.emptyText}>Could not load places.</p>
        </div>
      </div>
    )
  }

  if (!filtered.length) {
    return (
      <div className={styles.panel}>
        <div className={styles.empty}>
          <LayoutGrid size={28} strokeWidth={1.2} color="#c5b8a8" />
          <p className={styles.emptyText}>
            {searchQuery ? 'No places match your search.' : 'No places found for this city.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.panel}>
      <p className={styles.count}>{filtered.length} PLACES</p>
      <div className={styles.grid}>
        {filtered.map((pin) => (
          <PinCard
            key={pin.id}
            pin={pin}
            isAdded={addedPinIds.includes(pin.id)}
            onAdd={onAdd}
          />
        ))}
      </div>
    </div>
  )
}
