import * as React from 'react'
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles'
import palette from './palette'
import { CssBaseline, PaletteMode } from '@mui/material'
import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect'

interface Props {
  children: React.ReactNode
}

export const ColorModeContext = React.createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleColorMode: () => {},
})

export default function ThemeConfig(props: Props): JSX.Element {
  const prefersDarkMode =
    localStorage.getItem('prefers-color-scheme') === 'dark'

  const [mode, setMode] = React.useState<PaletteMode>(
    prefersDarkMode ? 'dark' : 'light',
  )

  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
      ...(mode === 'light' ? palette : {}),
    },
  })

  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) => {
          const nextMode = prevMode === 'light' ? 'dark' : 'light'
          localStorage.setItem('prefers-color-scheme', nextMode)
          return nextMode
        })
        console.log(mode)
      },
    }),
    [],
  )

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  useEnhancedEffect(() => {
    if (theme.palette.mode === 'dark') {
      document.body.classList.remove('mode-light')
      document.body.classList.add('mode-dark')
    } else {
      document.body.classList.remove('mode-dark')
      document.body.classList.add('mode-light')
    }
  }, [theme.palette.mode])

  return (
    <StyledEngineProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {props.children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </StyledEngineProvider>
  )
}
