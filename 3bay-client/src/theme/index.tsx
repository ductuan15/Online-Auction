import * as React from 'react'
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles'
import { darkPalette, palette } from './palette'
import { CssBaseline, PaletteMode } from '@mui/material'
import { useDarkMode } from '../hooks'

// import useEnhancedEffect from '@mui/material/utils/useEnhancedEffect'

interface Props {
  children: React.ReactNode
}

export default function ThemeConfig(props: Props): JSX.Element {
  const { isDarkMode } = useDarkMode()

  const mode = isDarkMode ? 'dark' : 'light'

  const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
      ...(mode === 'light' ? palette : darkPalette),
    },
    typography: { fontFamily: 'Manrope, sans-serif' },
  })

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  // useEnhancedEffect(() => {
  //   if (theme.palette.mode === 'dark') {
  //     document.body.classList.remove('mode-light')
  //     document.body.classList.add('mode-dark')
  //   } else {
  //     document.body.classList.remove('mode-dark')
  //     document.body.classList.add('mode-light')
  //   }
  // }, [theme.palette.mode])

  return (
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
