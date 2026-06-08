import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tripDetailsApi } from '@/api/tripDetails'
import { TripDetail } from '@/types'

export const useTripDetails = (tripId: number) =>
  useQuery({
    queryKey: ['tripDetails', tripId],
    queryFn: () => tripDetailsApi.listAll(tripId),
    enabled: !!tripId,
    gcTime: 0,
  })

export const useTripDetailsByDate = (tripId: number, date: string | undefined) =>
  useQuery({
    queryKey: ['tripDetails', tripId, date],
    queryFn: () => tripDetailsApi.listByDate(tripId, date!),
    enabled: !!tripId && !!date,
    gcTime: 0,
  })

export const useAddTripDetail = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: Pick<TripDetail, 'visitDate' | 'cityId'> & { cityOrder?: number }) =>
      tripDetailsApi.create(tripId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tripDetails', tripId] }),
  })
}

export const useReorderTripDetail = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ detailId, order }: { detailId: number; order: number }) =>
      tripDetailsApi.reorder(detailId, order),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tripDetails', tripId] }),
  })
}

export const useDeleteTripDetail = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (detailId: number) => tripDetailsApi.delete(detailId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tripDetails', tripId] }),
  })
}

export const useDeleteTripDetailsByDate = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (date: string) => tripDetailsApi.deleteByDate(tripId, date),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tripDetails', tripId] }),
  })
}
