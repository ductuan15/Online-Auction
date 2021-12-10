import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Avatar } from '@mui/material'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined'
import Logout from '@mui/icons-material/Logout'
import * as React from 'react'
import { FC } from 'react'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'
import { ColorModeContext } from '../../../theme'

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

export const MobileMenu: FC = () => {
  const colorMode = React.useContext(ColorModeContext)
  const {
    mobileMoreAnchorEl,
    mobileMenuId,
    isMobileMenuOpened,
    handleMobileMenuClose,
  } = useAppBarContext()

  return (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      id={mobileMenuId}
      keepMounted
      open={isMobileMenuOpened}
      onClose={handleMobileMenuClose}
      PaperProps={menuPaperProp}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem>
        <Avatar /> My account
      </MenuItem>

      <Divider />

      <MenuItem onClick={colorMode.toggleColorMode}>
        <ListItemIcon>
          <Brightness4OutlinedIcon />
        </ListItemIcon>
        Change theme
      </MenuItem>

      <Divider />

      <MenuItem>
        <ListItemIcon>
          <Logout fontSize='small' />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )
}

export const AppBarMenu: FC = () => {
  const { anchorEl, isMenuOpened, handleMenuClose } = useAppBarContext()

  return (
    <Menu
      anchorEl={anchorEl}
      open={isMenuOpened}
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
          <Logout fontSize='small' />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )
}
