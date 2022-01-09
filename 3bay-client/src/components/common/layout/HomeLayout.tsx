import { Container } from '@mui/material'
import React from 'react'

import AppFooter from '../footer/AppFooter'
import StyledDiv from '../StyledDiv'
import { LayoutCtxProvider } from '../../../contexts/layout/LayoutContext'
import { AppDrawer } from '../drawer'
import { Outlet } from 'react-router-dom'
import { CategoryProvider } from '../../../contexts/admin/CategoryContext'
import { AppBar, StyledToolbar } from '../appbar'

interface Props {
  children?: React.ReactNode
}

export default function HomeLayout({ children }: Props): JSX.Element {
  return (
    <StyledDiv>
      <LayoutCtxProvider>
        <CategoryProvider>
          {/* app bar */}
          <AppBar />
          <AppDrawer />

          <StyledToolbar sx={(theme) => ({ marginBottom: theme.spacing(1) })} />

          {/* main content */}

          <Container sx={{ bgcolor: 'background.default' }}>
            {children ? children : <Outlet />}
          </Container>
        </CategoryProvider>
        <AppFooter />
      </LayoutCtxProvider>
    </StyledDiv>
  )
}
