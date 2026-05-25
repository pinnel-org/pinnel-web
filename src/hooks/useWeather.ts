import { useQuery } from '@tanstack/react-query'
import { fetchWeather } from '@/api/weather'

export const useWeather = (lat: number | undefined, lng: number | undefined) =>
  useQuery({
    queryKey: ['weather', lat, lng],
    queryFn: () => fetchWeather(lat!, lng!),
    enabled: lat != null && lng != null,
    staleTime: 1000 * 60 * 30, // 30 min — weather doesn't change that fast
  })
