import { apiClient } from './client'
import { TripSummary, CreateTripDto } from '@/types'

// PUT /api/trips/{id} is a strict-replace — all fields required.
// addPin / removePin build the full payload from the existing trip.
const buildUpdatePayload = (trip: TripSummary, pinIds: number[]): CreateTripDto => ({
  name: trip.name,
  budget: trip.budget ?? undefined,
  cityIds: trip.cityIds,
  pinIds,
  days: trip.days,
})

export const tripsApi = {
  getTrip: (id: number) =>
    apiClient.get<TripSummary>(`/trips/${id}`).then((r) => r.data),

  getTripBySlug: (slug: string) =>
    apiClient.get<TripSummary>(`/trips/slug/${slug}`).then((r) => r.data),

  getUserTrips: () =>
    apiClient.get<TripSummary[]>('/trips').then((r) => r.data),

  createTrip: (data: CreateTripDto) =>
    apiClient.post<TripSummary>('/trips', data).then((r) => r.data),

  updateTrip: (id: number, data: CreateTripDto) =>
    apiClient.put<TripSummary>(`/trips/${id}`, data).then((r) => r.data),

  deleteTrip: (id: number) =>
    apiClient.delete(`/trips/${id}`),

  addPin: (trip: TripSummary, pinId: number) => {
    const pinIds = [...new Set([...(trip.pinIds ?? []), pinId])]
    return apiClient.put<TripSummary>(`/trips/${trip.id}`, buildUpdatePayload(trip, pinIds)).then((r) => r.data)
  },

  removePin: (trip: TripSummary, pinId: number) => {
    const pinIds = (trip.pinIds ?? []).filter((id) => id !== pinId)
    return apiClient.put<TripSummary>(`/trips/${trip.id}`, buildUpdatePayload(trip, pinIds)).then((r) => r.data)
  },
}
