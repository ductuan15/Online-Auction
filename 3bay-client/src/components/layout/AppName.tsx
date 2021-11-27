import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import '@fontsource/libre-baskerville/400-italic.css'
import '@fontsource/roboto-slab'
import { styled } from '@mui/material/styles'
import { SxProps } from '@mui/system'

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.dark,
}))

type AppNameProps = {
  bigSize?: boolean
  sx?: SxProps
}

export function AppName({ bigSize, sx }: AppNameProps) {
  return (
    <Box display="flex" alignItems="center">
      <StyledTypography
        sx={sx}
        fontFamily="Libre Baskerville"
        variant={bigSize ? 'h3' : 'h4'}
      >
        3
      </StyledTypography>

      <StyledTypography
        variant={bigSize ? 'h4' : 'h5'}
        noWrap
        fontFamily="Libre Baskerville"
        sx={sx}
      >
        bay
      </StyledTypography>
    </Box>
  )
}
