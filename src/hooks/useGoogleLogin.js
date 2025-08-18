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

    if (window.google?.accounts?.oauth2) {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id:
          '1075571822700-qgpstiaffn0o2b5n4r8eku6rfifmorrb.apps.googleusercontent.com',
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
    clientRef.current?.requestAccessToken(config)

  return handleLoginImplicit
}

export default useGoogleLogin
