import { apiClient } from './client'
import { User, UpdateUserDto } from '@/types'

export const usersApi = {
  getMe: () =>
    apiClient.get<User>('/me').then((r) => r.data),

  updateMe: (data: UpdateUserDto) =>
    apiClient.put<User>('/me', data).then((r) => r.data),

  uploadAvatar: (blob: Blob) => {
    const fd = new FormData()
    fd.append('file', blob, 'avatar.jpg')
    return apiClient.post('/me/avatar', fd).then(() => undefined)
  },

  getAvatarBlob: () =>
    apiClient
      .get<Blob>('/me/avatar', { responseType: 'blob' })
      .then((r) => r.data)
      .catch((err) => {
        if (err?.response?.status === 404) return null
        throw err
      }),

  deleteAvatar: () => apiClient.delete('/me/avatar').then(() => undefined),
}
