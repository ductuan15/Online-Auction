import { useRef } from 'react'

/**
 * @return True at the mount time, Then always false
 * @see https://usehooks-ts.com/react-hook/use-is-first-render
 */
function useIsFirstRender(): boolean {
  const isFirst = useRef(true)

  if (isFirst.current) {
    isFirst.current = false

    return true
  }

  return isFirst.current
}

export default useIsFirstRender
