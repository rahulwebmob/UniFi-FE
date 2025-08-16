import { useRef, useState, useEffect } from 'react'

// Facebook SDK Types
interface FBAuthResponse {
  accessToken: string
  data_access_expiration_time: number
  expiresIn: number
  graphDomain: string
  signedRequest: string
  userID: string
}

interface FBLoginResponse {
  authResponse?: FBAuthResponse
  status: 'connected' | 'not_authorized' | 'unknown'
}

interface FBLoginOptions {
  scope?: string
  auth_type?: string
  return_scopes?: boolean
  enable_profile_selector?: boolean
}

interface FBError {
  error: string
}

interface FacebookSDK {
  init: (params: {
    appId: string
    cookie?: boolean
    xfbml?: boolean
    version: string
  }) => void
  login: (
    callback: (response: FBLoginResponse) => void,
    options?: FBLoginOptions
  ) => void
}

declare global {
  interface Window {
    FB?: FacebookSDK
  }
}

interface UseFbLoginOptions {
  onSuccess?: (response: FBLoginResponse) => void
  onError?: (error: FBLoginResponse | FBError) => void
}

function useFbLogin({ onSuccess, onError }: UseFbLoginOptions) {
  const onErrorRef = useRef(onError)
  const onSuccessRef = useRef(onSuccess)

  const [isScriptLoaded, setIsScriptLoaded] = useState(false)

  useEffect(() => {
    if (document.getElementById('fb-jssdk')) {
      setIsScriptLoaded(true)
      return undefined
    }

    const scriptTag = document.createElement('script')
    scriptTag.id = 'fb-jssdk'
    scriptTag.src = 'https://connect.facebook.net/en_US/sdk.js'
    scriptTag.async = true
    scriptTag.defer = true
    scriptTag.onload = () => {
      setIsScriptLoaded(true)
    }
    scriptTag.onerror = () => {
      setIsScriptLoaded(false)
      if (onErrorRef.current)
        onErrorRef.current({ error: 'Failed to load Facebook SDK' })
    }

    document.body.appendChild(scriptTag)

    return () => {
      if (scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag)
      }
    }
  }, [])

  useEffect(() => {
    if (!isScriptLoaded) return
    if (window.FB) {
      window.FB.init({
        appId: '1182224963594912',
        cookie: true,
        xfbml: true,
        version: 'v10.0',
      })
    }
  }, [isScriptLoaded])

  const handleFbLogin = (config: FBLoginOptions = {}) => {
    if (!isScriptLoaded || !window.FB) {
      if (onErrorRef.current)
        onErrorRef.current({ error: 'Facebook SDK not loaded' })
      return
    }

    window.FB.login(
      (response: FBLoginResponse) => {
        if (response.status === 'connected') {
          if (onSuccessRef.current) onSuccessRef.current(response)
        } else if (onErrorRef.current) onErrorRef.current(response)
      },
      { scope: 'public_profile,email', ...config },
    )
  }

  return handleFbLogin
}

export default useFbLogin