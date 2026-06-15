import { apiClient } from './client'
import { Pin } from '@/types'

export const pinsApi = {
  getPinsByCity: (cityId: number) =>
    apiClient.get<Pin[]>('/pins', { params: { cityId } }).then((r) => r.data),

  getPin: (id: number) =>
    apiClient.get<Pin>(`/pins/${id}`).then((r) => r.data),

  // YouTube video ids for short clips about the pin ("feel the vibe" reel).
  // 404 → no shorts / pin not visible; 502 → YouTube upstream failure.
  getPinShorts: (id: number) =>
    apiClient.get<string[]>(`/pins/${id}/shorts`).then((r) => r.data),
}
