import { useRef, useState, useEffect } from 'react'

function useFbLogin({ onSuccess, onError }) {
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
      if (onErrorRef.current) {
        onErrorRef.current({ error: 'Failed to load Facebook SDK' })
      }
    }

    document.body.appendChild(scriptTag)

    return () => {
      if (scriptTag.parentNode) {
        scriptTag.parentNode.removeChild(scriptTag)
      }
    }
  }, [])

  useEffect(() => {
    if (!isScriptLoaded) {
      return
    }
    if (window.FB) {
      window.FB.init({
        appId: '1182224963594912',
        cookie: true,
        xfbml: true,
        version: 'v10.0',
      })
    }
  }, [isScriptLoaded])

  const handleFbLogin = (config = {}) => {
    if (!isScriptLoaded || !window.FB) {
      if (onErrorRef.current) {
        onErrorRef.current({ error: 'Facebook SDK not loaded' })
      }
      return
    }

    window.FB.login(
      (response) => {
        if (response.status === 'connected') {
          if (onSuccessRef.current) {
            onSuccessRef.current(response)
          }
        } else if (onErrorRef.current) {
          onErrorRef.current(response)
        }
      },
      { scope: 'public_profile,email', ...config },
    )
  }

  return handleFbLogin
}

export default useFbLogin
