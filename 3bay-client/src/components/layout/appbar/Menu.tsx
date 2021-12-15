import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Avatar } from '@mui/material'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined'
import Logout from '@mui/icons-material/Logout'
import * as React from 'react'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'
import { useAuth } from '../../../contexts/user/AuthContext'
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined'
import { useDarkMode } from 'usehooks-ts'

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
  } = useAppBarContext()
  const { isAuth } = useAuth()

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
      PaperProps={profileMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {isAuth ? (
        <MenuItem>
          <Avatar /> My account
        </MenuItem>
      ) : (
        <MenuItem>
          <ListItemIcon>
            <LoginOutlinedIcon fontSize='small' />
          </ListItemIcon>
          Sign in
        </MenuItem>
      )}

      <Divider />

      <MenuItem onClick={toggle}>
        <ListItemIcon>
          <Brightness4OutlinedIcon />
        </ListItemIcon>
        Change theme
      </MenuItem>

      <Divider />

      {isAuth && (
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
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
  } = useAppBarContext()

  const { isAuth } = useAuth()
  return (
    <Menu
      id={id}
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() =>
        dispatch({
          type: 'CLOSE_PROFILE_MENU',
        })
      }
      onClick={(e) =>
        dispatch({
          type: 'OPEN_PROFILE_MENU',
          payload: e,
        })
      }
      PaperProps={profileMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {isAuth ? (
        <MenuItem>
          <Avatar /> My account
        </MenuItem>
      ) : (
        <MenuItem>
          <ListItemIcon>
            <LoginOutlinedIcon fontSize='small' />
          </ListItemIcon>
          Sign in
        </MenuItem>
      )}

      <Divider />

      {isAuth && (
        <MenuItem>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      )}
    </Menu>
  )
}
