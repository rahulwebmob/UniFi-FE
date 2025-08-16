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

export { downloadPdf, DateFormatInTutor }
