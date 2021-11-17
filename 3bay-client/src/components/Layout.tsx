import { Container } from '@mui/material'
import React, { ReactNode } from 'react'

import SearchAppBar from './AppBar'

interface Props {
  children: ReactNode
}

export default function Layout(props: Props) {
  return (
    <div>
      {/* app bar */}
      <SearchAppBar />

      {/* main content */}
      <Container>
        {props.children}
      </Container>
    </div>
  )
}
