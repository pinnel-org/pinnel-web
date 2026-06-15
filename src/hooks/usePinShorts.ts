import { useQuery } from '@tanstack/react-query'
import { pinsApi } from '@/api/pins'

// Fetches YouTube short video ids for a pin. The backend returns 404 when a pin
// has no shorts and 502 on a YouTube upstream failure — both are deterministic,
// so we don't retry. The consuming component reads the error status to tell the
// "no vibes yet" (404) case apart from "couldn't load" (502).
export const usePinShorts = (pinId: number | undefined) =>
  useQuery({
    queryKey: ['pinShorts', pinId],
    queryFn: () => pinsApi.getPinShorts(pinId!),
    enabled: !!pinId,
    retry: false,
    staleTime: 30 * 60 * 1000, // 30 min — shorts for a place rarely change
  })
