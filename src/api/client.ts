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
    if (error.response?.status === 401) window.location.href = '/'
    return Promise.reject(error)
  }
)
