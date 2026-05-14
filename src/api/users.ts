import { apiClient } from './client'
import { User, UpdateUserDto } from '@/types'

export const usersApi = {
  getMe: () =>
    apiClient.get<User>('/me').then((r) => r.data),

  updateMe: (data: UpdateUserDto) =>
    apiClient.put<User>('/me', data).then((r) => r.data),
}
