import { useQuery } from '@tanstack/react-query'
import { visitedCountriesApi } from '@/api/visitedCountries'
import { useAuthStore } from '@/store/authStore'

export const useVisitedCountries = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['visitedCountries', 'me'],
    queryFn: visitedCountriesApi.getMine,
    enabled: isAuthenticated,
  })
}
