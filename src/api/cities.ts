import { apiClient } from './client'
import { CityDto } from '@/types'

export const citiesApi = {
  search: (query: string) =>
    apiClient.get<CityDto[]>('/cities', { params: { search: query } }).then((r) => r.data),

  getById: (id: number) =>
    apiClient.get<CityDto>(`/cities/${id}`).then((r) => r.data),
}
