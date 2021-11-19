import { Container } from '@mui/material'
import React from 'react'

import SearchAppBar from './AppBar'
import Toolbar from '@mui/material/Toolbar'

interface Props {
  children: React.ReactElement
}

export default function Layout(props: Props) {
  return (
    <div>
      {/* app bar */}
      <SearchAppBar />

      <Toolbar />

      {/* main content */}
      <Container>{props.children}</Container>
    </div>
  )
}
