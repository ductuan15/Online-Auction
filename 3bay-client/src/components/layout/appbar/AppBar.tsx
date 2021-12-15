import * as React from 'react'
import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import { AppName } from '../AppName'
import { AppBarMenu, MobileMenu } from './Menu'
import { AppBarProfileMenu } from './AppBarProfileMenu'
import { ThemeChangeButton } from './ThemeChangeButton'
import { HideOnScroll } from './HideOnScroll'
import NotifyMenuButton from './NotifyMenuButton'
import { NotifyMenu } from './NotifyMenu'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'

const APPBAR_LARGE = 92
const APPBAR_SMALL = 80

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === 'light'
      ? 'alpha(theme.palette.common.white, 0.15)'
      : theme.palette.background.paper,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'alpha(theme.palette.common.white, 0.25)'
        : theme.palette.background.paper,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(1, 1.5),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.5, 2, 1.5, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '24ch',
      '&:focus ': {
        width: '32ch',
      },
    },
    [theme.breakpoints.up('sm')]: {
      border:
        theme.palette.mode === 'light'
          ? `1.5px solid ${theme.palette.grey[300]}`
          : '1.5px solid white',
      borderRadius: '8px',
    },
  },
}))

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_SMALL,
  [theme.breakpoints.up('md')]: {
    minHeight: APPBAR_LARGE,
    padding: theme.spacing(0, 5),
  },
}))

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create('width'),
  boxShadow: 'none',
  borderStyle: 'solid',
  borderColor:
    theme.palette.mode === 'light'
      ? theme.palette.grey[300]
      : theme.palette.grey[800],
  borderWidth: 0,
  borderBottomWidth: 'thin',
  background:
    theme.palette.mode === 'light'
      ? 'rgba(255,255,255,0.98)'
      : theme.palette.background.default,

  color:
    theme.palette.mode === 'light'
      ? theme.palette.grey[800]
      : theme.palette.text.primary,
  '& .MuiIconButton-root': {
    /*borderRadius: theme.shape.borderRadius,*/
    color:
      theme.palette.mode === 'light'
        ? theme.palette.primary
        : theme.palette.primary.light,
    background: theme.palette.background.default,
    // [theme.breakpoints.up('sm')]: {
    //   border: `1px solid ${theme.palette.grey[300]}`,
    //   borderRadius: '8px',
    // },
  },
}))

export default function SearchAppBar(): JSX.Element {
  const menuId = 'primary-search-account-menu'
  const mobileMenuId = 'primary-search-account-menu-mobile'
  const notifyMenuId = 'primary-search-account-menu-Notify'

  const { toggleDrawer } = useAppBarContext()

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HideOnScroll>
        <StyledAppBar>
          <StyledToolbar>
            {/* Menu drawer icon */}
            <IconButton
              size='large'
              edge='start'
              color='inherit'
              aria-label='open drawer'
              sx={{ mr: 2 }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            {/*Hide app name when the size is xs*/}
            <AppName sx={{ display: { xs: 'none', sm: 'block' } }} />

            {/*Search bar*/}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='Search…'
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            <Box sx={{ flexGrow: 1 }} />

            {/*Notifications*/}
            <NotifyMenuButton notifyMenuId={notifyMenuId} />

            {/*Theme button*/}
            <ThemeChangeButton
              sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, ml: 2 }}
            />

            {/* Profile */}
            <AppBarProfileMenu menuId={menuId} mobileMenuId={mobileMenuId} />
          </StyledToolbar>
        </StyledAppBar>
      </HideOnScroll>

      <MobileMenu mobileMenuId={mobileMenuId} />
      <AppBarMenu id={menuId} />
      <NotifyMenu />
    </Box>
  )
}
