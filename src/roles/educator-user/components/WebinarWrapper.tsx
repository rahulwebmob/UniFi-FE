import { Device } from 'mediasoup-client'

// Define mediasoup-client types locally since they are not properly exported
interface Transport {
  id: string
  closed: boolean
  direction: 'send' | 'recv'
  produce: (params: unknown) => Promise<Producer>
  consume: (params: unknown) => Promise<Consumer>
  connect: (params: unknown) => Promise<void>
  close: () => void
  on(
    event: 'connect',
    callback: (
      params: { dtlsParameters: DtlsParameters },
      cb: () => void,
      eb: (error: Error) => void,
    ) => void,
  ): void
  on(
    event: 'connectionstatechange',
    callback: (state: ConnectionState) => void,
  ): void
  on(
    event: 'produce',
    callback: (
      params: {
        kind: MediaKind
        rtpParameters: RtpParameters
        appData: Record<string, unknown>
      },
      cb: (params: { id: string }) => void,
      eb: (error: Error) => void,
    ) => void,
  ): void
  on(event: string, callback: (...args: unknown[]) => void): void
}

interface Producer {
  id: string
  closed: boolean
  kind: MediaKind
  rtpParameters: RtpParameters
  track: MediaStreamTrack
  close: () => void
}

interface Consumer {
  id: string
  closed: boolean
  kind: MediaKind
  rtpParameters: RtpParameters
  track: MediaStreamTrack
  close: () => void
  resume: () => Promise<void>
}

interface IceParameters {
  usernameFragment: string
  password: string
}

interface IceCandidate {
  foundation: string
  priority: number
  address: string
  protocol: 'udp' | 'tcp'
  port: number
  type: 'host' | 'srflx' | 'relay'
  component: number
  generation?: number
  ip: string // Required by mediasoup-client
}

interface TransportOptions {
  id: string
  iceParameters: IceParameters
  iceCandidates: IceCandidate[]
  dtlsParameters: DtlsParameters
}

interface DtlsParameters {
  role: 'auto' | 'client' | 'server'
  fingerprints: Array<{
    algorithm: 'sha-1' | 'sha-224' | 'sha-256' | 'sha-384' | 'sha-512'
    value: string
  }>
}

type ConnectionState = string
type MediaKind = 'audio' | 'video'

interface RtpParameters {
  mid?: string
  codecs: unknown[]
  headerExtensions: unknown[]
  encodings: unknown[]
  rtcp: unknown
}
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { useRef, useMemo, useState, useEffect, useCallback } from 'react'

import Toolbar from './Toolbar'
import Learning from './Learning'
import WaitingRoom from './waiting-room'
import { WebinarContainer } from './styles'
import { successAlert } from '../../../redux/reducers/app-slice'
import { setLoading } from '../../../redux/reducers/education-slice'
import { chatSocket, chatConnection } from '../../../services/sockets'
import {
  mergeData,
  stopStream,
  ASPECT_RATIO,
  VIDEO_RESOLUTION,
  WebSocketEventType,
  createWebinarSocket,
} from './common/common'

import type { RootState } from '../../../redux/types'

interface WebinarWrapperProps {
  isHost?: boolean
}

interface UserInRoom {
  _id: string
  firstName: string
  lastName: string
  role?: string
}

interface ProducerInfo {
  producerId: string
  variant?: string
}

interface ConsumerData {
  consumer: Consumer
  stream: MediaStream
  kind: string
  producerId: string
  variant?: string
}

interface SocketResponse {
  status?: boolean | string
  message?: string
  users?: { users: UserInRoom[] }
  producerId?: string
  id?: string
  kind?: string
  rtpParameters?: object
  variant?: string
  params?: object
}

interface EventData {
  event: string
  args:
    | {
        user?: UserInRoom
        data?: UserInRoom
        producerId?: string
      }
    | { user: UserInRoom }
    | { data: UserInRoom }
    | { producerId: string }
    | ProducerInfo[]
}

interface SocketInterface {
  on: (event: string, callback: (...args: unknown[]) => void) => void
  onAny: (callback: (...args: unknown[]) => void) => void
  disconnect: () => void
  emit: (
    event: string,
    data: unknown,
    callback?: (...args: unknown[]) => void,
  ) => void
}

// Interface matching Learning component's RemoteStream
interface RemoteStreamData {
  firstName?: string
  producer?: Producer
  audio?: {
    stream: MediaStream
  }
  video?: {
    stream: MediaStream
  }
  [key: string]: unknown
}

