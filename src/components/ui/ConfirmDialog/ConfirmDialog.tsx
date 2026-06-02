import styles from './ConfirmDialog.module.css'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({ title, message, confirmLabel = 'Remove', onConfirm, onCancel }: ConfirmDialogProps) => (
  <>
    <div className={styles.backdrop} onClick={onCancel} />
    <div className={styles.dialog}>
      <button className={styles.closeBtn} onClick={onCancel}>×</button>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      <div className={styles.actions}>
        <button className={styles.cancelBtn} onClick={onCancel}>Cancel</button>
        <button className={styles.confirmBtn} onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  </>
)
