import { apiClient } from './client'

// GET /api/me/countries — returns ISO 3166-1 alpha-2 codes (e.g. ['CN', 'TR', 'BR']).
export const visitedCountriesApi = {
  getMine: () => apiClient.get<string[]>('/me/countries').then((r) => r.data),
}
