import * as React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'

const WonAuctionButton = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <Box>
      <Tooltip title='Won Auctions list'>
        <IconButton
          onClick={() => navigate('/user/won-auction-list')}
          size='large'
          edge='end'
          aria-label='Won Auctions'
          color='inherit'
        >
          <InventoryOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default WonAuctionButton
