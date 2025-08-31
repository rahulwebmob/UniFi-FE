import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { exitFullscreen, enterFullscreen } from '../redux/reducers/app-slice'

const useFullscreen = () => {
  const dispatch = useDispatch()
  const isDocument = typeof document !== 'undefined'

  const handleFullScreen = () => {
    const element = document.documentElement
    if (element.requestFullscreen) {
      element
        .requestFullscreen()
        .then(() => dispatch(enterFullscreen()))
        .catch(() => {
          //
        }) // Handle potential errors silently
    } else if (element.mozRequestFullScreen) {
      element
        .mozRequestFullScreen()
        .then(() => dispatch(enterFullscreen()))
        .catch(() => {
          //
        }) // Handle potential errors silently
    } else if (element.webkitRequestFullscreen) {
      element
        .webkitRequestFullscreen()
        .then(() => dispatch(enterFullscreen()))
        .catch(() => {
          //
        }) // Handle potential errors silently
    } else if (element.msRequestFullscreen) {
      element
        .msRequestFullscreen()
        .then(() => dispatch(enterFullscreen()))
        .catch(() => {
          //
        }) // Handle potential errors silently
    }
  }

  const handleExitFullScreen = useCallback(() => {
    if (!isDocument) {
      return
    }
    if (document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {
          //
        })
    } else if (document.mozCancelFullScreen) {
      // Firefox
      document
        .mozCancelFullScreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {
          //
        })
    } else if (document.webkitExitFullscreen) {
      // Chrome, Safari and Opera
      document
        .webkitExitFullscreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {
          //
        })
    } else if (document.msExitFullscreen) {
      // IE/Edge
      document
        .msExitFullscreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {
          //
        })
    }
  }, [dispatch, isDocument])

  const handleFullScreenChange = useCallback(() => {
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      dispatch(exitFullscreen())
    }
  }, [dispatch])

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullScreenChange)
    document.addEventListener('mozfullscreenchange', handleFullScreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange)
    document.addEventListener('msfullscreenchange', handleFullScreenChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange)
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange)
      document.removeEventListener('msfullscreenchange', handleFullScreenChange)
      handleExitFullScreen()
    }
  }, [dispatch, handleFullScreenChange, handleExitFullScreen])

  return { handleFullScreen, handleExitFullScreen }
}

export default useFullscreen
