// Common utilities
import type {
  FileError,
  EducatorDetail,
  NestedArrayObject,
  DataObject,
  RequestCallback,
} from '../../../../types/common'

export const mergeData = (..._args: unknown[]) => {
  void _args
  return {}
}

export const stopStream = (stream: MediaStream | null) => {
  if (stream?.getTracks) {
    stream.getTracks().forEach((track: MediaStreamTrack) => track.stop())
  }
}

export const WebSocketEventType = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  ERROR: 'error',
  JOIN_ROOM: 'join_room',
  LEAVE_ROOM: 'leave_room',
  GET_IN_ROOM_USERS: 'get_in_room_users',
  GET_ROUTER_RTP_CAPABILITIES: 'get_router_rtp_capabilities',
  CREATE_WEBRTC_TRANSPORT: 'create_webrtc_transport',
  CONNECT_TRANSPORT: 'connect_transport',
  PRODUCE: 'produce',
  GET_PRODUCERS: 'get_producers',
  CLOSE_PRODUCER: 'close_producer',
  CONSUME: 'consume',
  USER_JOINED: 'user_joined',
  USER_LEFT: 'user_left',
  NEW_PRODUCERS: 'new_producers',
  PRODUCER_CLOSED: 'producer_closed',
  CALL_ENDED: 'call_ended',
  HANDS_UP: 'hands_up',
  RAISE_HAND: 'raise_hand',
  EXIT_ROOM: 'exit_room',
} as const

export const ASPECT_RATIO = 16 / 9
export const VIDEO_RESOLUTION = 720

export const createWebinarSocket = () => ({
  on: (_event: string, _callback: (...args: unknown[]) => void) => {
    void _event
    void _callback
  },
  onAny: (_callback: (...args: unknown[]) => void) => {
    void _callback
  },
  disconnect: () => {
    /* mock disconnect */
  },
  emit: (
    _event: string,
    _data: unknown,
    _callback?: (...args: unknown[]) => void,
  ) => {
    void _event
    void _data
    void _callback
  },
})

export const formatDate = (date: string | Date | null) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

export const formatTime = (time: string | Date | null) => {
  if (!time) return ''
  return new Date(time).toLocaleTimeString()
}

export const getErrorMessage = (error: unknown) => {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message
  }
  return 'An error occurred'
}

export const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + '...'
}

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
) => {
  let timeout: NodeJS.Timeout
  return function executedFunction(...args: Parameters<T>) {
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
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
  ],
  DEFAULT_PAGE_SIZE: 10,
}

import html2pdf from 'html2pdf.js'
import moment, { utc } from 'moment-timezone'
import { format, isSameDay, intervalToDuration } from 'date-fns'

export const CHAPTER_CONFIG = {
  VIDEO_EXTENSIONS: ['mp4', 'mov', 'webm', 'mkv'],
  DOCUMENT_EXTENSIONS: ['pdf', 'doc', 'docx'],
  MAX_VIDEO_SIZE_MB: 1024,
  MAX_DOCUMENT_SIZE_MB: 50,
}

export const handleIsTodaySelected = (selectedDate: Date | null) => {
  if (!selectedDate) return false
  return isSameDay(new Date(selectedDate), new Date())
}

export const handleStatusColor = (value: string) => {
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

export const convDateToUtc = (
  localDate: string | Date,
  localTime: string | Date,
) => {
  const dateMoment = moment(localDate)
  const timeMoment = moment(localTime)
  dateMoment.hour(timeMoment.hour())
  dateMoment.minute(timeMoment.minute())
  dateMoment.second(0)
  dateMoment.millisecond(0)
  return dateMoment.utc().format('YYYY-MM-DD')
}

export const convHMtoUtc = (localTime: string | Date) =>
  moment(localTime).utc().format('HH:mm')

export const handleMinTime = () => {
  const now = new Date()
  return new Date(now.getTime())
}

export const iff = <T, U>(condition: boolean, then: T, otherwise: U) =>
  condition ? then : otherwise

export const handleFileChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  setErrors: (errors: FileError | ((prev: FileError) => FileError)) => void,
  setResource: (file: File) => void,
) => {
  const file = event.target.files?.[0]
  const fileExtension = file?.name?.split('.').pop()?.toLowerCase()

  if (!file) return

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
    ![
      ...CHAPTER_CONFIG.VIDEO_EXTENSIONS,
      ...CHAPTER_CONFIG.DOCUMENT_EXTENSIONS,
    ].includes(fileExtension)
  ) {
    setErrors({
      resource: `Invalid file type. Only videos (${CHAPTER_CONFIG.VIDEO_EXTENSIONS.join(
        ', ',
      )}) and documents (${CHAPTER_CONFIG.DOCUMENT_EXTENSIONS.join(
        ', ',
      )}) are allowed.`,
    })
    return
  }

  setResource(file)
  setErrors((prev: FileError) => ({ ...prev, resource: '' }))
}

