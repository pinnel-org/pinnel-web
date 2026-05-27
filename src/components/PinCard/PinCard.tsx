import { MapPin, Plus, Check } from 'lucide-react'
import { Pin } from '@/types'
import styles from './PinCard.module.css'

interface PinCardProps {
  pin: Pin
  isAdded: boolean
  onAdd: (pin: Pin) => void
}

export const PinCard = ({ pin, isAdded, onAdd }: PinCardProps) => (
  <div className={styles.card}>
    <div className={styles.body}>
      <span className={styles.name}>{pin.name}</span>
      {pin.description && (
        <p className={styles.description}>{pin.description}</p>
      )}
    </div>

    <div className={styles.footer}>
      <span className={styles.coords}>
        <MapPin size={11} strokeWidth={1.8} />
        {pin.latitude.toFixed(4)}, {pin.longitude.toFixed(4)}
      </span>

      <button
        className={isAdded ? styles.addedBtn : styles.addBtn}
        onClick={() => !isAdded && onAdd(pin)}
        disabled={isAdded}
        aria-label={isAdded ? 'Added to trip' : `Add ${pin.name} to trip`}
      >
        {isAdded ? (
          <><Check size={12} strokeWidth={2.5} /> ADDED</>
        ) : (
          <><Plus size={12} strokeWidth={2.5} /> ADD</>
        )}
      </button>
    </div>
  </div>
)
