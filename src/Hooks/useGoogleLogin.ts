import { useRef, useState, useEffect } from 'react'

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

function useGoogleLogin(options) {
  const { onError, onSuccess, onNonOAuthError } = options

  const clientRef = useRef(null)
  const onErrorRef = useRef(onError)
  const onSuccessRef = useRef(onSuccess)
  const onNonOAuthErrorRef = useRef(onNonOAuthError)

  const isScriptLoaded = useLoadGsiScript()

  useEffect(() => {
    if (!isScriptLoaded) return

    if (
      window.google &&
      window.google.accounts &&
      window.google.accounts.oauth2
    ) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: 123,
        scope: 'openid profile email',
        callback: (response) => {
          if (response.error) {
            if (onErrorRef.current) onErrorRef.current(response)
            return
          }
          if (onSuccessRef.current) onSuccessRef.current(response)
        },
        error_callback: (nonOAuthError) => {
          if (onNonOAuthErrorRef.current)
            onNonOAuthErrorRef.current(nonOAuthError)
        },
      })
      clientRef.current = client
    }
  }, [isScriptLoaded])

  const handleLoginImplicit = (config) =>
    clientRef.current && clientRef.current.requestAccessToken(config)

  return handleLoginImplicit
}

export default useGoogleLogin
