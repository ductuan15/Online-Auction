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

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light' ? palette : darkPalette),
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 48,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&$checked, &$colorPrimary$checked, &$colorSecondary$checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + $track': {
              opacity: 1,
              border: 'none',
            },
          },
        },
        thumb: {
          width: 24,
          height: 24,
        },
        track: {
          borderRadius: 13,
          border: '1px solid #bdbdbd',
          backgroundColor: '#fafafa',
          opacity: 1,
          transition:
            'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Manrope, sans-serif',
    button: {
      fontWeight: 600,
    },
    overline: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 600,
    },
  },
})

export default function ThemeConfig(props: Props): JSX.Element {
  const { isDarkMode } = useDarkMode()

  const mode = isDarkMode ? 'dark' : 'light'

  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
