// Generates src/components/WorldMap/de-jure-110m.json from world-atlas.
// Natural Earth (the upstream source for world-atlas) shows Crimea as part of
// Russia. Pinnel follows the de jure / UN convention: Crimea belongs to Ukraine.
// Run: node scripts/build-de-jure-topology.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const SRC = resolve(__dirname, '../node_modules/world-atlas/countries-110m.json')
const OUT = resolve(__dirname, '../src/components/WorldMap/de-jure-110m.json')

const RUSSIA_ID = '643'
const UKRAINE_ID = '804'
// In countries-110m.json, Russia's MultiPolygon has 12 sub-polygons; index 11
// is the Crimean peninsula (bbox 32.5–36.5°E, 44.4–46.2°N). Verified by point-
// in-polygon test against (34.55, 45.0).
const CRIMEA_POLYGON_INDEX = 11
const CRIMEA_BBOX = { minLng: 32.5, minLat: 44.4, maxLng: 36.5, maxLat: 46.2 }

const topo = JSON.parse(readFileSync(SRC, 'utf8'))
const geometries = topo.objects.countries.geometries
const russia = geometries.find((g) => g.id === RUSSIA_ID)
const ukraine = geometries.find((g) => g.id === UKRAINE_ID)
if (!russia || !ukraine) throw new Error('Russia or Ukraine not found in topology')
if (russia.type !== 'MultiPolygon') throw new Error(`Russia is ${russia.type}, expected MultiPolygon`)

// Sanity check: confirm the polygon at CRIMEA_POLYGON_INDEX is actually Crimea
// by reconstructing its bbox from the referenced arcs. If world-atlas ever
// reorders polygons, this will fail loudly instead of silently mis-assigning.
const bbox = computeBbox(topo, russia.arcs[CRIMEA_POLYGON_INDEX])
const matches =
  bbox.minLng >= CRIMEA_BBOX.minLng - 0.5 && bbox.maxLng <= CRIMEA_BBOX.maxLng + 0.5 &&
  bbox.minLat >= CRIMEA_BBOX.minLat - 0.5 && bbox.maxLat <= CRIMEA_BBOX.maxLat + 0.5
if (!matches) {
  throw new Error(
    `Russia polygon[${CRIMEA_POLYGON_INDEX}] bbox ${JSON.stringify(bbox)} does not match Crimea — topology may have changed.`,
  )
}

const crimeaArcs = russia.arcs[CRIMEA_POLYGON_INDEX]
russia.arcs.splice(CRIMEA_POLYGON_INDEX, 1)

// Promote Ukraine from Polygon to MultiPolygon and append Crimea as a second polygon.
if (ukraine.type === 'Polygon') {
  ukraine.type = 'MultiPolygon'
  ukraine.arcs = [ukraine.arcs, crimeaArcs]
} else {
  ukraine.arcs.push(crimeaArcs)
}

writeFileSync(OUT, JSON.stringify(topo))
console.log(`Wrote ${OUT}`)

function computeBbox(topology, polygonArcs) {
  const transform = topology.transform
  let minLng = Infinity, minLat = Infinity, maxLng = -Infinity, maxLat = -Infinity
  for (const ringArcs of polygonArcs) {
    for (const arcIdx of ringArcs) {
      const idx = arcIdx < 0 ? ~arcIdx : arcIdx
      let x = 0, y = 0
      for (const delta of topology.arcs[idx]) {
        x += delta[0]
        y += delta[1]
        const lng = x * transform.scale[0] + transform.translate[0]
        const lat = y * transform.scale[1] + transform.translate[1]
        if (lng < minLng) minLng = lng
        if (lng > maxLng) maxLng = lng
        if (lat < minLat) minLat = lat
        if (lat > maxLat) maxLat = lat
      }
    }
  }
  return { minLng, minLat, maxLng, maxLat }
}
