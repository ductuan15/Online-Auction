import * as React from 'react'
import { useMemo } from 'react'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'
import Typography from '@mui/material/Typography'
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  PaperProps,
  Popover,
} from '@mui/material'
import { NotifyData } from '../../../models/notification'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import { useUserContext } from '../../../contexts/user/UserContext'
import moment from 'moment'
import { GREY } from '../../../theme/palette'
import { Link as RouterLink } from 'react-router-dom'

const notifyMenu: PaperProps = {
  elevation: 0,
  sx: {
    overflow: 'inherit',
    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
    mt: 1.5,
    ml: 0.5,
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

type NotifyMenuItemProps = {
  notifyData: NotifyData
}

export const NotifyMenuItem = ({
  notifyData,
}: NotifyMenuItemProps): JSX.Element => {
  const {
    state: { userDetails },
  } = useUserContext()

  const title = useMemo(() => {
    switch (notifyData.type) {
      case 'AUCTION_BID_REJECTED':
        return 'Your bid has been rejected'
      case 'AUCTION_CLOSED_NO_WINNER':
        return 'The auction time of your product has been ended'
      case 'AUCTION_CLOSED_HAD_WINNER': {
        if (userDetails?.uuid === notifyData.data?.sellerId) {
          return 'The auction time of your product has been ended'
        }
        return `You have won the auction for the product「${notifyData?.data.name}」`
      }
      case 'AUCTION_NEW_BID':
        return `The price of「${notifyData.data.name}」has been updated`
    }
    return ''
  }, [notifyData, userDetails?.uuid])

  const date = useMemo(() => {
    return moment(notifyData?.date || new Date()).format('L')
  }, [notifyData.date])

  return (
    <ListItemButton
      disableGutters
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        bgcolor: 'action.selected',
      }}
      component={RouterLink}
      to={`/product/${notifyData.data.id}`}
    >
      <ListItemAvatar>
        <Avatar
          sx={{ bgcolor: 'background.neutral' }}
          src={notifyData?.data?.thumbnails.sm}
        />
      </ListItemAvatar>

      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant='caption'
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
              alignContent: 'center',
            }}
          >
            <AccessTimeRoundedIcon fontSize='small' sx={{ mr: 0.5 }} />

            {date}
          </Typography>
        }
      />
    </ListItemButton>
  )
}

// const dl = '01/20/2022 01:30 PM'
export const NotifyMenu = (): JSX.Element => {
  const {
    state: { notifyAnchorEl },
    dispatch,
  } = useLayoutContext()

  const {
    state: { notifyList },
  } = useUserContext()

  const handleNotifyMenuClose = () => {
    dispatch({ type: 'CLOSE_NOTIFY_MENU' })
  }

  return (
    <Popover
      anchorEl={notifyAnchorEl}
      open={Boolean(notifyAnchorEl)}
      onClose={handleNotifyMenuClose}
      PaperProps={notifyMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      sx={{ width: 360 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          px: 2.5,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant='subtitle1' fontWeight={600}>
            Notifications
          </Typography>
          <Typography variant='body2' sx={{ color: 'text.secondary' }}>
            {notifyList.length === 0
              ? "You don't have any notifications"
              : `You have ${notifyList.length} notification(s)`}
          </Typography>
        </Box>
        {
          notifyList?.map((notification, idx) => {
            return <NotifyMenuItem notifyData={notification} key={idx}/>
          })
        }
        {/*<Divider />*/}
        {/*<NotifyMenuItem />*/}
      </Box>
    </Popover>
  )
}
