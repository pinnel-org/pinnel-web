import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { tripsApi } from '@/api/trips'
import { UpdateUserDto } from '@/types'
import { useAuthStore } from '@/store/authStore'

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
