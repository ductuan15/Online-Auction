import * as React from 'react'
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles'
import { darkPalette, palette } from './palette'
import { CssBaseline, PaletteMode } from '@mui/material'
import { useDarkMode } from 'usehooks-ts'
import '@fontsource/manrope'

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
    components: {
      MuiCssBaseline: {
        styleOverrides: `
        @font-face {
          font-family: 'Manrope';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url('https://fonts.googleapis.com/css2?family=Manrope:wght@450&display=swap');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
      },
    },
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
