// Common utilities

import { format, isSameDay, intervalToDuration } from 'date-fns'
import html2pdf from 'html2pdf.js'
import moment, { utc } from 'moment-timezone'
import { io } from 'socket.io-client'

export const mergeData = (usersInRoom, remoteStreamsMap, producers) => {
  const educator = usersInRoom.find((u) => u.role === 'educator')
  if (!educator) {
    return null
  }

  const mergedStreams = {}
  Object.values(remoteStreamsMap).forEach((streamData) => {
    const producerExists = producers.find((p) => p.producerId === streamData.producerId)
    if (producerExists) {
      mergedStreams[streamData.variant] = streamData
    }
  })
  return { producer: mergedStreams, firstName: educator.firstName }
}

export const stopStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
  }
}

export const WebSocketEventType = {
  // ROOM EVENTS
  CREATE_ROOM: 'createRoom',
  JOIN_ROOM: 'joinRoom',
  LEAVE_ROOM: 'exitRoom',
  EXIT_ROOM: 'endCall',
  USER_LEFT: 'userLeft',
  USER_JOINED: 'userJoined',
  GET_IN_ROOM_USERS: 'getInRoomUsers',
  STATUS: 'status',

  // server side
  GET_PRODUCERS: 'getProducers',
  GET_ROUTER_RTP_CAPABILITIES: 'getRouterRtpCapabilities',
  CREATE_WEBRTC_TRANSPORT: 'createWebRtcTransport',
  CONNECT_TRANSPORT: 'connectTransport',
  PRODUCE: 'produce',
  CONSUME: 'consume',
  GET_MY_ROOM_INFO: 'getMyRoomInfo',
  PRODUCER_CLOSED: 'producerClosed',
  CONSUMER_CLOSED: 'consumerClosed',
  HANDS_UP: 'handsUp',

  // client side
  ROOM_CREATED_MESSAGE: 'createdRoom',
  NEW_PRODUCERS: 'newProducers',
  PRODUCED: 'produced',
  ROUTER_RTP_CAPABILITIES: 'routerRtpCapabilities',
  CREATED_WEBRTC_TRANSPORT: 'createdWebRtcTransport',
  CONSUMED: 'consumed',
  ROOM_INFO: 'roomInfo',
  JOINED_ROOM_MESSAGE: 'joinedRoom',
  RAISE_HAND: 'handRaise',
  CLOSE_PRODUCER: 'closeProducer',
  CALL_ENDED: 'callEnded',
}
export const ASPECT_RATIO = 16 / 9
export const VIDEO_RESOLUTION = 720

const defaultSocketSettings = {
  transports: ['websocket', 'polling'],
}

export const createWebinarSocket = () =>
  io(`${import.meta.env.VITE_BASE_URL}/vedio`, {
    path: '/vedio-sfu-service/socket/',
    auth: { token: localStorage.getItem('token') },
    ...defaultSocketSettings,
  })

export const formatDate = (date) => {
  if (!date) {
    return ''
  }
  return new Date(date).toLocaleDateString()
}

export const formatTime = (time) => {
  if (!time) {
    return ''
  }
  return new Date(time).toLocaleTimeString()
}

export const getErrorMessage = (error) => {
  if (error && typeof error === 'object' && 'message' in error) {
    return error.message
  }
  return 'An error occurred'
}

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const truncateText = (text, maxLength) => {
  if (!text) {
    return ''
  }
  if (text.length <= maxLength) {
    return text
  }
  return `${text.substr(0, maxLength)}...`
}

export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const CONSTANTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  DEFAULT_PAGE_SIZE: 10,
}

export const CHAPTER_CONFIG = {
  VIDEO_EXTENSIONS: ['mp4', 'mov', 'webm', 'mkv'],
  DOCUMENT_EXTENSIONS: ['pdf', 'doc', 'docx'],
  MAX_VIDEO_SIZE_MB: 1024,
  MAX_DOCUMENT_SIZE_MB: 50,
}

