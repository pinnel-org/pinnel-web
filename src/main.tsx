import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import { useAuthStore } from './store/authStore'
import './styles/globals.css'

if (!localStorage.getItem('cognitoId')) {
  useAuthStore.getState().setCognitoSession({
    cognitoId: 'dev-user-001',
    email: 'dev@pinnel.app',
    username: 'devuser',
  })
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
