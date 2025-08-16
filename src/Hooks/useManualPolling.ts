import { useRef, useEffect } from 'react'

const useManualPolling = (refetch, interval = 3000) => {
  const timeoutIdRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      try {
        await refetch()
      } catch {
        //
      }
      if (!cancelled) {
        timeoutIdRef.current = setTimeout(poll, interval)
      }
    }

    poll()

    return () => {
      cancelled = true
      clearTimeout(timeoutIdRef.current)
    }
  }, [refetch, interval])
}

export default useManualPolling
