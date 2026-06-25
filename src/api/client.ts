import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/store/authStore'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const idToken = localStorage.getItem('idToken')
  const cognitoId = localStorage.getItem('cognitoId')
  const cognitoEmail = localStorage.getItem('cognitoEmail')
  const cognitoUsername = localStorage.getItem('cognitoUsername')
  if (idToken) config.headers.Authorization = `Bearer ${idToken}`
  if (cognitoId) {
    config.headers['X-Cognito-Id'] = cognitoId
    config.headers['X-Cognito-Email'] = cognitoEmail ?? ''
    config.headers['X-Cognito-Username'] = cognitoUsername ?? ''
  }
  return config
})

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

const drainQueue = (token: string) => {
  refreshQueue.forEach((resolve) => resolve(token))
  refreshQueue = []
}

const refreshIdToken = async (): Promise<string> => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) throw new Error('No refresh token')

  const domain = import.meta.env.VITE_COGNITO_DOMAIN as string
  const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string

  const res = await fetch(`https://${domain}/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      refresh_token: refreshToken,
    }).toString(),
  })

  if (!res.ok) throw new Error(`Token refresh failed: ${res.status}`)

  const data = await res.json() as { id_token: string }
  useAuthStore.getState().updateIdToken(data.id_token)
  return data.id_token
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (import.meta.env.DEV) {
      const url: string = originalRequest?.url ?? ''
      if (/\/trips\/1$/.test(url)) {
        return Promise.resolve({
          data: { id: 1, name: 'Milan Weekend', budget: 150, userId: 1, coverImageUrl: null, createdAt: '2026-05-24T00:00:00Z', updatedAt: '2026-05-24T00:00:00Z' },
          status: 200, statusText: 'OK', headers: {}, config: originalRequest,
        })
      }
      if (/\/cities\/1$/.test(url)) {
        return Promise.resolve({
          data: { id: 1, name: 'Milan', country: 'IT', latitude: 45.4642, longitude: 9.19, population: 1350000 },
          status: 200, statusText: 'OK', headers: {}, config: originalRequest,
        })
      }
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise<string>((resolve) => {
          refreshQueue.push(resolve)
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return apiClient(originalRequest)
        })
      }

      isRefreshing = true
      try {
        const newToken = await refreshIdToken()
        isRefreshing = false
        drainQueue(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return apiClient(originalRequest)
      } catch {
        isRefreshing = false
        refreshQueue = []
        useAuthStore.getState().logout()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)
