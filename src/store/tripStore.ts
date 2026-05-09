import { create } from 'zustand'
import { Trip, Place } from '@/types'

interface TripStore {
  currentTrip: Trip | null
  places: Place[]
  isDirty: boolean
  isLoading: boolean
  setCurrentTrip: (trip: Trip | null) => void
  addPlace: (place: Place) => void
  removePlace: (placeId: string) => void
  updatePlace: (placeId: string, updates: Partial<Place>) => void
  reorderPlaces: (places: Place[]) => void
  clearTrip: () => void
}

export const useTripStore = create<TripStore>((set) => ({
  currentTrip: null,
  places: [],
  isDirty: false,
  isLoading: false,
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  addPlace: (place) => set((s) => ({ places: [...s.places, place], isDirty: true })),
  removePlace: (id) => set((s) => ({ places: s.places.filter((p) => p.id !== id), isDirty: true })),
  updatePlace: (id, updates) => set((s) => ({
    places: s.places.map((p) => p.id === id ? { ...p, ...updates } : p),
    isDirty: true,
  })),
  reorderPlaces: (places) => set({ places, isDirty: true }),
  clearTrip: () => set({ currentTrip: null, places: [], isDirty: false }),
}))
