import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Pin, CityDto } from '@/types'
import styles from './TripMap.module.css'

// Fix Leaflet default icon paths broken by Vite asset hashing
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

const createPinIcon = (index: number) =>
  L.divIcon({
    html: `<div style="
      width:28px;height:28px;
      background:#e8471c;
      border:2.5px solid #fff;
      border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      font-family:'JetBrains Mono',monospace;
      font-size:11px;font-weight:700;
      color:#fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.3);
      box-sizing:border-box;
    ">${index}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -20],
  })

// ── Inner controller: re-centers / fits bounds when pins change ──
interface MapControllerProps {
  city: CityDto | undefined
  pins: Pin[]
}

const MapController = ({ city, pins }: MapControllerProps) => {
  const map = useMap()

  useEffect(() => {
    if (pins.length > 0) {
      const bounds = L.latLngBounds(pins.map((p) => [p.latitude, p.longitude]))
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 15, animate: true })
    } else if (city) {
      map.setView([city.latitude, city.longitude], 13, { animate: true })
    }
  }, [pins, city, map])

  return null
}

// ── Public component ─────────────────────────────────────────────
interface TripMapProps {
  city: CityDto | undefined
  pins: Pin[]
}

export const TripMap = ({ city, pins }: TripMapProps) => {
  const center: [number, number] = city
    ? [city.latitude, city.longitude]
    : [48.8, 10.0]

  return (
    <div className={styles.mapWrap}>
      <MapContainer
        key={city?.id ?? 'default'}
        center={center}
        zoom={13}
        className={styles.map}
        zoomControl
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {pins.map((pin, i) => (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={createPinIcon(i + 1)}
          >
            <Popup>
              <span className={styles.popupName}>{pin.name}</span>
              {pin.description && (
                <p className={styles.popupDesc}>{pin.description}</p>
              )}
            </Popup>
          </Marker>
        ))}

        <MapController city={city} pins={pins} />
      </MapContainer>
    </div>
  )
}
