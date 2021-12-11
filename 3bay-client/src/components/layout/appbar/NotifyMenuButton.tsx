import * as React from 'react'
import {FC} from 'react'
import {useAppBarContext} from '../../../contexts/layout/AppBarContext'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined'

const NotifyMenuButton: FC = () => {
  const {handleNotifyMenuOpen, notifyMenuId} = useAppBarContext()

  return (
    <>
      <Box
        sx={{
          display: {xs: 'none', md: 'flex'},
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
            <NotificationsNoneOutlinedIcon/>
          </IconButton>
        </Tooltip>
      </Box>
    </>
  )
}

export default NotifyMenuButton
