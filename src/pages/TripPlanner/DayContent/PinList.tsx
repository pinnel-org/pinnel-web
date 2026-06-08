import { useRef, useCallback, useState } from 'react'
import { Pin } from '@/types'
import styles from './PinList.module.css'

const DragDots = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" width="11" height="11">
    <circle cx="5" cy="3.5" r="1.1"/><circle cx="11" cy="3.5" r="1.1"/>
    <circle cx="5" cy="8" r="1.1"/><circle cx="11" cy="8" r="1.1"/>
    <circle cx="5" cy="12.5" r="1.1"/><circle cx="11" cy="12.5" r="1.1"/>
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width="12" height="12">
    <path d="M3 4.5h10M6.5 4V3h3v1M5 4.5l.5 8.5h5l.5-8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

interface PinListProps {
  pins: Pin[]
  onReorder: (pins: Pin[]) => void
  onRemove: (pinId: number) => void
  onPinReorderComplete?: (pinId: number, newOrder: number) => void
}

export const PinList = ({ pins, onReorder, onRemove, onPinReorderComplete }: PinListProps) => {
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const pinsRef = useRef(pins)
  pinsRef.current = pins
  const dragRef = useRef<{ fromIdx: number } | null>(null)
  const onPinReorderCompleteRef = useRef(onPinReorderComplete)
  onPinReorderCompleteRef.current = onPinReorderComplete

  const onDocMouseMove = useCallback((e: MouseEvent) => {
    if (!dragRef.current || !listRef.current) return
    const rows = Array.from(listRef.current.children) as HTMLElement[]
    let toIdx = rows.length - 1
    for (let i = 0; i < rows.length; i++) {
      const { top, height } = rows[i].getBoundingClientRect()
      if (e.clientY < top + height / 2) { toIdx = i; break }
    }
    const fromIdx = dragRef.current.fromIdx
    if (toIdx !== fromIdx) {
      const reordered = [...pinsRef.current]
      const [moved] = reordered.splice(fromIdx, 1)
      reordered.splice(toIdx, 0, moved)
      onReorder(reordered)
      dragRef.current.fromIdx = toIdx
      setDraggingIdx(toIdx)
    }
  }, [onReorder])

  const onDocMouseUp = useCallback(() => {
    const finalIdx = dragRef.current?.fromIdx ?? null
    dragRef.current = null
    setDraggingIdx(null)
    document.removeEventListener('mousemove', onDocMouseMove)
    document.removeEventListener('mouseup', onDocMouseUp)
    if (finalIdx != null) {
      const movedPin = pinsRef.current[finalIdx]
      if (movedPin) onPinReorderCompleteRef.current?.(movedPin.id, finalIdx)
    }
  }, [onDocMouseMove])

  const startDrag = useCallback((idx: number) => {
    dragRef.current = { fromIdx: idx }
    setDraggingIdx(idx)
    document.addEventListener('mousemove', onDocMouseMove)
    document.addEventListener('mouseup', onDocMouseUp)
  }, [onDocMouseMove, onDocMouseUp])

  return (
    <div ref={listRef} className={`${styles.list} ${draggingIdx !== null ? styles.listDragging : ''}`}>
      {pins.map((pin, idx) => (
        <div key={pin.id} className={`${styles.item} ${draggingIdx === idx ? styles.dragging : ''}`}>
          <span className={styles.num}>{idx + 1}</span>
          <div className={styles.body}>
            <span className={styles.name}>{pin.name}</span>
            {pin.description && (
              <span className={styles.desc}>{pin.description}</span>
            )}
          </div>
          <button
            className={styles.removeBtn}
            onClick={() => onRemove(pin.id)}
            aria-label={`Remove ${pin.name}`}
          >
            <TrashIcon />
          </button>
          <span
            className={styles.dragHandle}
            onMouseDown={() => startDrag(idx)}
          >
            <DragDots />
          </span>
        </div>
      ))}
    </div>
  )
}
