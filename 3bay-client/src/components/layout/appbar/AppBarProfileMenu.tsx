import * as React from 'react'
import { FC } from 'react'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { Avatar } from '@mui/material'
import MoreIcon from '@mui/icons-material/MoreVert'

export const AppBarProfileMenu: FC = () => {
  const { handleProfileMenuOpen, menuId, mobileMenuId, handleMobileMenuOpen } =
    useAppBarContext()

  return (
    <>
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
    </>
  )
}
