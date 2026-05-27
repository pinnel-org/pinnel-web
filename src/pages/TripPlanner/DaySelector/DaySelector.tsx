import { useState, useRef } from 'react'
import { CalendarPicker } from '../CalendarPicker/CalendarPicker'
import { PlaceCard } from '@/components/PlaceCard/PlaceCard'
import { Pin } from '@/types'
import styles from './DaySelector.module.css'

interface DaySelectorProps {
  days: Date[]
  onAddDay: (date: Date) => void
  pinsByDay: Record<number, number[]>
  allPins: Pin[]
  onDropPin: (pinId: number, dayIdx: number) => void
  onRemovePin: (pinId: number) => void
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatShortDate = (date: Date) =>
  `${DAY_NAMES[date.getDay()]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`

interface CalendarState {
  open: boolean
  position: { top: number; left: number }
}

export const DaySelector = ({
  days, onAddDay,
  pinsByDay, allPins,
  onDropPin, onRemovePin,
}: DaySelectorProps) => {
  const [calendar, setCalendar] = useState<CalendarState>({
    open: false,
    position: { top: 0, left: 0 },
  })
  const [dragOverDay, setDragOverDay] = useState<number | null>(null)

  const firstDayRef = useRef<HTMLButtonElement>(null)
  const addDayRef = useRef<HTMLButtonElement>(null)

  const openCalendar = (ref: React.RefObject<HTMLButtonElement | null>) => {
    if (!ref.current) return
    const triggerRect = ref.current.getBoundingClientRect()
    const sidebar = ref.current.closest('aside')
    const anchorLeft = sidebar
      ? sidebar.getBoundingClientRect().right + 8
      : triggerRect.right + 8
    setCalendar({ open: true, position: { top: triggerRect.top, left: anchorLeft } })
  }

  const handleSelect = (date: Date) => {
    onAddDay(date)
    setCalendar((prev) => ({ ...prev, open: false }))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, dayIdx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setDragOverDay(dayIdx)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverDay(null)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, dayIdx: number) => {
    e.preventDefault()
    const pinId = parseInt(e.dataTransfer.getData('application/pinnel-pin'), 10)
    if (!isNaN(pinId)) onDropPin(pinId, dayIdx)
    setDragOverDay(null)
  }

  const nextDay = days.length > 0
    ? new Date(days[days.length - 1].getTime() + 24 * 60 * 60 * 1000)
    : null

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (days.length === 0) {
    return (
      <div className={styles.wrapper}>
        <button
          ref={firstDayRef}
          className={styles.addFirstDay}
          onClick={() => openCalendar(firstDayRef)}
        >
          <span className={styles.addFirstDayPlus}>+</span>
          ADD YOUR FIRST DAY
        </button>

        {calendar.open && (
          <CalendarPicker
            selectedDates={days}
            position={calendar.position}
            onSelect={handleSelect}
            onClose={() => setCalendar((prev) => ({ ...prev, open: false }))}
          />
        )}
      </div>
    )
  }

  // ── Days added ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.wrapper}>
      <div className={styles.dayList}>
        {days.map((date, i) => {
          const dayPinIds = pinsByDay[i] ?? []
          const dayPins = allPins.filter((p) => dayPinIds.includes(p.id))
          const isTarget = dragOverDay === i

          return (
            <div key={date.toISOString()} className={styles.dayGroup}>
              <div className={styles.dayChip}>
                <span className={styles.chipNumber}>DAY {i + 1}</span>
                <span className={styles.chipDate}>{formatShortDate(date)}</span>
              </div>

              <div
                className={[
                  dayPins.length === 0 ? styles.dayEmpty : styles.dayPins,
                  isTarget ? styles.dragOver : '',
                ].join(' ')}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, i)}
              >
                {dayPins.length === 0 ? (
                  <>
                    <p className={styles.dayEmptyText}>No places yet.</p>
                    <p className={styles.dayEmptyHint}>Browse and add places to your trip.</p>
                  </>
                ) : (
                  dayPins.map((pin, j) => (
                    <PlaceCard
                      key={pin.id}
                      pin={pin}
                      index={j + 1}
                      onRemove={onRemovePin}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.footer}>
        <button
          ref={addDayRef}
          className={styles.addDayBtn}
          onClick={() => openCalendar(addDayRef)}
        >
          + ADD DAY
        </button>

        {nextDay && (
          <button className={styles.nextDayBtn} onClick={() => onAddDay(nextDay)}>
            DAY {days.length + 1} · {formatShortDate(nextDay)}
          </button>
        )}
      </div>

      {calendar.open && (
        <CalendarPicker
          selectedDates={days}
          position={calendar.position}
          onSelect={handleSelect}
          onClose={() => setCalendar((prev) => ({ ...prev, open: false }))}
        />
      )}
    </div>
  )
}
