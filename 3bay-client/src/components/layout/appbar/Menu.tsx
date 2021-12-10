import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { Avatar } from '@mui/material'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined'
import Logout from '@mui/icons-material/Logout'
import * as React from 'react'
import { FC } from 'react'

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

type MobileMenuProps = {
  mobileMoreAnchorEl: HTMLElement | null
  mobileMenuId: string
  isMobileMenuOpen: boolean
  handleMobileMenuClose: () => void
  colorMode: { toggleColorMode: () => void }
}

type MenuProps = {
  anchorEl: HTMLElement | null
  isMenuOpen: boolean
  handleMenuClose: () => void
}

export const MobileMenu: FC<MobileMenuProps> = ({
  mobileMoreAnchorEl,
  mobileMenuId,
  isMobileMenuOpen,
  handleMobileMenuClose,
  colorMode,
}: MobileMenuProps) => {
  return (
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

export const AppBarMenu: FC<MenuProps> = ({
  anchorEl,
  isMenuOpen,
  handleMenuClose,
}: MenuProps) => {
  return (
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
          <Logout fontSize='small' />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  )
}
