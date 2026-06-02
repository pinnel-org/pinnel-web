import { useState } from 'react'
import styles from './MiniCalendar.module.css'

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const WD = ['Mo','Tu','We','Th','Fr','Sa','Su']

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

interface MiniCalendarProps {
  initialDate?: Date
  selectedDate?: Date
  disabledDates?: Date[]
  suggestedDate?: Date
  position?: { top: number; left: number }
  onSelect: (date: Date) => void
  onClose: () => void
}

export const MiniCalendar = ({ initialDate, selectedDate, disabledDates, suggestedDate, position, onSelect, onClose }: MiniCalendarProps) => {
  const base = initialDate ?? new Date()
  const [month, setMonth] = useState(base.getMonth())
  const [year, setYear] = useState(base.getFullYear())

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const offset = (new Date(year, month, 1).getDay() + 6) % 7
  const cells: (number | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1)
  }
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1)
  }

  const calendarStyle = position
    ? { top: position.top, left: position.left, transform: 'none' }
    : undefined

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.calendar} style={calendarStyle}>
        <div className={styles.header}>
          <button className={styles.arrow} onClick={prev}>‹</button>
          <span className={styles.monthLabel}>{MONTHS[month]} {year}</span>
          <button className={styles.arrow} onClick={next}>›</button>
        </div>
        <div className={styles.weekRow}>
          {WD.map(d => <span key={d} className={styles.wd}>{d}</span>)}
        </div>
        <div className={styles.grid}>
          {cells.map((day, i) => {
            if (day == null) return <span key={`_${i}`} />
            const cellDate = new Date(year, month, day)
            const isSelected = selectedDate ? sameDay(cellDate, selectedDate) : false
            const isDisabled = disabledDates?.some(d => sameDay(cellDate, d)) ?? false
            const isSuggested = suggestedDate ? sameDay(cellDate, suggestedDate) : false
            const cls = [
              styles.cell,
              isSelected ? styles.selected : '',
              isSuggested ? styles.suggested : '',
            ].join(' ')
            return (
              <button key={day} className={cls} disabled={isDisabled} onClick={() => onSelect(cellDate)}>
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
