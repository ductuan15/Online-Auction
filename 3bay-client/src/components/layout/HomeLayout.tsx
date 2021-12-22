import { Container } from '@mui/material'
import React from 'react'

import SearchAppBar, { StyledToolbar } from './appbar/AppBar'
import AppFooter from './footer/AppFooter'
import StyledDiv from '../common/StyledDiv'
import { AppBarCtxProvider } from '../../contexts/layout/AppBarContext'
import AppDrawer from './drawer/AppDrawer'
import { Outlet } from 'react-router-dom'
import { CategoryProvider } from '../../contexts/admin/CategoryContext'

interface Props {
  children?: React.ReactNode
}

export default function HomeLayout({ children }: Props): JSX.Element {
  return (
    <StyledDiv>
      <CategoryProvider>
        {/* app bar */}
        <AppBarCtxProvider>
          <SearchAppBar />
          <AppDrawer />
        </AppBarCtxProvider>

        <StyledToolbar sx={(theme) => ({ marginBottom: theme.spacing(1) })} />

        {/* main content */}

        <Container sx={{ bgcolor: 'background.paper' }}>
          {children ? children : <Outlet />}
        </Container>

        <AppFooter />
      </CategoryProvider>
    </StyledDiv>
  )
}
