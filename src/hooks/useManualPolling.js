import { useRef, useEffect } from 'react'

const useManualPolling = (refetch, interval = 3000) => {
  const timeoutIdRef = useRef(undefined)

  useEffect(() => {
    let cancelled = false

    const poll = async () => {
      try {
        await refetch()
      } catch {
        //
      }
      if (!cancelled) {
        timeoutIdRef.current = window.setTimeout(() => poll(), interval)
      }
    }

    poll()

    return () => {
      cancelled = true
      if (timeoutIdRef.current !== undefined) {
        clearTimeout(timeoutIdRef.current)
      }
    }
  }, [refetch, interval])
}

export default useManualPolling
