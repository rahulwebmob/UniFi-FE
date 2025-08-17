const downloadPdf = async (urls: string) => {
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

const DateFormatInTutor = ({
  date,
}: {
  date: string | Date | null | undefined
}) => {
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

const handleGeneratePdf = async (
  id: string,
  downloadFunction: (params: {
    invoiceId: string
  }) => Promise<{ error: boolean; data?: { url: string } }>,
  successCallback: () => void,
) => {
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

export { downloadPdf, DateFormatInTutor, handleGeneratePdf }
