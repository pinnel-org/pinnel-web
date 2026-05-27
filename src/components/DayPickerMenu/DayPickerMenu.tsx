import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './DayPickerMenu.module.css'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const formatShortDate = (date: Date) =>
  `${DAY_NAMES[date.getDay()]} ${date.getDate()} ${MONTH_NAMES[date.getMonth()]}`

interface DayPickerMenuProps {
  days: Date[]
  anchor: DOMRect
  onSelect: (dayIdx: number) => void
  onClose: () => void
}

const MENU_WIDTH = 192

export const DayPickerMenu = ({ days, anchor, onSelect, onClose }: DayPickerMenuProps) => {
  const ref = useRef<HTMLDivElement>(null)

  // Vertically: below the button, or above if near bottom
  const menuHeight = 32 + days.length * 36 + 8
  const spaceBelow = window.innerHeight - anchor.bottom - 8
  const top = spaceBelow >= menuHeight
    ? anchor.bottom + 4
    : anchor.top - menuHeight - 4

  // Horizontally: align to button right edge, clamp inside viewport
  const left = Math.min(
    Math.max(anchor.right - MENU_WIDTH, 8),
    window.innerWidth - MENU_WIDTH - 8,
  )

  // Close on any click outside the menu
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    // Use capture phase so it fires before any click handlers that might
    // re-open the menu (e.g. the ADD button itself)
    document.addEventListener('mousedown', handler, true)
    return () => document.removeEventListener('mousedown', handler, true)
  }, [onClose])

  // Render into document.body via portal so the menu escapes any ancestor
  // with transform/overflow:hidden (e.g. the .card:hover transform that
  // would otherwise make position:fixed behave like position:absolute).
  return createPortal(
    <div ref={ref} className={styles.menu} style={{ top, left, width: MENU_WIDTH }}>
      <p className={styles.header}>ADD TO DAY</p>
      {days.map((date, i) => (
        <button
          key={date.toISOString()}
          className={styles.option}
          onClick={() => { onSelect(i); onClose() }}
        >
          <span className={styles.optionDay}>DAY {i + 1}</span>
          <span className={styles.optionDate}>{formatShortDate(date)}</span>
        </button>
      ))}
    </div>,
    document.body,
  )
}
