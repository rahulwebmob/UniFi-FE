import { Device } from 'mediasoup-client'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import { successAlert } from '../../../redux/reducers/app-slice'
import { setLoading } from '../../../redux/reducers/education-slice'

import {
  mergeData,
  stopStream,
  WebSocketEventType,
  createWebinarSocket,
  ASPECT_RATIO,
  VIDEO_RESOLUTION,
} from './common/common'
import Learning from './learning'
import { WebinarContainer } from './styles'
import Toolbar from './toolbar'
import WaitingRoom from './waiting-room'

const WebinarWrapper = ({ isHost = false }) => {
  const { roomId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user: selfUser } = useSelector((state) => state.user)

  const socketRef = useRef(null)
  const deviceRef = useRef(null)
  const producerRef = useRef(null)
  const consumerRef = useRef(null)

  const videoProducer = useRef(null)
  const audioProducer = useRef(null)
  const screenShareProducer = useRef(null)

  const [producers, setProducers] = useState([])
  const [isJoined, setIsJoined] = useState(false)
  const [usersInRoom, setUsersInRoom] = useState([])
  const [remoteStreamsMap, setRemoteStreamsMap] = useState({})
  const [localVideoStream, setLocalVideoStream] = useState(null)
  const [localAudioStream, setLocalAudioStream] = useState(null)
  const [localScreenStream, setLocalScreenStream] = useState(null)

  const [mediaStatus, setMediaStatus] = useState({
    isVideo: false,
    isAudio: false,
    isScreen: false,
  })

  const sendRequest = (type, data) =>
    new Promise((resolve, reject) => {
      if (!socketRef.current) {
        return
      }
      socketRef.current.emit(type, data, (response, err) => (err ? reject(err) : resolve(response)))
    })

  const joinRoom = async () => {
    const response = await sendRequest(WebSocketEventType.JOIN_ROOM, {
      roomId,
      userId: selfUser._id,
    })

    if (response?.status === false) {
      dispatch(successAlert({ message: response.message }))
      navigate('/dashboard/education')
      return
    }
  }

  const getCurrentUsers = async () => {
    const users = await sendRequest(WebSocketEventType.GET_IN_ROOM_USERS, {
      roomId,
    })
    if (users.users.length) {
      setUsersInRoom(users.users)
    }
  }

  const loadDevice = async (rtp) => {
    if (socketRef.current && !deviceRef.current) {
      const device = new Device()
      await device.load({ routerRtpCapabilities: rtp })
      deviceRef.current = device
    } else {
      console.error("Couldn't load device. Check socket or existing active device")
    }
  }

  const getRouterRTPCapabilties = async () => {
    const rtp = await sendRequest(WebSocketEventType.GET_ROUTER_RTP_CAPABILITIES, { roomId })
    if (!rtp) {
      console.error("Couldn't get RTP for device")
    } else {
      await loadDevice(rtp)
    }
  }

  const createConsumerTransport = async () => {
    if (consumerRef.current) {
      return
    }
    try {
      const data = await sendRequest(WebSocketEventType.CREATE_WEBRTC_TRANSPORT, {
        forceTcp: false,
        roomId,
      })
      if (!data) {
        throw new Error('No Transport created')
      }

      if (!deviceRef.current || !socketRef.current) {
        return
      }
      consumerRef.current = deviceRef.current.createRecvTransport(data.params)

      consumerRef.current.on('connect', async ({ dtlsParameters }, cb, eb) => {
        sendRequest(WebSocketEventType.CONNECT_TRANSPORT, {
          transport_id: consumerRef.current?.id,
          dtlsParameters,
          roomId,
        })
          .then(cb)
          .catch(eb)
      })

      consumerRef.current.on('connectionstatechange', (state) => {
        if (state === 'disconnected') {
          consumerRef.current?.close()
        }
      })
    } catch (error) {
      console.error('Error creating consumer transport:', error)
    }
  }

  const createProducerTransport = async () => {
    if (deviceRef.current && socketRef.current) {
      const resp = await sendRequest(WebSocketEventType.CREATE_WEBRTC_TRANSPORT, {
        roomId,
        forceTcp: false,
        rtpCapabilities: deviceRef.current.rtpCapabilities,
      })
      producerRef.current = deviceRef.current.createSendTransport(resp.params)

      if (producerRef.current) {
        producerRef.current.on('connect', ({ dtlsParameters }, cb, eb) => {
          sendRequest(WebSocketEventType.CONNECT_TRANSPORT, {
            transport_id: producerRef.current?.id,
            dtlsParameters,
            roomId,
          })
            .then(cb)
            .catch(eb)
        })

        producerRef.current.on('produce', async ({ kind, rtpParameters, appData }, cb, eb) => {
          try {
            const { producerId } = await sendRequest(WebSocketEventType.PRODUCE, {
              kind,
              roomId,
              rtpParameters,
              variant: appData.variant,
              producerTransportId: producerRef.current?.id,
            })
            cb({ id: producerId })
          } catch (error) {
            eb(new Error(String(error)))
          }
        })
        return true
      }
    }
    return null
  }

  const getProducers = async () => {
    const res = await sendRequest(WebSocketEventType.GET_PRODUCERS, { roomId })
    setProducers(res)
  }

  const handleInit = async () => {
    await joinRoom()
    await getCurrentUsers()
    await getRouterRTPCapabilties()
    await createConsumerTransport()
    await getProducers()
    await createProducerTransport()
    setIsJoined(true)
  }

  const userJoined = ({ user: newUser }) => {
    setUsersInRoom((prev) => (prev.some((u) => u._id === newUser._id) ? prev : [...prev, newUser]))
  }

  const closeProducer = (producerId) =>
    sendRequest(WebSocketEventType.CLOSE_PRODUCER, { producerId, roomId })

  const cleanup = () => {
    const streams = [localVideoStream, localAudioStream, localScreenStream]

    streams.forEach((stream) => {
      stopStream(stream)
    })

    if (audioProducer.current) {
      closeProducer(audioProducer.current.id)
      audioProducer.current.close()
      audioProducer.current = null
    }
    if (videoProducer.current) {
      closeProducer(videoProducer.current.id)
      videoProducer.current.close()
      videoProducer.current = null
    }
    if (screenShareProducer.current) {
      closeProducer(screenShareProducer.current.id)
      screenShareProducer.current.close()
      screenShareProducer.current = null
    }
    setMediaStatus({ isVideo: false, isAudio: false, isScreen: false })
  }

  const beforeunload = async () => {
    await sendRequest(WebSocketEventType.LEAVE_ROOM, { roomId })
    socketRef.current?.disconnect()
  }

  const getConsumerStream = async (producerId) => {
    if (!deviceRef.current || !consumerRef.current) {
      return null
    }
    const { rtpCapabilities } = deviceRef.current
    const data = await sendRequest(WebSocketEventType.CONSUME, {
      roomId,
      producerId,
      rtpCapabilities,
      consumerTransportId: consumerRef.current.id,
    })

    const { id, kind, rtpParameters, variant } = data
    const consumer = await consumerRef.current.consume({
      id,
      kind,
      producerId,
      rtpParameters,
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

    return { consumer, stream, kind, producerId, variant }
  }

  const consume = useCallback(
    async (producerId) => {
      if (remoteStreamsMap[producerId]) {
        return
      }
      if (!producers.some((p) => p.producerId === producerId)) {
        return
      }

      const data = await getConsumerStream(producerId)
      if (!data) {
        return
      }
      if (!producers.some((p) => p.producerId === data.producerId)) {
        return
      }

      setRemoteStreamsMap((prev) => ({ ...prev, [data.producerId]: data }))
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [producers, remoteStreamsMap],
  )

  const userLeft = ({ user: leavingUser }) => {
    setUsersInRoom((prev) => prev.filter((peer) => peer._id !== leavingUser._id))
    if (leavingUser.role === 'educator') {
      setProducers([])
      setRemoteStreamsMap({})
    }
  }

  const newProducers = (args) => {
    setProducers((prev) => [...prev, ...args])
  }

  const closedProducers = ({ producerId }) => {
    setProducers((prev) => prev.filter((prod) => prod.producerId !== producerId))
    setRemoteStreamsMap((prev) => {
      const updated = { ...prev }
      delete updated[producerId]
      return updated
    })
  }

  const handleIncEndWebByHost = () => {
    dispatch(successAlert({ message: 'Meeting has been ended by host' }))
    navigate('/dashboard/education')
  }

  const handleIncRaisedHand = (args) => {
    dispatch(
      successAlert({
        message: `${args.data.firstName} ${args.data.lastName} raised hand`,
      }),
    )
  }

  const routeIncommingEvents = ({ event, args }) => {
    switch (event) {
      case WebSocketEventType.USER_JOINED:
        userJoined(args)
        break
      case WebSocketEventType.USER_LEFT:
        userLeft(args)
        break
      case WebSocketEventType.NEW_PRODUCERS:
        newProducers(args)
        break
      case WebSocketEventType.PRODUCER_CLOSED:
        closedProducers(args)
        break
      case WebSocketEventType.CALL_ENDED:
        handleIncEndWebByHost()
        break
      case WebSocketEventType.HANDS_UP:
        handleIncRaisedHand(args)
        break
      default:
        break
    }
  }

  useEffect(() => {
    const socket = createWebinarSocket()
    socket.on('connect', () => {
      socketRef.current = socket
      if (isHost) {
        handleInit()
      }
      socket.onAny((event, args) => {
        routeIncommingEvents({ event, args })
      })
    })

    window.addEventListener('beforeunload', () => {
      cleanup()
      beforeunload()
    })

    socket.on('disconnect', () => {
      if (isHost) {
        cleanup()
        setLocalVideoStream(null)
        setRemoteStreamsMap({})
      } else {
        window.location.reload()
      }
    })

    return () => {
      cleanup()
      beforeunload()
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  useEffect(() => {
    producers.forEach((prod) => {
      if (!remoteStreamsMap[prod.producerId]) {
        consume(prod.producerId)
      }
    })
  }, [producers, remoteStreamsMap, consume])

  const remoteStream = useMemo(
    () => mergeData(usersInRoom, remoteStreamsMap, producers),
    [usersInRoom, remoteStreamsMap, producers],
  )

  const handleTurnedMicOn = async () => {
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
          closeProducer(audioProducer.current.id)
          audioProducer.current.close()
        }
        setMediaStatus((prev) => ({ ...prev, isAudio: false }))
      }
    } catch (e) {
      console.error(e)
    }
    dispatch(setLoading(false))
  }

  const handleTurnedVideoOn = async () => {
    dispatch(setLoading(true))
    try {
      if (!mediaStatus.isVideo) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          height: { ideal: VIDEO_RESOLUTION },
          aspectRatio: ASPECT_RATIO,
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
          closeProducer(videoProducer.current.id)
          videoProducer.current.close()
        }
        setMediaStatus((prev) => ({ ...prev, isVideo: false }))
      }
    } catch (e) {
      console.error(e)
    }
    dispatch(setLoading(false))
  }

  const handleStopScreenShare = () => {
    stopStream(localScreenStream)
    setLocalScreenStream(null)
    if (screenShareProducer.current) {
      closeProducer(screenShareProducer.current.id)
      screenShareProducer.current.close()
      screenShareProducer.current = null
    }
    setMediaStatus((prev) => ({ ...prev, isScreen: false }))
  }

  const handleTurnedScreenShare = async () => {
    dispatch(setLoading(true))
    try {
      if (!mediaStatus.isScreen) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          aspectRatio: ASPECT_RATIO,
          height: { ideal: VIDEO_RESOLUTION },
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
  }

  const handleRaiseHand = () => {
    sendRequest(WebSocketEventType.RAISE_HAND, { roomId })
  }

  const handleEndWebinar = () => {
    sendRequest(WebSocketEventType.EXIT_ROOM, { roomId })
  }

  const handleRenderWebinar = () => (
    <WebinarContainer>
      <Learning
        isHost={isHost}
        mediaStatus={mediaStatus}
        usersInRoom={usersInRoom}
        remoteStream={remoteStream}
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
        audioStream={remoteStream?.producer?.audio?.stream || null}
      />
    </WebinarContainer>
  )

  return isJoined || isHost ? handleRenderWebinar() : <WaitingRoom handleInit={handleInit} />
}

WebinarWrapper.propTypes = { isHost: PropTypes.bool }

export default WebinarWrapper
