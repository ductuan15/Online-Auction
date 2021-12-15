import * as React from 'react'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { Avatar, Button, Link } from '@mui/material'
import MoreIcon from '@mui/icons-material/MoreVert'
import { useAuth } from '../../../contexts/user/AuthContext'
import { Link as RouterLink } from 'react-router-dom'

type AppBarProfileMenuProps = {
  menuId: string
  mobileMenuId: string
}

export const AppBarProfileMenu = ({
  menuId,
  mobileMenuId,
}: AppBarProfileMenuProps): JSX.Element => {
  const { dispatch } = useAppBarContext()

  const { isAuth } = useAuth()

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
              onClick={(e) =>
                dispatch({
                  type: 'OPEN_PROFILE_MENU',
                  payload: e,
                })
              }
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
          onClick={(e) => dispatch({ type: 'OPEN_MOBILE_MENU', payload: e })}
          color='inherit'
        >
          <MoreIcon />
        </IconButton>
      </Box>
    </>
  )
}
