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
    // Build the pill ghost and position it exactly under the cursor so the
    // browser can paint it before capturing it for the drag image.
    // (Elements at top:-9999px are not painted → setDragImage gets a blank.)
    const OFFSET = 20
    const ghost = document.createElement('div')
    ghost.setAttribute('aria-hidden', 'true')
    Object.assign(ghost.style, {
      position: 'fixed',
      top: `${e.clientY - OFFSET}px`,
      left: `${e.clientX - OFFSET}px`,
      zIndex: '-1',            // behind everything — user won't see the flash
      pointerEvents: 'none',
      background: '#1a1410',
      color: '#f4ede1',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.04em',
      padding: '7px 14px 7px 10px',
      borderRadius: '20px',
      boxShadow: '0 4px 18px rgba(0,0,0,0.38), 0 1px 4px rgba(0,0,0,0.18)',
      whiteSpace: 'nowrap',
      maxWidth: '220px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    })

    const dot = document.createElement('span')
    Object.assign(dot.style, {
      width: '6px', height: '6px',
      borderRadius: '50%', background: '#e8471c', flexShrink: '0',
    })
    ghost.appendChild(dot)
    ghost.appendChild(document.createTextNode(pin.name))

    document.body.appendChild(ghost)
    ghostRef.current = ghost

    // Force a synchronous layout so the browser has dimensions before capture
    void ghost.offsetWidth

    // Cursor should be at (OFFSET, OFFSET) within the ghost image
    e.dataTransfer.setDragImage(ghost, OFFSET, OFFSET)
    e.dataTransfer.setData('application/pinnel-pin', String(pin.id))
    e.dataTransfer.effectAllowed = 'copy'

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
