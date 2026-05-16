import { useState, useRef, useCallback } from 'react'
import styles from './PhotoUpload.module.css'

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

interface PhotoFile {
  file: File
  previewUrl: string
  width: number
  height: number
}

const UploadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 15V4m0 0-3.5 3.5M12 4l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
)

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`

export const PhotoUpload = () => {
  const [photo, setPhoto] = useState<PhotoFile | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback((file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      setFileError('Only JPG, PNG, or WEBP files are accepted.')
      return
    }
    if (file.size > MAX_BYTES) {
      setFileError('File too large. Max 5 MB.')
      return
    }
    setFileError(null)
    const previewUrl = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () =>
      setPhoto({ file, previewUrl, width: img.naturalWidth, height: img.naturalHeight })
    img.src = previewUrl
  }, [])

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (files?.[0]) processFile(files[0])
    },
    [processFile],
  )

  const handleRemove = () => {
    if (photo) URL.revokeObjectURL(photo.previewUrl)
    setPhoto(null)
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className={styles.wrapper}>
      {photo ? (
        <div className={styles.preview}>
          <img src={photo.previewUrl} alt="Profile preview" className={styles.previewImg} />
          <div className={styles.previewInfo}>
            <span className={styles.fileName}>{photo.file.name}</span>
            <span className={styles.fileMeta}>
              {formatSize(photo.file.size)} · {photo.width} × {photo.height} px
            </span>
            <button type="button" className={styles.removeBtn} onClick={handleRemove}>
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.dropZone} ${isDragOver ? styles.dragOver : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
        >
          <UploadIcon />
          <p className={styles.dropLabel}>Drag & drop your photo here</p>
          <button
            type="button"
            className={styles.browseBtn}
            onClick={() => inputRef.current?.click()}
          >
            Browse files
          </button>
          <p className={styles.dropHint}>JPG, PNG, WEBP · max 5 MB</p>
        </div>
      )}

      {fileError && <p className={styles.fileError}>{fileError}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className={styles.hiddenInput}
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
