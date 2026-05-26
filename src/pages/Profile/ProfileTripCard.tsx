import { useNavigate } from 'react-router-dom'
import { TripSummary } from '@/types'
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

  return (
    <div className={styles.card} onClick={() => navigate(`/trip/${trip.id}`)}>
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
      </div>
    </div>
  )
}
