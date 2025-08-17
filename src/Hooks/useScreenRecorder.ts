import fixWebmDuration from 'webm-duration-fix'
import { useRef, useState, useEffect, useCallback } from 'react'

// Extend Window interface for vendor prefixes
interface WindowWithVendorAudio extends Window {
  webkitAudioContext?: typeof AudioContext
}

interface ScreenRecorderProps {
  isHost: boolean
  isMicAudioRequired: boolean
  externalAudioStream?: MediaStream | null
}

const useScreenRecorder = ({
  isHost,
  isMicAudioRequired,
  externalAudioStream = null,
}: ScreenRecorderProps) => {
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef(0)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const screenStreamRef = useRef<MediaStream | null>(null)
  const remoteSourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mixDestinationRef = useRef<MediaStreamAudioDestinationNode | null>(null)

  const [isRecording, setIsRecording] = useState(false)

  const cleanupStreams = useCallback(() => {
    screenStreamRef.current?.getTracks().forEach((track) => track.stop())
    micStreamRef.current?.getTracks().forEach((track) => track.stop())

    if (remoteSourceRef.current) {
      remoteSourceRef.current.disconnect()
      remoteSourceRef.current = null
    }

    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      void audioCtxRef.current.close()
    }
  }, [])

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
    cleanupStreams()
  }, [cleanupStreams])

  const startRecording = useCallback(async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      })
      screenStreamRef.current = screenStream

      try {
        micStreamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
      } catch {
        micStreamRef.current = null
      }

      const AudioContextClass =
        window.AudioContext ||
        (window as WindowWithVendorAudio).webkitAudioContext
      if (!AudioContextClass) {
        throw new Error('AudioContext not supported')
      }
      const audioCtx = new AudioContextClass()
      audioCtxRef.current = audioCtx

      const mixDestination = audioCtx.createMediaStreamDestination()
      mixDestinationRef.current = mixDestination

      const systemTracks = screenStream.getAudioTracks()
      if (systemTracks.length) {
        const systemSource = audioCtx.createMediaStreamSource(
          new MediaStream(systemTracks),
        )
        systemSource.connect(mixDestination)
      }

      if (micStreamRef.current) {
        const micSource = audioCtx.createMediaStreamSource(micStreamRef.current)
        micSource.connect(mixDestination)
      }

      if (
        !isHost &&
        externalAudioStream &&
        externalAudioStream.getAudioTracks().length > 0
      ) {
        const remoteSource = audioCtx.createMediaStreamSource(
          new MediaStream(externalAudioStream.getAudioTracks()),
        )
        remoteSource.connect(mixDestination)
        remoteSourceRef.current = remoteSource
      }

      const mixedStream = new MediaStream([
        ...screenStream.getVideoTracks(),
        ...mixDestination.stream.getAudioTracks(),
      ])

      chunksRef.current = []
      const recorder = new MediaRecorder(mixedStream)
      mediaRecorderRef.current = recorder

      startTimeRef.current = Date.now()

      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data)
      }

      recorder.onstop = async () => {
        try {
          const duration = Date.now() - startTimeRef.current
          const blob = new Blob(chunksRef.current, { type: 'video/webm' })
          const fixedBlob = await fixWebmDuration(blob, duration, {
            logger: false,
          })
          const url = URL.createObjectURL(fixedBlob)

          const anchor = document.createElement('a')
          anchor.style.display = 'none'
          anchor.href = url
          anchor.download = 'webinar-recording.webm'
          document.body.appendChild(anchor)
          anchor.click()
          document.body.removeChild(anchor)
          URL.revokeObjectURL(url)
        } catch {
          //
        }
      }

      recorder.start()
      setIsRecording(true)

      screenStream.getVideoTracks()[0]?.addEventListener('ended', stopRecording)
    } catch {
      //
    }
  }, [externalAudioStream, stopRecording, isHost])

  useEffect(() => {
    if (!isRecording || !audioCtxRef.current || !mixDestinationRef.current)
      return

    if (remoteSourceRef.current) {
      remoteSourceRef.current.disconnect()
      remoteSourceRef.current = null
    }

    if (!isHost && externalAudioStream?.getAudioTracks().length) {
      try {
        const newRemoteSource = audioCtxRef.current.createMediaStreamSource(
          new MediaStream(externalAudioStream.getAudioTracks()),
        )
        newRemoteSource.connect(mixDestinationRef.current)
        remoteSourceRef.current = newRemoteSource
      } catch (err) {
        console.warn('Failed to attach remote audio stream:', err)
      }
    }
  }, [externalAudioStream, isRecording, isHost])

  useEffect(() => {
    if (isRecording && micStreamRef.current) {
      const audioTrack = micStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = isMicAudioRequired
      }
    }
  }, [isMicAudioRequired, isRecording])

  useEffect(() => {
    return () => {
      if (isRecording) {
        stopRecording()
      }
    }
  }, [isRecording, stopRecording])

  const handleToggleRecording = useCallback(
    () => (isRecording ? stopRecording() : startRecording()),
    [isRecording, startRecording, stopRecording],
  )

  return { isRecording, handleToggleRecording }
}

export default useScreenRecorder
