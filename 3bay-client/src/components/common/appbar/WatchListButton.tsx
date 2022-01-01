import * as React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import { Badge } from '@mui/material'
import { useUserContext } from '../../../contexts/user/UserContext'

const WatchListButton = (): JSX.Element => {
  const navigate = useNavigate()
  const {
    state: { watchlist },
  } = useUserContext()
  return (
    <Box>
      <Tooltip title='Watch list'>
        <IconButton
          onClick={() => navigate('/user/watchlist')}
          size='large'
          edge='end'
          aria-label='Watch list'
          color='inherit'
        >
          <Badge badgeContent={watchlist.length} color='secondary'>
            <FavoriteBorderOutlinedIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default WatchListButton
