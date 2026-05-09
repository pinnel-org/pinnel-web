import { apiClient } from './client'
import { Place, CreatePlaceDto } from '@/types'

export const placesApi = {
  getPlaces: (tripId: string) =>
    apiClient.get<Place[]>(`/trips/${tripId}/places`).then((r) => r.data),

  createPlace: (data: CreatePlaceDto) =>
    apiClient.post<Place>('/places', data).then((r) => r.data),

  updatePlace: (id: string, data: Partial<CreatePlaceDto>) =>
    apiClient.patch<Place>(`/places/${id}`, data).then((r) => r.data),

  deletePlace: (id: string) =>
    apiClient.delete(`/places/${id}`),

  reorderPlaces: (tripId: string, places: { id: string; orderIndex: number }[]) =>
    apiClient.patch(`/trips/${tripId}/places/reorder`, { places }).then((r) => r.data),
}
