import { SxProps } from '@mui/system'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import * as React from 'react'

export const Copyright = ({ sx }: { sx: SxProps }): JSX.Element => (
  <Typography variant='body2' color='text.secondary' align='center' sx={sx}>
    {'Copyright © '}
    <Link color='inherit' href='/'>
      3bay
    </Link>{' '}
    {new Date().getFullYear()}
    {'.'}
  </Typography>
)