import { apiClient } from './client'
import { TripSummary, CreateTripDto } from '@/types'

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
}
