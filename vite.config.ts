import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { execSync } from 'child_process'

const appVersion = (() => {
  try { return execSync('git rev-parse --short HEAD').toString().trim() }
  catch { return String(Date.now()) }
})()

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
})
