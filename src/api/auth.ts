import { apiClient } from './client'
import { User } from '@/types'

interface LoginDto {
  email: string
  password: string
}

interface AuthResponse {
  token: string
  user: User
}

export const authApi = {
  login: (data: LoginDto) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  register: (data: LoginDto & { name: string }) =>
    apiClient.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  me: () =>
    apiClient.get<User>('/auth/me').then((r) => r.data),
}
