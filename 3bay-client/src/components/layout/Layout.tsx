import { Container } from '@mui/material'
import React from 'react'

import SearchAppBar from './AppBar'
import Toolbar from '@mui/material/Toolbar'
import AppFooter from './AppFooter'

interface Props {
  children: React.ReactElement
}

export default function Layout({ children }: Props) {
  return (
    <Container maxWidth="xl" sx={{ bgcolor: 'background.paper' }}>
      {/* app bar */}
      <SearchAppBar />

      <Toolbar />

      {/* main content */}
      <Container sx={{ bgcolor: 'background.paper' }}>{children}</Container>

      <AppFooter />
    </Container>
  )
}
