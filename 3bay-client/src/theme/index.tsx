import * as React from 'react'
import { useMemo } from 'react'
import {
  createTheme,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material/styles'
import palette from './palette'
import { CssBaseline } from '@mui/material'

interface Props {
  children: React.ReactElement
}

export default function ThemeConfig(props: Props) {
  const themeOptions = useMemo(
    () => ({
      palette,
    }),
    [],
  )

  const theme = createTheme(themeOptions)

  return (
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {props.children}
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
