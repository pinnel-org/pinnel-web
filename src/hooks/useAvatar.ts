import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { usersApi } from '@/api/users'
import { useAuthStore } from '@/store/authStore'

const AVATAR_KEY = ['avatar', 'me'] as const

export const useAvatar = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const query = useQuery({
    queryKey: AVATAR_KEY,
    queryFn: usersApi.getAvatarBlob,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
  })

  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!query.data) {
      setUrl(null)
      return
    }
    const objectUrl = URL.createObjectURL(query.data)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [query.data])

  return { url, isLoading: query.isLoading }
}

export const useUploadAvatar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (blob: Blob) => usersApi.uploadAvatar(blob),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AVATAR_KEY }),
  })
}

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => usersApi.deleteAvatar(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AVATAR_KEY }),
  })
}
