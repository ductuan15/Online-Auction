import { Container } from '@mui/material'
import React from 'react'

import SearchAppBar, { StyledToolbar } from './AppBar'
import AppFooter from './AppFooter'
import { styled } from '@mui/material/styles'

interface Props {
  children: React.ReactElement
}

const StyledDiv = styled('div')(({ theme }) => ({
  background: theme.palette.background.paper,
}))

export default function Layout({ children }: Props): JSX.Element {
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
