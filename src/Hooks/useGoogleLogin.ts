import { useRef, useState, useEffect } from 'react'

// Google OAuth Response Types
interface TokenResponse {
  access_token: string
  authuser?: string
  expires_in: number
  prompt: string
  scope: string
  token_type: string
  error?: string
  error_description?: string
  error_uri?: string
}

interface ErrorResponse {
  type: string
  message?: string
}

interface TokenClient {
  requestAccessToken: (config?: { prompt?: string }) => void
}

interface GoogleAccounts {
  oauth2: {
    initTokenClient: (config: {
      client_id: string | number
      scope: string
      callback: (response: TokenResponse) => void
      error_callback?: (error: ErrorResponse) => void
    }) => TokenClient
  }
}

declare global {
  interface Window {
    google?: {
      accounts?: GoogleAccounts
    }
  }
}

interface UseGoogleLoginOptions {
  onSuccess?: (response: TokenResponse) => void
  onError?: (error: TokenResponse) => void
  onNonOAuthError?: (error: ErrorResponse) => void
}

function useLoadGsiScript() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    const scriptTag = document.createElement('script')
    scriptTag.src = 'https://accounts.google.com/gsi/client'
    scriptTag.async = true
    scriptTag.defer = true
    scriptTag.onload = () => {
      setIsScriptLoaded(true)
    }
    scriptTag.onerror = () => {
      setIsScriptLoaded(false)
    }

    document.body.appendChild(scriptTag)

    return () => {
      document.body.removeChild(scriptTag)
    }
  }, [])

  return isScriptLoaded
}

function useGoogleLogin(options: UseGoogleLoginOptions) {
  const { onError, onSuccess, onNonOAuthError } = options

  const clientRef = useRef<TokenClient | null>(null)
  const onErrorRef = useRef(onError)
  const onSuccessRef = useRef(onSuccess)
  const onNonOAuthErrorRef = useRef(onNonOAuthError)

  const isScriptLoaded = useLoadGsiScript()

  useEffect(() => {
    if (!isScriptLoaded) return

    if (window.google?.accounts?.oauth2) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: '1075571822700-qgpstiaffn0o2b5n4r8eku6rfifmorrb.apps.googleusercontent.com',
        scope: 'openid profile email',
        callback: (response: TokenResponse) => {
          if (response.error) {
            if (onErrorRef.current) onErrorRef.current(response)
            return
          }
          if (onSuccessRef.current) onSuccessRef.current(response)
        },
        error_callback: (nonOAuthError: ErrorResponse) => {
          if (onNonOAuthErrorRef.current)
            onNonOAuthErrorRef.current(nonOAuthError)
        },
      })
      clientRef.current = client
    }
  }, [isScriptLoaded])

  const handleLoginImplicit = (config?: { prompt?: string }) =>
    clientRef.current?.requestAccessToken(config)

  return handleLoginImplicit
}

export default useGoogleLogin
