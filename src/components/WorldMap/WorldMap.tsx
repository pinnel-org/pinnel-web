import { useEffect, useMemo, useState } from 'react'
import { geoEquirectangular, geoPath } from 'd3-geo'
import { feature } from 'topojson-client'
import type { Topology, GeometryCollection } from 'topojson-specification'
import type { Feature, Geometry } from 'geojson'
import { numericToAlpha2 } from './isoCountryCodes'
import styles from './WorldMap.module.css'

interface WorldMapProps {
  visited: string[]
  isLoading?: boolean
}

interface CountryProps {
  name?: string
}

type CountryFeature = Feature<Geometry, CountryProps> & { alpha2: string | null }

const VIEWBOX_WIDTH = 1120
const VIEWBOX_HEIGHT = 440

// Tuned to show every populated landmass (Iceland → northern Russia, Greenland,
// Tierra del Fuego, all of Australia) while trimming empty polar ocean only.
const projection = geoEquirectangular()
  .scale(178)
  .translate([560, 230])
  .center([0, 12])

const pathBuilder = geoPath(projection)

export const WorldMap = ({ visited, isLoading }: WorldMapProps) => {
  const [features, setFeatures] = useState<CountryFeature[] | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    // de-jure-110m.json is a patched world-atlas/countries-110m.json that moves
    // Crimea from Russia to Ukraine. Regenerate via scripts/build-de-jure-topology.mjs.
    import('./de-jure-110m.json')
      .then((mod) => {
        if (cancelled) return
        const topology = (mod.default ?? mod) as unknown as Topology
        const collection = topology.objects.countries as GeometryCollection<CountryProps>
        const geo = feature(topology, collection)
        const enriched: CountryFeature[] = geo.features
          .filter((f) => f.properties?.name !== 'Antarctica')
          .map((f) => ({ ...f, alpha2: numericToAlpha2(f.id as string | number | undefined) }))
        setFeatures(enriched)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const visitedSet = useMemo(() => new Set(visited.map((c) => c.toUpperCase())), [visited])

  const paths = useMemo(() => {
    if (!features) return null
    return features
      .map((f, i) => {
        const d = pathBuilder(f)
        if (!d) return null
        const alpha2 = f.alpha2
        const isVisited = alpha2 != null && visitedSet.has(alpha2)
        return { d, key: alpha2 ?? `idx-${i}`, name: f.properties?.name ?? '', isVisited }
      })
      .filter((p): p is { d: string; key: string; name: string; isVisited: boolean } => p !== null)
  }, [features, visitedSet])

  const showLoading = isLoading || (!features && !loadError)

  return (
    <div className={styles.container} onMouseLeave={() => setTooltip(null)}>
      {showLoading && <div className={styles.statusOverlay}>Loading map…</div>}
      {loadError && <div className={styles.statusOverlay}>Map unavailable</div>}

      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        role="img"
        aria-label="World map of visited countries"
        onMouseMove={(e) => {
          if (!tooltip) return
          const rect = e.currentTarget.getBoundingClientRect()
          setTooltip((t) => (t ? { ...t, x: e.clientX - rect.left, y: e.clientY - rect.top } : t))
        }}
      >
        <rect
          x={0}
          y={0}
          width={VIEWBOX_WIDTH}
          height={VIEWBOX_HEIGHT}
          className={styles.ocean}
        />
        {paths?.map(({ d, key, name, isVisited }) => (
          <path
            key={key}
            d={d}
            className={`${styles.country} ${isVisited ? styles.visited : ''}`}
            onMouseEnter={(e) => {
              const rect = e.currentTarget.ownerSVGElement?.getBoundingClientRect()
              if (!rect) return
              setTooltip({ x: e.clientX - rect.left, y: e.clientY - rect.top, name })
            }}
            onMouseLeave={() => setTooltip(null)}
          />
        ))}
      </svg>

      {tooltip && (
        <div
          className={styles.tooltip}
          style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          role="presentation"
        >
          {tooltip.name}
        </div>
      )}
    </div>
  )
}
