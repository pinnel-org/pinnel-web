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
  const [lifted, setLifted] = useState(false)
  const [menuAnchor, setMenuAnchor] = useState<DOMRect | null>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const ghostRef = useRef<HTMLDivElement | null>(null)

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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Mini dark pill ghost — appears under the cursor instead of the full card
    const ghost = document.createElement('div')
    ghost.style.cssText = [
      'position:fixed', 'top:-9999px', 'left:-9999px',
      'pointer-events:none',
      'background:#1a1410', 'color:#f4ede1',
      "font-family:'JetBrains Mono',monospace",
      'font-size:11px', 'font-weight:600', 'letter-spacing:0.04em',
      'padding:7px 14px 7px 10px', 'border-radius:20px',
      'box-shadow:0 4px 18px rgba(0,0,0,0.38),0 1px 4px rgba(0,0,0,0.18)',
      'white-space:nowrap', 'max-width:220px',
      'overflow:hidden', 'text-overflow:ellipsis',
      'display:flex', 'align-items:center', 'gap:6px',
    ].join(';')
    // small dot accent
    const dot = document.createElement('span')
    dot.style.cssText = 'width:6px;height:6px;border-radius:50%;background:#e8471c;flex-shrink:0'
    ghost.appendChild(dot)
    ghost.appendChild(document.createTextNode(pin.name))
    document.body.appendChild(ghost)
    ghostRef.current = ghost

    // Force layout so offsetWidth is correct, then set drag image
    void ghost.offsetWidth
    e.dataTransfer.setDragImage(ghost, 20, 20)
    e.dataTransfer.setData('application/pinnel-pin', String(pin.id))
    e.dataTransfer.effectAllowed = 'copy'

    // Signal to DaySelector zones to enter invite state
    document.body.setAttribute('data-pin-dragging', 'true')
    setLifted(true)
  }

  const handleDragEnd = () => {
    document.body.removeAttribute('data-pin-dragging')
    setLifted(false)
    if (ghostRef.current) {
      ghostRef.current.remove()
      ghostRef.current = null
    }
  }

  return (
    <div
      className={[styles.card, flying ? styles.flying : '', lifted ? styles.lifted : ''].join(' ')}
      draggable={hasDays && !isAdded}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
