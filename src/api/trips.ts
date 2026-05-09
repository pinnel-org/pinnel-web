import { apiClient } from './client'
import { Trip, CreateTripDto } from '@/types'

export const tripsApi = {
  getTrip: (id: string) =>
    apiClient.get<Trip>(`/trips/${id}`).then((r) => r.data),

  getTripBySlug: (slug: string) =>
    apiClient.get<Trip>(`/trips/slug/${slug}`).then((r) => r.data),

  getUserTrips: () =>
    apiClient.get<Trip[]>('/trips/me').then((r) => r.data),

  searchTrips: (city: string, mood?: string) =>
    apiClient.get<Trip[]>('/trips', { params: { city, mood } }).then((r) => r.data),

  createTrip: (data: CreateTripDto) =>
    apiClient.post<Trip>('/trips', data).then((r) => r.data),

  updateTrip: (id: string, data: Partial<CreateTripDto>) =>
    apiClient.patch<Trip>(`/trips/${id}`, data).then((r) => r.data),

  deleteTrip: (id: string) =>
    apiClient.delete(`/trips/${id}`),

  cloneTrip: (id: string) =>
    apiClient.post<Trip>(`/trips/${id}/clone`).then((r) => r.data),

  publishTrip: (id: string) =>
    apiClient.patch<Trip>(`/trips/${id}/publish`).then((r) => r.data),

  finalizeRoute: (id: string) =>
    apiClient.post<Trip>(`/trips/${id}/finalize`).then((r) => r.data),
}
