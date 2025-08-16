import millify from 'millify'
import Cookies from 'js-cookie'
import { ja, de, fr, pt, it, enUS, arSA } from 'date-fns/locale'

import { ENV } from '../validation/env'
import i18n from '../../../Localization/i18n'

export const iff = <T,>(condition: boolean, then: T, otherwise: T): T => (condition ? then : otherwise)

const millifyNumbers = (value: number, precision = 2): string =>
  millify(value, {
    units: ['', 'K', 'M', 'B', 'T', 'Q'],
    precision,
  })

export const readLangCookie = (): string | undefined =>
  Cookies.get('languagePreference')

export const clearLangCookie = (): void => Cookies.remove('languagePreference')

interface UserData {
  firstName?: string
  lastName?: string
}

export const handleGetInitials = (data: UserData): string => {
  const firstInitial = data.firstName
    ? data.firstName.charAt(0).toUpperCase()
    : ''
  const lastInitial = data.lastName
    ? data.lastName.charAt(0).toUpperCase()
    : ''
  return `${firstInitial}${lastInitial}`
}

export const setLangCookie = (lang: string): void => {
  Cookies.set('languagePreference', lang, { domain: '.quasarmarkets.com' })
}

const handleDateAndTime = (
  timestamp: string | number | Date,
): string | null => {
  if (!timestamp) {
    return null
  }
  const localDate = new Date(timestamp)
  const language = i18n.language || 'en'
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'numeric',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    hour12: language !== 'fr' && language !== 'de',
    ...(language === 'ar' && {
      numberingSystem: 'arab' as const,
      calendar: 'gregory' as const,
    }),
  }
  const formattedDate = localDate.toLocaleString(
    language === 'jp' ? 'ja-JP' : language,
    options,
  )
  return formattedDate
}

const generateUniqueId = () => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}${random}`
}

interface DayData {
  _id: number
  [key: string]: unknown
}

const sortDataByDay = (data: DayData[], currentDate: number): DayData[] => {
  const sortedData = [...data]
  sortedData.sort((a, b) => {
    const dayA = (a._id - currentDate + 6) % 7
    const dayB = (b._id - currentDate + 6) % 7
    return dayA - dayB
  })
  return sortedData
}

const getCookie = (key: string): string | null => {
  const cookies = document.cookie.split('; ')
  for (const cookie of cookies) {
    const [cookieKey, cookieValue] = cookie.split('=')
    if (cookieKey === key) {
      return decodeURIComponent(cookieValue)
    }
  }
  return null
}

const scriptForFreeSignUp = (orderId: string, email: string, userId: string): void => {
  // Add the script after successful signup
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.innerHTML = `
    ire('trackConversion', 40659, {
      orderId: "${orderId}",
      customerId: "${userId}",
      customerEmail: "${email}"
    }, {
      verifySiteDefinitionMatch: true
    });
  `
  document.head.appendChild(script)
}

const scriptForPaidSubscription = (
  orderId: string,
  customerId: string,
  customerEmail: string,
  customerStatus: string,
  itemsSelected: unknown[],
): void => {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.innerHTML = `ire('trackConversion', 40660, {
        orderId: "${orderId}",
        customerId: "${customerId}",
        customerEmail: "${customerEmail}",
        customerStatus: "${customerStatus}",
        currencyCode: "USD",
        orderPromoCode: "",
        orderDiscount: "0.00",
        items: ${JSON.stringify(itemsSelected)}
              },
      {
        verifySiteDefinitionMatch:true
      });`
  document.body.appendChild(script)
}

const generateImageUrl = (folderName: string, fileName: string): string => {
  const baseUrl = ENV.BASE_URL
  if (folderName && fileName && baseUrl) {
    return `${baseUrl}/user-api/fetch-assets/${folderName}/${fileName}`
  }

  return ''
}

const convertCoordinatesToDirection = (latitude: number | null | undefined, longitude: number | null | undefined): { latitude: string; longitude: string } => {
  if (!latitude && !longitude) {
    return { latitude: '', longitude: '' }
  }
  const directionNorthSouth = latitude >= 0 ? 'N' : 'S'
  const directionEastWest = longitude >= 0 ? 'E' : 'W'
  const latitudeStr = `${Math.abs(latitude).toFixed(4)}°${directionNorthSouth}`
  const longitudeStr = `${Math.abs(longitude).toFixed(4)}°${directionEastWest}`
  return { latitude: latitudeStr, longitude: longitudeStr }
}


const escapeCSVValue = (value: unknown): string => {
  if (value === null || value === undefined) return ''
  const escapedValue = `${value}`.replace(/"/g, '""')
  return escapedValue.includes(',') ||
    escapedValue.includes('\n') ||
    escapedValue.includes('"')
    ? `"${escapedValue}"`
    : escapedValue
}

interface Column {
  header: string
  accessorKey: string
}

type Row = Record<string, unknown>;

const exportToCSV = (fileName: string, columns: Column[], rows: Row[]): void => {
  const csvHeader = `${columns
    .map((col) => escapeCSVValue(col.header))
    .join(',')}\n`
  const csvRows = rows
    .map((row) =>
      columns.map((col) => escapeCSVValue(row[col.accessorKey])).join(','),
    )
    .join('\n')

  const csvContent = csvHeader + csvRows

  // Create a blob and link to download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const getCurrentAndNextThreeQuarters = () => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const currentQuarter = Math.floor(currentMonth / 3) + 1

  const quarters = []

  for (let i = 0; i < 4; i++) {
    const quarter = ((currentQuarter + i - 1) % 4) + 1
    const yearOffset = Math.floor((currentQuarter + i - 1) / 4)
    const year = (currentYear + yearOffset) % 100
    quarters.push({ quarter, year })
  }

  return {
    quarters,
  }
}

import type { Locale } from 'date-fns'

const getLocaleByLanguageCode = (languageCode: string): Locale | undefined => {
  const localeMap: Record<string, Locale> = { ar: arSA, jp: ja, en: enUS, de, fr, pt, it }
  return localeMap[languageCode]
}

export {
  getCookie,
  exportToCSV,
  sortDataByDay,
  millifyNumbers,
  generateUniqueId,
  generateImageUrl,
  handleDateAndTime,
  scriptForFreeSignUp,
  getLocaleByLanguageCode,
  scriptForPaidSubscription,
  convertCoordinatesToDirection,
  getCurrentAndNextThreeQuarters,
}
