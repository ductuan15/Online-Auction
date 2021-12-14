import * as React from 'react'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { Avatar, Button, Link } from '@mui/material'
import MoreIcon from '@mui/icons-material/MoreVert'
import { useAuthContext } from '../../../contexts/user/AuthContext'
import { Link as RouterLink } from 'react-router-dom'

export const AppBarProfileMenu = (): JSX.Element => {
  const { handleProfileMenuOpen, menuId, mobileMenuId, handleMobileMenuOpen } =
    useAppBarContext()

  const {
    state: { isAuth },
  } = useAuthContext()

  return (
    <>
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {isAuth ? (
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
        ) : (
          <Button variant='text' color='inherit'>
            <Link
              color='inherit'
              underline='none'
              component={RouterLink}
              to='/signin'
            >
              Sign in
            </Link>
          </Button>
        )}
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
