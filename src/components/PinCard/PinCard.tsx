import { useState, useRef } from 'react'
import { Plus, Check, ImageIcon } from 'lucide-react'
import { DayPickerMenu } from '@/components/DayPickerMenu/DayPickerMenu'
import { Pin } from '@/types'
import styles from './PinCard.module.css'

interface PinCardProps {
  pin: Pin
  isAdded: boolean
  onAdd: (pin: Pin) => void
  days?: Date[]
  onAddToDay?: (pin: Pin, dayIdx: number) => void
}

export const PinCard = ({ pin, isAdded, onAdd, days, onAddToDay }: PinCardProps) => {
  const [flying, setFlying] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<DOMRect | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)

  const hasDays = (days?.length ?? 0) > 0

  const handleAdd = () => {
    if (isAdded || flying) return
    if (hasDays && onAddToDay) {
      setMenuAnchor(btnRef.current?.getBoundingClientRect() ?? null)
      return
    }
    setFlying(true)
  }

  const handleAnimationEnd = () => {
    setFlying(false)
    onAdd(pin)
  }

  const handleDaySelect = (dayIdx: number) => {
    onAddToDay!(pin, dayIdx)
    setMenuAnchor(null)
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
          ref={btnRef}
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

      {menuAnchor && days && (
        <DayPickerMenu
          days={days}
          anchor={menuAnchor}
          onSelect={handleDaySelect}
          onClose={() => setMenuAnchor(null)}
        />
      )}
    </div>
  )
}
