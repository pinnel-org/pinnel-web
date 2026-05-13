import { create } from 'zustand'

interface CognitoSession {
  cognitoId: string
  cognitoEmail: string
  cognitoUsername: string
}

interface AuthStore {
  cognitoId: string | null
  cognitoEmail: string | null
  cognitoUsername: string | null
  isAuthenticated: boolean
  setCognitoSession: (session: { cognitoId: string; email: string; username: string }) => void
  logout: () => void
}

const LS_COGNITO_ID = 'cognitoId'
const LS_COGNITO_EMAIL = 'cognitoEmail'
const LS_COGNITO_USERNAME = 'cognitoUsername'

export const useAuthStore = create<AuthStore>((set) => ({
  cognitoId: localStorage.getItem(LS_COGNITO_ID),
  cognitoEmail: localStorage.getItem(LS_COGNITO_EMAIL),
  cognitoUsername: localStorage.getItem(LS_COGNITO_USERNAME),
  isAuthenticated: !!localStorage.getItem(LS_COGNITO_ID),

  setCognitoSession: ({ cognitoId, email, username }) => {
    localStorage.setItem(LS_COGNITO_ID, cognitoId)
    localStorage.setItem(LS_COGNITO_EMAIL, email)
    localStorage.setItem(LS_COGNITO_USERNAME, username)
    set({ cognitoId, cognitoEmail: email, cognitoUsername: username, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem(LS_COGNITO_ID)
    localStorage.removeItem(LS_COGNITO_EMAIL)
    localStorage.removeItem(LS_COGNITO_USERNAME)
    set({ cognitoId: null, cognitoEmail: null, cognitoUsername: null, isAuthenticated: false })
  },
}))
