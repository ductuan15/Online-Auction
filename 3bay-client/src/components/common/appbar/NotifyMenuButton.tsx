import * as React from 'react'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import { Badge } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useUserContext } from '../../../contexts/user/UserContext'

type NotifyMenuButtonProps = {
  notifyMenuId: string
}

const NotifyMenuButton = ({
  notifyMenuId,
}: NotifyMenuButtonProps): JSX.Element => {
  const { state, dispatch } = useLayoutContext()
  const {
    state: { notifyList },
  } = useUserContext()

  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Tooltip title='Notifications'>
        <IconButton
          onClick={(e) =>
            dispatch({
              type: 'OPEN_NOTIFY_MENU',
              payload: e,
            })
          }
          size='large'
          edge='end'
          aria-label='current notifications'
          aria-controls={notifyMenuId}
          aria-haspopup='true'
          color='inherit'
          sx={(theme) => ({
            bgcolor: state.notifyAnchorEl
              ? alpha(
                  theme.palette.primary.main,
                  theme.palette.action.focusOpacity,
                )
              : undefined,
          })}
        >
          <Badge badgeContent={notifyList.length} color='error'>
            {state.notifyAnchorEl ? (
              <NotificationsRoundedIcon
                sx={{
                  color: 'primary.main',
                }}
              />
            ) : (
              <NotificationsNoneOutlinedIcon />
            )}
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default NotifyMenuButton
