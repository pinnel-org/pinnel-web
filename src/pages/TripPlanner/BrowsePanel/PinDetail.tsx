import { ImageIcon } from 'lucide-react'
import { Pin } from '@/types'
import { ShortsReel } from '@/components/ShortsReel/ShortsReel'
import styles from './PinDetail.module.css'

interface PinDetailProps {
  pin: Pin
  cityName: string
  isAdded: boolean
  onAdd: (pin: Pin) => void
  onRemove?: (pin: Pin) => void
  onClose: () => void
}

export const PinDetail = ({ pin, cityName, isAdded, onAdd, onRemove, onClose }: PinDetailProps) => {
  return (
    <div className={styles.overlay}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
        <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
          <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <div className={styles.scroll}>
        <div className={styles.imagePlaceholder}>
          {pin.logoUrlBig ? (
            <img src={pin.logoUrlBig} alt={pin.name} className={styles.image} />
          ) : (
            <ImageIcon size={36} strokeWidth={1.1} className={styles.imageIcon} />
          )}
        </div>

        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.cityLabel}>{cityName.toUpperCase()}</span>
          </div>

          <h2 className={styles.name}>{pin.name}</h2>

          <div className={styles.coords}>
            <svg viewBox="0 0 16 16" fill="none" width="12" height="12" className={styles.coordsIcon}>
              <path d="M8 2c2.2 0 4 1.7 4 3.8C12 8.6 8 14 8 14S4 8.6 4 5.8C4 3.7 5.8 2 8 2z" stroke="currentColor" strokeWidth="1.3"/>
              <circle cx="8" cy="6" r="1.25" stroke="currentColor" strokeWidth="1.3"/>
            </svg>
            <span>{pin.latitude.toFixed(4)}°, {pin.longitude.toFixed(4)}°</span>
          </div>

          <div className={styles.actions}>
            {isAdded ? (
              <button className={styles.removeBtn} onClick={() => onRemove?.(pin)}>
                Remove from trip
              </button>
            ) : (
              <button className={styles.addBtn} onClick={() => onAdd(pin)}>
                <svg viewBox="0 0 16 16" fill="none" width="13" height="13">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Add to trip
              </button>
            )}
          </div>

          <div className={styles.lowerRow}>
            <section className={styles.shortsCol}>
              <p className={styles.sectionLabel}>SHORTS</p>
              <ShortsReel pinId={pin.id} />
            </section>

            <section className={styles.infoCol}>
              <p className={styles.sectionLabel}>INFO</p>
              {pin.description ? (
                <p className={styles.description}>{pin.description}</p>
              ) : (
                <p className={styles.descriptionEmpty}>No description yet.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
