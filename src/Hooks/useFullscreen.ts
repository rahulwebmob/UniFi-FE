import { useDispatch } from 'react-redux'
import { useEffect, useCallback } from 'react'

import { exitFullscreen, enterFullscreen } from '../Redux/Reducers/AppSlice'

const useFullscreen = () => {
  const dispatch = useDispatch()
  const isDocument = typeof document !== 'undefined'

  const handleFullScreen = () => {
    const element = document.documentElement
    if (element.requestFullscreen) {
      void element
        .requestFullscreen()
        .then(() => dispatch(enterFullscreen({ isFullscreen: true })))
        .catch(() => {}) // Handle potential errors silently
    } else if ((element as any).mozRequestFullScreen) {
      void (element as unknown)
        .mozRequestFullScreen()
        .then(() => dispatch(enterFullscreen({ isFullscreen: true })))
        .catch(() => {}) // Handle potential errors silently
    } else if ((element as any).webkitRequestFullscreen) {
      void (element as any)
        .webkitRequestFullscreen()
        .then(() => dispatch(enterFullscreen({ isFullscreen: true })))
        .catch(() => {}) // Handle potential errors silently
    } else if ((element as any).msRequestFullscreen) {
      void (element as any)
        .msRequestFullscreen()
        .then(() => dispatch(enterFullscreen({ isFullscreen: true })))
        .catch(() => {}) // Handle potential errors silently
    }
  }

  const handleExitFullScreen = useCallback(() => {
    if (!isDocument) return
    if (document.exitFullscreen) {
      void document
        .exitFullscreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {})
    } else if ((document as any).mozCancelFullScreen) {
      // Firefox
      void (document as any)
        .mozCancelFullScreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {})
    } else if ((document as any).webkitExitFullscreen) {
      // Chrome, Safari and Opera
      void (document as any)
        .webkitExitFullscreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {})
    } else if ((document as any).msExitFullscreen) {
      // IE/Edge
      void (document as any)
        .msExitFullscreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {})
    }
  }, [dispatch, isDocument])

  const handleFullScreenChange = useCallback(() => {
    if (
      !document.fullscreenElement &&
      !(document as any).mozFullScreenElement &&
      !(document as any).webkitFullscreenElement &&
      !(document as any).msFullscreenElement
    ) {
      dispatch(exitFullscreen({ isFullscreen: false }))
    }
  }, [dispatch])

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    document.addEventListener('mozfullscreenchange', handleFullScreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange)
    document.addEventListener('msfullscreenchange', handleFullScreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullScreenChange,
      )
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullScreenChange,
      )
      document.removeEventListener('msfullscreenchange', handleFullScreenChange)
      handleExitFullScreen()
    }
  }, [dispatch, handleFullScreenChange, handleExitFullScreen])

  return { handleFullScreen, handleExitFullScreen }
}

export default useFullscreen
