import {getNotificationDescription, NotifyData} from '../../../models/notification'
import { useUserContext } from '../../../contexts/user/UserContext'
import * as React from 'react'
import { useMemo } from 'react'
import moment from 'moment'
import {
  Avatar,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'

type NotifyMenuItemProps = {
  notifyData: NotifyData
}

const NotifyMenuItem = ({ notifyData }: NotifyMenuItemProps): JSX.Element => {
  const {
    state: { userDetails },
  } = useUserContext()

  const title = useMemo(() => {
    return getNotificationDescription(notifyData, userDetails?.uuid)
  }, [notifyData, userDetails?.uuid])

  const date = useMemo(() => {
    return moment(notifyData?.date || new Date()).format('L')
  }, [notifyData.date])

  return (
    <ListItemButton
      disableGutters
      sx={{
        py: 1,
        px: 1,
        mt: '1px',
        // bgcolor: 'action.selected',
        width: 1,
      }}
      component={RouterLink}
      to={`/product/${notifyData.data.id}`}
    >
      <ListItemAvatar>
        <Avatar variant='rounded'
          sx={{ bgcolor: 'background.neutral' }}
          src={notifyData?.data?.thumbnails.sm}
        />
      </ListItemAvatar>

      <ListItemText
        primaryTypographyProps={{
          variant: 'body2'
        }}
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

export default NotifyMenuItem