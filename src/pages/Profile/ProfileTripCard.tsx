import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TripSummary } from '@/types'
import { DeleteTripModal } from '@/components/DeleteTripModal/DeleteTripModal'
import styles from './ProfileTripCard.module.css'

const GRADIENTS = [
  'linear-gradient(140deg, #c8631a 0%, #7a3a0a 100%)',
  'linear-gradient(140deg, #9b7a1a 0%, #5a4209 100%)',
  'linear-gradient(140deg, #1a5a5a 0%, #0c3030 100%)',
  'linear-gradient(140deg, #4a6a7a 0%, #263a44 100%)',
  'linear-gradient(140deg, #5a3a7a 0%, #2e1c40 100%)',
  'linear-gradient(140deg, #2a5a3a 0%, #12301e 100%)',
]

interface Props {
  trip: TripSummary
  index: number
}

export const ProfileTripCard = ({ trip, index }: Props) => {
  const navigate = useNavigate()
  const gradient = GRADIENTS[index % GRADIENTS.length]
  const pinCount = trip.pinIds?.length ?? 0
  const cityCount = trip.cityIds?.length ?? 0

  const [menuOpen, setMenuOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleCardClick = () => {
    if (menuOpen || deleteOpen) return
    navigate(`/trip/${trip.id}`)
  }

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen((v) => !v)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen(false)
    setDeleteOpen(true)
  }

  return (
    <>
      <div className={`${styles.card} ${menuOpen ? styles.cardActive : ''}`} onClick={handleCardClick}>
        <div className={styles.image} style={{ background: gradient }}>
          {trip.coverImageUrl && (
            <img
              src={trip.coverImageUrl}
              alt=""
              className={styles.coverImg}
              onError={(e) => { e.currentTarget.style.display = 'none' }}
              loading="lazy"
            />
          )}
          <span className={styles.pinCount}>{pinCount}</span>
        </div>
        <div className={styles.body}>
          <div className={styles.city}>{trip.name}</div>
          <div className={styles.meta}>{cityCount} cities · {pinCount} pins</div>
          {trip.budget != null && (
            <div className={styles.budget}>Budget: {trip.budget}</div>
          )}

          <div className={styles.menuWrap} ref={menuRef}>
            <button
              type="button"
              className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ''}`}
              onClick={handleMenuToggle}
              aria-label="Trip actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className={styles.dots} aria-hidden="true">⋯</span>
            </button>
            {menuOpen && (
              <div className={styles.popover} role="menu">
                <button
                  type="button"
                  className={styles.popoverItem}
                  onClick={handleDeleteClick}
                  role="menuitem"
                >
                  <span className={styles.popoverIcon} aria-hidden="true">✕</span>
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteTripModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        tripId={trip.id}
        tripName={trip.name}
      />
    </>
  )
}
