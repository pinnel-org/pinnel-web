import { useState } from 'react'
import { Plus, Check, ImageIcon } from 'lucide-react'
import { Pin } from '@/types'
import styles from './PinCard.module.css'

interface PinCardProps {
  pin: Pin
  isAdded: boolean
  onAdd: (pin: Pin) => void
}

export const PinCard = ({ pin, isAdded, onAdd }: PinCardProps) => {
  const [flying, setFlying] = useState(false)

  const handleAdd = () => {
    if (isAdded || flying) return
    setFlying(true)
  }

  const handleAnimationEnd = () => {
    setFlying(false)
    onAdd(pin)
  }

  return (
    <div
      className={`${styles.card} ${flying ? styles.flying : ''}`}
      onAnimationEnd={flying ? handleAnimationEnd : undefined}
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
        <button
          className={isAdded ? styles.addedBtn : styles.addBtn}
          onClick={handleAdd}
          disabled={isAdded || flying}
          aria-label={isAdded ? 'Added to trip' : `Add ${pin.name} to trip`}
        >
          {isAdded ? (
            <><Check size={12} strokeWidth={2.5} />ADDED</>
          ) : (
            <><Plus size={12} strokeWidth={2.5} />ADD</>
          )}
        </button>
      </div>
    </div>
  )
}
