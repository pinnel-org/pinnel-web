import { apiClient } from './client'
import { TripDetailPin } from '@/types'

export const tripDetailPinsApi = {
  /** GET /api/trip-details/{detailId}/pins */
  list: (detailId: number) =>
    apiClient.get<TripDetailPin[]>(`/trip-details/${detailId}/pins`).then((r) => r.data),

  /** POST /api/trip-details/{detailId}/pins */
  add: (detailId: number, data: { pinId: number; pinOrder?: number; visitTime?: string; budget?: number }) =>
    apiClient.post<TripDetailPin>(`/trip-details/${detailId}/pins`, data).then((r) => r.data),

  /** DELETE /api/trip-detail-pins/{id} */
  delete: (pinEntryId: number) =>
    apiClient.delete(`/trip-detail-pins/${pinEntryId}`),
}
