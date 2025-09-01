import { intervalToDuration } from 'date-fns'

export const CHAPTER_CONFIG = {
  VIDEO_EXTENSIONS: ['mp4', 'mov', 'webm', 'mkv'],
  DOCUMENT_EXTENSIONS: ['pdf', 'doc', 'docx'],
  IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
}

const videoMimeTypes = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  ogg: 'video/ogg',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  flv: 'video/x-flv',
  wmv: 'video/x-ms-wmv',
  '3gp': 'video/3gpp',
  '3g2': 'video/3gpp2',
}

export const getFormatType = (ext) => videoMimeTypes[ext] || 'application/octet-stream'

export const handleFileChange = (event, setErrors, setResource) => {
  const file = event.target.files?.[0]
  const fileExtension = file?.name?.split('.').pop()?.toLowerCase()

  if (!file) {
    return
  }

  // Check file extension
  const isVideo = CHAPTER_CONFIG.VIDEO_EXTENSIONS.includes(fileExtension)
  const isDocument = CHAPTER_CONFIG.DOCUMENT_EXTENSIONS.includes(fileExtension)

  if (!isVideo && !isDocument) {
    setErrors({
      resource: {
        message: `Please upload a valid file. Supported formats: ${[
          ...CHAPTER_CONFIG.VIDEO_EXTENSIONS,
          ...CHAPTER_CONFIG.DOCUMENT_EXTENSIONS,
        ].join(', ')}`,
      },
    })
    return
  }

  // Check file size
  if (file.size > CHAPTER_CONFIG.MAX_FILE_SIZE) {
    setErrors({
      resource: {
        message: 'File size should not exceed 100MB',
      },
    })
    return
  }

  setResource(file)
  setErrors({})
}

export const handleFormatSeconds = (seconds) => {
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 })
  const { hours, minutes, days, seconds: remainingSeconds } = duration

  const totalHours = (days || 0) * 24 + (hours || 0)

  const formattedHours = String(totalHours).padStart(2, '0')
  const formattedMinutes = String(minutes || 0).padStart(2, '0')
  const formattedSeconds = String(remainingSeconds || 0).padStart(2, '0')

  if (totalHours > 0) {
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }
  if (minutes > 0) {
    return `${formattedMinutes}:${formattedSeconds}`
  }
  return `00:${formattedSeconds}`
}

export const transformNaNToNull = (value) => (Number.isNaN(value) ? null : value)

const areValuesEqual = (value1, value2) => {
  if (value1 === value2) {
    return true
  }
  if (value1 === null && value2 === undefined) {
    return true
  }
  if (value1 === undefined && value2 === null) {
    return true
  }
  if (
    (value1 === '' || value1 === null || value1 === undefined) &&
    (value2 === '' || value2 === null || value2 === undefined)
  ) {
    return true
  }

  return false
}

export const getUpdatedFields = (data, initialData, excludeKeys = []) => {
  const updatedFields = {}

  Object.keys(data).forEach((key) => {
    if (excludeKeys.includes(key)) {
      return
    }

    if (!areValuesEqual(data[key], initialData[key])) {
      updatedFields[key] = data[key]
    }
  })

  return updatedFields
}

export const isNewFile = (file, previousFile) => {
  if (!(file instanceof File)) {
    return false
  }

  if (!previousFile) {
    return true
  }

  if (previousFile instanceof File) {
    return file.name !== previousFile.name || file.size !== previousFile.size
  }

  return true
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
