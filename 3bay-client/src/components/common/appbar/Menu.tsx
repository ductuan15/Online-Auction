import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined'
import Logout from '@mui/icons-material/Logout'
import * as React from 'react'
import { useCallback } from 'react'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'
import { useAuth } from '../../../contexts/user/AuthContext'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { useDarkMode } from '../../../hooks'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'
import { Box, Typography } from '@mui/material'
import { useUserContext } from '../../../contexts/user/UserContext'
import BorderButton from '../button/BorderButton'
import LocalAtmOutlinedIcon from '@mui/icons-material/LocalAtmOutlined'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined'
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined'

const profileMenu = {
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

type MobileMenuProps = {
  mobileMenuId: string
}

export const MobileMenu = ({ mobileMenuId }: MobileMenuProps): JSX.Element => {
  // const colorMode = React.useContext(ColorModeContext)
  const { toggle } = useDarkMode()
  const {
    state: { mobileMoreAnchorEl },
    dispatch,
  } = useLayoutContext()

  const navigate = useNavigate()
  const { isAuth, signOut } = useAuth()

  const onSignOutButtonClicked = useCallback(() => {
    signOut(() => {
      dispatch({ type: 'CLOSE_PROFILE_MENU' })
      navigate('/')
    })
  }, [dispatch, navigate, signOut])

  const onMenuClosed = useCallback(
    () => dispatch({ type: 'CLOSE_MOBILE_MENU' }),
    [dispatch],
  )

  const onMenuClicked = useCallback(() =>
    dispatch({type: 'CLOSE_PROFILE_MENU',}), [dispatch])

  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={Boolean(mobileMoreAnchorEl)}
      onClose={onMenuClosed}
      onClick={onMenuClicked}
      PaperProps={profileMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {isAuth ? (
        <MenuItem component={RouterLink} to='/user/view'>
          <ListItemIcon>
            <AccountCircleOutlinedIcon fontSize='small' />
          </ListItemIcon>
          My account
        </MenuItem>
      ) : (
        <MenuItem component={RouterLink} to='/signin'>
          <ListItemIcon>
            <LoginOutlinedIcon fontSize='small' />
          </ListItemIcon>
          Sign in
        </MenuItem>
      )}

      {isAuth && (
        <MenuItem component={RouterLink} to='/user/watchlist'>
          <ListItemIcon>
            <FavoriteBorderOutlinedIcon />
          </ListItemIcon>
          My watchlist
        </MenuItem>
      )}

      <MenuItem onClick={toggle}>
        <ListItemIcon>
          <Brightness4OutlinedIcon />
        </ListItemIcon>
        Change theme
      </MenuItem>

      {isAuth && (
        <MenuItem onClick={onSignOutButtonClicked}>
          <ListItemIcon>
            <Logout fontSize='small' color='inherit' />
          </ListItemIcon>
          Sign out
        </MenuItem>
      )}
    </Menu>
  )
}

type AppBarMenuProps = {
  id: string
}

export const AppBarMenu = ({ id }: AppBarMenuProps): JSX.Element => {
  const {
    state: { anchorEl },
    dispatch,
  } = useLayoutContext()

  const navigate = useNavigate()
  const { isAuth, signOut, user } = useAuth()
  const {
    state: { userDetails },
  } = useUserContext()

  const onSignOutButtonClicked = useCallback(() => {
    signOut(() => {
      dispatch({
        type: 'CLOSE_PROFILE_MENU',
      })
      navigate('/')
    })
  }, [dispatch, navigate, signOut])

  const onMenuClosed = useCallback(() => {
    dispatch({type: 'CLOSE_PROFILE_MENU',})
  }, [dispatch])

  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onMenuClosed}
      PaperProps={profileMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant='subtitle1' fontWeight={600} noWrap>
          {userDetails?.name}
        </Typography>
        <Typography variant='body2' sx={{ color: 'text.secondary' }} noWrap>
          {userDetails?.email}
        </Typography>
      </Box>

      <Divider />

      {isAuth ? (
        <MenuItem component={RouterLink} to='/user/view'>
          <ListItemIcon>
            <AccountCircleOutlinedIcon fontSize='small' />
          </ListItemIcon>
          My account
        </MenuItem>
      ) : (
        <MenuItem component={RouterLink} to='/signin'>
          <ListItemIcon>
            <LoginOutlinedIcon fontSize='small' />
          </ListItemIcon>
          Sign in
        </MenuItem>
      )}

      <MenuItem component={RouterLink} to='/user/auction-list'>
        <ListItemIcon>
          <InventoryOutlinedIcon fontSize='small' />
        </ListItemIcon>
        Auctions list
      </MenuItem>

      <MenuItem component={RouterLink} to='/user/won-auction-list'>
        <ListItemIcon>
          <LocalAtmOutlinedIcon fontSize='small' />
        </ListItemIcon>
        Won Auctions list
      </MenuItem>

      {user && user.role === 'SELLER' && (
        <MenuItem component={RouterLink} to='/seller/posted-product-list'>
          <ListItemIcon>
            <SellOutlinedIcon fontSize='small' />
          </ListItemIcon>
          Posted product list
        </MenuItem>
      )}

      {user && user.role === 'SELLER' && (
        <MenuItem component={RouterLink} to='/seller/auctions-have-winner'>
          <ListItemIcon>
            <LocalShippingOutlinedIcon fontSize='small' />
          </ListItemIcon>
          Auctions have winner
        </MenuItem>
      )}

      {isAuth && (
        <Box mx={2} mt={1}>
          <BorderButton
            sx={{ width: 1 }}
            onClick={onSignOutButtonClicked}
            padding={`4px 4px`}
            startIcon={<Logout fontSize='small' color='inherit' />}
          >
            Sign out
          </BorderButton>
        </Box>
      )}
    </Menu>
  )
}
