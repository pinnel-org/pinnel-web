import { create } from 'zustand'

interface MapStore {
  center: [number, number]
  zoom: number
  selectedPlaceId: string | null
  setCenter: (center: [number, number]) => void
  setZoom: (zoom: number) => void
  setSelectedPlaceId: (id: string | null) => void
}

export const useMapStore = create<MapStore>((set) => ({
  center: [48.8566, 2.3522],
  zoom: 13,
  selectedPlaceId: null,
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setSelectedPlaceId: (id) => set({ selectedPlaceId: id }),
}))
