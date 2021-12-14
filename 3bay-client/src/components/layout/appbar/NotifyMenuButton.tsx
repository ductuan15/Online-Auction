import * as React from 'react'
import { useAppBarContext } from '../../../contexts/layout/AppBarContext'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'
import { Badge } from '@mui/material'

const NotifyMenuButton = (): JSX.Element => {
  const { handleNotifyMenuOpen, notifyMenuId, notifyBadgeContent } =
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
        <Tooltip title='Notifications'>
          <IconButton
            onClick={handleNotifyMenuOpen}
            size='large'
            edge='end'
            aria-label='current notifications'
            aria-controls={notifyMenuId}
            aria-haspopup='true'
            color='inherit'
          >
            <Badge
              badgeContent={notifyBadgeContent}
              color='secondary'
              variant='dot'
            >
              <NotificationsNoneOutlinedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
      </Box>
    </>
  )
}

export default NotifyMenuButton
