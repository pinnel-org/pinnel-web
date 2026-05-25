const LS_APP_VERSION = 'appVersion'
const AUTH_KEYS = ['cognitoId', 'cognitoEmail', 'cognitoUsername', 'idToken'] as const

const clearAuthState = () => {
  AUTH_KEYS.forEach((key) => localStorage.removeItem(key))
}

export const sanitizeAuthState = () => {
  const storedVersion = localStorage.getItem(LS_APP_VERSION)

  // New deploy detected — clear stale auth state and reload to home
  if (storedVersion !== __APP_VERSION__) {
    clearAuthState()
    localStorage.setItem(LS_APP_VERSION, __APP_VERSION__)
    // storedVersion === null means first visit, no redirect needed
    if (storedVersion !== null) {
      window.location.replace('/')
    }
    return
  }

  // Version matches — validate that auth state is internally consistent
  const cognitoId = localStorage.getItem('cognitoId')
  if (cognitoId) {
    const isValid = AUTH_KEYS.every((key) => {
      const val = localStorage.getItem(key)
      return typeof val === 'string' && val.length > 0
    })
    if (!isValid) clearAuthState()
  }
}
