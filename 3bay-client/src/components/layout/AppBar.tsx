import * as React from 'react'
import { styled } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import MoreIcon from '@mui/icons-material/MoreVert'
import { AppName } from './AppName'
import { Avatar, Slide, useScrollTrigger } from '@mui/material'
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined'
import Tooltip from '@mui/material/Tooltip'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Logout from '@mui/icons-material/Logout'
import { ColorModeContext } from '../../theme'

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
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  )
}

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
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

  color:theme.palette.mode === 'light' ? theme.palette.grey[800] : theme.palette.text.primary,
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

const menuPaperProp = {
  elevation: 0,
  sx: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    '& .MuiAvatar-root': {
      width: 32,
      height: 32,
      ml: -0.5,
      mr: 1,
    },
    '&:before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      right: 14,
      width: 10,
      height: 10,
      bgcolor: 'background.paper',
      transform: 'translateY(-50%) rotate(45deg)',
      zIndex: 0,
    },
  },
}

// TODO: break down smaller components into separated files
// TODO: change the app bar color into white (or dark if dark mode is enabled)
// TODO: resize the menu icon, the current one seems too small
export default function SearchAppBar() {
  const colorMode = React.useContext(ColorModeContext)

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
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpen}
      onClose={handleMenuClose}
      onClick={handleMenuClose}
      PaperProps={menuPaperProp}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem>
        <Avatar /> My account
      </MenuItem>
      <Divider />

      <MenuItem>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-search-account-menu-mobile'
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      PaperProps={menuPaperProp}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem>
        <Avatar /> My account
      </MenuItem>

      <Divider />

      <MenuItem>
        <ListItemIcon>
          <Brightness4OutlinedIcon />
        </ListItemIcon>
        Change theme
      </MenuItem>

      <Divider />

      <MenuItem>
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <HideOnScroll>
        <StyledAppBar>
          <StyledToolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>

            {/*Hide app name when the size is xs*/}
            <AppName sx={{ display: { xs: 'none', sm: 'block' } }} />

            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={colorMode.toggleColorMode}
              >
                <Tooltip title="Change theme">
                  <Brightness4OutlinedIcon />
                </Tooltip>
              </IconButton>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <Tooltip title="Account settings">
                <IconButton onClick={handleProfileMenuOpen}>
                  <Avatar>M</Avatar>
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </StyledToolbar>
        </StyledAppBar>
      </HideOnScroll>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  )
}
