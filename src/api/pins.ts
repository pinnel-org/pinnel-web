import { apiClient } from './client'
import { Pin } from '@/types'

export const pinsApi = {
  getPinsByCity: (cityId: number) =>
    apiClient.get<Pin[]>('/pins', { params: { cityId } }).then((r) => r.data),

  getPin: (id: number) =>
    apiClient.get<Pin>(`/pins/${id}`).then((r) => r.data),
}