const WebinarWrapper = ({ isHost = false }: WebinarWrapperProps) => {
  const { roomId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user: selfUser } = useSelector((state: RootState) => state.user)

  const socketRef = useRef<SocketInterface | null>(null)
  const deviceRef = useRef<Device | null>(null)
  const producerRef = useRef<Transport | null>(null)
  const consumerRef = useRef<Transport | null>(null)

  const videoProducer = useRef<Producer | null>(null)
  const audioProducer = useRef<Producer | null>(null)
  const screenShareProducer = useRef<Producer | null>(null)

  const [producers, setProducers] = useState<ProducerInfo[]>([])
  const [isJoined, setIsJoined] = useState(false)
  const [usersInRoom, setUsersInRoom] = useState<UserInRoom[]>([])
  const [remoteStreamsMap, setRemoteStreamsMap] = useState<
    Record<string, ConsumerData>
  >({})
  const [localVideoStream, setLocalVideoStream] = useState<MediaStream | null>(
    null,
  )
  const [localAudioStream, setLocalAudioStream] = useState<MediaStream | null>(
    null,
  )
  const [localScreenStream, setLocalScreenStream] =
    useState<MediaStream | null>(null)

  const [mediaStatus, setMediaStatus] = useState({
    isVideo: false,
    isAudio: false,
    isScreen: false,
  })

  const sendRequest = useCallback(
    (type: string, data: object) =>
      new Promise((resolve, reject) => {
        if (!socketRef.current) return
        socketRef.current.emit(type, data, (...args: unknown[]) => {
          const [response, err] = args as [SocketResponse, Error | undefined]
          if (err) {
            reject(err)
          } else {
            resolve(response)
          }
        })
      }),
    [],
  )

  const joinRoom = useCallback(async () => {
    if (!selfUser) return

    const response = (await sendRequest(WebSocketEventType.JOIN_ROOM, {
      roomId,
      userId: selfUser._id,
    })) as SocketResponse

    if (response?.status === false) {
      dispatch(
        successAlert({ message: response.message || 'Error joining room' }),
      )
      void navigate('/dashboard')
      return
    }
    if (response?.status === 'Joined Room Successfully') {
      if (chatSocket) chatSocket.disconnect()
      const token = localStorage.getItem('token')
      if (token) void chatConnection(token)
    }
  }, [roomId, selfUser, dispatch, navigate, sendRequest])

  const getCurrentUsers = useCallback(async () => {
    const response = (await sendRequest(WebSocketEventType.GET_IN_ROOM_USERS, {
      roomId,
    })) as SocketResponse
    if (response?.users?.users && response.users.users.length) {
      setUsersInRoom(response.users.users)
    }
  }, [roomId, sendRequest])

  const loadDevice = useCallback(async (rtp: object) => {
    if (socketRef.current && !deviceRef.current) {
      const device = new Device()
      await device.load({ routerRtpCapabilities: rtp })
      deviceRef.current = device
    } else {
      console.error(
        "Couldn't load device. Check socket or existing active device",
      )
    }
  }, [])

  const getRouterRTPCapabilties = useCallback(async () => {
    const rtp = await sendRequest(
      WebSocketEventType.GET_ROUTER_RTP_CAPABILITIES,
      { roomId },
    )
    if (!rtp) {
      console.error("Couldn't get RTP for device")
    } else {
      await loadDevice(rtp)
    }
  }, [roomId, sendRequest, loadDevice])

  const createConsumerTransport = useCallback(async () => {
    if (consumerRef.current) return
    try {
      const response = (await sendRequest(
        WebSocketEventType.CREATE_WEBRTC_TRANSPORT,
        {
          forceTcp: false,
          roomId,
        },
      )) as SocketResponse
      if (!response?.params) throw new Error('No Transport created')

      if (!deviceRef.current || !socketRef.current) return
      consumerRef.current = deviceRef.current.createRecvTransport(
        response.params as unknown as TransportOptions,
      ) as unknown as Transport
      ;(consumerRef.current as unknown as Transport).on(
        'connect',
        async (
          { dtlsParameters }: { dtlsParameters: DtlsParameters },
          cb: () => void,
          eb: (error: Error) => void,
        ) => {
          void sendRequest(WebSocketEventType.CONNECT_TRANSPORT, {
            transport_id: consumerRef.current!.id,
            dtlsParameters,
            roomId,
          })
            .then(cb)
            .catch(eb)
        },
      )
      ;(consumerRef.current as unknown as Transport).on(
        'connectionstatechange',
        (state: ConnectionState) => {
          if (state === 'disconnected') consumerRef.current!.close()
        },
      )
    } catch (error) {
      console.error('Error creating consumer transport:', error)
    }
  }, [roomId, sendRequest])

  const createProducerTransport = useCallback(async () => {
    if (deviceRef.current && socketRef.current) {
      const resp = (await sendRequest(
        WebSocketEventType.CREATE_WEBRTC_TRANSPORT,
        {
          roomId,
          forceTcp: false,
          rtpCapabilities: deviceRef.current.rtpCapabilities,
        },
      )) as SocketResponse
      producerRef.current = deviceRef.current.createSendTransport(
        resp.params as unknown as TransportOptions,
      ) as unknown as Transport

      if (producerRef.current) {
        ;(producerRef.current as unknown as Transport).on(
          'connect',
          (
            { dtlsParameters }: { dtlsParameters: DtlsParameters },
            cb: () => void,
            eb: (error: Error) => void,
          ) => {
            void sendRequest(WebSocketEventType.CONNECT_TRANSPORT, {
              transport_id: producerRef.current?.id,
              dtlsParameters,
              roomId,
            })
              .then(cb)
              .catch(eb)
          },
        )
        ;(producerRef.current as unknown as Transport).on(
          'produce',
          async (
            {
              kind,
              rtpParameters,
              appData,
            }: {
              kind: MediaKind
              rtpParameters: RtpParameters
              appData: Record<string, unknown>
            },
            cb: (params: { id: string }) => void,
            eb: (error: Error) => void,
          ) => {
            try {
              const response = (await sendRequest(WebSocketEventType.PRODUCE, {
                kind,
                roomId,
                rtpParameters,
                variant: appData.variant,
                producerTransportId: producerRef.current?.id,
              })) as SocketResponse
              const producerId = response.producerId || ''
              cb({ id: producerId })
            } catch (error) {
              eb(new Error(String(error)))
            }
          },
        )
        return true
      }
    }
    return null
  }, [roomId, sendRequest])

  const getProducers = useCallback(async () => {
    const res = await sendRequest(WebSocketEventType.GET_PRODUCERS, { roomId })
    setProducers(res as ProducerInfo[])
  }, [roomId, sendRequest])

  const handleInit = useCallback(async () => {
    await joinRoom()
    await getCurrentUsers()
    await getRouterRTPCapabilties()
    await createConsumerTransport()
    await getProducers()
    await createProducerTransport()
    setIsJoined(true)
  }, [
    joinRoom,
    getCurrentUsers,
    getRouterRTPCapabilties,
    createConsumerTransport,
    getProducers,
    createProducerTransport,
  ])

  const userJoined = useCallback(({ user: newUser }: { user: UserInRoom }) => {
    setUsersInRoom((prev) =>
      prev.some((u) => u._id === newUser._id) ? prev : [...prev, newUser],
    )
  }, [])

  const closeProducer = useCallback(
    (producerId: string) =>
      sendRequest(WebSocketEventType.CLOSE_PRODUCER, { producerId, roomId }),
    [roomId, sendRequest],
  )

  const cleanup = useCallback(() => {
    const streams = [localVideoStream, localAudioStream, localScreenStream]

    streams.forEach((stream) => {
      stopStream(stream)
    })

    if (audioProducer.current) {
      void closeProducer(audioProducer.current.id)
      audioProducer.current.close()
      audioProducer.current = null
    }
    if (videoProducer.current) {
      void closeProducer(videoProducer.current.id)
      videoProducer.current.close()
      videoProducer.current = null
    }
    if (screenShareProducer.current) {
      void closeProducer(screenShareProducer.current.id)
      screenShareProducer.current.close()
      screenShareProducer.current = null
    }
    setMediaStatus({ isVideo: false, isAudio: false, isScreen: false })
  }, [localVideoStream, localAudioStream, localScreenStream, closeProducer])

  const beforeunload = useCallback(async () => {
    await sendRequest(WebSocketEventType.LEAVE_ROOM, { roomId })
    socketRef.current?.disconnect()
  }, [roomId, sendRequest])

  const getConsumerStream = useCallback(
    async (producerId: string) => {
      if (!deviceRef.current || !consumerRef.current) return null
      const { rtpCapabilities } = deviceRef.current
      const data = await sendRequest(WebSocketEventType.CONSUME, {
        roomId,
        producerId,
        rtpCapabilities,
        consumerTransportId: consumerRef.current.id,
      })

      const { id, kind, rtpParameters, variant } = data as SocketResponse
      const consumer = await consumerRef.current.consume({
        id: id as string,
        kind: kind as MediaKind,
        producerId,
        rtpParameters: rtpParameters as RtpParameters,
      })
      await consumer.resume()

      const stream = new MediaStream()
      stream.addTrack(consumer.track)

      consumer.track.onended = () => {
        console.error(`Remote ${kind} track ended for producer: ${producerId}`)
        setRemoteStreamsMap((prev) => {
          const updated = { ...prev }
          delete updated[producerId]
          return updated
        })
      }

      return {
        consumer,
        stream,
        kind: kind as string,
        producerId,
        variant: variant as string,
      }
    },
    [roomId, sendRequest],
  )

  const consume = useCallback(
    async (producerId: string) => {
      if (remoteStreamsMap[producerId]) return
      if (!producers.some((p) => p.producerId === producerId)) return

      const data = await getConsumerStream(producerId)
      if (!data) return
      if (!producers.some((p) => p.producerId === data.producerId)) return

      setRemoteStreamsMap((prev) => ({ ...prev, [data.producerId]: data }))
    },
    [producers, remoteStreamsMap, getConsumerStream],
  )

  const userLeft = useCallback(
    ({ user: leavingUser }: { user: UserInRoom }) => {
      setUsersInRoom((prev) =>
        prev.filter((peer) => peer._id !== leavingUser._id),
      )
      if (leavingUser.role === 'educator') {
        setProducers([])
        setRemoteStreamsMap({})
      }
    },
    [],
  )

  const newProducers = useCallback((args: ProducerInfo[]) => {
    setProducers((prev) => [...prev, ...args])
  }, [])

  const closedProducers = useCallback(
    ({ producerId }: { producerId: string }) => {
      setProducers((prev) =>
        prev.filter((prod) => prod.producerId !== producerId),
      )
      setRemoteStreamsMap((prev) => {
        const updated = { ...prev }
        delete updated[producerId]
        return updated
      })
    },
    [],
  )

  const handleIncEndWebByHost = useCallback(() => {
    dispatch(successAlert({ message: 'Meeting has been ended by host' }))
    void navigate('/dashboard')
  }, [dispatch, navigate])

  const handleIncRaisedHand = useCallback(
    (args: { data: UserInRoom }) => {
      dispatch(
        successAlert({
          message: `${args.data.firstName} ${args.data.lastName} raised hand`,
        }),
      )
    },
    [dispatch],
  )

  const routeIncommingEvents = useCallback(
    ({ event, args }: EventData) => {
      switch (event) {
        case WebSocketEventType.USER_JOINED as string:
          if ('user' in args) userJoined(args as { user: UserInRoom })
          break
        case WebSocketEventType.USER_LEFT as string:
          if ('user' in args) userLeft(args as { user: UserInRoom })
          break
        case WebSocketEventType.NEW_PRODUCERS as string:
          if (Array.isArray(args)) newProducers(args as ProducerInfo[])
          break
        case WebSocketEventType.PRODUCER_CLOSED as string:
          if ('producerId' in args)
            closedProducers(args as { producerId: string })
          break
        case WebSocketEventType.CALL_ENDED as string:
          handleIncEndWebByHost()
          break
        case WebSocketEventType.HANDS_UP as string:
          if ('data' in args) handleIncRaisedHand(args as { data: UserInRoom })
          break
        default:
          break
      }
    },
    [
      userJoined,
      userLeft,
      newProducers,
      closedProducers,
      handleIncEndWebByHost,
      handleIncRaisedHand,
    ],
  )

  useEffect(() => {
    const socket = createWebinarSocket()
    socket.on('connect', () => {
      socketRef.current = socket
      if (isHost) void handleInit()
      socket.onAny((...params: unknown[]) => {
        const [event, args] = params as [string, EventData['args']]
        routeIncommingEvents({ event, args })
      })
    })

    window.addEventListener('beforeunload', () => {
      cleanup()
      void beforeunload()
    })

    socket.on('disconnect', () => {
      if (isHost) {
        cleanup()
        setLocalVideoStream(null)
        setRemoteStreamsMap({})
      } else window.location.reload()
    })

    return () => {
      cleanup()
      void beforeunload()
      socket.disconnect()
    }
  }, [roomId, isHost, handleInit, cleanup, beforeunload, routeIncommingEvents])

  useEffect(() => {
    producers.forEach((prod) => {
      if (!remoteStreamsMap[prod.producerId]) void consume(prod.producerId)
    })
  }, [producers, remoteStreamsMap, consume])

  const remoteStream = useMemo(
    () =>
      mergeData(usersInRoom, remoteStreamsMap, producers) as RemoteStreamData,
    [usersInRoom, remoteStreamsMap, producers],
  )

  const handleTurnedMicOn = useCallback(async () => {
    dispatch(setLoading(true))
    try {
      if (!mediaStatus.isAudio) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        const audioTrack = stream.getAudioTracks()[0]
        if (producerRef.current) {
          audioProducer.current = await producerRef.current.produce({
            track: audioTrack,
            appData: { variant: 'audio' },
          })
        }
        setLocalAudioStream(stream)
        setMediaStatus((prev) => ({ ...prev, isAudio: true }))
      } else {
        stopStream(localAudioStream)
        setLocalAudioStream(null)
        if (audioProducer.current) {
          void closeProducer(audioProducer.current.id)
          audioProducer.current.close()
        }
        setMediaStatus((prev) => ({ ...prev, isAudio: false }))
      }
    } catch (e) {
      console.error(e)
    }
    dispatch(setLoading(false))
  }, [mediaStatus.isAudio, localAudioStream, closeProducer, dispatch])

  const handleTurnedVideoOn = useCallback(async () => {
    dispatch(setLoading(true))
    try {
      if (!mediaStatus.isVideo) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            height: { ideal: VIDEO_RESOLUTION },
            aspectRatio: ASPECT_RATIO,
          },
        })
        const videoTrack = stream.getVideoTracks()[0]
        if (producerRef.current) {
          videoProducer.current = await producerRef.current.produce({
            track: videoTrack,
            appData: { variant: 'video' },
          })
        }
        setLocalVideoStream(stream)
        setMediaStatus((prev) => ({ ...prev, isVideo: true }))
      } else {
        stopStream(localVideoStream)
        setLocalVideoStream(null)
        if (videoProducer.current) {
          void closeProducer(videoProducer.current.id)
          videoProducer.current.close()
        }
        setMediaStatus((prev) => ({ ...prev, isVideo: false }))
      }
    } catch (e) {
      console.error(e)
    }
    dispatch(setLoading(false))
  }, [mediaStatus.isVideo, localVideoStream, closeProducer, dispatch])

  const handleStopScreenShare = useCallback(() => {
    stopStream(localScreenStream)
    setLocalScreenStream(null)
    if (screenShareProducer.current) {
      void closeProducer(screenShareProducer.current.id)
      screenShareProducer.current.close()
      screenShareProducer.current = null
    }
    setMediaStatus((prev) => ({ ...prev, isScreen: false }))
  }, [localScreenStream, closeProducer])

  const handleTurnedScreenShare = useCallback(async () => {
    dispatch(setLoading(true))
    try {
      if (!mediaStatus.isScreen) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            aspectRatio: ASPECT_RATIO,
            height: { ideal: VIDEO_RESOLUTION },
          },
        })
        stream.getVideoTracks()[0].onended = handleStopScreenShare
        if (producerRef.current) {
          screenShareProducer.current = await producerRef.current.produce({
            track: stream.getVideoTracks()[0],
            appData: { variant: 'screen' },
          })
        }
        setLocalScreenStream(stream)
        setMediaStatus((prev) => ({ ...prev, isScreen: true }))
      } else {
        handleStopScreenShare()
      }
    } catch (e) {
      console.error(e)
    }
    dispatch(setLoading(false))
  }, [mediaStatus.isScreen, handleStopScreenShare, dispatch])

  const handleRaiseHand = useCallback(() => {
    void sendRequest(WebSocketEventType.RAISE_HAND, { roomId })
  }, [sendRequest, roomId])

  const handleEndWebinar = useCallback(() => {
    void sendRequest(WebSocketEventType.EXIT_ROOM, { roomId })
  }, [sendRequest, roomId])

  const handleRenderWebinar = () => (
    <WebinarContainer>
      <Learning
        isHost={isHost}
        mediaStatus={mediaStatus}
        usersInRoom={usersInRoom}
        remoteStream={
          remoteStream as {
            firstName?: string
            producer?: {
              screen?: { stream: unknown }
              video?: { stream: unknown }
              audio?: { stream: unknown }
            }
          }
        }
        localVideoStream={localVideoStream}
        localScreenStream={localScreenStream}
      />
      <Toolbar
        isHost={isHost}
        mediaStatus={mediaStatus}
        handleRaiseHand={handleRaiseHand}
        handleEndWebinar={handleEndWebinar}
        handleTurnedMicOn={handleTurnedMicOn}
        handleTurnedVideoOn={handleTurnedVideoOn}
        handleTurnedScreenShare={handleTurnedScreenShare}
        audioStream={remoteStream?.audio?.stream}
      />
    </WebinarContainer>
  )

  return isJoined || isHost ? (
    handleRenderWebinar()
  ) : (
    <WaitingRoom
      handleInit={() => {
        void handleInit()
      }}
    />
  )
}

export default WebinarWrapper
