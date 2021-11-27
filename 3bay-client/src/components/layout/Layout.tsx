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
    <div>
      {/* app bar */}
      <SearchAppBar />

      <Toolbar />

      {/* main content */}
      <Container>{children}</Container>

      <AppFooter />
    </div>
  )
}
