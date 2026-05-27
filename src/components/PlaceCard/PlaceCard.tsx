import { X } from 'lucide-react'
import { Pin } from '@/types'
import styles from './PlaceCard.module.css'

interface PlaceCardProps {
  pin: Pin
  index: number
  onRemove: (pinId: number) => void
}

export const PlaceCard = ({ pin, index, onRemove }: PlaceCardProps) => (
  <div className={styles.card}>
    <div className={styles.index}>{index}</div>

    <div className={styles.body}>
      <span className={styles.name}>{pin.name}</span>
      {pin.description && (
        <p className={styles.description}>{pin.description}</p>
      )}
    </div>

    <button
      className={styles.removeBtn}
      onClick={() => onRemove(pin.id)}
      aria-label={`Remove ${pin.name}`}
    >
      <X size={12} strokeWidth={2} />
    </button>
  </div>
)
