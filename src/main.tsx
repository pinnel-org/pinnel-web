import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { App } from './App'
import { useAuthStore } from './store/authStore'
import './styles/globals.css'

// Module-level listener — never cleaned up by React, fires reliably on bfcache restore.
// When the browser navigates back to a page from bfcache, pageshow fires with persisted=true.
// We re-sync auth state so the UI reflects what's actually in localStorage.
window.addEventListener('pageshow', (e) => {
  if ((e as PageTransitionEvent).persisted) {
    useAuthStore.getState().syncFromStorage()
  }
})

const queryClient = new QueryClient()
const container = document.getElementById('root')!
createRoot(container).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
