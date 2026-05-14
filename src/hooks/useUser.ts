import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { UpdateUserDto } from '@/types'

export const useCurrentUser = () =>
  useQuery({
    queryKey: ['me'],
    queryFn: usersApi.getMe,
  })

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUserDto) => usersApi.updateMe(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
  })
}
