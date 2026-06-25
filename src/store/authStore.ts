import { create } from 'zustand'

interface AuthStore {
  cognitoId: string | null
  cognitoEmail: string | null
  cognitoUsername: string | null
  idToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setCognitoSession: (session: {
    cognitoId: string
    email: string
    username: string
    idToken: string
    refreshToken: string
  }) => void
  updateIdToken: (idToken: string) => void
  logout: () => void
}

const LS_COGNITO_ID = 'cognitoId'
const LS_COGNITO_EMAIL = 'cognitoEmail'
const LS_COGNITO_USERNAME = 'cognitoUsername'
const LS_ID_TOKEN = 'idToken'
const LS_REFRESH_TOKEN = 'refreshToken'

export const useAuthStore = create<AuthStore>((set) => ({
  cognitoId: localStorage.getItem(LS_COGNITO_ID),
  cognitoEmail: localStorage.getItem(LS_COGNITO_EMAIL),
  cognitoUsername: localStorage.getItem(LS_COGNITO_USERNAME),
  idToken: localStorage.getItem(LS_ID_TOKEN),
  refreshToken: localStorage.getItem(LS_REFRESH_TOKEN),
  isAuthenticated: !!localStorage.getItem(LS_COGNITO_ID),

  setCognitoSession: ({ cognitoId, email, username, idToken, refreshToken }) => {
    localStorage.setItem(LS_COGNITO_ID, cognitoId)
    localStorage.setItem(LS_COGNITO_EMAIL, email)
    localStorage.setItem(LS_COGNITO_USERNAME, username)
    localStorage.setItem(LS_ID_TOKEN, idToken)
    localStorage.setItem(LS_REFRESH_TOKEN, refreshToken)
    set({ cognitoId, cognitoEmail: email, cognitoUsername: username, idToken, refreshToken, isAuthenticated: true })
  },

  updateIdToken: (idToken) => {
    localStorage.setItem(LS_ID_TOKEN, idToken)
    set({ idToken })
  },

  logout: () => {
    localStorage.removeItem(LS_COGNITO_ID)
    localStorage.removeItem(LS_COGNITO_EMAIL)
    localStorage.removeItem(LS_COGNITO_USERNAME)
    localStorage.removeItem(LS_ID_TOKEN)
    localStorage.removeItem(LS_REFRESH_TOKEN)
    set({ cognitoId: null, cognitoEmail: null, cognitoUsername: null, idToken: null, refreshToken: null, isAuthenticated: false })

    const domain = import.meta.env.VITE_COGNITO_DOMAIN as string | undefined
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string | undefined
    if (domain && clientId) {
      const logoutUri = encodeURIComponent(window.location.origin)
      window.location.href = `https://${domain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`
    } else {
      window.location.href = '/'
    }
  },
}))
