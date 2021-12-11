import Menu from '@mui/material/Menu'
import * as React from 'react'
import { FC } from 'react'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'

const notifyMenu = {
  elevation: 0,
  sx: {
    overflow: 'visible',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    minWidth: 240,
    maxWidth: 600,
    mt: 1.5,
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

export const NotifyMenu: FC = () => {
  const { notifyAnchorEl, isNotifyMenuOpened, handleNotifyMenuClose } =
    useAppBarContext()

  return (
    <Menu
      anchorEl={notifyAnchorEl}
      open={isNotifyMenuOpened}
      onClose={handleNotifyMenuClose}
      onClick={handleNotifyMenuClose}
      PaperProps={notifyMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    />
  )
}