export const handleIsTodaySelected = (selectedDate) => {
  if (!selectedDate) {
    return false
  }
  return isSameDay(new Date(selectedDate), new Date())
}

export const handleStatusColor = (value) => {
  switch (value) {
    case 'published':
      return 'success'
    case 'draft':
      return 'warning'
    default:
      return 'primary'
  }
}

export const getLocalTimezone = () => moment.tz.guess()

export const convDateToUtc = (localDate, localTime) => {
  const dateMoment = moment(localDate)
  const timeMoment = moment(localTime)
  dateMoment.hour(timeMoment.hour())
  dateMoment.minute(timeMoment.minute())
  dateMoment.second(0)
  dateMoment.millisecond(0)
  return dateMoment.utc().format('YYYY-MM-DD')
}

export const convHMtoUtc = (localTime) => moment(localTime).utc().format('HH:mm')

export const handleMinTime = () => {
  const now = new Date()
  return new Date(now.getTime())
}

export const iff = (condition, then, otherwise) => (condition ? then : otherwise)

export const handleFileChange = (event, setErrors, setResource) => {
  const file = event.target.files?.[0]
  const fileExtension = file?.name?.split('.').pop()?.toLowerCase()

  if (!file) {
    return
  }

  if (
    fileExtension &&
    CHAPTER_CONFIG.VIDEO_EXTENSIONS.includes(fileExtension) &&
    file.size > CHAPTER_CONFIG.MAX_VIDEO_SIZE_MB * 1024 * 1024
  ) {
    setErrors({
      resource: `Video files must not exceed ${CHAPTER_CONFIG.MAX_VIDEO_SIZE_MB}MB.`,
    })
    return
  }

  if (
    fileExtension &&
    CHAPTER_CONFIG.DOCUMENT_EXTENSIONS.includes(fileExtension) &&
    file.size > CHAPTER_CONFIG.MAX_DOCUMENT_SIZE_MB * 1024 * 1024
  ) {
    setErrors({
      resource: `Document files must not exceed ${CHAPTER_CONFIG.MAX_DOCUMENT_SIZE_MB}MB.`,
    })
    return
  }

  if (
    !fileExtension ||
    ![...CHAPTER_CONFIG.VIDEO_EXTENSIONS, ...CHAPTER_CONFIG.DOCUMENT_EXTENSIONS].includes(
      fileExtension,
    )
  ) {
    setErrors({
      resource: `Invalid file type. Only videos (${CHAPTER_CONFIG.VIDEO_EXTENSIONS.join(
        ', ',
      )}) and documents (${CHAPTER_CONFIG.DOCUMENT_EXTENSIONS.join(', ')}) are allowed.`,
    })
    return
  }

  setResource(file)
  setErrors((prev) => ({ ...prev, resource: '' }))
}

export const handleFormatSeconds = (seconds) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  const { hours, minutes, days, seconds: remainingSeconds } = duration
  const parts = []
  if (days) {
    parts.push(`${days}d`)
  }
  if (hours) {
    parts.push(`${hours}h`)
  }
  if (minutes) {
    parts.push(`${minutes}m`)
  }
  if (remainingSeconds) {
    parts.push(`${remainingSeconds}s`)
  }
  return parts.join(' ')
}

export const ACTIVE_BUTTON_CSS = {
  backgroundColor: 'text.primary',
  color: 'background.paper',
}

export const transformNaNToNull = (value) => (Number.isNaN(value) ? null : value)

const areValuesEqual = (value1, value2) => {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) {
      return false
    }
    return value1.every((item, index) => item === value2[index])
  }
  return value1 === value2
}

export const getUpdatedFields = (data, initialData, excludeKeys = []) => {
  const updatedFields = {}

  Object.keys(data).forEach((key) => {
    if (!excludeKeys.includes(key) && !areValuesEqual(data[key], initialData[key])) {
      updatedFields[key] = data[key]
    }
  })

  const isIdentical = !Object.keys(updatedFields).length

  return [updatedFields, isIdentical]
}

