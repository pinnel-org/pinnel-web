import { useState, useEffect } from 'react'
import { useUpdateUser } from '@/hooks/useUser'
import styles from './EditProfileModal.module.css'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUsername: string
  currentDisplayName: string | null
  currentBio: string | null
}

export const EditProfileModal = ({
  isOpen,
  onClose,
  currentUsername,
  currentDisplayName,
  currentBio,
}: EditProfileModalProps) => {
  const [username, setUsername] = useState(currentUsername)
  const [displayName, setDisplayName] = useState(currentDisplayName ?? '')
  const [bio, setBio] = useState(currentBio ?? '')

  const [validationError, setValidationError] = useState<string | null>(null)
  const { mutate, isPending, error, reset } = useUpdateUser()

  useEffect(() => {
    if (!isOpen) return
    setUsername(currentUsername)
    setDisplayName(currentDisplayName ?? '')
    setBio(currentBio ?? '')
    setValidationError(null)
    reset()
  }, [isOpen, currentUsername, currentDisplayName, currentBio, reset])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedUsername = username.trim()
    const trimmedDisplayName = displayName.trim()
    if (!trimmedUsername) {
      setValidationError('Username is required.')
      return
    }
    if (!trimmedDisplayName) {
      setValidationError('Display name is required.')
      return
    }
    setValidationError(null)
    mutate(
      { username: trimmedUsername, displayName: trimmedDisplayName, bio: bio.trim() },
      { onSuccess: onClose },
    )
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <h2 className={styles.title}>Edit profile</h2>
        <p className={styles.subtitle}>Update your public profile details.</p>

        <div className={styles.divider} />

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="ep-displayName">
              Display name
            </label>
            <input
              id="ep-displayName"
              className={styles.input}
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
              placeholder="Your name"
              required
              autoFocus
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ep-username">
              Username
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputPrefix}>@</span>
              <input
                id="ep-username"
                className={styles.inputWithPrefix}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={50}
                placeholder="username"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="ep-bio">
              Bio
              <span className={styles.charCount}>{bio.length} / 500</span>
            </label>
            <textarea
              id="ep-bio"
              className={styles.textarea}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={500}
              placeholder="Tell something about yourself"
              rows={4}
            />
          </div>

          {(validationError ?? error) && (
            <p className={styles.error}>
              {validationError ?? 'Failed to save. Please try again.'}
            </p>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isPending}>
              {isPending ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
