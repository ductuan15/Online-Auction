import * as React from 'react'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import AppName from '../appname/AppName'
import { AppBarMenu, MobileMenu } from './Menu'
import { AppBarProfileMenu } from './AppBarProfileMenu'
import { ThemeChangeButton } from './ThemeChangeButton'
import { HideOnScroll } from './HideOnScroll'
import NotifyMenuButton from './NotifyMenuButton'
import { NotifyMenu } from './NotifyMenu'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'
import { useAuth } from '../../../contexts/user/AuthContext'
import RoleLabel from '../../user/profile/RoleLabel'
import WatchListButton from './WatchListButton'
import { Link, Stack, useTheme } from '@mui/material'
import BorderButton from '../button/BorderButton'
import {Link as RouterLink, useMatch, useNavigate, useResolvedPath} from 'react-router-dom'
import { GREY } from '../../../theme/palette'
import JoiningAuction from "./JoiningAuctionButton";
import WonAuctionButton from "./WonAuctionButton";

export const APPBAR_LARGE = 92
export const APPBAR_SMALL = 80

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === 'light'
      ? 'alpha(theme.palette.background.paper, 0.15)'
      : theme.palette.background.paper,
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light'
        ? 'alpha(theme.palette.background.paper, 0.45)'
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
          ? `1.75px solid ${GREY[500_48]}`
          : `1.75px solid ${GREY[500_24]}`,
      borderRadius: '8px',
    },
  },
}))

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_SMALL,
  [theme.breakpoints.up('sm')]: {
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
    // color: 'inherit',
    // background: theme.palette.background.default,
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

  const createProductPath = '/product/create'
  const resolved = useResolvedPath(createProductPath)
  const match = useMatch({ path: resolved.pathname, end: true })

  const { toggleDrawer, dispatch } = useAppBarContext()

  const { isAuth, user } = useAuth()
  const theme = useTheme()
  useEffect(() => {
    dispatch({ type: 'CLOSE_PROFILE_MENU' })
  }, [dispatch, theme])

  const [searchKey, setSearchKey] = useState('')
  const navigate = useNavigate()

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key == 'Enter') {
      navigate(`/products/search/?key='${searchKey}'`)
      window.location.reload();
    }
  }

  const searchKey_Changed = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.currentTarget.value)
  }

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

            {user?.role !== 'BIDDER' && (
              <RoleLabel sx={{ mx: 1, display: { xs: 'none', sm: 'flex' } }} />
            )}

            {/*Search bar*/}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder='Search…'
                inputProps={{ 'aria-label': 'search' }}
                onKeyPress={handleKeyPress}
                value={searchKey}
                onChange={searchKey_Changed}
              />
            </Search>

            {user?.role !== 'SELLER' && (
              <Box sx={{ display: { xs: 'none', lg: 'block' } }} ml={1}>
                <BorderButton onClick={toggleDrawer(true)}>
                  🏷️ Categories
                </BorderButton>
              </Box>
            )}

            {user?.role === 'SELLER' && (
              <Link
                sx={{ display: { xs: 'none', lg: 'block' } }}
                ml={1}
                component={RouterLink}
                to={createProductPath}
                color='inherit'
                underline='none'
              >
                <BorderButton disabled={!!match}>📦 New product</BorderButton>
              </Link>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Stack
              direction='row'
              sx={{ display: { xs: 'none', md: 'flex' }, mx: 2 }}
              alignItems='center'
              spacing={2}
            >
              {/*Notifications*/}
              <NotifyMenuButton notifyMenuId={notifyMenuId} />

              {/*Theme button*/}
              <ThemeChangeButton />

              {/*WatchList Button*/}
              {isAuth ? <WatchListButton /> : null}

              {/*JoiningAuction Button*/}
              {isAuth ? <JoiningAuction /> : null}

              {/*WonAuction Button*/}
              {isAuth ? <WonAuctionButton /> : null}

            </Stack>

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
