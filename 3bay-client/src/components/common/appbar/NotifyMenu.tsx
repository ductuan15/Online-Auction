import Menu from '@mui/material/Menu'
import * as React from 'react'
import { useLayoutContext } from '../../../contexts/layout/LayoutContext'
import MenuItem from '@mui/material/MenuItem'
import DeadlineCountDown from './DeadlineCountDown'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Divider, Grid, Link } from '@mui/material'
import GitHubIcon from '@mui/icons-material/GitHub'

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

export const NotifyMenu = (): JSX.Element => {
  const {
    state: { notifyAnchorEl },
    dispatch,
  } = useLayoutContext()
  const handleNotifyMenuClose = () => {
    dispatch({ type: 'CLOSE_NOTIFY_MENU' })
  }

  const dl = '01/06/2022 01:00 PM'

  return (
    <Menu
      anchorEl={notifyAnchorEl}
      open={Boolean(notifyAnchorEl)}
      onClose={handleNotifyMenuClose}
      onClick={handleNotifyMenuClose}
      PaperProps={notifyMenu}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem sx={{ m: 1.5 }}>
        <Grid container spacing={1} display='flex' flexDirection='column' p={1}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              px: 0.5,
              py: 1,
            }}
          >
            <CalendarTodayOutlinedIcon sx={{ mr: 1 }} />
            <Typography>{dl}</Typography>
          </Box>

          <DeadlineCountDown
            date={dl}
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              px: 0.5,
              pt: 1,
              pb: 0,
            }}
          />
        </Grid>
      </MenuItem>

      <Divider variant='middle' />

      <MenuItem sx={{ m: 1.5 }}>
        <Link
          target='_blank'
          rel='noopener'
          href='https://github.com/ductuan15/Online-Auction'
          color='inherit'
          underline='none'
        >
          <Grid
            container
            spacing={1}
            display='flex'
            flexDirection='row'
            alignItems='center'
            py={1.5}
            px={1}
          >
            <GitHubIcon sx={{ mr: 1 }} />
            <Typography variant='body1' color='text.primary'>
              Online Auction
            </Typography>
          </Grid>
        </Link>
      </MenuItem>
    </Menu>
  )
}
