import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import * as React from 'react'
import '@fontsource/libre-baskerville/400-italic.css'
import '@fontsource/roboto-slab'

export function AppName() {
  return (
    <Box display="flex" alignItems="center">
      <Typography
        component="div"
        sx={{ display: { xs: 'none', sm: 'block' } }}
        fontFamily="Libre Baskerville"
        variant="h4"
      >
        3
      </Typography>

      <Typography
        variant="h5"
        noWrap
        component="div"
        fontFamily="Libre Baskerville"
        sx={{ display: { xs: 'none', sm: 'block' } }}
      >
        bay
      </Typography>
    </Box>
  )
}
