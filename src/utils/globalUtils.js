import { ENV } from './env'

const getImageCdnUrl = (path) => `${ENV.CDN}/application/static-assets/${path}`

const getImageWebsiteCdnUrl = (path) => `${ENV.CDN}/website/images/${path}`

const getLogoCdn = (path) => `${ENV.CDN}/website/logos/${path}`

// Stub functions for missing exports - these need proper implementation
const generateImageUrl = (url) => url || ''
const clearLangCookie = () => {
  // TODO: Implement clearing language cookie
}
const scriptForFreeSignUp = () => {
  // TODO: Implement free signup script
}
const handleDateAndTime = (date) => {
  if (!date) {
    return '-'
  }
  return new Date(date).toLocaleString()
}
const getLocaleByLanguageCode = () =>
  // TODO: Return proper locale object based on language code
  undefined

const getCookie = () =>
  // TODO: Implement cookie retrieval
  null

const generateUniqueId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)
const scriptForPaidSubscription = () => {
  // TODO: Implement paid subscription script
}
const setLangCookie = (lang) => {
  // TODO: Implement setting language cookie
  document.cookie = `language=${lang};path=/`
}
const readLangCookie = () => {
  const match = /language=([^;]+)/.exec(document.cookie)
  return match?.[1] ?? null
}
const exportToCSV = (data, filename = 'export.csv') => {
  // Simple CSV export implementation
  if (!data || data.length === 0) {
    return
  }

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          return typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        })
        .join(','),
    ),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.URL.revokeObjectURL(url)
}

const convertHtmlToPdf = async (htmlContent, options = {}) => {
  const {
    filename = 'document.pdf',
    margin = 10,
    scale = 2,
    orientation = 'portrait',
    onSuccess,
    onError,
  } = options

  try {
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent

    // Dynamically import html2pdf.js
    const html2pdf = (await import('html2pdf.js')).default

    // Generate and save the PDF
    await html2pdf()
      .from(tempDiv)
      .set({
        margin,
        filename,
        html2canvas: { scale },
        jsPDF: { orientation },
      })
      .save()

    // Call success callback if provided
    onSuccess?.()
  } catch (error) {
    console.error('Error converting HTML to PDF:', error)
    // Call error callback if provided
    onError?.(error)
  }
}

const generateInvoicePdf = async (htmlContent, invoiceId, onSuccess, onError) => {
  await convertHtmlToPdf(htmlContent, {
    filename: `Invoice_${invoiceId}.pdf`,
    margin: 10,
    scale: 2,
    orientation: 'portrait',
    onSuccess,
    onError,
  })
}

export {
  getCookie,
  getLogoCdn,
  exportToCSV,
  setLangCookie,
  getImageCdnUrl,
  readLangCookie,
  clearLangCookie,
  generateImageUrl,
  generateUniqueId,
  handleDateAndTime,
  convertHtmlToPdf,
  generateInvoicePdf,
  scriptForFreeSignUp,
  getImageWebsiteCdnUrl,
  getLocaleByLanguageCode,
  scriptForPaidSubscription,
}
