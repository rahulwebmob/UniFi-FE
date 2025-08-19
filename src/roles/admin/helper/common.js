import html2pdf from 'html2pdf.js'

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
  const result = await requestCallback({
    transactionId: id,
  })

  const response = await result.unwrap()

  if (!response?.error && response?.data) {
    const div = document.createElement('div')
    div.innerHTML = response.data
    await convertImagesToBase64(div)

    div.querySelectorAll('*').forEach((node) => {
      const element = node
      element.style.color = '#000'
    })

    div.querySelectorAll('p').forEach((node) => {
      const element = node
      element.style.color = '#8A1C1C'
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

const downloadPdf = async (urls) => {
  const response = await fetch(urls)
  const blob = await response.blob()
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'CV.pdf'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const DateFormatInTutor = ({ date }) => {
  const lastActiveDate = date ? new Date(date) : ''
  let formattedDate
  if (lastActiveDate) {
    formattedDate = lastActiveDate.toLocaleString('en-US', {
      timeZone: 'GMT',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    })
  }
  return formattedDate
}

const handleGeneratePdfFromUrl = async (id, downloadFunction, successCallback) => {
  try {
    const response = await downloadFunction({ invoiceId: id })
    if (!response.error && response.data?.url) {
      await downloadPdf(response.data.url)
      successCallback()
    }
  } catch (error) {
    console.error('Error generating PDF:', error)
  }
}

export { downloadPdf, DateFormatInTutor, handleGeneratePdfFromUrl }
