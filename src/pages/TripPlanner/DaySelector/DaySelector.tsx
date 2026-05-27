import { useState, useRef } from 'react'
import { CalendarPicker } from '../CalendarPicker/CalendarPicker'
import styles from './DaySelector.module.css'

interface DaySelectorProps {
  days: Date[]
  onAddDay: (date: Date) => void
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatShortDate = (date: Date) =>
  `${DAY_NAMES[date.getDay()]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`

interface CalendarState {
  open: boolean
  position: { top: number; left: number }
}

export const DaySelector = ({ days, onAddDay }: DaySelectorProps) => {
  const [calendar, setCalendar] = useState<CalendarState>({
    open: false,
    position: { top: 0, left: 0 },
  })

  const firstDayRef = useRef<HTMLButtonElement>(null)
  const addDayRef = useRef<HTMLButtonElement>(null)

  const openCalendar = (ref: React.RefObject<HTMLButtonElement | null>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setCalendar({
      open: true,
      position: { top: rect.top, left: rect.right + 10 },
    })
  }

  const handleSelect = (date: Date) => {
    onAddDay(date)
    setCalendar((prev) => ({ ...prev, open: false }))
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
        {days.map((date, i) => (
          <div key={date.toISOString()} className={styles.dayChip}>
            <span className={styles.chipNumber}>DAY {i + 1}</span>
            <span className={styles.chipDate}>{formatShortDate(date)}</span>
          </div>
        ))}
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
          <button
            className={styles.nextDayBtn}
            onClick={() => onAddDay(nextDay)}
          >
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
