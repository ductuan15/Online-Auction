import * as React from 'react'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import { useNavigate } from 'react-router-dom'
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'

const JoiningAuctionButton = (): JSX.Element => {
  const navigate = useNavigate()

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
          <ShoppingBagOutlinedIcon />
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default JoiningAuctionButton
