import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { tripsApi } from '@/api/trips'
import { UpdateUserDto, CreateTripDto, TripSummary, CityDto } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { apiClient } from '@/api/client'

export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ['me'],
    queryFn: usersApi.getMe,
    enabled: isAuthenticated,
  })
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserDto) => usersApi.updateMe(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  })
}

export const useMyTrips = () =>
  useQuery({
    queryKey: ['trips', 'me'],
    queryFn: tripsApi.getUserTrips,
  })

export const useCreateTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateTripDto) => tripsApi.createTrip(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips', 'me'] }),
  })
}

export const useDeleteTrip = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => tripsApi.deleteTrip(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips', 'me'] }),
  })
}

export const useTrip = (id: number) =>
  useQuery({
    queryKey: ['trip', id],
    queryFn: () => apiClient.get<TripSummary>(`/trips/${id}`).then((r) => r.data),
    enabled: !!id,
    gcTime: 0,
  })

export const useCity = (id: number | undefined) =>
  useQuery({
    queryKey: ['city', id],
    queryFn: () => apiClient.get<CityDto>(`/cities/${id}`).then((r) => r.data),
    enabled: !!id,
  })

export const useAddPinToTrip = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ trip, pinId }: { trip: TripSummary; pinId: number }) =>
      tripsApi.addPin(trip, pinId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trip', tripId] }),
  })
}

export const useRemovePinFromTrip = (tripId: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ trip, pinId }: { trip: TripSummary; pinId: number }) =>
      tripsApi.removePin(trip, pinId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trip', tripId] }),
  })
}
