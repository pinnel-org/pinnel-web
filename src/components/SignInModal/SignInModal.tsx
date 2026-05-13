import { useEffect } from 'react'
import styles from './SignInModal.module.css'

interface SignInModalProps {
  onClose: () => void
}

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

export const SignInModal = ({ onClose }: SignInModalProps) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const handleGoogleSignIn = () => {
    const userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID ?? ''
    const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID ?? ''
    const region = userPoolId.split('_')[0] ?? 'eu-central-1'
    const domain = import.meta.env.VITE_COGNITO_DOMAIN
    const redirectUri = encodeURIComponent(window.location.origin + '/dashboard')

    if (domain) {
      window.location.href = `https://${domain}/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}&scope=email+openid+profile`
    } else if (userPoolId && clientId) {
      window.location.href = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/oauth2/authorize?identity_provider=Google&redirect_uri=${redirectUri}&response_type=code&client_id=${clientId}&scope=email+openid+profile`
    } else {
      // Dev fallback — log intent
      console.info('[SignIn] Google OAuth — Cognito env vars not configured yet')
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close sign-in modal">
          ✕
        </button>

        <div className={styles.content}>
          <div className={styles.logoRow}>
            <svg width="20" height="26" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 0C6.268 0 0 6.268 0 14c0 9.941 14 22 14 22S28 23.941 28 14C28 6.268 21.732 0 14 0z"
                fill="#c8ff57"
              />
              <circle cx="14" cy="14" r="5" fill="#0f0f0f" />
            </svg>
            <span className={styles.logoName}>pinnel</span>
          </div>

          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>
            Sign in to plan, save and share trips.
          </p>

          <button className={styles.googleBtn} onClick={handleGoogleSignIn}>
            <GoogleIcon />
            <span>Continue with Google</span>
          </button>

          <p className={styles.terms}>
            By signing in you agree to our{' '}
            <a href="#" className={styles.link}>Terms</a>
            {' '}and{' '}
            <a href="#" className={styles.link}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
