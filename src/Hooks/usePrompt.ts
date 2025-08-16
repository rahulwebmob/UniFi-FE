import { useState } from 'react'
import { useBlocker } from 'react-router-dom'

const usePrompt = () => {
  const [value, setValue] = useState(false)

  // Block navigating elsewhere when data has been entered into the input
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      value && currentLocation.pathname !== nextLocation.pathname,
  )

  return { blocker, setValue }
}

export default usePrompt
