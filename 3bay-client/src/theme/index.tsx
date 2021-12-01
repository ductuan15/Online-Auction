import * as React from 'react'
import { createTheme, StyledEngineProvider, ThemeProvider } from '@mui/material/styles'
import palette from './palette'
import { CssBaseline, PaletteMode } from '@mui/material'

interface Props {
  children: React.ReactElement
}

export const ColorModeContext = React.createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  toggleColorMode: () => {},
})

// TODO: save dark/light mode preference
export default function ThemeConfig(props: Props): JSX.Element {
  const [mode, setMode] = React.useState<PaletteMode>('light')

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
        setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode])

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
