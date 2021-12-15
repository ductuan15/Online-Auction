import { Container } from '@mui/material'
import React from 'react'

import SearchAppBar, { StyledToolbar } from './appbar/AppBar'
import AppFooter from './AppFooter'
import StyledDiv from '../common/StyledDiv'

interface Props {
  children?: React.ReactNode
}

export default function HomeLayout({ children }: Props): JSX.Element {
  return (
    <StyledDiv>
      {/* app bar */}
      <SearchAppBar />

      <StyledToolbar sx={(theme) => ({ marginBottom: theme.spacing(1) })} />

      {/* main content */}
      <Container sx={{ bgcolor: 'background.paper' }}>{children}</Container>

      <AppFooter />
    </StyledDiv>
  )
}
