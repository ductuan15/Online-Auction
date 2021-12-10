import * as React from 'react'
import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import MoreIcon from '@mui/icons-material/MoreVert'
import { AppName } from '../AppName'
import { Avatar, Slide, useScrollTrigger, useTheme } from '@mui/material'
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined'
import Tooltip from '@mui/material/Tooltip'
import { ColorModeContext } from '../../../theme'
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined'
import { AppBarMenu, MobileMenu } from './Menu'

interface Props {
  children: React.ReactElement
}

const APPBAR_LARGE = 92
const APPBAR_SMALL = 64

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

function HideOnScroll({ children }: Props) {
  const trigger = useScrollTrigger({
    target: window,
  })

  return (
    <Slide appear={false} direction='down' in={!trigger}>
      {children}
    </Slide>
  )
}

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: APPBAR_SMALL,
  [theme.breakpoints.up('lg')]: {
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

// TODO: break down smaller components into separated files
export default function SearchAppBar(): JSX.Element {
  const colorMode = React.useContext(ColorModeContext)
  const theme = useTheme()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null)

  const isMenuOpen = Boolean(anchorEl)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    handleMobileMenuClose()
  }

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget)
  }

  const menuId = 'primary-search-account-menu'
  const mobileMenuId = 'primary-search-account-menu-mobile'

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

            {/*Theme button*/}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
              <IconButton
                size='large'
                color='inherit'
                onClick={colorMode.toggleColorMode}
              >
                <Tooltip title='Change theme'>
                  {theme.palette.mode === 'light' ? (
                    <Brightness2OutlinedIcon />
                  ) : (
                    <Brightness4OutlinedIcon />
                  )}
                </Tooltip>
              </IconButton>
            </Box>

            {/* Profile */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Tooltip title='Account settings'>
                <IconButton
                  onClick={handleProfileMenuOpen}
                  size='large'
                  edge='end'
                  aria-label='account of current user'
                  aria-controls={menuId}
                  aria-haspopup='true'
                  color='inherit'
                >
                  <Avatar>M</Avatar>
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size='large'
                aria-label='show more'
                aria-controls={mobileMenuId}
                aria-haspopup='true'
                onClick={handleMobileMenuOpen}
                color='inherit'
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </StyledToolbar>
        </StyledAppBar>
      </HideOnScroll>

      <MobileMenu
        mobileMoreAnchorEl={mobileMoreAnchorEl}
        mobileMenuId={mobileMenuId}
        isMobileMenuOpen={isMobileMenuOpen}
        handleMobileMenuClose={handleMobileMenuClose}
        colorMode={colorMode}
      />

      <AppBarMenu
        isMenuOpen={isMenuOpen}
        anchorEl={anchorEl}
        handleMenuClose={handleMenuClose}
      />
    </Box>
  )
}
