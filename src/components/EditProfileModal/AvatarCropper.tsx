import { useEffect, useMemo, useState } from 'react'
import Cropper, { Area } from 'react-easy-crop'
import { cropToJpeg } from '@/utils/cropImage'
import styles from './AvatarCropper.module.css'

interface AvatarCropperProps {
  file: File
  onConfirm: (blob: Blob) => void
  onCancel: () => void
}

export const AvatarCropper = ({ file, onConfirm, onCancel }: AvatarCropperProps) => {
  const imageUrl = useMemo(() => URL.createObjectURL(file), [file])
  useEffect(() => () => URL.revokeObjectURL(imageUrl), [imageUrl])

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [pixelArea, setPixelArea] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!pixelArea) return
    setIsProcessing(true)
    setError(null)
    try {
      const blob = await cropToJpeg(file, pixelArea)
      onConfirm(blob)
    } catch {
      setError('Could not process the image. Try a different file.')
      setIsProcessing(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.stage}>
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, areaPixels) => setPixelArea(areaPixels)}
        />
      </div>

      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        aria-label="Zoom"
        className={styles.zoomSlider}
      />

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={isProcessing}>
          Cancel
        </button>
        <button
          type="button"
          className={styles.confirmBtn}
          onClick={handleConfirm}
          disabled={isProcessing || !pixelArea}
        >
          {isProcessing ? 'Processing…' : 'Use photo'}
        </button>
      </div>
    </div>
  )
}
