import { styled } from '@mui/material/styles'
import { ListSubheader, ListSubheaderProps } from '@mui/material'
import * as React from 'react'

const StyledListSubheader = styled((props: ListSubheaderProps) => (
  <ListSubheader {...props} />
))(({ theme }) => ({
  typography: 'h6',
  p: theme.spacing(1),
}))

export default StyledListSubheader
