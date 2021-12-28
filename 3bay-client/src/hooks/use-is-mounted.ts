import { useCallback, useEffect, useRef } from 'react'

/**
 * @see https://usehooks-ts.com/react-hook/use-is-mounted
 */
function useIsMounted() {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  return useCallback(() => isMounted.current, [])
}

export default useIsMounted
