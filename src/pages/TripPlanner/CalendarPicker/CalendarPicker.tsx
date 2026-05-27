import { useState, useEffect, useRef } from 'react'
import styles from './CalendarPicker.module.css'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const WEEK_DAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

interface CalendarPickerProps {
  selectedDates: Date[]
  position: { top: number; left: number }
  onSelect: (date: Date) => void
  onClose: () => void
}

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate()

const buildGrid = (year: number, month: number): (Date | null)[] => {
  const firstDay = new Date(year, month, 1).getDay()
  const offset = (firstDay === 0 ? 6 : firstDay - 1) // Mon-first offset
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export const CalendarPicker = ({ selectedDates, position, onSelect, onClose }: CalendarPickerProps) => {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose])

  const grid = buildGrid(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) }
    else setViewMonth((m) => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) }
    else setViewMonth((m) => m + 1)
  }

  // Clamp to stay in viewport
  const top = Math.min(position.top, window.innerHeight - 320)

  return (
    <div
      ref={ref}
      className={styles.picker}
      style={{ top, left: position.left }}
    >
      <div className={styles.header}>
        <button className={styles.navBtn} onClick={prevMonth}>‹</button>
        <span className={styles.monthLabel}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button className={styles.navBtn} onClick={nextMonth}>›</button>
      </div>

      <div className={styles.weekRow}>
        {WEEK_DAYS.map((d) => (
          <span key={d} className={styles.weekDay}>{d}</span>
        ))}
      </div>

      <div className={styles.grid}>
        {grid.map((date, i) => {
          if (!date) return <span key={i} className={styles.empty} />
          const isSelected = selectedDates.some((s) => isSameDay(s, date))
          const isToday = isSameDay(date, today)
          return (
            <button
              key={date.toISOString()}
              className={[
                styles.day,
                isSelected ? styles.daySelected : '',
                isToday ? styles.dayToday : '',
              ].join(' ')}
              onClick={() => onSelect(date)}
              disabled={isSelected}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
