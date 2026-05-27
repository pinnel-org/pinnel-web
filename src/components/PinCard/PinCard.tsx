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

/** Draw a rounded-rect pill on canvas and return it as drag image */
const buildGhostCanvas = (label: string): HTMLCanvasElement => {
  const canvas = document.createElement('canvas')
  const DPR = Math.min(window.devicePixelRatio || 1, 2)
  const W = 192
  const H = 34
  canvas.width = W * DPR
  canvas.height = H * DPR

  const ctx = canvas.getContext('2d')!
  ctx.scale(DPR, DPR)

  // Pill shape
  const r = H / 2
  ctx.fillStyle = '#1a1410'
  ctx.beginPath()
  ctx.moveTo(r, 0)
  ctx.lineTo(W - r, 0)
  ctx.arcTo(W, 0, W, r, r)
  ctx.lineTo(W, H - r)
  ctx.arcTo(W, H, W - r, H, r)
  ctx.lineTo(r, H)
  ctx.arcTo(0, H, 0, H - r, r)
  ctx.lineTo(0, r)
  ctx.arcTo(0, 0, r, 0, r)
  ctx.closePath()
  ctx.fill()

  // Orange accent dot
  ctx.fillStyle = '#e8471c'
  ctx.beginPath()
  ctx.arc(15, H / 2, 3.5, 0, Math.PI * 2)
  ctx.fill()

  // Label text
  ctx.fillStyle = '#f0ede8'
  ctx.font = '600 11px monospace'
  ctx.textBaseline = 'middle'
  const maxLen = 22
  const text = label.length > maxLen ? label.slice(0, maxLen - 1) + '…' : label
  ctx.fillText(text, 27, H / 2 + 0.5)

  return canvas
}

export const PinCard = ({ pin, isAdded, onAdd, days, onAddToDay }: PinCardProps) => {
  const [flying, setFlying] = useState(false)
  const [lifted, setLifted] = useState(false)
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

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    // Canvas ghost — rendered in memory, no DOM timing issues
    try {
      const canvas = buildGhostCanvas(pin.name)
      e.dataTransfer.setDragImage(canvas, 16, 17)
    } catch {
      // Fallback: browser default ghost
    }

    // Firefox requires text/plain to be present or it won't start the drag
    e.dataTransfer.setData('text/plain', pin.name)
    e.dataTransfer.setData('application/pinnel-pin', String(pin.id))
    e.dataTransfer.effectAllowed = 'copy'

    document.body.setAttribute('data-pin-dragging', 'true')
    setLifted(true)
  }

  const handleDragEnd = () => {
    document.body.removeAttribute('data-pin-dragging')
    setLifted(false)
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