export const handleFormatSeconds = (seconds: number) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  const { hours, minutes, days, seconds: remainingSeconds } = duration
  const parts = []
  if (days) parts.push(`${days}d`)
  if (hours) parts.push(`${hours}h`)
  if (minutes) parts.push(`${minutes}m`)
  if (remainingSeconds) parts.push(`${remainingSeconds}s`)
  return parts.join(' ')
}

export const ACTIVE_BUTTON_CSS = {
  backgroundColor: 'text.primary',
  color: 'background.paper',
}

export const transformNaNToNull = (value: number) =>
  Number.isNaN(value) ? null : value

const areValuesEqual = (value1: unknown, value2: unknown): boolean => {
  if (Array.isArray(value1) && Array.isArray(value2)) {
    if (value1.length !== value2.length) return false
    return value1.every((item, index) => item === value2[index])
  }
  return value1 === value2
}

export const getUpdatedFields = <T extends DataObject>(
  data: T,
  initialData: T,
  excludeKeys: string[] = [],
): [Partial<T>, boolean] => {
  const updatedFields: Partial<T> = {}

  Object.keys(data).forEach((key) => {
    if (
      !excludeKeys.includes(key) &&
      !areValuesEqual(data[key], initialData[key])
    ) {
      updatedFields[key as keyof T] = data[key as keyof T]
    }
  })

  const isIdentical = !Object.keys(updatedFields).length

  return [updatedFields, isIdentical]
}

export const isNewFile = (
  file: unknown,
  previousFile: File | string | null,
): boolean => {
  if (!(file instanceof File)) return false
  if (!previousFile) return true
  if (typeof previousFile === 'string') return true // If previous is a string URL, any File is new
  if (previousFile instanceof File) {
    return file.size !== previousFile.size || file.name !== previousFile.name
  }
  return true
}

export const extractFilename = (fileName: string) => {
  if (!fileName) return ''
  const [, ...rest] = fileName.split('_')
  return rest.join('_') || fileName
}

export const getEducatorDetails = (
  detail: EducatorDetail,
  returnType = 'fullName',
): string => {
  const firstName = detail?.educatorId?.firstName || ''
  const lastName = detail?.educatorId?.lastName || ''

  const avatarName = `${firstName[0]}${lastName[0]}`
  const fullName = `${firstName} ${lastName}`

  if (returnType === 'avatarName') {
    return avatarName
  }
  return fullName
}

export const containsNestedArray = (
  objectArray: NestedArrayObject[],
  nestedArrayKey: string,
): boolean =>
  objectArray.every(
    (item: NestedArrayObject) =>
      Array.isArray(item[nestedArrayKey]) && item[nestedArrayKey].length,
  )

export const formatDateTime = (date: string | Date | null) => {
  if (!date) return '-'

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

export const getFormatType = (ext: string): string =>
  videoMimeTypes[ext as keyof typeof videoMimeTypes] ||
  'application/octet-stream'

// Generate Invoice

const fetchImageAsBase64 = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = () =>
        reject(new Error('Failed to convert image to base64'))
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

const convertImagesToBase64 = async (div: HTMLElement): Promise<void> => {
  const images = div.querySelectorAll('img')
  const promises = Array.from(images).map(async (img) => {
    const src = (img as HTMLImageElement).getAttribute('src')
    if (src && (src.startsWith('https') || src.startsWith('data:'))) {
      const base64 = await fetchImageAsBase64(src)
      if (base64) {
        ;(img as HTMLImageElement).setAttribute('src', base64 as string)
      } else (img as HTMLImageElement).remove()
    }
  })

  await Promise.all(promises)
}

export const handleGeneratePdf = async (
  id: string,
  requestCallback: RequestCallback,
  successCallback: () => void,
) => {
  const callbackResult = await requestCallback({
    transactionId: id,
  })
  const response =
    'unwrap' in callbackResult ? await callbackResult.unwrap() : callbackResult

  if (!response.error) {
    const div = document.createElement('div')
    div.innerHTML = String(response.data)
    await convertImagesToBase64(div)

    div.querySelectorAll('*').forEach((node: Element) => {
      ;(node as HTMLElement).style.color = '#000'
    })

    div.querySelectorAll('p').forEach((node: HTMLParagraphElement) => {
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

export const isAndroidOrIphone = (): boolean => {
  const userAgent =
    navigator.userAgent ||
    (navigator as unknown as { vendor?: string }).vendor ||
    (window as unknown as { opera?: string }).opera ||
    ''
  return (
    /android/i.test(userAgent) ||
    (/iPhone/i.test(userAgent) &&
      !(window as unknown as { MSStream?: unknown }).MSStream)
  )
}

export const convUtcToLocal = (
  timeStr: string,
  dateStr = new Date().toISOString(),
): Date | null => {
  if (!dateStr || !timeStr) return null
  const datePart = dateStr.split('T')[0]
  return utc(`${datePart} ${timeStr}`, 'YYYY-MM-DD HH:mm').local().toDate()
}

export const handleAreAllFieldsFilled = (arr: DataObject[]): boolean =>
  arr.every((obj: DataObject) =>
    Object.values(obj).every(
      (value) => value !== '' && value !== null && value !== undefined,
    ),
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
