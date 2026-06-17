import { useState } from 'react'
import { Plus, ImageIcon } from 'lucide-react'
import { Pin } from '@/types'
import styles from './PinCard.module.css'

interface PinCardProps {
  pin: Pin
  isAdded: boolean
  onAdd: (pin: Pin) => void
  onRemove?: (pin: Pin) => void
  onView?: (pin: Pin) => void
}

export const PinCard = ({ pin, isAdded, onAdd, onRemove, onView }: PinCardProps) => {
  const [flying, setFlying] = useState(false)
  const [removing, setRemoving] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isAdded || flying) return
    setFlying(true)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (removing) return
    setRemoving(true)
  }

  const handleAnimationEnd = () => {
    if (flying) {
      setFlying(false)
      onAdd(pin)
    } else if (removing) {
      setRemoving(false)
      onRemove?.(pin)
    }
  }

  return (
    <div
      className={`${styles.card} ${flying ? styles.flying : ''} ${removing ? styles.removing : ''}`}
      onAnimationEnd={(flying || removing) ? handleAnimationEnd : undefined}
      onClick={() => onView?.(pin)}
    >
      <div className={styles.imagePlaceholder}>
        <ImageIcon size={26} strokeWidth={1.2} className={styles.imagePlaceholderIcon} />
      </div>

      <div className={styles.body}>
        <span className={styles.name}>{pin.name}</span>
        {pin.description && (
          <p className={styles.description}>{pin.description}</p>
        )}
      </div>

      <div className={styles.footer}>
        {isAdded ? (
          <button
            className={styles.removeBtn}
            onClick={handleRemove}
            disabled={removing}
            aria-label={`Remove ${pin.name} from trip`}
          >
            REMOVE
          </button>
        ) : (
          <button
            className={`${styles.addBtn} ${flying ? styles.addBtnFlying : ''}`}
            onClick={handleAdd}
            disabled={flying}
            aria-label={`Add ${pin.name} to trip`}
          >
            <Plus size={12} strokeWidth={2.5} />ADD
          </button>
        )}
      </div>
    </div>
  )
}
