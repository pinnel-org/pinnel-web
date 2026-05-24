import axios from 'axios'

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

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (import.meta.env.DEV) {
      const url: string = error.config?.url ?? ''
      if (/\/trips\/1$/.test(url)) {
        return Promise.resolve({
          data: { id: 1, name: 'Milan Weekend', budget: 150, userId: 1, cityIds: [1], pinIds: [], createdAt: '2026-05-24T00:00:00Z', updatedAt: '2026-05-24T00:00:00Z' },
          status: 200, statusText: 'OK', headers: {}, config: error.config,
        })
      }
      if (/\/cities\/1$/.test(url)) {
        return Promise.resolve({
          data: { id: 1, name: 'Milan', country: 'IT', latitude: 45.4642, longitude: 9.19, population: 1350000 },
          status: 200, statusText: 'OK', headers: {}, config: error.config,
        })
      }
    }
    if (error.response?.status === 401) window.location.href = '/'
    return Promise.reject(error)
  }
)
