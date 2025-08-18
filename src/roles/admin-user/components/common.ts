import html2pdf from 'html2pdf.js'

interface ApiResponse {
  error?: boolean
  data?: string
}

type RequestCallback = (params: {
  transactionId: string
}) => Promise<{ unwrap: () => Promise<ApiResponse> }>

const fetchImageAsBase64 = async (url: string) => {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = () =>
        reject(new Error('Failed to convert image to base64'))
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

const convertImagesToBase64 = async (div: HTMLElement) => {
  const images = div.querySelectorAll('img')
  const promises = Array.from(images).map(async (img) => {
    const src = img.getAttribute('src')
    if (src && (src.startsWith('https') || src.startsWith('data:'))) {
      const base64 = await fetchImageAsBase64(src)
      if (base64) {
        img.setAttribute('src', base64 as string)
      } else img.remove()
    }
  })

  await Promise.all(promises)
}

export const handleGeneratePdf = async (
  id: string,
  requestCallback: RequestCallback,
  successCallback: () => void,
) => {
  const result = await requestCallback({
    transactionId: id,
  })

  const response = await result.unwrap()

  if (!response?.error && response?.data) {
    const div = document.createElement('div')
    div.innerHTML = response.data
    await convertImagesToBase64(div)

    div.querySelectorAll('*').forEach((node) => {
      const element = node as HTMLElement
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