export const isNewFile = (file, previousFile) => {
  if (!(file instanceof File)) {
    return false
  }
  if (!previousFile) {
    return true
  }
  if (typeof previousFile === 'string') {
    return true
  } // If previous is a string URL, any File is new
  if (previousFile instanceof File) {
    return file.size !== previousFile.size || file.name !== previousFile.name
  }
  return true
}

export const extractFilename = (fileName) => {
  if (!fileName) {
    return ''
  }
  const [, ...rest] = fileName.split('_')
  return rest.join('_') || fileName
}

export const getEducatorDetails = (detail, returnType = 'fullName') => {
  const firstName = detail?.educatorId?.firstName || ''
  const lastName = detail?.educatorId?.lastName || ''

  const avatarName = `${firstName[0]}${lastName[0]}`
  const fullName = `${firstName} ${lastName}`

  if (returnType === 'avatarName') {
    return avatarName
  }
  return fullName
}

export const containsNestedArray = (objectArray, nestedArrayKey) =>
  objectArray.every((item) => Array.isArray(item[nestedArrayKey]) && item[nestedArrayKey].length)

export const formatDateTime = (date) => {
  if (!date) {
    return '-'
  }

  try {
    const formattedDate = format(new Date(date), 'dd MMM yyyy')
    const formattedTime = format(new Date(date), 'hh:mm a')
    return `${formattedDate}\n${formattedTime} (GMT)`
  } catch {
    return '-'
  }
}

const videoMimeTypes = {
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  webm: 'video/webm',
}

export const getFormatType = (ext) => videoMimeTypes[ext] || 'application/octet-stream'

// Generate Invoice

const fetchImageAsBase64 = async (url) => {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () => reject(new Error('Failed to convert image to base64'))
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

const convertImagesToBase64 = async (div) => {
  const images = div.querySelectorAll('img')
  const promises = Array.from(images).map(async (img) => {
    const src = img.getAttribute('src')
    if (src && (src.startsWith('https') || src.startsWith('data:'))) {
      const base64 = await fetchImageAsBase64(src)
      if (base64) {
        img.setAttribute('src', base64)
      } else {
        img.remove()
      }
    }
  })

  await Promise.all(promises)
}

export const handleGeneratePdf = async (id, requestCallback, successCallback) => {
  const callbackResult = await requestCallback({
    transactionId: id,
  })
  const response = 'unwrap' in callbackResult ? await callbackResult.unwrap() : callbackResult

  if (!response.error) {
    const div = document.createElement('div')
    div.innerHTML = String(response.data)
    await convertImagesToBase64(div)

    div.querySelectorAll('*').forEach((node) => {
      node.style.color = '#000'
    })

    div.querySelectorAll('p').forEach((node) => {
      node.style.color = '#8A1C1C'
    })

    html2pdf()
      .from(div)
      .set({
        margin: 10,
        filename: `Invoice_${id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait' },
      })
      .save()
      .then(() => {
        successCallback()
      })
  }
}

export const isAndroidOrIphone = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera || ''
  return /android/i.test(userAgent) || (/iPhone/i.test(userAgent) && !window.MSStream)
}

export const convUtcToLocal = (timeStr, dateStr = new Date().toISOString()) => {
  if (!dateStr || !timeStr) {
    return null
  }
  const datePart = dateStr.split('T')[0]
  return utc(`${datePart} ${timeStr}`, 'YYYY-MM-DD HH:mm').local().toDate()
}

export const handleAreAllFieldsFilled = (arr) =>
  arr.every((obj) =>
    Object.values(obj).every((value) => value !== '' && value !== null && value !== undefined),
  )

export default {
  mergeData,
  stopStream,
  WebSocketEventType,
  createWebinarSocket,
  formatDate,
  formatTime,
  getErrorMessage,
  validateEmail,
  truncateText,
  debounce,
  CONSTANTS,
}
