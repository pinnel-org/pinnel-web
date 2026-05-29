import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './DaySelector.module.css'
import { MiniCalendar } from '../MiniCalendar/MiniCalendar'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog/ConfirmDialog'

const DAY_ABBR = ['SUN','MON','TUE','WED','THU','FRI','SAT']
const MON_ABBR = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
const fmtDate = (d: Date) => `${DAY_ABBR[d.getDay()]} ${MON_ABBR[d.getMonth()]} ${d.getDate()}`
const pad2 = (n: number) => String(n).padStart(2, '0')

function smoothScroll(el: HTMLElement, to: number, duration = 420) {
  const from = el.scrollLeft
  const diff = to - from
  if (Math.abs(diff) < 1) return
  let start: number | null = null
  const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  const step = (ts: number) => {
    if (start === null) start = ts
    const p = Math.min((ts - start) / duration, 1)
    el.scrollLeft = from + diff * ease(p)
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

interface DaySelectorProps {
  days: Date[]
  activeDay: number
  onDaySelect: (day: number) => void
  onDayAdd: (date: Date) => void
  onDayRemove: (day: number) => void
  onDayEdit: (day: number, date: Date) => void
}

type PickerMode = { mode: 'add' } | { mode: 'edit'; idx: number }

export const DaySelector = ({ days, activeDay, onDaySelect, onDayAdd, onDayRemove, onDayEdit }: DaySelectorProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const drag = useRef({ on: false, x: 0, sl: 0 })
  const prevActiveDay = useRef(activeDay)
  const [picker, setPicker] = useState<PickerMode | null>(null)
  const [pendingRemove, setPendingRemove] = useState<number | null>(null)
  const [pickerPos, setPickerPos] = useState<{ top: number; left: number } | undefined>()
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const t = trackRef.current
    if (!t) return
    setCanScrollLeft(t.scrollLeft > 2)
    setCanScrollRight(t.scrollLeft + t.clientWidth < t.scrollWidth - 2)
  }, [])

  const getCardTarget = useCallback((idx: number) => {
    const track = trackRef.current
    if (!track) return null
    const card = track.children[idx] as HTMLElement | undefined
    if (!card) return null
    return card.offsetLeft - track.offsetWidth / 2 + card.offsetWidth / 2
  }, [])

  const scrollToCard = useCallback((idx: number) => {
    const track = trackRef.current
    if (!track) return
    const target = getCardTarget(idx)
    if (target !== null) { smoothScroll(track, target); setTimeout(checkScroll, 450) }
  }, [checkScroll, getCardTarget])

  useEffect(() => {
    const id = requestAnimationFrame(checkScroll)
    return () => cancelAnimationFrame(id)
  }, [days.length, checkScroll])

  useEffect(() => {
    if (prevActiveDay.current === activeDay) return
    prevActiveDay.current = activeDay
    requestAnimationFrame(() => scrollToCard(activeDay - 1))
  }, [activeDay, scrollToCard])

  const scrollCarousel = (dir: 'left' | 'right') => {
    const t = trackRef.current
    if (!t) return
    smoothScroll(t, t.scrollLeft + (dir === 'left' ? -148 : 148))
    setTimeout(checkScroll, 450)
  }

  const select = (day: number) => { onDaySelect(day); scrollToCard(day - 1) }

  const openPicker = (mode: PickerMode) => {
    const rect = rootRef.current?.getBoundingClientRect()
    if (rect) setPickerPos({ top: rect.top, left: rect.right + 8 })
    setPicker(mode)
  }

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (trackRef.current) { trackRef.current.scrollLeft += e.deltaY || e.deltaX; checkScroll() }
  }

  const onMouseDown = (e: React.MouseEvent) => {
    drag.current = { on: true, x: e.pageX, sl: trackRef.current?.scrollLeft ?? 0 }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.on || !trackRef.current) return
    trackRef.current.scrollLeft = drag.current.sl - (e.pageX - drag.current.x)
    checkScroll()
  }

  const stopDrag = () => { drag.current.on = false }

  const onPickerSelect = (date: Date) => {
    if (!picker) return
    picker.mode === 'add' ? onDayAdd(date) : onDayEdit(picker.idx + 1, date)
    setPicker(null)
  }

  const lastDay = days[days.length - 1]
  const suggestedDate = lastDay
    ? new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() + 1)
    : new Date()

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.trackWrapper}>
        {canScrollLeft && (
          <button className={`${styles.scrollBtn} ${styles.scrollLeft}`} onClick={() => scrollCarousel('left')}>‹</button>
        )}

        <div
          ref={trackRef}
          className={styles.track}
          onScroll={checkScroll}
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={stopDrag}
          onMouseLeave={stopDrag}
        >
          {days.map((date, i) => {
            const day = i + 1
            const active = activeDay === day
            return (
              <div key={day} className={`${styles.card} ${active ? styles.active : ''}`} onClick={() => select(day)}>
                {!active && <span className={styles.dot} />}
                {active && days.length > 1 && (
                  <button className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); setPendingRemove(day) }}>×</button>
                )}
                <span className={styles.dayLabel}>DAY</span>
                <span className={styles.dayNum}>{pad2(day)}</span>
                {active ? (
                  <button className={styles.dateBtn} onClick={(e) => { e.stopPropagation(); openPicker({ mode: 'edit', idx: i }) }}>
                    {fmtDate(date)}
                  </button>
                ) : (
                  <span className={styles.dateTxt}>{fmtDate(date)}</span>
                )}
              </div>
            )
          })}

          <button className={styles.addCard} onClick={() => openPicker({ mode: 'add' })}>
            <span className={styles.plus}>+</span>
          </button>
        </div>

        {canScrollRight && (
          <button className={`${styles.scrollBtn} ${styles.scrollRight}`} onClick={() => scrollCarousel('right')}>›</button>
        )}
      </div>

      {pendingRemove !== null && (
        <ConfirmDialog
          title={`Remove DAY ${pad2(pendingRemove)} · ${fmtDate(days[pendingRemove - 1])}?`}
          message="All places added to this day will also be removed."
          confirmLabel="Remove"
          onConfirm={() => { onDayRemove(pendingRemove); setPendingRemove(null) }}
          onCancel={() => setPendingRemove(null)}
        />
      )}

      {picker && (
        <MiniCalendar
          initialDate={picker.mode === 'add' ? suggestedDate : days[picker.idx]}
          selectedDate={picker.mode === 'edit' ? days[picker.idx] : undefined}
          disabledDates={picker.mode === 'add' ? days : days.filter((_, i) => i !== picker.idx)}
          suggestedDate={picker.mode === 'add' ? suggestedDate : undefined}
          position={pickerPos}
          onSelect={onPickerSelect}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  )
}
