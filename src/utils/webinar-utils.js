import moment from 'moment-timezone'

export const iff = (condition, then, otherwise) => (condition ? then : otherwise)

export const handleIsTodaySelected = (selectedDate) => {
  if (!selectedDate) {
    return false
  }

  const today = new Date()
  const selected = new Date(selectedDate)

  return (
    selected.getDate() === today.getDate() &&
    selected.getMonth() === today.getMonth() &&
    selected.getFullYear() === today.getFullYear()
  )
}

export const getLocalTimezone = () => moment.tz.guess()

export const convDateToUtc = (localDate, localTime) => {
  const dateMoment = moment(localDate)
  const timeMoment = moment(localTime)

  const combinedDateTime = dateMoment
    .set({ hour: timeMoment.hour(), minute: timeMoment.minute() })
    .utc()

  return combinedDateTime.format()
}

export const convHMtoUtc = (localTime) => moment(localTime).utc().format('HH:mm')

export const handleMinTime = () => {
  const now = new Date()
  return new Date(now.getTime())
}

export const convUtcToLocal = (timeStr, dateStr = new Date().toISOString()) => {
  if (!dateStr || !timeStr) {
    return null
  }

  const combinedDateTimeStr = `${dateStr.split('T')[0]}T${timeStr}`
  const utcMoment = moment.utc(combinedDateTimeStr)
  const localMoment = utcMoment.local()

  return localMoment.toDate()
}
