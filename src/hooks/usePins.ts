import { useQuery } from '@tanstack/react-query'
import { pinsApi } from '@/api/pins'

export const usePins = (cityId: number | undefined) =>
  useQuery({
    queryKey: ['pins', cityId],
    queryFn: () => pinsApi.getPinsByCity(cityId!),
    enabled: !!cityId,
    staleTime: 5 * 60 * 1000, // 5 min — curated pins rarely change
  })
