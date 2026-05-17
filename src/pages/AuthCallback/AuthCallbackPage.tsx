import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import styles from './AuthCallbackPage.module.css'

interface CognitoIdTokenPayload {
  sub: string
  email: string
  'cognito:username'?: string
}

const decodeIdToken = (idToken: string): CognitoIdTokenPayload => {
  const base64 = idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
  return JSON.parse(atob(base64)) as CognitoIdTokenPayload
}

export const AuthCallbackPage = () => {
  const navigate = useNavigate()
  const setCognitoSession = useAuthStore((s) => s.setCognitoSession)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const errorParam = params.get('error')
    const errorDescription = params.get('error_description')

    if (errorParam) {
      setError(`Cognito error: ${errorParam} — ${errorDescription ?? ''}`)
      return
    }

    if (!code) {
      setError('No authorization code in URL. Expected ?code=... from Cognito.')
      return
    }

    const exchangeCode = async () => {
      const codeVerifier = sessionStorage.getItem('pkce_code_verifier')
      sessionStorage.removeItem('pkce_code_verifier')

      const domain = import.meta.env.VITE_COGNITO_DOMAIN as string
      const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID as string
      const redirectUri = window.location.origin + '/auth/callback'

      if (!domain || !clientId) {
        setError(`Missing env vars — VITE_COGNITO_DOMAIN: "${domain}", VITE_COGNITO_CLIENT_ID: "${clientId}"`)
        return
      }

      const body = new URLSearchParams({ grant_type: 'authorization_code', code, client_id: clientId, redirect_uri: redirectUri })
      if (codeVerifier) body.set('code_verifier', codeVerifier)

      const res = await fetch(`https://${domain}/oauth2/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })

      if (!res.ok) {
        const text = await res.text()
        setError(`Token exchange failed — ${res.status} ${res.statusText}: ${text}`)
        return
      }

      const tokens = await res.json() as { id_token: string }
      const payload = decodeIdToken(tokens.id_token)

      setCognitoSession({
        cognitoId: payload.sub,
        email: payload.email,
        username: payload['cognito:username'] ?? payload.email,
      })

      navigate('/profile', { replace: true })
    }

    exchangeCode().catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : String(e)
      setError(`Unexpected error: ${msg}`)
    })
  }, [navigate, setCognitoSession])

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.errorBox}>
          <p className={styles.errorTitle}>Sign-in failed</p>
          <pre className={styles.errorDetail}>{error}</pre>
          <button className={styles.backBtn} onClick={() => navigate('/')}>Back to home</button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <p className={styles.message}>Signing in…</p>
    </div>
  )
}
