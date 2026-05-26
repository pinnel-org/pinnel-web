import { apiClient } from './client'

export const visitedCountriesApi = {
  // TODO(#114): swap to real endpoint once pinnel-api ships `GET /me/visited-countries`.
  // Expected payload: ISO 3166-1 alpha-3 codes, e.g. ['USA', 'ITA', 'JPN'].
  getMine: async (): Promise<string[]> => {
    void apiClient
    return []
  },
}
