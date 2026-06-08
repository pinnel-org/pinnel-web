import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripDetailPinsApi } from '@/api/tripDetailPins'
import { TripDetailPin } from '@/types'

export const useTripDetailPins = (detailId: number | undefined) =>
  useQuery({
    queryKey: ['tripDetailPins', detailId],
    queryFn: () => tripDetailPinsApi.list(detailId!),
    enabled: !!detailId,
    gcTime: 0,
  })

export const useAddTripDetailPin = (detailId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Pick<TripDetailPin, 'pinId'> & { pinOrder?: number; visitTime?: string; budget?: number }) =>
      tripDetailPinsApi.add(detailId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tripDetailPins', detailId] }),
  })
}

export const useDeleteTripDetailPin = (detailId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pinEntryId: number) => tripDetailPinsApi.delete(pinEntryId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tripDetailPins', detailId] }),
  })
}
