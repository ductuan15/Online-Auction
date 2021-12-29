// See: https://usehooks-ts.com/react-hook/use-local-storage
import useLocalStorage from './use-local-storage'
// See: https://usehooks-ts.com/react-hook/use-media-query
import useMediaQuery from './use-media-query'

import useUpdateEffect from './use-update-effect'

const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)'

interface UseDarkModeOutput {
  isDarkMode: boolean
  toggle: () => void
  enable: () => void
  disable: () => void
}

/**
 * This React Hook offers you an interface to enable, disable, toggle
 * and read the dark theme mode. The returned value (isDarkMode) is a
 * boolean to let you be able to use with your logic.
 * @param defaultValue
 * @see https://usehooks-ts.com/react-hook/use-dark-mode
 */
function useDarkMode(defaultValue?: boolean): UseDarkModeOutput {
  const isDarkOS = useMediaQuery(COLOR_SCHEME_QUERY)
  const [isDarkMode, setDarkMode] = useLocalStorage<boolean>(
    'darkMode',
    defaultValue ?? false,
    // ?? isDarkOS,
  )

  // Update darkMode if os prefers changes
  useUpdateEffect(() => {
    setDarkMode(isDarkOS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkOS])

  return {
    isDarkMode,
    toggle: () => setDarkMode((prev) => !prev),
    enable: () => setDarkMode(true),
    disable: () => setDarkMode(false),
  }
}

export default useDarkMode
