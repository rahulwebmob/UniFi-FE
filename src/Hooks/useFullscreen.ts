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
      const mozElement = element as ElementWithVendorFullscreen
      if (mozElement.mozRequestFullScreen) {
        void mozElement
          .mozRequestFullScreen()
          .then(() => dispatch(enterFullscreen()))
          .catch(() => {
            //
          }) // Handle potential errors silently
      }
    } else if (
      (element as ElementWithVendorFullscreen).webkitRequestFullscreen
    ) {
      const webkitElement = element as ElementWithVendorFullscreen
      if (webkitElement.webkitRequestFullscreen) {
        void webkitElement
          .webkitRequestFullscreen()
          .then(() => dispatch(enterFullscreen()))
          .catch(() => {
            //
          }) // Handle potential errors silently
      }
    } else if ((element as ElementWithVendorFullscreen).msRequestFullscreen) {
      const msElement = element as ElementWithVendorFullscreen
      if (msElement.msRequestFullscreen) {
        void msElement
          .msRequestFullscreen()
          .then(() => dispatch(enterFullscreen()))
          .catch(() => {
            //
          }) // Handle potential errors silently
      }
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
      const mozDoc = document as DocumentWithVendorFullscreen
      if (mozDoc.mozCancelFullScreen) {
        void mozDoc
          .mozCancelFullScreen()
          .then(() => dispatch(exitFullscreen()))
          .catch(() => {
            //
          })
      }
    } else if (
      (document as DocumentWithVendorFullscreen).webkitExitFullscreen
    ) {
      // Chrome, Safari and Opera
      const webkitDoc = document as DocumentWithVendorFullscreen
      if (webkitDoc.webkitExitFullscreen) {
        void webkitDoc
          .webkitExitFullscreen()
          .then(() => dispatch(exitFullscreen()))
          .catch(() => {
            //
          })
      }
    } else if ((document as DocumentWithVendorFullscreen).msExitFullscreen) {
      // IE/Edge
      const msDoc = document as DocumentWithVendorFullscreen
      if (msDoc.msExitFullscreen) {
        void msDoc
          .msExitFullscreen()
          .then(() => dispatch(exitFullscreen()))
          .catch(() => {
            //
          })
      }
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
