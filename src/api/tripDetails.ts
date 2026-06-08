import { apiClient } from './client'
import { TripDetail } from '@/types'

export const tripDetailsApi = {
  /** GET /api/trips/{tripId}/trip-details/all — all details ordered by visitDate then cityOrder */
  listAll: (tripId: number) =>
    apiClient.get<TripDetail[]>(`/trips/${tripId}/trip-details/all`).then((r) => r.data),

  /** GET /api/trips/{tripId}/trip-details?date=YYYY-MM-DD */
  listByDate: (tripId: number, date: string) =>
    apiClient.get<TripDetail[]>(`/trips/${tripId}/trip-details`, { params: { date } }).then((r) => r.data),

  /** POST /api/trips/{tripId}/trip-details */
  create: (tripId: number, data: { visitDate: string; cityId: number; cityOrder?: number }) =>
    apiClient.post<TripDetail>(`/trips/${tripId}/trip-details`, data).then((r) => r.data),

  /** PUT /api/trip-details/{detailId}/city-order/{order} */
  reorder: (detailId: number, order: number) =>
    apiClient.put<TripDetail>(`/trip-details/${detailId}/city-order/${order}`).then((r) => r.data),

  /** DELETE /api/trip-details/{detailId} */
  delete: (detailId: number) =>
    apiClient.delete(`/trip-details/${detailId}`),

  /** DELETE /api/trips/{tripId}/trip-details?date=YYYY-MM-DD */
  deleteByDate: (tripId: number, date: string) =>
    apiClient.delete(`/trips/${tripId}/trip-details`, { params: { date } }),
}
