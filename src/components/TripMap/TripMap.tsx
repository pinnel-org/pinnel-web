import { useRef, useState, useCallback, useEffect } from 'react'
import Map, { Marker, Popup, Source, Layer, NavigationControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { Pin } from '@/types'
import styles from './TripMap.module.css'

const MAP_STYLE = 'https://tiles.openfreemap.org/styles/bright'

const lineLayerSpec = {
  id: 'route-line',
  type: 'line' as const,
  layout: { 'line-cap': 'round' as const, 'line-join': 'round' as const },
  paint: {
    'line-color': '#E25A2C',
    'line-width': 3,
    'line-opacity': 0.85,
    'line-dasharray': [2, 3],
  },
}

const buildings3dLayerSpec = {
  id: 'buildings-3d',
  type: 'fill-extrusion' as const,
  source: 'openmaptiles',
  'source-layer': 'building',
  paint: {
    'fill-extrusion-color': '#d6cfc4',
    'fill-extrusion-height': ['get', 'render_height'] as unknown as number,
    'fill-extrusion-base': ['get', 'render_min_height'] as unknown as number,
    'fill-extrusion-opacity': 0.85,
  },
}

interface TripMapProps {
  pins: Pin[]
  centerLat?: number
  centerLng?: number
  focusPinRequest?: { pin: Pin; seq: number } | null
}

export const TripMap = ({ pins, centerLat, centerLng, focusPinRequest }: TripMapProps) => {
  const mapRef = useRef<MapRef>(null)
  const [selected, setSelected] = useState<Pin | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [is3D, setIs3D] = useState(false)
  const [pulsePinId, setPulsePinId] = useState<number | null>(null)
  const pulseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const navigateToView = useCallback((pinsToFit: Pin[], lat: number, lng: number) => {
    const map = mapRef.current
    if (!map) return

    if (!pinsToFit.length) {
      map.flyTo({ center: [lng, lat], zoom: 13, duration: 600 })
      return
    }

    if (pinsToFit.length === 1) {
      map.flyTo({ center: [pinsToFit[0].longitude, pinsToFit[0].latitude], zoom: 14, duration: 600 })
      return
    }

    const lngs = pinsToFit.map(p => p.longitude)
    const lats = pinsToFit.map(p => p.latitude)
    map.fitBounds(
      [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
      { padding: 80, duration: 600 },
    )
  }, [])

  const handleMapLoad = useCallback(() => {
    setMapLoaded(true)
    if (centerLat != null && centerLng != null) {
      navigateToView(pins, centerLat, centerLng)
    }
  }, [pins, centerLat, centerLng, navigateToView])

  useEffect(() => {
    if (!mapLoaded || centerLat == null || centerLng == null) return
    setSelected(null)
    navigateToView(pins, centerLat, centerLng)
  }, [pins, centerLat, centerLng, mapLoaded, navigateToView])

  useEffect(() => {
    if (!focusPinRequest || !mapLoaded) return
    mapRef.current?.flyTo({
      center: [focusPinRequest.pin.longitude, focusPinRequest.pin.latitude],
      zoom: 16,
      duration: 700,
    })
    setSelected(focusPinRequest.pin)
    setPulsePinId(focusPinRequest.pin.id)
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current)
    pulseTimerRef.current = setTimeout(() => setPulsePinId(null), 3000)
  }, [focusPinRequest?.seq, mapLoaded])

  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current?.getMap()
    if (!map) return
    const currentZoom = map.getZoom()
    map.jumpTo({
      pitch: is3D ? 52 : 0,
      bearing: is3D ? -20 : 0,
      zoom: is3D ? Math.max(currentZoom, 14) : currentZoom,
    })
  }, [is3D, mapLoaded])

  const route = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'LineString' as const,
      coordinates: pins.map(p => [p.longitude, p.latitude]),
    },
  }

  return (
    <div className={styles.wrapper}>
      <Map
        ref={mapRef}
        initialViewState={{ longitude: centerLng ?? 10.0, latitude: centerLat ?? 48.8, zoom: 12 }}
        mapStyle={MAP_STYLE}
        style={{ width: '100%', height: '100%' }}
        onLoad={handleMapLoad}
      >
        <NavigationControl position="top-right" />

        {is3D && <Layer {...buildings3dLayerSpec} />}

        {pins.length > 1 && (
          <Source id="route" type="geojson" data={route}>
            <Layer {...lineLayerSpec} />
          </Source>
        )}

        {pins.map((pin, i) => (
          <Marker
            key={pin.id}
            longitude={pin.longitude}
            latitude={pin.latitude}
            anchor="bottom"
            onClick={(e) => {
              e.originalEvent.stopPropagation()
              setSelected(s => s?.id === pin.id ? null : pin)
            }}
          >
            <div className={`${styles.travelPin} ${pulsePinId === pin.id ? styles.travelPinPulsing : ''}`}>
              <span className={styles.pinNum}>{i + 1}</span>
            </div>
          </Marker>
        ))}

        {selected && (
          <Popup
            longitude={selected.longitude}
            latitude={selected.latitude}
            anchor="bottom"
            offset={34}
            closeButton={false}
            className={styles.pinPopup}
            onClose={() => setSelected(null)}
          >
            <div className={styles.pinCard}>
              <p className={styles.pinName}>{selected.name}</p>
            </div>
          </Popup>
        )}
      </Map>

      <button
        className={`${styles.toggleBtn} ${is3D ? styles.toggleBtnActive : ''}`}
        onClick={() => setIs3D(v => !v)}
        title={is3D ? 'Disable 3D' : 'Enable 3D'}
      >
        3D
      </button>
    </div>
  )
}
