import { useEffect, useMemo, useState } from 'react'
import { useUpdateUser } from '@/hooks/useUser'
import { useAvatar, useDeleteAvatar, useUploadAvatar } from '@/hooks/useAvatar'
import { PhotoUpload } from './PhotoUpload'
import { AvatarCropper } from './AvatarCropper'
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

  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)
  const [removeAvatar, setRemoveAvatar] = useState(false)

  const [validationError, setValidationError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { mutateAsync: updateUserAsync, reset: resetUpdate } = useUpdateUser()
  const { mutateAsync: uploadAvatarAsync } = useUploadAvatar()
  const { mutateAsync: deleteAvatarAsync } = useDeleteAvatar()
  const { url: currentAvatarUrl } = useAvatar()

  const stagedPreviewUrl = useMemo(
    () => (croppedBlob ? URL.createObjectURL(croppedBlob) : null),
    [croppedBlob],
  )
  useEffect(() => {
    if (!stagedPreviewUrl) return
    return () => URL.revokeObjectURL(stagedPreviewUrl)
  }, [stagedPreviewUrl])

  useEffect(() => {
    if (!isOpen) return
    setUsername(currentUsername)
    setDisplayName(currentDisplayName ?? '')
    setBio(currentBio ?? '')
    setValidationError(null)
    setSubmitError(null)
    setPendingFile(null)
    setCroppedBlob(null)
    setRemoveAvatar(false)
    setIsSubmitting(false)
    resetUpdate()
  }, [isOpen, currentUsername, currentDisplayName, currentBio, resetUpdate])

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    setSubmitError(null)
    setIsSubmitting(true)
    try {
      await updateUserAsync({
        username: trimmedUsername,
        displayName: trimmedDisplayName,
        bio: bio.trim(),
      })
      if (removeAvatar) {
        await deleteAvatarAsync()
      } else if (croppedBlob) {
        await uploadAvatarAsync(croppedBlob)
      }
      onClose()
    } catch {
      setSubmitError('Failed to save. Please try again.')
      setIsSubmitting(false)
    }
  }

  const showingExisting = !pendingFile && !croppedBlob && !removeAvatar && currentAvatarUrl
  const showingDropZone = !pendingFile && !croppedBlob && (!currentAvatarUrl || removeAvatar)

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className={styles.header}>
          <p className={styles.step}>EDIT PROFILE</p>
          <h2 className={styles.title}>Edit <em className={styles.titleAccent}>profile.</em></h2>

          <div className={styles.photoWrap}>
            {pendingFile && (
              <AvatarCropper
                file={pendingFile}
                onConfirm={(blob) => {
                  setCroppedBlob(blob)
                  setPendingFile(null)
                  setRemoveAvatar(false)
                }}
                onCancel={() => setPendingFile(null)}
              />
            )}

            {!pendingFile && croppedBlob && stagedPreviewUrl && (
              <div className={styles.stagedPreview}>
                <img src={stagedPreviewUrl} alt="" className={styles.previewImg} />
                <div className={styles.previewActions}>
                  <span className={styles.previewLabel}>New photo ready</span>
                  <div className={styles.linkRow}>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => setCroppedBlob(null)}
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => {
                        setCroppedBlob(null)
                        setRemoveAvatar(true)
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showingExisting && (
              <div className={styles.stagedPreview}>
                <img src={currentAvatarUrl} alt="" className={styles.previewImg} />
                <div className={styles.previewActions}>
                  <span className={styles.previewLabel}>Current photo</span>
                  <div className={styles.linkRow}>
                    <button
                      type="button"
                      className={styles.linkBtn}
                      onClick={() => setRemoveAvatar(true)}
                    >
                      Remove photo
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showingDropZone && <PhotoUpload onFileSelected={setPendingFile} />}
          </div>
        </div>

        <form id="ep-form" className={styles.form} onSubmit={handleSubmit}>
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

          {(validationError ?? submitError) && (
            <p className={styles.error}>{validationError ?? submitError}</p>
          )}
        </form>

        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="ep-form" className={styles.saveBtn} disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save →'}
          </button>
        </div>
      </div>
    </div>
  )
}
