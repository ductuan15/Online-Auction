import * as React from 'react'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'
import Typography from '@mui/material/Typography'
import { Box, Divider, PaperProps, Popover } from '@mui/material'
import { useUserContext } from '../../../contexts/user/UserContext'
import { GREY } from '../../../theme/palette'
import NotifyMenuItem from './NotifyMenuItem'
import {useCallback} from 'react'

const width = 360
const height = width * 1.61803398875

const notifyMenu: PaperProps = {
  elevation: 0,
  sx: {
    overflowY: 'auto',
    overflowX: 'hidden',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    ml: 0.5,
    maxHeight: height,
    border: `solid 1px ${GREY[500_8]}`,
    width: `100%`,
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

// const dl = '01/20/2022 01:30 PM'
export const NotifyMenu = (): JSX.Element => {
  const {
    state: { notifyAnchorEl },
    dispatch,
  } = useLayoutContext()

  const {
    state: { notifyList },
    dispatch: userDispatch,
  } = useUserContext()

  const handleNotifyMenuClose = useCallback(() => {
    userDispatch({ type: 'READ_NOTIFICATIONS' })
    dispatch({ type: 'CLOSE_NOTIFY_MENU' })
  },[dispatch, userDispatch])

  return (
    <Popover
      anchorEl={notifyAnchorEl}
      open={Boolean(notifyAnchorEl)}
      onClose={handleNotifyMenuClose}
      PaperProps={notifyMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      sx={{ width: width }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          py: 1,
          px: 0.5,
        }}
      >
        <Box sx={{ width: 1, px: 1, my: 1 }}>
          <Typography variant='subtitle1' fontWeight={600}>
            🔔 Notifications
          </Typography>

          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {notifyList.length === 0
              ? "You don't have any notifications"
              : `You have ${notifyList.length} notification(s)`}
          </Typography>
        </Box>

        <Box width={1}>
          <Divider />
        </Box>

        {notifyList?.map((notification, idx) => {
          return <NotifyMenuItem notifyData={notification} key={idx} />
        })}
        {/*<Divider />*/}
        {/*<NotifyMenuItem />*/}
      </Box>
    </Popover>
  )
}
