import * as React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@mui/material'
import { useUserContext } from '../../../contexts/user/UserContext'
import ShopIcon from '@mui/icons-material/Shop';

const JoiningAuctionButton = (): JSX.Element => {
  const navigate = useNavigate()
  const {
    state: { auctionlist },
  } = useUserContext()
  return (
    <Box>
      <Tooltip title='Auctions list'>
        <IconButton
          onClick={() => navigate('/user/auctionlist')}
          size='large'
          edge='end'
          aria-label='Auctions'
          color='inherit'
        >
          <Badge badgeContent={auctionlist.length} color='secondary'>
            <ShopIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default JoiningAuctionButton