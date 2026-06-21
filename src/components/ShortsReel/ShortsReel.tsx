import { useRef, useState, useCallback } from 'react'
import { Play } from 'lucide-react'
import type { AxiosError } from 'axios'
import { usePinShorts } from '@/hooks/usePinShorts'
import styles from './ShortsReel.module.css'

interface ShortsReelProps {
  pinId: number
}

const embedUrl = (id: string) =>
  `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0`

const thumbUrl = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`

export const ShortsReel = ({ pinId }: ShortsReelProps) => {
  const { data, isLoading, isError, error } = usePinShorts(pinId)
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // The active slide is the one nearest the vertical center of the viewport.
  const onScroll = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const slideHeight = track.clientHeight
    if (slideHeight === 0) return
    setActive(Math.round(track.scrollTop / slideHeight))
  }, [])

  if (isLoading) {
    return (
      <div className={styles.reel}>
        <div className={styles.skeleton} />
      </div>
    )
  }

  if (isError) {
    const status = (error as AxiosError)?.response?.status
    // 404 → backend found no shorts for this pin (the common, expected case).
    return (
      <div className={styles.reel}>
        <div className={styles.empty}>
          {status === 404 ? 'No vibes yet for this place.' : "Couldn't load shorts right now."}
        </div>
      </div>
    )
  }

  const ids = data ?? []
  if (ids.length === 0) {
    return (
      <div className={styles.reel}>
        <div className={styles.empty}>No vibes yet for this place.</div>
      </div>
    )
  }

  return (
    <div className={styles.reel}>
      <div className={styles.track} ref={trackRef} onScroll={onScroll}>
        {ids.map((id, i) => (
          <div className={styles.slide} key={id}>
            {i === active ? (
              <iframe
                className={styles.player}
                src={embedUrl(id)}
                title={`Short ${i + 1}`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button
                className={styles.poster}
                style={{ backgroundImage: `url(${thumbUrl(id)})` }}
                onClick={() => {
                  trackRef.current?.scrollTo({ top: i * trackRef.current.clientHeight, behavior: 'smooth' })
                }}
                aria-label={`Play short ${i + 1}`}
              >
                <span className={styles.playGlyph}>
                  <Play size={20} fill="currentColor" strokeWidth={0} />
                </span>
              </button>
            )}
          </div>
        ))}
      </div>
      <div className={styles.counter}>
        {active + 1} / {ids.length}
      </div>
    </div>
  )
}
