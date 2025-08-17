const useWindowOpen = () => {
  return (url: string, self = false): void => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

    if (isSafari) {
      const link = document.createElement('a')
      link.href = url
      link.target = self ? '_self' : '_blank'
      link.click()
      link.remove()
    } else {
      window.open(url, self ? '_self' : '_blank')
    }
  }
}

export default useWindowOpen
