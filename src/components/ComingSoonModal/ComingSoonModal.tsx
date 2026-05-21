import { useEffect } from 'react'
import styles from './ComingSoonModal.module.css'

interface ComingSoonModalProps {
  onClose: () => void
  featureName: string
}

export const ComingSoonModal = ({ onClose, featureName }: ComingSoonModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.iconWrapper}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 className={styles.title}>Coming Soon</h2>
          <p className={styles.subtitle}>
            <strong>{featureName}</strong> is currently under development.<br />
            This page will be added soon — stay tuned.
          </p>
        </div>
      </div>
    </div>
  )
}
