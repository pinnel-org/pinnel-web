import { useEffect } from 'react'
import { useDeleteTrip } from '@/hooks/useUser'
import styles from './DeleteTripModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  tripId: number
  tripName: string
}

export const DeleteTripModal = ({ isOpen, onClose, tripId, tripName }: Props) => {
  const { mutate, isPending, error, reset } = useDeleteTrip()

  useEffect(() => {
    if (!isOpen) {
      reset()
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose, reset])

  if (!isOpen) return null

  const handleDelete = () => {
    mutate(tripId, { onSuccess: onClose })
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.header}>
          <p className={styles.step}>DELETE TRIP</p>
          <h2 className={styles.title}>
            Delete <em className={styles.titleAccent}>{tripName}?</em>
          </h2>
          <p className={styles.body}>
            All cards, notes, and routes for this trip will be removed. This can't be undone.
          </p>
        </div>

        {error && (
          <p className={styles.error}>Failed to delete trip. Please try again.</p>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose} disabled={isPending}>
            Cancel
          </button>
          <button type="button" className={styles.deleteBtn} onClick={handleDelete} disabled={isPending}>
            {isPending ? 'Deleting…' : 'Delete →'}
          </button>
        </div>
      </div>
    </div>
  )
}
