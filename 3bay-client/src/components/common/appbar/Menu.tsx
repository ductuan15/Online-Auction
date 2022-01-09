import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined'
import Logout from '@mui/icons-material/Logout'
import * as React from 'react'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'
import { useAuth } from '../../../contexts/user/AuthContext'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'
import { useDarkMode } from '../../../hooks'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';

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

  function onSignOutButtonClicked() {
    signOut(() => {
      dispatch({
        type: 'CLOSE_PROFILE_MENU',
      })
      navigate('/')
    })
  }

  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={Boolean(mobileMoreAnchorEl)}
      onClose={() =>
        dispatch({
          type: 'CLOSE_MOBILE_MENU',
        })
      }
      onClick={() =>
        dispatch({
          type: 'CLOSE_PROFILE_MENU',
        })
      }
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

      <Divider />

      {isAuth && (
        <MenuItem component={RouterLink} to='/user/watchlist'>
          <ListItemIcon>
            <FavoriteBorderOutlinedIcon />
          </ListItemIcon>
          My watchlist
        </MenuItem>
      )}

      {isAuth && <Divider />}

      <MenuItem onClick={toggle}>
        <ListItemIcon>
          <Brightness4OutlinedIcon />
        </ListItemIcon>
        Change theme
      </MenuItem>

      <Divider />

      {isAuth && (
        <MenuItem onClick={() => onSignOutButtonClicked()}>
          <ListItemIcon>
            <Logout fontSize='small' />
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

  function onSignOutButtonClicked() {
    signOut(() => {
      dispatch({
        type: 'CLOSE_PROFILE_MENU',
      })
      navigate('/')
    })
  }

  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClick={() =>
        dispatch({
          type: 'CLOSE_PROFILE_MENU',
        })
      }
      onClose={() =>
        dispatch({
          type: 'CLOSE_PROFILE_MENU',
        })
      }
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

      {user && user.role === 'SELLER' && (
        <MenuItem component={RouterLink} to='/user/postedproductlist'>
          <ListItemIcon>
            <Inventory2OutlinedIcon fontSize='small' />
          </ListItemIcon>
          Posted product list
        </MenuItem>
      )}

      {user && user.role === 'SELLER' && (
        <MenuItem component={RouterLink} to='/user/auctionhaswinner'>
          <ListItemIcon>
            <InventoryOutlinedIcon fontSize='small' />
          </ListItemIcon>
          Auctions have winner
        </MenuItem>
      )}

      <Divider />

      {isAuth && (
        <MenuItem onClick={() => onSignOutButtonClicked()}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Sign out
        </MenuItem>
      )}
    </Menu>
  )
}
