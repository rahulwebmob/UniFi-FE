import { uniqueId } from 'lodash'
import { useState, useEffect } from 'react'

const LINKEDIN_URI = 'https://www.linkedin.com/oauth/v2/authorization'

const useLinkedinLogin = ({ onError, onSuccess }) => {
  const [popup, setPopup] = useState(null)

  const scope = 'openid email profile'
  const redirectUri = window.location.origin

  const handleLinkedinLogin = () => {
    const linkedInUrl = `${LINKEDIN_URI}?response_type=code&client_id=${123}&redirect_uri=${encodeURIComponent(
      redirectUri,
    )}&scope=${encodeURIComponent(scope)}&state=${uniqueId()}&prompt=login`

    const width = 600
    const height = 600
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2
    const options = `width=${width},height=${height},top=${top},left=${left}`

    const popupWindow = window.open(linkedInUrl, 'LinkedIn Login', options)
    setPopup(popupWindow)
  }

  useEffect(() => {
    if (!popup) return undefined

    const timer = setInterval(() => {
      try {
        if (!popup || popup.closed) {
          clearInterval(timer)
          setPopup(null)
          if (onError) onError(new Error('Popup closed by user'))
          return
        }
        if (popup.location.href.startsWith(redirectUri)) {
          const urlParams = new URLSearchParams(popup.location.search)
          const code = urlParams.get('code')
          const error = urlParams.get('error')

          if (code) {
            if (onSuccess) onSuccess(code)
            popup.close()
            clearInterval(timer)
            setPopup(null)
          } else if (error) {
            const errorDesc =
              urlParams.get('error_description') || 'Error during login'
            if (onError) onError(new Error(errorDesc))
            popup.close()
            clearInterval(timer)
            setPopup(null)
          }
        }
      } catch {
        //
      }
    }, 500)

    return () => clearInterval(timer)
  }, [popup, redirectUri, onSuccess, onError])

  return handleLinkedinLogin
}

export default useLinkedinLogin
