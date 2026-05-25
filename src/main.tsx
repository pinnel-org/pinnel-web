import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import { sanitizeAuthState } from '@/utils/authStateGuard'
import './styles/globals.css'

if (import.meta.env.DEV) {
  // Seed dev auth so ProtectedRoute passes
  if (!localStorage.getItem('cognitoId')) {
    localStorage.setItem('cognitoId', 'dev-user-001')
    localStorage.setItem('cognitoEmail', 'dev@pinnel.app')
    localStorage.setItem('cognitoUsername', 'devuser')
  }
} else {
  sanitizeAuthState()
}

const queryClient = new QueryClient()
const container = document.getElementById('root')!
createRoot(container).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
