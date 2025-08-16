import { useDispatch } from 'react-redux'
import { useEffect, useCallback } from 'react'

import { exitFullscreen, enterFullscreen } from '../redux/reducers/app-slice'

interface DocumentWithVendorFullscreen extends Document {
  mozCancelFullScreen?: () => Promise<void>
  webkitExitFullscreen?: () => Promise<void>
  msExitFullscreen?: () => Promise<void>
  mozFullScreenElement?: Element | null
  webkitFullscreenElement?: Element | null
  msFullscreenElement?: Element | null
}

interface ElementWithVendorFullscreen extends HTMLElement {
  mozRequestFullScreen?: () => Promise<void>
  webkitRequestFullscreen?: () => Promise<void>
  msRequestFullscreen?: () => Promise<void>
}

const useFullscreen = () => {
  const dispatch = useDispatch()
  const isDocument = typeof document !== 'undefined'

  const handleFullScreen = () => {
    const element = document.documentElement
    if (element.requestFullscreen) {
      void element
        .requestFullscreen()
        .then(() => dispatch(enterFullscreen()))
        .catch(() => {
          //
        }) // Handle potential errors silently
    } else if ((element as ElementWithVendorFullscreen).mozRequestFullScreen) {
      void (element as ElementWithVendorFullscreen)
        .mozRequestFullScreen()
        .then(() => dispatch(enterFullscreen()))
        .catch(() => {
          //
        }) // Handle potential errors silently
    } else if ((element as ElementWithVendorFullscreen).webkitRequestFullscreen) {
      void (element as ElementWithVendorFullscreen)
        .webkitRequestFullscreen()
        .then(() => dispatch(enterFullscreen()))
        .catch(() => {
          //
        }) // Handle potential errors silently
    } else if ((element as ElementWithVendorFullscreen).msRequestFullscreen) {
      void (element as ElementWithVendorFullscreen)
        .msRequestFullscreen()
        .then(() => dispatch(enterFullscreen()))
        .catch(() => {
          //
        }) // Handle potential errors silently
    }
  }

  const handleExitFullScreen = useCallback(() => {
    if (!isDocument) return
    if (document.exitFullscreen) {
      void document
        .exitFullscreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {
          //
        })
    } else if ((document as DocumentWithVendorFullscreen).mozCancelFullScreen) {
      // Firefox
      void (document as DocumentWithVendorFullscreen)
        .mozCancelFullScreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {
          //
        })
    } else if ((document as DocumentWithVendorFullscreen).webkitExitFullscreen) {
      // Chrome, Safari and Opera
      void (document as DocumentWithVendorFullscreen)
        .webkitExitFullscreen()
        .then(() => dispatch(exitFullscreen()))
        .catch(() => {
          //
        })
    } else if ((document as DocumentWithVendorFullscreen).msExitFullscreen) {
      // IE/Edge
      void (document as DocumentWithVendorFullscreen)
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
      !(document as DocumentWithVendorFullscreen).mozFullScreenElement &&
      !(document as DocumentWithVendorFullscreen).webkitFullscreenElement &&
      !(document as DocumentWithVendorFullscreen).msFullscreenElement
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
